import { createAclMessage } from './acl.js';

export class MessageAnalysisAgent {
  name = 'MessageAnalysisAgent';

  async handle(request, ontology) {
    const message = request.content.message.toLowerCase();
    const detectedFeatures = [];

    for (const feature of ontology.features) {
      if (feature.id === 'SuspiciousLink') continue;

      const evidence = feature.keywords.filter((keyword) => message.includes(String(keyword).toLowerCase()));

      if (evidence.length > 0) {
        detectedFeatures.push({
          id: feature.id,
          label: feature.label,
          score: feature.score,
          description: feature.description,
          evidence
        });
      }
    }

    return createAclMessage({
      performative: 'INFORM',
      sender: this.name,
      receiver: request.sender,
      conversationId: request.conversationId,
      inReplyTo: request.id,
      content: {
        agentRole: 'text-feature-analysis',
        detectedFeatures
      }
    });
  }
}
