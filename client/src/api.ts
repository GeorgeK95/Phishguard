import type { AnalysisResult, HistoryItem, Ontology } from './types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.error || `Request failed: ${response.status}`)
  }

  return response.json()
}

export function analyzeMessage(message: string, channel: string) {
  return request<AnalysisResult>('/analyze', {
    method: 'POST',
    body: JSON.stringify({ message, channel })
  })
}

export function getHistory() {
  return request<HistoryItem[]>('/analyses')
}

export function getOntology() {
  return request<Ontology>('/ontology')
}

export function addOntologyFeature(payload: {
  label: string
  keywords: string[]
  score: number
  description: string
}) {
  return request('/ontology/features', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function addThreatType(payload: {
  label: string
  description: string
  relatedFeatureIds: string[]
}) {
  return request('/ontology/threat-types', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}
