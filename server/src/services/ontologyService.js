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
  namespace: 'http://example.org/phishguard#',
  classes: [
    { id: 'ThreatType', label: 'Threat type' },
    { id: 'MessageFeature', label: 'Message feature' },
    { id: 'CommunicationChannel', label: 'Communication channel' },
    { id: 'RiskLevel', label: 'Risk level' },
    { id: 'Recommendation', label: 'Recommendation' }
  ],
  riskLevels: [
    { id: 'LowRisk', label: 'Нисък риск', minScore: 0, maxScore: 30 },
    { id: 'MediumRisk', label: 'Среден риск', minScore: 31, maxScore: 60 },
    { id: 'HighRisk', label: 'Висок риск', minScore: 61, maxScore: 100 }
  ],
  channels: [
    { id: 'SMS', label: 'SMS' },
    { id: 'Email', label: 'Email' },
    { id: 'ChatMessage', label: 'Chat message' }
  ],
  features: [
    {
      id: 'Urgency',
      label: 'Спешност',
      score: 15,
      description: 'Съобщението използва спешност, за да провокира бърза реакция.',
      keywords: ['спешно', 'незабавно', 'до 24 часа', 'веднага', 'urgent', 'immediately', 'limited time']
    },
    {
      id: 'AccountThreat',
      label: 'Заплаха за акаунт',
      score: 20,
      description: 'Съобщението заплашва с блокиране, спиране или ограничаване на акаунт.',
      keywords: ['ще бъде блокиран', 'блокирана', 'suspended', 'blocked', 'restricted', 'закриване']
    },
    {
      id: 'CredentialRequest',
      label: 'Искане за парола или вход',
      score: 30,
      description: 'Съобщението изисква парола, вход или потвърждение на акаунт.',
      keywords: ['парола', 'password', 'login', 'потвърдете акаунта', 'verify your account', 'вход']
    },
    {
      id: 'PaymentRequest',
      label: 'Искане за плащане',
      score: 25,
      description: 'Съобщението иска плащане, такса или банкови данни.',
      keywords: ['платете', 'такса', 'карта', 'card', 'iban', 'payment', 'bank details', 'банкови данни']
    },
    {
      id: 'SuspiciousLink',
      label: 'Подозрителен линк',
      score: 30,
      description: 'Съобщението съдържа линк, който може да води към фалшив сайт.',
      keywords: ['http://', 'bit.ly', 'tinyurl', 'login-', 'secure-', 'verify-', '.top', '.xyz']
    },
    {
      id: 'PrizeBait',
      label: 'Фалшива награда',
      score: 20,
      description: 'Съобщението обещава награда, печалба или бонус с цел измама.',
      keywords: ['спечелихте', 'награда', 'prize', 'winner', 'bonus', 'free gift']
    },
    {
      id: 'UnknownSender',
      label: 'Непознат или неясен подател',
      score: 10,
      description: 'Липсва ясен официален подател или институция.',
      keywords: ['непознат', 'unknown', 'no-reply', 'support-center']
    },
    {
      id: 'DeliveryFeeBait',
      label: 'Фалшива куриерска такса',
      score: 25,
      description: 'Съобщението имитира куриер и иска малка такса за пратка.',
      keywords: ['пратка', 'доставка', 'куриер', 'delivery', 'parcel', 'shipping fee']
    }
  ],
  threatTypes: [
    {
      id: 'FakeBankMessage',
      label: 'Фалшиво банково съобщение',
      description: 'Измама, която имитира банка и цели кражба на данни или пари.',
      relatedFeatureIds: ['AccountThreat', 'CredentialRequest', 'PaymentRequest', 'SuspiciousLink']
    },
    {
      id: 'FakeDeliveryMessage',
      label: 'Фалшиво куриерско съобщение',
      description: 'Измама, която имитира куриерска услуга и иска такса или данни.',
      relatedFeatureIds: ['DeliveryFeeBait', 'PaymentRequest', 'SuspiciousLink', 'Urgency']
    },
    {
      id: 'FakePrizeScam',
      label: 'Фалшива награда',
      description: 'Измама, която обещава награда и води потребителя към линк или плащане.',
      relatedFeatureIds: ['PrizeBait', 'SuspiciousLink', 'PaymentRequest']
    },
    {
      id: 'CredentialPhishing',
      label: 'Фишинг за идентификационни данни',
      description: 'Фишинг атака, при която се търсят пароли, кодове или данни за вход.',
      relatedFeatureIds: ['CredentialRequest', 'SuspiciousLink', 'Urgency']
    }
  ],
  recommendations: [
    {
      id: 'DoNotOpenLink',
      label: 'Не отваряйте линка',
      appliesToRisk: ['MediumRisk', 'HighRisk'],
      text: 'Не отваряйте линковете от съобщението, докато не проверите подателя.'
    },
    {
      id: 'DoNotEnterData',
      label: 'Не въвеждайте лични данни',
      appliesToRisk: ['MediumRisk', 'HighRisk'],
      text: 'Не въвеждайте пароли, банкови данни или лична информация през линка.'
    },
    {
      id: 'VerifyOfficialWebsite',
      label: 'Проверете официалния сайт',
      appliesToRisk: ['LowRisk', 'MediumRisk', 'HighRisk'],
      text: 'Отворете официалния сайт ръчно от браузъра, вместо да използвате получения линк.'
    },
    {
      id: 'ReportMessage',
      label: 'Докладвайте съобщението',
      appliesToRisk: ['HighRisk'],
      text: 'Докладвайте съобщението като спам/фишинг и блокирайте подателя.'
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
    description: description || `Потребителски добавен признак: ${label}`,
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
    description: description || `Потребителски добавен тип заплаха: ${label}`,
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
    .replace(/[^a-zA-Z0-9А-Яа-я]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
    .replace(/[А-Яа-я]/g, '') || `Entity${Date.now()}`;
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
