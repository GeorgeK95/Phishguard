import { mkdir, readFile, writeFile, access } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '../../data');
const ontologyDir = path.resolve(__dirname, '../../ontology');
const ontologyJsonPath = path.resolve(dataDir, 'ontology.json');
const ontologyOwlPath = path.resolve(ontologyDir, 'phishguard.owl');

const seedOntology = {
  "namespace": "http://example.org/phishguard#",
  "classes": [
    {
      "id": "ThreatType",
      "label": "Threat type"
    },
    {
      "id": "MessageFeature",
      "label": "Message feature"
    },
    {
      "id": "CommunicationChannel",
      "label": "Communication channel"
    },
    {
      "id": "RiskLevel",
      "label": "Risk level"
    },
    {
      "id": "Recommendation",
      "label": "Recommendation"
    }
  ],
  "riskLevels": [
    {
      "id": "LowRisk",
      "label": "Low risk",
      "minScore": 0,
      "maxScore": 30
    },
    {
      "id": "MediumRisk",
      "label": "Medium risk",
      "minScore": 31,
      "maxScore": 60
    },
    {
      "id": "HighRisk",
      "label": "High risk",
      "minScore": 61,
      "maxScore": 100
    }
  ],
  "channels": [
    {
      "id": "SMS",
      "label": "SMS"
    },
    {
      "id": "Email",
      "label": "Email"
    },
    {
      "id": "ChatMessage",
      "label": "Chat message"
    },
    {
      "id": "SocialMedia",
      "label": "Social media message"
    }
  ],
  "features": [
    {
      "id": "Urgency",
      "label": "Urgency",
      "score": 15,
      "description": "The message uses urgency to push the user into a fast reaction.",
      "keywords": [
        "urgent",
        "immediately",
        "limited time",
        "within 24 hours",
        "act now",
        "right away"
      ]
    },
    {
      "id": "AccountThreat",
      "label": "Account threat",
      "score": 20,
      "description": "The message threatens account blocking, suspension or restriction.",
      "keywords": [
        "suspended",
        "blocked",
        "restricted",
        "account closure",
        "deactivated",
        "will be blocked"
      ]
    },
    {
      "id": "CredentialRequest",
      "label": "Credential request",
      "score": 30,
      "description": "The message asks for a password, login action or account verification.",
      "keywords": [
        "password",
        "login",
        "verify your account",
        "confirm your account",
        "security code",
        "2fa code"
      ]
    },
    {
      "id": "PaymentRequest",
      "label": "Payment request",
      "score": 25,
      "description": "The message requests a payment, fee, card details or bank information.",
      "keywords": [
        "pay",
        "payment",
        "fee",
        "card",
        "iban",
        "bank details",
        "billing",
        "invoice"
      ]
    },
    {
      "id": "SuspiciousLink",
      "label": "Suspicious link",
      "score": 30,
      "description": "The message contains a link that may lead to a fake or unsafe website.",
      "keywords": [
        "http://",
        "bit.ly",
        "tinyurl",
        "login-",
        "secure-",
        "verify-",
        ".top",
        ".xyz"
      ]
    },
    {
      "id": "PrizeBait",
      "label": "Prize bait",
      "score": 20,
      "description": "The message promises a prize, reward or bonus to manipulate the user.",
      "keywords": [
        "prize",
        "winner",
        "bonus",
        "free gift",
        "reward",
        "congratulations"
      ]
    },
    {
      "id": "UnknownSender",
      "label": "Unknown or unclear sender",
      "score": 10,
      "description": "The message does not clearly identify an official sender or institution.",
      "keywords": [
        "unknown",
        "no-reply",
        "support-center",
        "customer-support",
        "service-team"
      ]
    },
    {
      "id": "DeliveryFeeBait",
      "label": "Fake delivery fee",
      "score": 25,
      "description": "The message imitates a delivery provider and asks for a small parcel or shipping fee.",
      "keywords": [
        "delivery",
        "parcel",
        "shipping fee",
        "package",
        "customs fee",
        "tracking"
      ]
    }
  ],
  "threatTypes": [
    {
      "id": "FakeBankMessage",
      "label": "Fake bank message",
      "description": "A scam that imitates a bank in order to steal credentials, personal data or money.",
      "relatedFeatureIds": [
        "AccountThreat",
        "CredentialRequest",
        "PaymentRequest",
        "SuspiciousLink"
      ]
    },
    {
      "id": "FakeDeliveryMessage",
      "label": "Fake delivery message",
      "description": "A scam that imitates a courier or delivery service and asks for a fee or personal data.",
      "relatedFeatureIds": [
        "DeliveryFeeBait",
        "PaymentRequest",
        "SuspiciousLink",
        "Urgency"
      ]
    },
    {
      "id": "FakePrizeScam",
      "label": "Fake prize scam",
      "description": "A scam that promises a prize and leads the user to a link, payment or data request.",
      "relatedFeatureIds": [
        "PrizeBait",
        "SuspiciousLink",
        "PaymentRequest"
      ]
    },
    {
      "id": "CredentialPhishing",
      "label": "Credential phishing",
      "description": "A phishing attack focused on stealing passwords, security codes or login credentials.",
      "relatedFeatureIds": [
        "CredentialRequest",
        "SuspiciousLink",
        "Urgency"
      ]
    }
  ],
  "recommendations": [
    {
      "id": "DoNotOpenLink",
      "label": "Do not open the link",
      "appliesToRisk": [
        "MediumRisk",
        "HighRisk"
      ],
      "text": "Do not open any links from this message before verifying the sender through an official source."
    },
    {
      "id": "DoNotEnterData",
      "label": "Do not enter personal data",
      "appliesToRisk": [
        "MediumRisk",
        "HighRisk"
      ],
      "text": "Do not enter passwords, card details, banking data or personal information through the provided link."
    },
    {
      "id": "VerifyOfficialWebsite",
      "label": "Verify the official website",
      "appliesToRisk": [
        "LowRisk",
        "MediumRisk",
        "HighRisk"
      ],
      "text": "Open the official website manually in the browser instead of using the link from the message."
    },
    {
      "id": "ReportMessage",
      "label": "Report the message",
      "appliesToRisk": [
        "HighRisk"
      ],
      "text": "Report the message as spam or phishing and block the sender if possible."
    }
  ]
};

