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
      "id": "DomainConcept",
      "label": "Domain concept"
    },
    {
      "id": "CyberSecurityConcept",
      "label": "Cybersecurity concept",
      "parentId": "DomainConcept"
    },
    {
      "id": "PhishingMessage",
      "label": "Phishing message",
      "parentId": "CyberSecurityConcept"
    },
    {
      "id": "AnalysisResult",
      "label": "Analysis result",
      "parentId": "CyberSecurityConcept"
    },
    {
      "id": "Evidence",
      "label": "Evidence",
      "parentId": "CyberSecurityConcept"
    },
    {
      "id": "KeywordEvidence",
      "label": "Keyword evidence",
      "parentId": "Evidence"
    },
    {
      "id": "UrlEvidence",
      "label": "URL evidence",
      "parentId": "Evidence"
    },
    {
      "id": "SenderEvidence",
      "label": "Sender evidence",
      "parentId": "Evidence"
    },
    {
      "id": "RiskAssessment",
      "label": "Risk assessment",
      "parentId": "CyberSecurityConcept"
    },
    {
      "id": "CyberThreat",
      "label": "Cyber threat",
      "parentId": "CyberSecurityConcept"
    },
    {
      "id": "ThreatType",
      "label": "Threat type",
      "parentId": "CyberThreat"
    },
    {
      "id": "PhishingThreat",
      "label": "Phishing threat",
      "parentId": "ThreatType"
    },
    {
      "id": "EmailPhishing",
      "label": "Email phishing",
      "parentId": "PhishingThreat"
    },
    {
      "id": "SpearPhishing",
      "label": "Spear phishing",
      "parentId": "PhishingThreat"
    },
    {
      "id": "CredentialPhishingClass",
      "label": "Credential phishing",
      "parentId": "PhishingThreat"
    },
    {
      "id": "ClonePhishing",
      "label": "Clone phishing",
      "parentId": "PhishingThreat"
    },
    {
      "id": "QRPhishingThreat",
      "label": "QR phishing threat",
      "parentId": "PhishingThreat"
    },
    {
      "id": "SmishingThreat",
      "label": "Smishing threat",
      "parentId": "ThreatType"
    },
    {
      "id": "FakeBankSms",
      "label": "Fake bank SMS",
      "parentId": "SmishingThreat"
    },
    {
      "id": "FakeDeliverySms",
      "label": "Fake delivery SMS",
      "parentId": "SmishingThreat"
    },
    {
      "id": "FakeTollSms",
      "label": "Fake toll SMS",
      "parentId": "SmishingThreat"
    },
    {
      "id": "VishingThreat",
      "label": "Vishing threat",
      "parentId": "ThreatType"
    },
    {
      "id": "SocialEngineeringThreat",
      "label": "Social engineering threat",
      "parentId": "ThreatType"
    },
    {
      "id": "ImpersonationScam",
      "label": "Impersonation scam",
      "parentId": "SocialEngineeringThreat"
    },
    {
      "id": "FakePrizeScamClass",
      "label": "Fake prize scam",
      "parentId": "SocialEngineeringThreat"
    },
    {
      "id": "RomanceScam",
      "label": "Romance scam",
      "parentId": "SocialEngineeringThreat"
    },
    {
      "id": "TechSupportScam",
      "label": "Tech support scam",
      "parentId": "SocialEngineeringThreat"
    },
    {
      "id": "FinancialScam",
      "label": "Financial scam",
      "parentId": "ThreatType"
    },
    {
      "id": "CryptoScamClass",
      "label": "Crypto scam",
      "parentId": "FinancialScam"
    },
    {
      "id": "InvestmentScam",
      "label": "Investment scam",
      "parentId": "FinancialScam"
    },
    {
      "id": "FakePaymentScam",
      "label": "Fake payment scam",
      "parentId": "FinancialScam"
    },
    {
      "id": "RefundScam",
      "label": "Refund scam",
      "parentId": "FinancialScam"
    },
    {
      "id": "MalwareThreat",
      "label": "Malware threat",
      "parentId": "ThreatType"
    },
    {
      "id": "MaliciousAttachment",
      "label": "Malicious attachment",
      "parentId": "MalwareThreat"
    },
    {
      "id": "FakeSoftwareUpdate",
      "label": "Fake software update",
      "parentId": "MalwareThreat"
    },
    {
      "id": "MessageFeature",
      "label": "Message feature",
      "parentId": "CyberSecurityConcept"
    },
    {
      "id": "LinguisticFeature",
      "label": "Linguistic feature",
      "parentId": "MessageFeature"
    },
    {
      "id": "UrgencyLanguage",
      "label": "Urgency language",
      "parentId": "LinguisticFeature"
    },
    {
      "id": "ThreateningLanguage",
      "label": "Threatening language",
      "parentId": "LinguisticFeature"
    },
    {
      "id": "GrammarMistakes",
      "label": "Grammar mistakes",
      "parentId": "LinguisticFeature"
    },
    {
      "id": "GenericGreeting",
      "label": "Generic greeting",
      "parentId": "LinguisticFeature"
    },
    {
      "id": "TooGoodToBeTrueLanguage",
      "label": "Too-good-to-be-true language",
      "parentId": "LinguisticFeature"
    },
    {
      "id": "AuthorityPressure",
      "label": "Authority pressure",
      "parentId": "LinguisticFeature"
    },
    {
      "id": "LinkFeature",
      "label": "Link feature",
      "parentId": "MessageFeature"
    },
    {
      "id": "SuspiciousUrl",
      "label": "Suspicious URL",
      "parentId": "LinkFeature"
    },
    {
      "id": "ShortenedUrl",
      "label": "Shortened URL",
      "parentId": "LinkFeature"
    },
    {
      "id": "LookalikeDomain",
      "label": "Lookalike domain",
      "parentId": "LinkFeature"
    },
    {
      "id": "HttpWithoutHttps",
      "label": "HTTP without HTTPS",
      "parentId": "LinkFeature"
    },
    {
      "id": "MismatchedDomain",
      "label": "Mismatched domain",
      "parentId": "LinkFeature"
    },
    {
      "id": "TyposquattedDomain",
      "label": "Typosquatted domain",
      "parentId": "LinkFeature"
    },
    {
      "id": "UrlWithIPAddress",
      "label": "URL with IP address",
      "parentId": "LinkFeature"
    },
    {
      "id": "DataRequestFeature",
      "label": "Data request feature",
      "parentId": "MessageFeature"
    },
    {
      "id": "PasswordRequestClass",
      "label": "Password request",
      "parentId": "DataRequestFeature"
    },
    {
      "id": "CardDataRequestClass",
      "label": "Card data request",
      "parentId": "DataRequestFeature"
    },
    {
      "id": "PersonalDataRequestClass",
      "label": "Personal data request",
      "parentId": "DataRequestFeature"
    },
    {
      "id": "TwoFactorCodeRequest",
      "label": "Two-factor code request",
      "parentId": "DataRequestFeature"
    },
    {
      "id": "RecoveryPhraseRequest",
      "label": "Recovery phrase request",
      "parentId": "DataRequestFeature"
    },
    {
      "id": "PaymentFeature",
      "label": "Payment feature",
      "parentId": "MessageFeature"
    },
    {
      "id": "UrgentPaymentRequest",
      "label": "Urgent payment request",
      "parentId": "PaymentFeature"
    },
    {
      "id": "CryptoWalletRequest",
      "label": "Crypto wallet request",
      "parentId": "PaymentFeature"
    },
    {
      "id": "SmallFeeRequest",
      "label": "Small fee request",
      "parentId": "PaymentFeature"
    },
    {
      "id": "GiftCardPaymentRequest",
      "label": "Gift card payment request",
      "parentId": "PaymentFeature"
    },
    {
      "id": "BankTransferRequest",
      "label": "Bank transfer request",
      "parentId": "PaymentFeature"
    },
    {
      "id": "SenderFeature",
      "label": "Sender feature",
      "parentId": "MessageFeature"
    },
    {
      "id": "UnknownSenderClass",
      "label": "Unknown sender",
      "parentId": "SenderFeature"
    },
    {
      "id": "SpoofedEmailAddress",
      "label": "Spoofed email address",
      "parentId": "SenderFeature"
    },
    {
      "id": "ImpersonatedOrganization",
      "label": "Impersonated organization",
      "parentId": "SenderFeature"
    },
    {
      "id": "NoReplySender",
      "label": "No-reply sender",
      "parentId": "SenderFeature"
    },
    {
      "id": "AttachmentFeature",
      "label": "Attachment feature",
      "parentId": "MessageFeature"
    },
    {
      "id": "ExecutableAttachment",
      "label": "Executable attachment",
      "parentId": "AttachmentFeature"
    },
    {
      "id": "MacroDocumentAttachment",
      "label": "Macro document attachment",
      "parentId": "AttachmentFeature"
    },
    {
      "id": "ArchiveAttachment",
      "label": "Archive attachment",
      "parentId": "AttachmentFeature"
    },
    {
      "id": "CommunicationChannel",
      "label": "Communication channel",
      "parentId": "CyberSecurityConcept"
    },
    {
      "id": "EmailChannel",
      "label": "Email channel",
      "parentId": "CommunicationChannel"
    },
    {
      "id": "SmsChannel",
      "label": "SMS channel",
      "parentId": "CommunicationChannel"
    },
    {
      "id": "ChatChannel",
      "label": "Chat channel",
      "parentId": "CommunicationChannel"
    },
    {
      "id": "SocialMediaChannel",
      "label": "Social media channel",
      "parentId": "CommunicationChannel"
    },
    {
      "id": "WhatsAppChannel",
      "label": "WhatsApp channel",
      "parentId": "CommunicationChannel"
    },
    {
      "id": "ViberChannel",
      "label": "Viber channel",
      "parentId": "CommunicationChannel"
    },
    {
      "id": "TelegramChannel",
      "label": "Telegram channel",
      "parentId": "CommunicationChannel"
    },
    {
      "id": "InstagramDMChannel",
      "label": "Instagram DM channel",
      "parentId": "CommunicationChannel"
    },
    {
      "id": "FacebookMessengerChannel",
      "label": "Facebook Messenger channel",
      "parentId": "CommunicationChannel"
    },
    {
      "id": "PhoneCallChannel",
      "label": "Phone call channel",
      "parentId": "CommunicationChannel"
    },
    {
      "id": "QRCodeChannel",
      "label": "QR code channel",
      "parentId": "CommunicationChannel"
    },
    {
      "id": "TargetOrganization",
      "label": "Target organization",
      "parentId": "CyberSecurityConcept"
    },
    {
      "id": "BankOrganization",
      "label": "Bank organization",
      "parentId": "TargetOrganization"
    },
    {
      "id": "CourierCompany",
      "label": "Courier company",
      "parentId": "TargetOrganization"
    },
    {
      "id": "GovernmentInstitution",
      "label": "Government institution",
      "parentId": "TargetOrganization"
    },
    {
      "id": "OnlineStore",
      "label": "Online store",
      "parentId": "TargetOrganization"
    },
    {
      "id": "SocialNetwork",
      "label": "Social network",
      "parentId": "TargetOrganization"
    },
    {
      "id": "CryptoExchange",
      "label": "Crypto exchange",
      "parentId": "TargetOrganization"
    },
    {
      "id": "PaymentProvider",
      "label": "Payment provider",
      "parentId": "TargetOrganization"
    },
    {
      "id": "TelecomProvider",
      "label": "Telecom provider",
      "parentId": "TargetOrganization"
    },
    {
      "id": "AttackGoal",
      "label": "Attack goal",
      "parentId": "CyberSecurityConcept"
    },
    {
      "id": "StealCredentials",
      "label": "Steal credentials",
      "parentId": "AttackGoal"
    },
    {
      "id": "StealCardData",
      "label": "Steal card data",
      "parentId": "AttackGoal"
    },
    {
      "id": "StealPersonalData",
      "label": "Steal personal data",
      "parentId": "AttackGoal"
    },
    {
      "id": "InstallMalware",
      "label": "Install malware",
      "parentId": "AttackGoal"
    },
    {
      "id": "ReceiveFraudulentPayment",
      "label": "Receive fraudulent payment",
      "parentId": "AttackGoal"
    },
    {
      "id": "TakeOverAccount",
      "label": "Take over account",
      "parentId": "AttackGoal"
    },
    {
      "id": "BypassTwoFactor",
      "label": "Bypass two-factor authentication",
      "parentId": "AttackGoal"
    },
    {
      "id": "StealCryptoAssets",
      "label": "Steal crypto assets",
      "parentId": "AttackGoal"
    },
    {
      "id": "RiskLevel",
      "label": "Risk level",
      "parentId": "CyberSecurityConcept"
    },
    {
      "id": "LowRiskClass",
      "label": "Low risk class",
      "parentId": "RiskLevel"
    },
    {
      "id": "MediumRiskClass",
      "label": "Medium risk class",
      "parentId": "RiskLevel"
    },
    {
      "id": "HighRiskClass",
      "label": "High risk class",
      "parentId": "RiskLevel"
    },
    {
      "id": "Recommendation",
      "label": "Recommendation",
      "parentId": "CyberSecurityConcept"
    },
    {
      "id": "PreventiveAction",
      "label": "Preventive action",
      "parentId": "Recommendation"
    },
    {
      "id": "VerificationAction",
      "label": "Verification action",
      "parentId": "Recommendation"
    },
    {
      "id": "ReportingAction",
      "label": "Reporting action",
      "parentId": "Recommendation"
    },
    {
      "id": "RecoveryAction",
      "label": "Recovery action",
      "parentId": "Recommendation"
    },
    {
      "id": "DoNotOpenLinkClass",
      "label": "Do not open link",
      "parentId": "PreventiveAction"
    },
    {
      "id": "DoNotEnterCredentialsClass",
      "label": "Do not enter credentials",
      "parentId": "PreventiveAction"
    },
    {
      "id": "DoNotDownloadAttachmentClass",
      "label": "Do not download attachment",
      "parentId": "PreventiveAction"
    },
    {
      "id": "VerifyOfficialWebsiteClass",
      "label": "Verify official website",
      "parentId": "VerificationAction"
    },
    {
      "id": "ContactBankClass",
      "label": "Contact bank",
      "parentId": "VerificationAction"
    },
    {
      "id": "ContactCourierClass",
      "label": "Contact courier",
      "parentId": "VerificationAction"
    },
    {
      "id": "ReportMessageClass",
      "label": "Report message",
      "parentId": "ReportingAction"
    },
    {
      "id": "BlockSenderClass",
      "label": "Block sender",
      "parentId": "ReportingAction"
    },
    {
      "id": "ChangePasswordClass",
      "label": "Change password",
      "parentId": "RecoveryAction"
    },
    {
      "id": "FreezeCardClass",
      "label": "Freeze card",
      "parentId": "RecoveryAction"
    }
  ],
  "objectProperties": [
    {
      "id": "hasFeature",
      "label": "Threat type has related message feature",
      "domain": "ThreatType",
      "range": "MessageFeature"
    },
    {
      "id": "indicatesThreat",
      "label": "Feature indicates threat",
      "domain": "MessageFeature",
      "range": "ThreatType"
    },
    {
      "id": "hasRiskLevel",
      "label": "Analysis has risk level",
      "domain": "AnalysisResult",
      "range": "RiskLevel"
    },
    {
      "id": "hasRecommendation",
      "label": "Risk level has recommendation",
      "domain": "RiskLevel",
      "range": "Recommendation"
    },
    {
      "id": "usesChannel",
      "label": "Message uses communication channel",
      "domain": "PhishingMessage",
      "range": "CommunicationChannel"
    },
    {
      "id": "targetsOrganization",
      "label": "Threat targets organization type",
      "domain": "ThreatType",
      "range": "TargetOrganization"
    },
    {
      "id": "hasAttackGoal",
      "label": "Threat has attack goal",
      "domain": "ThreatType",
      "range": "AttackGoal"
    },
    {
      "id": "requiresAction",
      "label": "Threat requires protective action",
      "domain": "ThreatType",
      "range": "Recommendation"
    },
    {
      "id": "detectedInMessage",
      "label": "Feature detected in message",
      "domain": "MessageFeature",
      "range": "PhishingMessage"
    },
    {
      "id": "hasEvidence",
      "label": "Analysis has evidence",
      "domain": "AnalysisResult",
      "range": "Evidence"
    },
    {
      "id": "containsUrlFeature",
      "label": "Message contains URL feature",
      "domain": "PhishingMessage",
      "range": "LinkFeature"
    },
    {
      "id": "hasSenderFeature",
      "label": "Message has sender feature",
      "domain": "PhishingMessage",
      "range": "SenderFeature"
    },
    {
      "id": "isFeatureOf",
      "label": "Feature is feature of threat",
      "domain": "MessageFeature",
      "range": "ThreatType",
      "inverseOf": "hasFeature"
    },
    {
      "id": "mitigatesThreat",
      "label": "Recommendation mitigates threat",
      "domain": "Recommendation",
      "range": "ThreatType"
    },
    {
      "id": "isEvidenceFor",
      "label": "Evidence supports analysis",
      "domain": "Evidence",
      "range": "AnalysisResult"
    }
  ],
  "dataProperties": [
    {
      "id": "keyword",
      "label": "Keyword used for feature detection",
      "domain": "MessageFeature",
      "range": "xsd:string"
    },
    {
      "id": "riskScore",
      "label": "Risk score contribution",
      "domain": "MessageFeature",
      "range": "xsd:integer"
    },
    {
      "id": "description",
      "label": "Entity description",
      "domain": "CyberSecurityConcept",
      "range": "xsd:string"
    },
    {
      "id": "hasSeverityWeight",
      "label": "Severity weight",
      "domain": "MessageFeature",
      "range": "xsd:integer"
    },
    {
      "id": "hasConfidenceScore",
      "label": "Confidence score",
      "domain": "AnalysisResult",
      "range": "xsd:decimal"
    },
    {
      "id": "hasMessageText",
      "label": "Message text",
      "domain": "PhishingMessage",
      "range": "xsd:string"
    },
    {
      "id": "hasDetectedAt",
      "label": "Detected timestamp",
      "domain": "AnalysisResult",
      "range": "xsd:dateTime"
    },
    {
      "id": "hasDomainName",
      "label": "Domain name",
      "domain": "UrlEvidence",
      "range": "xsd:string"
    },
    {
      "id": "hasSenderValue",
      "label": "Sender value",
      "domain": "SenderEvidence",
      "range": "xsd:string"
    },
    {
      "id": "hasRiskExplanation",
      "label": "Risk explanation",
      "domain": "AnalysisResult",
      "range": "xsd:string"
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
      "label": "Social media"
    },
    {
      "id": "WhatsApp",
      "label": "WhatsApp"
    },
    {
      "id": "Viber",
      "label": "Viber"
    },
    {
      "id": "Telegram",
      "label": "Telegram"
    },
    {
      "id": "InstagramDM",
      "label": "Instagram DM"
    },
    {
      "id": "FacebookMessenger",
      "label": "Facebook Messenger"
    },
    {
      "id": "PhoneCall",
      "label": "Phone call"
    },
    {
      "id": "QRCode",
      "label": "QR code"
    },
    {
      "id": "WebForm",
      "label": "Web form"
    }
  ],
  "features": [
    {
      "id": "Urgency",
      "label": "Urgency language",
      "score": 15,
      "description": "The message pushes the user to act quickly without proper verification.",
      "keywords": [
        "urgent",
        "immediately",
        "limited time",
        "within 24 hours",
        "act now",
        "final notice",
        "expires today"
      ]
    },
    {
      "id": "AccountThreat",
      "label": "Account threat",
      "score": 20,
      "description": "The message threatens account blocking, suspension, closure or restriction.",
      "keywords": [
        "blocked",
        "suspended",
        "restricted",
        "closed",
        "deactivated",
        "account will be blocked",
        "account suspension"
      ]
    },
    {
      "id": "CredentialRequest",
      "label": "Credential request",
      "score": 30,
      "description": "The message asks for password, login credentials or account verification.",
      "keywords": [
        "password",
        "login",
        "sign in",
        "verify your account",
        "confirm your account",
        "authentication",
        "credentials"
      ]
    },
    {
      "id": "PaymentRequest",
      "label": "Payment request",
      "score": 25,
      "description": "The message requests a payment, fee, card details, bank transfer or billing update.",
      "keywords": [
        "payment",
        "pay now",
        "fee",
        "card",
        "iban",
        "bank details",
        "billing",
        "invoice",
        "transfer"
      ]
    },
    {
      "id": "SuspiciousLink",
      "label": "Suspicious link",
      "score": 30,
      "description": "The message contains a URL that may lead to a fake or unsafe website.",
      "keywords": [
        "http://",
        "bit.ly",
        "tinyurl",
        "login-",
        "secure-",
        "verify-",
        ".top",
        ".xyz",
        ".click"
      ]
    },
    {
      "id": "PrizeBait",
      "label": "Prize bait",
      "score": 20,
      "description": "The message promises a prize, bonus, giveaway or reward to manipulate the user.",
      "keywords": [
        "prize",
        "winner",
        "bonus",
        "free gift",
        "giveaway",
        "reward",
        "you have won"
      ]
    },
    {
      "id": "UnknownSender",
      "label": "Unknown sender",
      "score": 10,
      "description": "The sender is unclear, unofficial or does not match a trusted organization.",
      "keywords": [
        "unknown",
        "no-reply",
        "support-center",
        "customer-support",
        "helpdesk"
      ]
    },
    {
      "id": "DeliveryFeeBait",
      "label": "Delivery fee bait",
      "score": 25,
      "description": "The message imitates a delivery company and asks for a small fee or data.",
      "keywords": [
        "delivery",
        "parcel",
        "shipping fee",
        "package",
        "customs fee",
        "delivery failed",
        "reschedule delivery"
      ]
    },
    {
      "id": "CryptoPaymentRequest",
      "label": "Crypto payment request",
      "score": 25,
      "description": "The message requests cryptocurrency payment or wallet transfer.",
      "keywords": [
        "crypto",
        "bitcoin",
        "usdt",
        "wallet",
        "blockchain",
        "seed phrase",
        "recovery phrase"
      ]
    },
    {
      "id": "CarFakeOffer",
      "label": "Fake vehicle offer",
      "score": 25,
      "description": "The message offers a vehicle at a suspiciously low price and pushes the user toward unsafe payment.",
      "keywords": [
        "car",
        "vehicle",
        "audi",
        "mercedes",
        "bmw",
        "shipping from canada",
        "shipping from usa",
        "deposit"
      ]
    },
    {
      "id": "TwoFactorCodeRequest",
      "label": "Two-factor code request",
      "score": 35,
      "description": "The message asks the user to provide a two-factor authentication code.",
      "keywords": [
        "2fa",
        "verification code",
        "one-time code",
        "otp",
        "security code",
        "six digit code"
      ]
    },
    {
      "id": "CardDataRequest",
      "label": "Card data request",
      "score": 35,
      "description": "The message asks for card number, CVV, expiration date or billing information.",
      "keywords": [
        "cvv",
        "card number",
        "expiry date",
        "expiration date",
        "billing address",
        "debit card",
        "credit card"
      ]
    },
    {
      "id": "PersonalDataRequest",
      "label": "Personal data request",
      "score": 25,
      "description": "The message asks for personal information such as ID number, address or document photo.",
      "keywords": [
        "personal data",
        "id card",
        "passport",
        "address",
        "date of birth",
        "document photo",
        "identity verification"
      ]
    },
    {
      "id": "ShortenedUrlFeature",
      "label": "Shortened URL",
      "score": 20,
      "description": "The message uses a shortened URL that hides the final destination.",
      "keywords": [
        "bit.ly",
        "tinyurl",
        "t.co",
        "goo.gl",
        "ow.ly",
        "rebrand.ly"
      ]
    },
    {
      "id": "LookalikeDomainFeature",
      "label": "Lookalike domain",
      "score": 30,
      "description": "The URL imitates a trusted brand using misleading domain structure.",
      "keywords": [
        "paypaI",
        "micros0ft",
        "g00gle",
        "secure-bank",
        "login-bank",
        "apple-support"
      ]
    },
    {
      "id": "HttpWithoutHttpsFeature",
      "label": "HTTP without HTTPS",
      "score": 15,
      "description": "The URL uses plain HTTP or another weak trust signal.",
      "keywords": [
        "http://"
      ]
    },
    {
      "id": "GenericGreetingFeature",
      "label": "Generic greeting",
      "score": 8,
      "description": "The message uses a generic greeting instead of a specific recipient.",
      "keywords": [
        "dear customer",
        "dear user",
        "hello client",
        "valued customer"
      ]
    },
    {
      "id": "GrammarMistakeFeature",
      "label": "Grammar or spelling mistakes",
      "score": 8,
      "description": "The message contains grammar or spelling patterns often seen in mass phishing.",
      "keywords": [
        "kindly verify",
        "your informations",
        "account informations",
        "dear costumer"
      ]
    },
    {
      "id": "AuthorityPressureFeature",
      "label": "Authority pressure",
      "score": 15,
      "description": "The message pretends to be from an authority, police, tax or government body.",
      "keywords": [
        "tax authority",
        "police",
        "government notice",
        "court notice",
        "legal action",
        "official request"
      ]
    },
    {
      "id": "GiftCardPaymentRequest",
      "label": "Gift card payment request",
      "score": 30,
      "description": "The message requests payment through gift cards or voucher codes.",
      "keywords": [
        "gift card",
        "voucher code",
        "itunes card",
        "google play card",
        "steam card"
      ]
    },
    {
      "id": "MaliciousAttachmentFeature",
      "label": "Malicious attachment signal",
      "score": 30,
      "description": "The message tries to make the user open an attachment or document.",
      "keywords": [
        "open the attachment",
        "attached invoice",
        "enable macros",
        "download document",
        ".exe",
        ".scr",
        ".zip"
      ]
    },
    {
      "id": "RefundBait",
      "label": "Refund bait",
      "score": 20,
      "description": "The message promises a refund in exchange for login, card or personal details.",
      "keywords": [
        "refund",
        "tax refund",
        "claim refund",
        "reimbursement",
        "money back"
      ]
    },
    {
      "id": "InvestmentReturnBait",
      "label": "Investment return bait",
      "score": 25,
      "description": "The message promises unrealistic investment returns.",
      "keywords": [
        "guaranteed return",
        "double your money",
        "investment opportunity",
        "risk-free profit",
        "daily profit"
      ]
    },
    {
      "id": "TechSupportBait",
      "label": "Tech support bait",
      "score": 20,
      "description": "The message claims a device or account has a technical/security problem.",
      "keywords": [
        "virus detected",
        "device infected",
        "call support",
        "technical support",
        "security alert"
      ]
    },
    {
      "id": "QRCodePrompt",
      "label": "QR code prompt",
      "score": 20,
      "description": "The message asks the user to scan a QR code for login, payment or verification.",
      "keywords": [
        "scan qr",
        "qr code",
        "scan the code",
        "qr payment"
      ]
    }
  ],
  "threatTypes": [
    {
      "id": "FakeBankMessage",
      "label": "Fake bank message",
      "description": "A scam that imitates a bank and tries to steal money, credentials or card data.",
      "relatedFeatureIds": [
        "AccountThreat",
        "CredentialRequest",
        "PaymentRequest",
        "SuspiciousLink",
        "CardDataRequest",
        "TwoFactorCodeRequest"
      ],
      "targetOrganizationIds": [
        "BankOrganization"
      ],
      "attackGoalIds": [
        "StealCredentials",
        "StealCardData",
        "BypassTwoFactor"
      ]
    },
    {
      "id": "FakeDeliveryMessage",
      "label": "Fake delivery message",
      "description": "A scam that imitates a courier or delivery service and requests a fee or personal data.",
      "relatedFeatureIds": [
        "DeliveryFeeBait",
        "PaymentRequest",
        "SuspiciousLink",
        "Urgency",
        "SmallFeeRequest"
      ],
      "targetOrganizationIds": [
        "CourierCompany"
      ],
      "attackGoalIds": [
        "ReceiveFraudulentPayment",
        "StealPersonalData"
      ]
    },
    {
      "id": "FakePrizeScam",
      "label": "Fake prize scam",
      "description": "A scam that promises a prize and leads the user to a link, payment or data request.",
      "relatedFeatureIds": [
        "PrizeBait",
        "SuspiciousLink",
        "PaymentRequest",
        "PersonalDataRequest"
      ],
      "targetOrganizationIds": [
        "OnlineStore",
        "SocialNetwork"
      ],
      "attackGoalIds": [
        "StealPersonalData",
        "ReceiveFraudulentPayment"
      ]
    },
    {
      "id": "CredentialPhishing",
      "label": "Credential phishing",
      "description": "A phishing attack that targets passwords, account access and login tokens.",
      "relatedFeatureIds": [
        "CredentialRequest",
        "SuspiciousLink",
        "Urgency",
        "LookalikeDomainFeature",
        "TwoFactorCodeRequest"
      ],
      "targetOrganizationIds": [
        "SocialNetwork",
        "PaymentProvider",
        "OnlineStore"
      ],
      "attackGoalIds": [
        "StealCredentials",
        "TakeOverAccount"
      ]
    },
    {
      "id": "CryptoScam",
      "label": "Crypto scam",
      "description": "A scam involving cryptocurrency payment, wallet transfer or recovery phrase theft.",
      "relatedFeatureIds": [
        "CryptoPaymentRequest",
        "Urgency",
        "SuspiciousLink",
        "UnknownSender",
        "InvestmentReturnBait"
      ],
      "targetOrganizationIds": [
        "CryptoExchange"
      ],
      "attackGoalIds": [
        "StealCryptoAssets",
        "ReceiveFraudulentPayment"
      ]
    },
    {
      "id": "FakeVehicleOffer",
      "label": "Fake vehicle offer",
      "description": "A scam involving a low-price vehicle offer and unsafe deposit/payment request.",
      "relatedFeatureIds": [
        "CarFakeOffer",
        "PaymentRequest",
        "UnknownSender",
        "SuspiciousLink"
      ],
      "targetOrganizationIds": [
        "OnlineStore"
      ],
      "attackGoalIds": [
        "ReceiveFraudulentPayment"
      ]
    },
    {
      "id": "TechSupportScam",
      "label": "Tech support scam",
      "description": "A scam that pretends the user has a technical or security issue and must contact fake support.",
      "relatedFeatureIds": [
        "TechSupportBait",
        "Urgency",
        "SuspiciousLink",
        "PaymentRequest"
      ],
      "targetOrganizationIds": [
        "TelecomProvider",
        "PaymentProvider"
      ],
      "attackGoalIds": [
        "InstallMalware",
        "ReceiveFraudulentPayment"
      ]
    },
    {
      "id": "InvestmentScam",
      "label": "Investment scam",
      "description": "A scam that promises unrealistic investment profits and asks for money or account details.",
      "relatedFeatureIds": [
        "InvestmentReturnBait",
        "CryptoPaymentRequest",
        "PaymentRequest",
        "UnknownSender"
      ],
      "targetOrganizationIds": [
        "CryptoExchange"
      ],
      "attackGoalIds": [
        "ReceiveFraudulentPayment",
        "StealCryptoAssets"
      ]
    },
    {
      "id": "RefundScam",
      "label": "Refund scam",
      "description": "A scam that uses a fake refund to collect card or personal details.",
      "relatedFeatureIds": [
        "RefundBait",
        "CardDataRequest",
        "PersonalDataRequest",
        "SuspiciousLink"
      ],
      "targetOrganizationIds": [
        "GovernmentInstitution",
        "OnlineStore",
        "PaymentProvider"
      ],
      "attackGoalIds": [
        "StealCardData",
        "StealPersonalData"
      ]
    },
    {
      "id": "MalwareAttachmentScam",
      "label": "Malware attachment scam",
      "description": "A scam that attempts to make the user open a malicious file or macro-enabled document.",
      "relatedFeatureIds": [
        "MaliciousAttachmentFeature",
        "Urgency",
        "UnknownSender"
      ],
      "targetOrganizationIds": [
        "OnlineStore"
      ],
      "attackGoalIds": [
        "InstallMalware"
      ]
    },
    {
      "id": "QRPhishing",
      "label": "QR phishing",
      "description": "A phishing attempt that uses a QR code to redirect the user to a malicious page.",
      "relatedFeatureIds": [
        "QRCodePrompt",
        "SuspiciousLink",
        "CredentialRequest"
      ],
      "targetOrganizationIds": [
        "PaymentProvider",
        "BankOrganization"
      ],
      "attackGoalIds": [
        "StealCredentials",
        "StealCardData"
      ]
    },
    {
      "id": "GovernmentImpersonation",
      "label": "Government impersonation",
      "description": "A scam that pretends to be from a tax, legal or government institution.",
      "relatedFeatureIds": [
        "AuthorityPressureFeature",
        "PaymentRequest",
        "PersonalDataRequest",
        "SuspiciousLink"
      ],
      "targetOrganizationIds": [
        "GovernmentInstitution"
      ],
      "attackGoalIds": [
        "StealPersonalData",
        "ReceiveFraudulentPayment"
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
      "text": "Do not open links from the message until you verify the sender through an official channel."
    },
    {
      "id": "DoNotEnterData",
      "label": "Do not enter personal data",
      "appliesToRisk": [
        "MediumRisk",
        "HighRisk"
      ],
      "text": "Do not enter passwords, card details, two-factor codes or personal information through the provided link."
    },
    {
      "id": "VerifyOfficialWebsite",
      "label": "Verify through the official website",
      "appliesToRisk": [
        "LowRisk",
        "MediumRisk",
        "HighRisk"
      ],
      "text": "Open the official website manually in your browser instead of using the received link."
    },
    {
      "id": "ReportMessage",
      "label": "Report the message",
      "appliesToRisk": [
        "HighRisk"
      ],
      "text": "Report the message as spam or phishing and block the sender if possible."
    },
    {
      "id": "ContactBank",
      "label": "Contact your bank",
      "appliesToRisk": [
        "HighRisk"
      ],
      "text": "If bank or card data may be involved, contact your bank through the official phone number or app."
    },
    {
      "id": "ChangePassword",
      "label": "Change password",
      "appliesToRisk": [
        "HighRisk"
      ],
      "text": "If you entered credentials, change your password from the official website and enable two-factor authentication."
    },
    {
      "id": "DoNotDownloadAttachment",
      "label": "Do not download attachments",
      "appliesToRisk": [
        "MediumRisk",
        "HighRisk"
      ],
      "text": "Do not download or open attachments from unknown or suspicious senders."
    },
    {
      "id": "CheckDeliveryOfficially",
      "label": "Check delivery officially",
      "appliesToRisk": [
        "MediumRisk",
        "HighRisk"
      ],
      "text": "For delivery messages, check the tracking number only through the official courier website or app."
    },
    {
      "id": "AvoidCryptoTransfer",
      "label": "Avoid crypto transfer",
      "appliesToRisk": [
        "MediumRisk",
        "HighRisk"
      ],
      "text": "Do not send cryptocurrency or wallet information based on an unsolicited message."
    },
    {
      "id": "PreserveEvidence",
      "label": "Preserve evidence",
      "appliesToRisk": [
        "HighRisk"
      ],
      "text": "Keep a screenshot or copy of the message if you need to report the scam."
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
    .join('') || `Entity${Date.now()}`;
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
  lines.push('  rdfs:comment "Expanded ontology for phishing message analysis, online scams, indicators, channels, attack goals, organizations, risk levels and recommendations." .');
  lines.push('');

  ontology.classes.forEach((klass) => {
    lines.push(`pg:${klass.id} a owl:Class ;`);
    lines.push(`  rdfs:label "${literal(klass.label)}" .`);
    lines.push('');

    if (klass.parentId) {
      lines.push(`pg:${klass.id} rdfs:subClassOf pg:${klass.parentId} .`);
      lines.push('');
    }
  });

  const objectProperties = ontology.objectProperties || [
    { id: 'hasFeature', label: 'Threat type has related message feature' },
    { id: 'hasRiskLevel', label: 'Analysis has risk level' },
    { id: 'hasRecommendation', label: 'Risk level has recommendation' },
    { id: 'usesChannel', label: 'Message uses communication channel' }
  ];

  objectProperties.forEach((property) => {
    lines.push(`pg:${property.id} a owl:ObjectProperty ;`);
    lines.push(`  rdfs:label "${literal(property.label)}" .`);
    if (property.domain) lines.push(`pg:${property.id} rdfs:domain pg:${property.domain} .`);
    if (property.range) lines.push(`pg:${property.id} rdfs:range pg:${property.range} .`);
    if (property.inverseOf) lines.push(`pg:${property.id} owl:inverseOf pg:${property.inverseOf} .`);
    lines.push('');
  });

  const dataProperties = ontology.dataProperties || [
    { id: 'keyword', label: 'Keyword used for feature detection' },
    { id: 'riskScore', label: 'Risk score contribution' },
    { id: 'description', label: 'Entity description' }
  ];

  dataProperties.forEach((property) => {
    lines.push(`pg:${property.id} a owl:DatatypeProperty ;`);
    lines.push(`  rdfs:label "${literal(property.label)}" .`);
    if (property.domain) lines.push(`pg:${property.id} rdfs:domain pg:${property.domain} .`);
    if (property.range) lines.push(`pg:${property.id} rdfs:range ${property.range} .`);
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
    const relationLines = [
      ...(threatType.relatedFeatureIds || []).map((featureId) => `  pg:hasFeature pg:${featureId}`),
      ...(threatType.targetOrganizationIds || []).map((organizationId) => `  pg:targetsOrganization pg:${organizationId}`),
      ...(threatType.attackGoalIds || []).map((goalId) => `  pg:hasAttackGoal pg:${goalId}`)
    ];

    lines.push(`pg:${threatType.id} a pg:ThreatType ;`);
    lines.push(`  rdfs:label "${literal(threatType.label)}" ;`);
    lines.push(`  pg:description "${literal(threatType.description)}"${relationLines.length ? ' ;' : ' .'}`);
    relationLines.forEach((line, index) => {
      const isLast = index === relationLines.length - 1;
      lines.push(`${line}${isLast ? ' .' : ' ;'}`);
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
