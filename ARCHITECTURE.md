# NorthStar Architecture Diagram

```mermaid
flowchart LR
  U[Users\nEmployee | Manager | Admin] --> FE[React + Vite Web App]

  FE -->|Role-based workflows| S[(In-Memory App State)]
  FE -->|Analytics charts| RC[Recharts Visualization]

  FE -->|POST /api/ai| VF[Vercel Serverless Function\napi/ai.js]
  VF -->|Groq Chat Completions API| G[Groq API]

  FE -->|CSV Export| X[Downloaded CSV Report]

  subgraph Core Modules
    M1[Goal Creation + Validation]
    M2[Approval Workflow]
    M3[Quarterly Check-ins]
    M4[Shared Goals]
    M5[Audit Trail]
    M6[Dashboards + Analytics]
  end

  FE --> M1
  FE --> M2
  FE --> M3
  FE --> M4
  FE --> M5
  FE --> M6
```

## Hosting
- Frontend + API proxy deployed on Vercel
- AI calls secured through server-side env var (`GROQ_API_KEY`)

## Security
- API key not exposed to browser
- All AI requests routed through serverless proxy
