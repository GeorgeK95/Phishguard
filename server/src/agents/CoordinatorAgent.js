import { v4 as uuidv4 } from 'uuid';
import { createAclMessage } from './acl.js';
import { MessageAnalysisAgent } from './MessageAnalysisAgent.js';
import { LinkAnalysisAgent } from './LinkAnalysisAgent.js';
import { RiskAssessmentAgent } from './RiskAssessmentAgent.js';
import { RecommendationAgent } from './RecommendationAgent.js';
import { loadOntology } from '../services/ontologyService.js';
import { getDatabase } from '../services/db.js';

export class CoordinatorAgent {
  name = 'CoordinatorAgent';

  constructor() {
    this.messageAnalysisAgent = new MessageAnalysisAgent();
    this.linkAnalysisAgent = new LinkAnalysisAgent();
    this.riskAssessmentAgent = new RiskAssessmentAgent();
    this.recommendationAgent = new RecommendationAgent();
  }

  async analyze({ message, channel }) {
    const ontology = await loadOntology();
    const db = getDatabase();
    const analysisId = uuidv4();
    const conversationId = uuidv4();
    const aclMessages = [];

    const messageRequest = createAclMessage({
      performative: 'REQUEST',
      sender: this.name,
      receiver: 'MessageAnalysisAgent',
      conversationId,
      content: { task: 'Analyze textual phishing indicators', message, channel }
    });
    aclMessages.push(messageRequest);

    const linkRequest = createAclMessage({
      performative: 'REQUEST',
      sender: this.name,
      receiver: 'LinkAnalysisAgent',
      conversationId,
      content: { task: 'Analyze URLs and link-related indicators', message, channel }
    });
    aclMessages.push(linkRequest);

    const messageResponse = await this.messageAnalysisAgent.handle(messageRequest, ontology);
    const linkResponse = await this.linkAnalysisAgent.handle(linkRequest, ontology);
    aclMessages.push(messageResponse, linkResponse);

    const detectedFeatures = [
      ...messageResponse.content.detectedFeatures,
      ...linkResponse.content.detectedFeatures
    ];

    const riskRequest = createAclMessage({
      performative: 'REQUEST',
      sender: this.name,
      receiver: 'RiskAssessmentAgent',
      conversationId,
      content: { task: 'Assess risk score and threat type', detectedFeatures }
    });
    aclMessages.push(riskRequest);

    const riskResponse = await this.riskAssessmentAgent.handle(riskRequest, ontology);
    aclMessages.push(riskResponse);

    const recommendationRequest = createAclMessage({
      performative: 'REQUEST',
      sender: this.name,
      receiver: 'RecommendationAgent',
      conversationId,
      content: {
        task: 'Generate user recommendations',
        riskLevel: riskResponse.content.riskLevel,
        riskScore: riskResponse.content.riskScore,
        threatType: riskResponse.content.threatType,
        detectedFeatures: riskResponse.content.detectedFeatures
      }
    });
    aclMessages.push(recommendationRequest);

    const recommendationResponse = await this.recommendationAgent.handle(recommendationRequest, ontology);
    aclMessages.push(recommendationResponse);

    await db.run(
      `INSERT INTO analyses (
        id, channel, original_message, risk_level, risk_score, detected_features,
        recommendations, explanation, threat_type, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        analysisId,
        channel,
        message,
        riskResponse.content.riskLevel.label,
        riskResponse.content.riskScore,
        JSON.stringify(riskResponse.content.detectedFeatures),
        JSON.stringify(recommendationResponse.content.recommendations),
        recommendationResponse.content.explanation,
        riskResponse.content.threatType?.label || null,
        new Date().toISOString()
      ]
    );

    for (const aclMessage of aclMessages) {
      await db.run(
        `INSERT INTO acl_messages (
          id, analysis_id, conversation_id, performative, sender, receiver,
          ontology, content, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          aclMessage.id,
          analysisId,
          aclMessage.conversationId,
          aclMessage.performative,
          aclMessage.sender,
          aclMessage.receiver,
          aclMessage.ontology,
          JSON.stringify(aclMessage.content),
          aclMessage.createdAt
        ]
      );
    }

    return {
      id: analysisId,
      channel,
      originalMessage: message,
      riskLevel: riskResponse.content.riskLevel,
      riskScore: riskResponse.content.riskScore,
      threatType: riskResponse.content.threatType,
      detectedFeatures: riskResponse.content.detectedFeatures,
      recommendations: recommendationResponse.content.recommendations,
      explanation: recommendationResponse.content.explanation,
      aclMessages
    };
  }
}
