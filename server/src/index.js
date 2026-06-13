import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase, getDatabase } from './services/db.js';
import { ensureOntologyFiles, loadOntology, addFeature, addThreatType } from './services/ontologyService.js';
import { CoordinatorAgent } from './agents/CoordinatorAgent.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

await ensureOntologyFiles();
await initDatabase();

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'phishguard-server', timestamp: new Date().toISOString() });
});

app.post('/api/analyze', async (req, res, next) => {
  try {
    const { message, channel = 'SMS' } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return res.status(400).json({ error: 'Message text is required and must be at least 5 characters.' });
    }

    const coordinator = new CoordinatorAgent();
    const result = await coordinator.analyze({ message: message.trim(), channel });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

app.get('/api/analyses', async (_req, res, next) => {
  try {
    const db = getDatabase();
    const analyses = await db.all(
      `SELECT id, channel, risk_level AS riskLevel, risk_score AS riskScore,
              detected_features AS detectedFeatures, created_at AS createdAt
       FROM analyses
       ORDER BY created_at DESC
       LIMIT 30`
    );

    res.json(analyses.map((row) => ({
      ...row,
      detectedFeatures: JSON.parse(row.detectedFeatures || '[]')
    })));
  } catch (error) {
    next(error);
  }
});

app.get('/api/analyses/:id', async (req, res, next) => {
  try {
    const db = getDatabase();
    const analysis = await db.get(
      `SELECT id, channel, original_message AS originalMessage, risk_level AS riskLevel,
              risk_score AS riskScore, detected_features AS detectedFeatures,
              recommendations, explanation, threat_type AS threatType,
              created_at AS createdAt
       FROM analyses
       WHERE id = ?`,
      [req.params.id]
    );

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found.' });
    }

    res.json({
      ...analysis,
      detectedFeatures: JSON.parse(analysis.detectedFeatures || '[]'),
      recommendations: JSON.parse(analysis.recommendations || '[]')
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/acl/messages', async (req, res, next) => {
  try {
    const db = getDatabase();
    const analysisId = req.query.analysisId;
    const messages = analysisId
      ? await db.all(
          `SELECT id, analysis_id AS analysisId, conversation_id AS conversationId,
                  performative, sender, receiver, ontology, content, created_at AS createdAt
           FROM acl_messages
           WHERE analysis_id = ?
           ORDER BY created_at ASC`,
          [analysisId]
        )
      : await db.all(
          `SELECT id, analysis_id AS analysisId, conversation_id AS conversationId,
                  performative, sender, receiver, ontology, content, created_at AS createdAt
           FROM acl_messages
           ORDER BY created_at DESC
           LIMIT 50`
        );

    res.json(messages.map((message) => ({
      ...message,
      content: JSON.parse(message.content || '{}')
    })));
  } catch (error) {
    next(error);
  }
});

app.get('/api/stats', async (_req, res, next) => {
  try {
    const db = getDatabase();
    const total = await db.get(`SELECT COUNT(*) as count FROM analyses`);
    const byRisk = await db.all(
      `SELECT risk_level AS riskLevel, COUNT(*) as count
       FROM analyses
       GROUP BY risk_level`
    );
    const recent = await db.all(
      `SELECT risk_level AS riskLevel, risk_score AS riskScore, created_at AS createdAt
       FROM analyses
       ORDER BY created_at DESC
       LIMIT 10`
    );

    res.json({ total: total.count, byRisk, recent });
  } catch (error) {
    next(error);
  }
});

app.get('/api/ontology', async (_req, res, next) => {
  try {
    res.json(await loadOntology());
  } catch (error) {
    next(error);
  }
});

app.post('/api/ontology/features', async (req, res, next) => {
  try {
    const { label, keywords, score, description } = req.body;
    if (!label || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ error: 'Feature label and at least one keyword are required.' });
    }

    const feature = await addFeature({ label, keywords, score, description });
    res.status(201).json(feature);
  } catch (error) {
    next(error);
  }
});

app.post('/api/ontology/threat-types', async (req, res, next) => {
  try {
    const { label, description, relatedFeatureIds } = req.body;
    if (!label) {
      return res.status(400).json({ error: 'Threat type label is required.' });
    }

    const threatType = await addThreatType({ label, description, relatedFeatureIds });
    res.status(201).json(threatType);
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: error.message || 'Unexpected server error.' });
});

app.listen(port, () => {
  console.log(`PhishGuard server running on http://localhost:${port}`);
});
