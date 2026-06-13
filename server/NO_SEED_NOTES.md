# No-seed experimental server

This server package starts with an empty ontology model: no predefined message features, threat types, risk levels, channels or recommendations are stored in `data/ontology.json`.

The SQLite database is intentionally not included. It will be created automatically at first startup.

The `RiskAssessmentAgent` contains a small runtime fallback for Low/Medium/High risk labels so that the `/api/analyze` endpoint does not crash while the ontology is empty. These fallback values are not stored as seeded ontology individuals.

Use this branch only for testing ontology manipulation from an empty state. For the exam demo, the seeded English version is more presentable.
