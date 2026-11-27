# n8n automations

Three workflows connect LendLoop (Convex) to n8n. Each message is signed, so each side checks the other.

| Workflow | Trigger | What it does |
|---|---|---|
| `loan-notifications.json` | Webhook, called by Convex | Verifies the signature, builds a message for the right person, logs a mock notification, answers 200 (or 401 if the signature is wrong or too old) |
| `overdue-reminders.json` | Schedule, every day at 9:00 | Asks Convex for overdue loans, builds one reminder per loan, then writes each reminder back to Convex |
| `error-handler.json` | Error Trigger | Reports any failed run to Convex, so failures show up in the journal and never stay silent |

## Security and data decisions
- **Signature both ways:** HMAC-SHA256 of `timestamp.body` with a shared secret. Messages older than 5 minutes are refused (limits replay).
- **Secrets:** `AUTOMATION_SECRET` lives in `n8n/.env` (n8n side) and in the Convex environment. It is never in the code or in these JSON files.
- **Data minimization:** Convex sends only event, loan id, recipient name and email, tool name, other party name and dates. No user ids, tokens or descriptions.
- **Idempotency:** every write-back has a unique key (`reminder:<loan>:<day>`, `error:<execution>`). Sending it twice creates one record. Convex also never sends the same notification twice.
- **Failures:** Convex retries a notification 3 times (now, 30 s, 2 min), then records it as `failed`. n8n HTTP nodes retry 3 times. The error workflow reports failed runs.

## Run it locally
1. `cd n8n`, copy `.env.example` to `.env` and set `AUTOMATION_SECRET` to a long random value (for example `openssl rand -hex 32`).
2. `docker compose up -d`, then open http://localhost:5678 and create the owner account.
3. Import the three files from `workflows/` (Workflows, Import from file).
4. In the two main workflows, open Settings and set **Error workflow** to `LendLoop - Error handler`.
5. Publish all three workflows.
6. Give the same secret and the webhook address to Convex, from the `back` folder:
   ```
   npx convex env set AUTOMATION_SECRET <the same value>
   npx convex env set N8N_WEBHOOK_URL http://localhost:5678/webhook/lendloop-loan-events
   ```
Without those two Convex settings, automation stays off and nothing leaves Convex.

## Replace the mock notification
The nodes named `Mock ... (logged)` only keep the message in the execution log. Swap them for Send Email, Slack or Discord, using an n8n credential for the channel.
