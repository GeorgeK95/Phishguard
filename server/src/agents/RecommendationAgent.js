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
      explanationParts.push('Не са открити силни признаци на фишинг според текущата онтология.');
    } else {
      explanationParts.push(`Открити са ${detectedFeatures.length} рискови признака: ${detectedFeatures.map((feature) => feature.label).join(', ')}.`);
    }

    if (threatType) {
      explanationParts.push(`Най-близък тип заплаха: ${threatType.label}.`);
    }

    explanationParts.push(`Крайно ниво на риск: ${riskLevel.label}.`);

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
