import { useEffect, useMemo, useState } from 'react'
import { addOntologyFeature, addThreatType, analyzeMessage, getHistory, getOntology } from './api'
import type { AnalysisResult, HistoryItem, Ontology } from './types'

const sampleMessages = [
  'Your bank account will be blocked. Urgently confirm your password and personal details here: http://secure-bank-login.example.com',
  'Your parcel is on hold. Pay a 2.99 BGN delivery fee here: http://delivery-verify.xyz',
  'Hi, our meeting is tomorrow at 2:00 PM. I will send you the documents later.'
]

function App() {
  const [message, setMessage] = useState(sampleMessages[0])
  const [channel, setChannel] = useState('SMS')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [ontology, setOntology] = useState<Ontology | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'analyze' | 'ontology' | 'history'>('analyze')

  async function refresh() {
    const [historyData, ontologyData] = await Promise.all([getHistory(), getOntology()])
    setHistory(historyData)
    setOntology(ontologyData)
  }

  useEffect(() => {
    refresh().catch((err) => setError(err.message))
  }, [])

  async function handleAnalyze() {
    try {
      setLoading(true)
      setError(null)
      const analysis = await analyzeMessage(message, channel)
      setResult(analysis)
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  const riskClass = useMemo(() => {
    if (!result) return 'risk-empty'
    if (result.riskScore >= 61) return 'risk-high'
    if (result.riskScore >= 31) return 'risk-medium'
    return 'risk-low'
  }, [result])

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">OWL + ACL + Multi-Agent System</p>
          <h1>PhishGuard</h1>
          <p className="hero-text">
            An intelligent multi-agent system for analyzing phishing messages and online scams.
            The system uses an ontology, agent communication and database persistence for analysis history.
          </p>
        </div>
      </section>

      <nav className="tabs">
        <button className={activeTab === 'analyze' ? 'active' : ''} onClick={() => setActiveTab('analyze')}>Analysis</button>
        <button className={activeTab === 'ontology' ? 'active' : ''} onClick={() => setActiveTab('ontology')}>Ontology</button>
        <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>History</button>
      </nav>

      {error && <div className="error-box">{error}</div>}

      {activeTab === 'analyze' && (
        <section className="grid two-columns">
          <div className="card">
            <h2>Message input</h2>
            <label>
              Channel
              <select value={channel} onChange={(event) => setChannel(event.target.value)}>
                <option value="SMS">SMS</option>
                <option value="Email">Email</option>
                <option value="ChatMessage">Chat message</option>
              </select>
            </label>
            <label>
              Message to analyze
              <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={9} />
            </label>
            <div className="sample-actions">
              {sampleMessages.map((sample, index) => (
                <button key={sample} type="button" onClick={() => setMessage(sample)}>Sample {index + 1}</button>
              ))}
            </div>
            <button className="primary-btn" onClick={handleAnalyze} disabled={loading}>
              {loading ? 'Analyzing...' : 'Analyze message'}
            </button>
          </div>

          <div className="card result-card">
            <h2>Result</h2>
            {!result ? (
              <p className="muted">No analysis yet. Paste a message and start the system.</p>
            ) : (
              <>
                <div className={`risk-meter ${riskClass}`}>
                  <div>
                    <span>Risk</span>
                    <strong>{result.riskLevel.label}</strong>
                  </div>
                  <div className="score-circle">{result.riskScore}</div>
                </div>

                <p className="explanation">{result.explanation}</p>

                {result.threatType && (
                  <div className="threat-box">
                    <span>Probable threat type</span>
                    <strong>{result.threatType.label}</strong>
                    <p>{result.threatType.description}</p>
                  </div>
                )}

                <h3>Detected indicators</h3>
                <div className="feature-list">
                  {result.detectedFeatures.length === 0 ? <p className="muted">No risky indicators detected.</p> : null}
                  {result.detectedFeatures.map((feature) => (
                    <article key={feature.id} className="feature-item">
                      <div>
                        <strong>{feature.label}</strong>
                        <p>{feature.description}</p>
                        <small>Evidence: {feature.evidence.join(', ')}</small>
                      </div>
                      <span>+{feature.score}</span>
                    </article>
                  ))}
                </div>

                <h3>Recommendations</h3>
                <ul className="recommendations">
                  {result.recommendations.map((recommendation) => <li key={recommendation}>{recommendation}</li>)}
                </ul>
              </>
            )}
          </div>
        </section>
      )}

      {activeTab === 'analyze' && result && (
        <section className="card full-width">
          <h2>ACL communication between agents</h2>
          <div className="acl-timeline">
            {result.aclMessages.map((aclMessage) => (
              <article key={aclMessage.id} className="acl-message">
                <div>
                  <strong>{aclMessage.performative}</strong>
                  <span>{aclMessage.sender} → {aclMessage.receiver}</span>
                </div>
                <pre>{JSON.stringify(aclMessage.content, null, 2)}</pre>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'ontology' && ontology && <OntologyManager ontology={ontology} onRefresh={refresh} />}
      {activeTab === 'history' && <History history={history} />}
    </main>
  )
}

function OntologyManager({ ontology, onRefresh }: { ontology: Ontology; onRefresh: () => Promise<void> }) {
  const [featureLabel, setFeatureLabel] = useState('Crypto payment request')
  const [featureKeywords, setFeatureKeywords] = useState('crypto, bitcoin, usdt, wallet')
  const [featureScore, setFeatureScore] = useState(25)
  const [featureDescription, setFeatureDescription] = useState('The message requests cryptocurrency payment or asks the user to send money to a wallet address.')
  const [threatLabel, setThreatLabel] = useState('Crypto Scam')
  const [threatDescription, setThreatDescription] = useState('A scam related to cryptocurrency payments, wallet transfers or fake crypto investment requests.')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  async function handleAddFeature() {
    setSaving(true)
    await addOntologyFeature({
      label: featureLabel,
      keywords: featureKeywords.split(',').map((keyword) => keyword.trim()).filter(Boolean),
      score: featureScore,
      description: featureDescription
    })
    await onRefresh()
    setSaving(false)
  }

  async function handleAddThreat() {
    setSaving(true)
    await addThreatType({ label: threatLabel, description: threatDescription, relatedFeatureIds: selectedFeatures })
    await onRefresh()
    setSaving(false)
  }

  function toggleFeature(id: string) {
    setSelectedFeatures((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  return (
    <section className="grid two-columns">
      <div className="card">
        <h2>Ontology manipulation: new indicator</h2>
        <p className="muted">This form adds a new individual of the MessageFeature class and regenerates the OWL file.</p>
        <label>Indicator name<input value={featureLabel} onChange={(event) => setFeatureLabel(event.target.value)} /></label>
        <label>Keywords<input value={featureKeywords} onChange={(event) => setFeatureKeywords(event.target.value)} /></label>
        <label>Risk points<input type="number" value={featureScore} onChange={(event) => setFeatureScore(Number(event.target.value))} /></label>
        <label>Description<textarea value={featureDescription} onChange={(event) => setFeatureDescription(event.target.value)} rows={4} /></label>
        <button className="primary-btn" onClick={handleAddFeature} disabled={saving}>Add indicator</button>
      </div>

      <div className="card">
        <h2>Ontology manipulation: new threat type</h2>
        <p className="muted">This form adds a new ThreatType and links it to existing indicators.</p>
        <label>Threat name<input value={threatLabel} onChange={(event) => setThreatLabel(event.target.value)} /></label>
        <label>Description<textarea value={threatDescription} onChange={(event) => setThreatDescription(event.target.value)} rows={4} /></label>
        <div className="checkbox-grid">
          {ontology.features.map((feature) => (
            <label key={feature.id} className="checkbox-label">
              <input type="checkbox" checked={selectedFeatures.includes(feature.id)} onChange={() => toggleFeature(feature.id)} />
              {feature.label}
            </label>
          ))}
        </div>
        <button className="primary-btn" onClick={handleAddThreat} disabled={saving}>Add threat type</button>
      </div>

      <div className="card full-width-content">
        <h2>Current ontology classes and individuals</h2>
        <div className="ontology-columns">
          <div>
            <h3>MessageFeature</h3>
            {ontology.features.map((feature) => (
              <article key={feature.id} className="ontology-item">
                <strong>{feature.label}</strong>
                <p>{feature.description}</p>
                <small>{feature.keywords.join(', ')}</small>
              </article>
            ))}
          </div>
          <div>
            <h3>ThreatType</h3>
            {ontology.threatTypes.map((threatType) => (
              <article key={threatType.id} className="ontology-item">
                <strong>{threatType.label}</strong>
                <p>{threatType.description}</p>
                <small>{threatType.relatedFeatureIds.join(', ')}</small>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function History({ history }: { history: HistoryItem[] }) {
  return (
    <section className="card full-width">
      <h2>Database history</h2>
      {history.length === 0 ? <p className="muted">No saved analyses yet.</p> : null}
      <div className="history-list">
        {history.map((item) => (
          <article key={item.id} className="history-item">
            <div>
              <strong>{item.riskLevel}</strong>
              <span>{new Date(item.createdAt).toLocaleString('en-US')}</span>
            </div>
            <p>Channel: {item.channel} · Risk points: {item.riskScore}</p>
            <small>Indicators: {item.detectedFeatures.map((feature) => feature.label).join(', ') || 'none'}</small>
          </article>
        ))}
      </div>
    </section>
  )
}

export default App