export async function ensureOntologyFiles() {
  await mkdir(dataDir, { recursive: true });
  await mkdir(ontologyDir, { recursive: true });

  try {
    await access(ontologyJsonPath);
  } catch {
    await saveOntology(seedOntology, false);
  }

  try {
    await access(ontologyOwlPath);
  } catch {
    const ontology = await loadOntology();
    await writeFile(ontologyOwlPath, renderOwlTurtle(ontology), 'utf-8');
  }
}

export async function loadOntology() {
  const raw = await readFile(ontologyJsonPath, 'utf-8');
  return JSON.parse(raw);
}

async function saveOntology(ontology, logChange = true, change = null) {
  await writeFile(ontologyJsonPath, JSON.stringify(ontology, null, 2), 'utf-8');
  await writeFile(ontologyOwlPath, renderOwlTurtle(ontology), 'utf-8');

  if (logChange && change) {
    try {
      const db = getDatabase();
      await db.run(
        `INSERT INTO ontology_changes (id, change_type, entity_id, payload, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        [uuidv4(), change.type, change.entityId, JSON.stringify(change.payload), new Date().toISOString()]
      );
    } catch {
      // During initial boot DB may not exist yet. Ontology save should still succeed.
    }
  }
}

export async function addFeature({ label, keywords, score = 10, description = '' }) {
  const ontology = await loadOntology();
  const id = toPascalId(label);

  if (ontology.features.some((feature) => feature.id === id)) {
    throw new Error('A feature with this label already exists.');
  }

  const feature = {
    id,
    label,
    score: Number(score) || 10,
    description: description || `User-added phishing indicator: ${label}`,
    keywords: keywords.map((keyword) => String(keyword).trim()).filter(Boolean)
  };

  ontology.features.push(feature);
  await saveOntology(ontology, true, { type: 'ADD_FEATURE', entityId: id, payload: feature });
  return feature;
}

export async function addThreatType({ label, description = '', relatedFeatureIds = [] }) {
  const ontology = await loadOntology();
  const id = toPascalId(label);

  if (ontology.threatTypes.some((threatType) => threatType.id === id)) {
    throw new Error('A threat type with this label already exists.');
  }

  const validFeatureIds = new Set(ontology.features.map((feature) => feature.id));
  const filteredFeatureIds = relatedFeatureIds.filter((featureId) => validFeatureIds.has(featureId));

  const threatType = {
    id,
    label,
    description: description || `User-added threat type: ${label}`,
    relatedFeatureIds: filteredFeatureIds
  };

  ontology.threatTypes.push(threatType);
  await saveOntology(ontology, true, { type: 'ADD_THREAT_TYPE', entityId: id, payload: threatType });
  return threatType;
}

function toPascalId(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
    || `Entity${Date.now()}`;
}

function literal(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function renderOwlTurtle(ontology) {
  const lines = [];

  lines.push('@prefix pg: <http://example.org/phishguard#> .');
  lines.push('@prefix owl: <http://www.w3.org/2002/07/owl#> .');
  lines.push('@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .');
  lines.push('@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .');
  lines.push('@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .');
  lines.push('');
  lines.push('pg:PhishGuardOntology a owl:Ontology ;');
  lines.push('  rdfs:label "PhishGuard OWL Ontology" ;');
  lines.push('  rdfs:comment "Ontology for phishing message analysis, threat types, message features, risk levels and recommendations." .');
  lines.push('');

  ontology.classes.forEach((klass) => {
    lines.push(`pg:${klass.id} a owl:Class ;`);
    lines.push(`  rdfs:label "${literal(klass.label)}" .`);
    lines.push('');
  });

  const objectProperties = [
    ['hasFeature', 'Threat type has related message feature'],
    ['hasRiskLevel', 'Analysis or feature has risk level'],
    ['hasRecommendation', 'Risk level has recommendation'],
    ['usesChannel', 'Message uses communication channel']
  ];

  objectProperties.forEach(([id, label]) => {
    lines.push(`pg:${id} a owl:ObjectProperty ;`);
    lines.push(`  rdfs:label "${label}" .`);
    lines.push('');
  });

  const dataProperties = [
    ['keyword', 'Keyword used for feature detection'],
    ['riskScore', 'Risk score contribution'],
    ['description', 'Entity description']
  ];

  dataProperties.forEach(([id, label]) => {
    lines.push(`pg:${id} a owl:DatatypeProperty ;`);
    lines.push(`  rdfs:label "${label}" .`);
    lines.push('');
  });

  ontology.riskLevels.forEach((risk) => {
    lines.push(`pg:${risk.id} a pg:RiskLevel ;`);
    lines.push(`  rdfs:label "${literal(risk.label)}" ;`);
    lines.push(`  pg:riskScore "${risk.minScore}-${risk.maxScore}" .`);
    lines.push('');
  });

  ontology.channels.forEach((channel) => {
    lines.push(`pg:${channel.id} a pg:CommunicationChannel ;`);
    lines.push(`  rdfs:label "${literal(channel.label)}" .`);
    lines.push('');
  });

  ontology.features.forEach((feature) => {
    lines.push(`pg:${feature.id} a pg:MessageFeature ;`);
    lines.push(`  rdfs:label "${literal(feature.label)}" ;`);
    lines.push(`  pg:description "${literal(feature.description)}" ;`);
    lines.push(`  pg:riskScore "${feature.score}"^^xsd:integer${feature.keywords.length ? ' ;' : ' .'}`);
    feature.keywords.forEach((keyword, index) => {
      const isLast = index === feature.keywords.length - 1;
      lines.push(`  pg:keyword "${literal(keyword)}"${isLast ? ' .' : ' ;'}`);
    });
    lines.push('');
  });

  ontology.threatTypes.forEach((threatType) => {
    lines.push(`pg:${threatType.id} a pg:ThreatType ;`);
    lines.push(`  rdfs:label "${literal(threatType.label)}" ;`);
    lines.push(`  pg:description "${literal(threatType.description)}"${threatType.relatedFeatureIds.length ? ' ;' : ' .'}`);
    threatType.relatedFeatureIds.forEach((featureId, index) => {
      const isLast = index === threatType.relatedFeatureIds.length - 1;
      lines.push(`  pg:hasFeature pg:${featureId}${isLast ? ' .' : ' ;'}`);
    });
    lines.push('');
  });

  ontology.recommendations.forEach((recommendation) => {
    lines.push(`pg:${recommendation.id} a pg:Recommendation ;`);
    lines.push(`  rdfs:label "${literal(recommendation.label)}" ;`);
    lines.push(`  pg:description "${literal(recommendation.text)}" .`);
    lines.push('');
  });

  return `${lines.join('\n')}\n`;
}
