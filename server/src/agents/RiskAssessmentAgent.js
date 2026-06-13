import { createAclMessage } from './acl.js';

export class RiskAssessmentAgent {
  name = 'RiskAssessmentAgent';

  async handle(request, ontology) {
    const detectedFeatures = deduplicateFeatures(request.content.detectedFeatures || []);
    const riskScore = Math.min(
      100,
      detectedFeatures.reduce((sum, feature) => sum + Number(feature.score || 0), 0)
    );

    const riskLevel = resolveRiskLevel(riskScore, ontology.riskLevels);
    const threatType = resolveThreatType(detectedFeatures, ontology.threatTypes);

    return createAclMessage({
      performative: 'INFORM',
      sender: this.name,
      receiver: request.sender,
      conversationId: request.conversationId,
      inReplyTo: request.id,
      content: {
        agentRole: 'risk-assessment',
        riskScore,
        riskLevel,
        threatType,
        detectedFeatures
      }
    });
  }
}

function deduplicateFeatures(features) {
  const map = new Map();

  for (const feature of features) {
    if (!map.has(feature.id)) {
      map.set(feature.id, feature);
    } else {
      const current = map.get(feature.id);
      map.set(feature.id, {
        ...current,
        evidence: [...new Set([...(current.evidence || []), ...(feature.evidence || [])])]
      });
    }
  }

  return Array.from(map.values());
}

function resolveRiskLevel(score, riskLevels) {
  const level = riskLevels.find((risk) => score >= risk.minScore && score <= risk.maxScore) || riskLevels[riskLevels.length - 1];
  return level;
}

function resolveThreatType(features, threatTypes) {
  const featureIds = new Set(features.map((feature) => feature.id));
  let best = null;

  for (const threatType of threatTypes) {
    const matches = threatType.relatedFeatureIds.filter((featureId) => featureIds.has(featureId)).length;
    if (!best || matches > best.matches) {
      best = { ...threatType, matches };
    }
  }

  return best && best.matches > 0 ? best : null;
}
