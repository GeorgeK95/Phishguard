export type RiskLevel = {
  id: string
  label: string
  minScore: number
  maxScore: number
}

export type DetectedFeature = {
  id: string
  label: string
  score: number
  description: string
  evidence: string[]
}

export type ThreatType = {
  id: string
  label: string
  description: string
  relatedFeatureIds: string[]
  matches?: number
}

export type AclMessage = {
  id: string
  performative: string
  sender: string
  receiver: string
  ontology: string
  conversationId: string
  content: Record<string, unknown>
  createdAt: string
}

export type AnalysisResult = {
  id: string
  channel: string
  originalMessage: string
  riskLevel: RiskLevel
  riskScore: number
  threatType: ThreatType | null
  detectedFeatures: DetectedFeature[]
  recommendations: string[]
  explanation: string
  aclMessages: AclMessage[]
}

export type OntologyFeature = {
  id: string
  label: string
  score: number
  description: string
  keywords: string[]
}

export type Ontology = {
  namespace: string
  classes: Array<{ id: string; label: string }>
  features: OntologyFeature[]
  threatTypes: ThreatType[]
  riskLevels: RiskLevel[]
  recommendations: Array<{ id: string; label: string; text: string; appliesToRisk: string[] }>
  channels: Array<{ id: string; label: string }>
}

export type HistoryItem = {
  id: string
  channel: string
  riskLevel: string
  riskScore: number
  detectedFeatures: DetectedFeature[]
  createdAt: string
}
