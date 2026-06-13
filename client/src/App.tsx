import { useEffect, useMemo, useState } from 'react'
import { addOntologyFeature, addThreatType, analyzeMessage, getHistory, getOntology } from './api'
import type { AnalysisResult, HistoryItem, Ontology } from './types'

const sampleMessages = [
  'Вашата банкова сметка ще бъде блокирана. Спешно потвърдете паролата и данните си тук: http://secure-bank-login.example.com',
  'Вашата пратка е задържана. Платете такса 2.99 лв за доставка тук: http://delivery-verify.xyz',
  'Здравей, срещата ни е утре в 14:00. Ще ти изпратя документите по-късно.'
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
            Интелигентна многоагентна система за анализ на фишинг съобщения и онлайн измами.
            Системата използва онтология, агентна комуникация и база данни за история на анализите.
          </p>
        </div>
      </section>

      <nav className="tabs">
        <button className={activeTab === 'analyze' ? 'active' : ''} onClick={() => setActiveTab('analyze')}>Анализ</button>
        <button className={activeTab === 'ontology' ? 'active' : ''} onClick={() => setActiveTab('ontology')}>Онтология</button>
        <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>История</button>
      </nav>

      {error && <div className="error-box">{error}</div>}

      {activeTab === 'analyze' && (
        <section className="grid two-columns">
          <div className="card">
            <h2>Входно съобщение</h2>
            <label>
              Канал
              <select value={channel} onChange={(event) => setChannel(event.target.value)}>
                <option value="SMS">SMS</option>
                <option value="Email">Email</option>
                <option value="ChatMessage">Chat message</option>
              </select>
            </label>
            <label>
              Съобщение за анализ
              <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={9} />
            </label>
            <div className="sample-actions">
              {sampleMessages.map((sample, index) => (
                <button key={sample} type="button" onClick={() => setMessage(sample)}>Пример {index + 1}</button>
              ))}
            </div>
            <button className="primary-btn" onClick={handleAnalyze} disabled={loading}>
              {loading ? 'Анализиране...' : 'Анализирай съобщението'}
            </button>
          </div>

          <div className="card result-card">
            <h2>Резултат</h2>
            {!result ? (
              <p className="muted">Все още няма анализ. Постави съобщение и стартирай системата.</p>
            ) : (
              <>
                <div className={`risk-meter ${riskClass}`}>
                  <div>
                    <span>Риск</span>
                    <strong>{result.riskLevel.label}</strong>
                  </div>
                  <div className="score-circle">{result.riskScore}</div>
                </div>

                <p className="explanation">{result.explanation}</p>

                {result.threatType && (
                  <div className="threat-box">
                    <span>Вероятен тип заплаха</span>
                    <strong>{result.threatType.label}</strong>
                    <p>{result.threatType.description}</p>
                  </div>
                )}

                <h3>Открити признаци</h3>
                <div className="feature-list">
                  {result.detectedFeatures.length === 0 ? <p className="muted">Няма открити рискови признаци.</p> : null}
                  {result.detectedFeatures.map((feature) => (
                    <article key={feature.id} className="feature-item">
                      <div>
                        <strong>{feature.label}</strong>
                        <p>{feature.description}</p>
                        <small>Доказателства: {feature.evidence.join(', ')}</small>
                      </div>
                      <span>+{feature.score}</span>
                    </article>
                  ))}
                </div>

                <h3>Препоръки</h3>
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
          <h2>ACL комуникация между агентите</h2>
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
  const [featureDescription, setFeatureDescription] = useState('Съобщението изисква плащане с криптовалута или изпращане към wallet.')
  const [threatLabel, setThreatLabel] = useState('Crypto Scam')
  const [threatDescription, setThreatDescription] = useState('Измама, свързана с искане за плащане или инвестиция в криптовалута.')
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
        <h2>Манипулация на онтология: нов признак</h2>
        <p className="muted">Тази форма добавя нов индивид от клас MessageFeature и регенерира OWL файла.</p>
        <label>Име на признака<input value={featureLabel} onChange={(event) => setFeatureLabel(event.target.value)} /></label>
        <label>Ключови думи<input value={featureKeywords} onChange={(event) => setFeatureKeywords(event.target.value)} /></label>
        <label>Точки риск<input type="number" value={featureScore} onChange={(event) => setFeatureScore(Number(event.target.value))} /></label>
        <label>Описание<textarea value={featureDescription} onChange={(event) => setFeatureDescription(event.target.value)} rows={4} /></label>
        <button className="primary-btn" onClick={handleAddFeature} disabled={saving}>Добави признак</button>
      </div>

      <div className="card">
        <h2>Манипулация на онтология: нов тип заплаха</h2>
        <p className="muted">Тази форма добавя нов ThreatType и го свързва с вече съществуващи признаци.</p>
        <label>Име на заплаха<input value={threatLabel} onChange={(event) => setThreatLabel(event.target.value)} /></label>
        <label>Описание<textarea value={threatDescription} onChange={(event) => setThreatDescription(event.target.value)} rows={4} /></label>
        <div className="checkbox-grid">
          {ontology.features.map((feature) => (
            <label key={feature.id} className="checkbox-label">
              <input type="checkbox" checked={selectedFeatures.includes(feature.id)} onChange={() => toggleFeature(feature.id)} />
              {feature.label}
            </label>
          ))}
        </div>
        <button className="primary-btn" onClick={handleAddThreat} disabled={saving}>Добави тип заплаха</button>
      </div>

      <div className="card full-width-content">
        <h2>Текущи класове и индивиди в онтологията</h2>
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
      <h2>История от базата данни</h2>
      {history.length === 0 ? <p className="muted">Все още няма записани анализи.</p> : null}
      <div className="history-list">
        {history.map((item) => (
          <article key={item.id} className="history-item">
            <div>
              <strong>{item.riskLevel}</strong>
              <span>{new Date(item.createdAt).toLocaleString('bg-BG')}</span>
            </div>
            <p>Канал: {item.channel} · Риск точки: {item.riskScore}</p>
            <small>Признаци: {item.detectedFeatures.map((feature) => feature.label).join(', ') || 'няма'}</small>
          </article>
        ))}
      </div>
    </section>
  )
}

export default App
