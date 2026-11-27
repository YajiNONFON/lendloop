# What I would change to run LendLoop in production

## Hosting and environments
- **Convex:** use a cloud deployment with separate development and production projects, not the local backend.
- **Clerk:** switch to a production instance with a real domain, and restrict allowed redirect URLs and origins.
- **n8n:** run it behind HTTPS with its own database (PostgreSQL) and queue mode, or use n8n Cloud, instead of a single local container. Pin the image version instead of `latest`.
- **Front-end:** deploy on a platform with preview environments per pull request.

## Secrets and keys
- Keep secrets in a secret manager, with a rotation plan. `AUTOMATION_SECRET` should be rotated without downtime (accept two secrets for a short overlap).
- Stop reading secrets from `$env` inside workflow expressions; use n8n credentials and external secrets where possible.
- Give each environment its own secrets and never reuse development keys.

## Security hardening
- Rate limiting on the public endpoints and on the webhook receiver, and an IP allow-list between Convex and n8n.
- Reject reused webhook event ids (store recent ids) on top of the 5-minute timestamp window.
- Validate and sanitize all free-text fields further, and add content limits on uploads when photos are added.
- Add an audit trail for admin actions (who removed which listing, who granted a badge).
- A data deletion and export flow for each user (privacy regulations), and a retention period for the automation journal.
- In a healthcare context: send pseudonymous identifiers to automation tools instead of names and emails, keep regulated data inside the primary store, and encrypt sensitive fields at rest with managed keys.

## Reliability and observability
- Alerts on failed automation events and on a rising retry count (the journal already records both).
- Error tracking (Sentry) on the front-end and logs and metrics in a monitoring tool such as Datadog.
- Backups and a tested restore procedure for the database; a runbook for the n8n error workflow.
- Real email delivery through a provider with bounce handling instead of the logged mock node.

## Scale and abuse protection
- **Pagination:** replace the full lists with Convex pagination (`paginate` on the server, `usePaginatedQuery` in the screens) and add search and filter indexes for categories and names.
- **Quotas and rate limiting:** the per-user quotas (50 tools, 10 pending requests) are in place; add request rate limiting per user and per IP.
- **Photo upload:** use Convex file storage with short-lived upload URLs, allow only JPEG, PNG and WebP, cap the size (about 2 MB), resize on the server and scan files, and keep the generated placeholder when no photo is set.
- **Offline behaviour:** add optimistic updates for common actions and clearer retry states for failed mutations.

## Quality
- End-to-end tests (Playwright) for the sign-in and loan flow, run in CI against a preview deployment.
- Dependency and security scanning in CI, and branch protection requiring green checks and one review.

## If the platform were AWS
| LendLoop | AWS equivalent |
|---|---|
| Clerk | Cognito |
| Convex functions and database | Lambda with API Gateway, and DynamoDB or RDS |
| n8n workflows | Step Functions and EventBridge Scheduler |
| Secrets | Secrets Manager |
| Audit and traceability | CloudTrail |
| Static front-end | S3 and CloudFront |
