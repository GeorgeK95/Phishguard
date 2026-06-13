import { createAclMessage } from './acl.js';

const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(?:com|net|org|info|top|xyz|site|online|click|shop|bg)(?:\/[^\s]*)?)/gi;
const suspiciousSignals = ['http://', 'bit.ly', 'tinyurl', '.top', '.xyz', '.click', 'login-', 'secure-', 'verify-', 'account-', 'support-'];

export class LinkAnalysisAgent {
  name = 'LinkAnalysisAgent';

  async handle(request, ontology) {
    const text = request.content.message;
    const urls = text.match(urlRegex) || [];
    const suspiciousUrls = [];

    for (const rawUrl of urls) {
      const url = rawUrl.toLowerCase().replace(/[),.;!?]+$/, '');
      const matchedSignals = suspiciousSignals.filter((signal) => url.includes(signal));

      if (matchedSignals.length > 0 || looksLikeImpersonation(url)) {
        suspiciousUrls.push({ url: rawUrl, signals: matchedSignals.length ? matchedSignals : ['possible-brand-impersonation'] });
      }
    }

    const suspiciousLinkFeature = ontology.features.find((feature) => feature.id === 'SuspiciousLink');
    const detectedFeatures = suspiciousUrls.length > 0 && suspiciousLinkFeature
      ? [{
          id: suspiciousLinkFeature.id,
          label: suspiciousLinkFeature.label,
          score: suspiciousLinkFeature.score,
          description: suspiciousLinkFeature.description,
          evidence: suspiciousUrls.map((item) => item.url)
        }]
      : [];

    return createAclMessage({
      performative: 'INFORM',
      sender: this.name,
      receiver: request.sender,
      conversationId: request.conversationId,
      inReplyTo: request.id,
      content: {
        agentRole: 'url-analysis',
        urls,
        suspiciousUrls,
        detectedFeatures
      }
    });
  }
}

function looksLikeImpersonation(url) {
  const brands = ['bank', 'dhl', 'econt', 'speedy', 'paypal', 'apple', 'google', 'microsoft'];
  const riskyWords = ['login', 'verify', 'secure', 'account', 'billing', 'update'];

  return brands.some((brand) => url.includes(brand)) && riskyWords.some((word) => url.includes(word));
}
