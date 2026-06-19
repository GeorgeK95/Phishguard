import { createAclMessage } from './acl.js';

export class RecommendationAgent {
  name = 'RecommendationAgent';

  async handle(request, ontology) {
    const { riskLevel, detectedFeatures, threatType } = request.content;
    const recommendations = ontology.recommendations
      .filter((recommendation) => recommendation.appliesToRisk.includes(riskLevel.id))
      .map((recommendation) => recommendation.text);

    const explanationParts = [];

    if (detectedFeatures.length === 0) {
      explanationParts.push('No strong phishing indicators were detected according to the current ontology.');
    } else {
      explanationParts.push(`Detected ${detectedFeatures.length} risk indicators: ${detectedFeatures.map((feature) => feature.label).join(', ')}.`);
    }

    if (threatType) {
      explanationParts.push(`Closest threat type: ${threatType.label}.`);
    }

    explanationParts.push(`Final risk level: ${riskLevel.label}.`);

    return createAclMessage({
      performative: 'INFORM',
      sender: this.name,
      receiver: request.sender,
      conversationId: request.conversationId,
      inReplyTo: request.id,
      content: {
        agentRole: 'recommendation',
        recommendations,
        explanation: explanationParts.join(' ')
      }
    });
  }
}
