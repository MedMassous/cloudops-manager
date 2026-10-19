# CloudOps Manager — Requirements Specification

**Project:** CloudOps Manager  
**Status:** Initial design baseline — validate with the project supervisor and update as implementation evolves.  
**Stack:** Next.js + TypeScript, NestJS REST API, PostgreSQL, Prisma or TypeORM, Docker Compose, Jest, AWS deployment target.

## 1. Purpose

CloudOps Manager is a web application for organizing infrastructure resources and viewing their operational status from a single dashboard. It provides role-based access, project and environment management, server/application inventory, monitoring metrics, alert rules, and incident tracking.

## 2. Objectives

- Centralize infrastructure inventory by project and environment.
- Provide role-based access to administrative and read-only functions.
- Display server health and historical CPU/RAM/availability metrics.
- Define alert thresholds and track triggered alerts/incidents.
- Offer a documented REST API and a responsive web interface.
- Package the application with Docker and prepare it for deployment on AWS.

## 3. Actors and permissions

| Actor | Main permissions |
|---|---|
| **Admin** | Manage users/roles and all projects, teams, environments, servers, applications, alert rules, and incidents. |
| **DevOps** | Manage assigned projects and their infrastructure resources; view metrics; manage alerts/incidents within permitted scope. |
| **Viewer** | Read dashboards, projects, environments, servers, applications, metrics, alerts, and incidents. Cannot modify data. |

Every protected API operation must verify authentication and authorization on the server. Hiding a button in the frontend is not a security control.

## 4. Functional requirements

### FR-01 — Authentication and authorization
- Users can sign in and sign out.
- The API issues and validates an authentication token using the agreed JWT strategy.
- Passwords are stored as secure hashes, never as plaintext.
- Protected endpoints require authentication and enforce Admin, DevOps, or Viewer permissions.
- Invalid credentials and expired/invalid tokens return appropriate HTTP errors without leaking secrets.

### FR-02 — Dashboard
- Show summary counts for projects, environments, servers, applications, active alerts, and open incidents.
- Show server status and recent CPU/RAM/availability information when data exists.
- Show recent alerts/incidents and provide navigation to their detail pages.
- Clearly distinguish live backend data from demo/sample data during development.

### FR-03 — Project and team management
- Authorized users can create, view, update, and delete projects.
- Projects can be associated with teams and assigned members.
- Users can list projects they are allowed to access.
- Lists support pagination and, where relevant, search and filters.

### FR-04 — Environment management
- A project can contain environments such as development, staging, and production.
- Authorized users can create, view, update, and delete environments.
- An environment belongs to one project; deleting it must respect related-resource constraints.

### FR-05 — Server inventory
- Authorized users can register, view, update, and remove server records.
- Server records include a name/hostname, environment, address or identifier, operating system, status, and timestamps as agreed in the data model.
- Server status must use a documented, consistent set of values.
- Sensitive credentials, private keys, and secrets must not be stored in ordinary server fields or returned by API responses.

### FR-06 — Application inventory
- Authorized users can register and maintain applications.
- Applications can be associated with a project/environment and, where applicable, a server.
- The UI shows the application name, deployment/environment association, and status.

### FR-07 — Monitoring metrics
- The system stores timestamped metrics associated with a server.
- The initial scope includes CPU usage, memory usage, and availability/status history.
- The dashboard displays recent metrics as charts and handles empty datasets gracefully.
- Metric values and units are validated; timestamps are stored consistently.
- If metrics are simulated for the academic demo, this must be documented and labelled as simulated data.

### FR-08 — Alert rules and alerts
- Authorized users can create, view, update, enable/disable, and delete alert rules.
- A rule specifies a metric, condition/threshold, and applicable resource or scope.
- Triggered alerts record the rule, affected resource, observed value when available, severity, status, and timestamps.
- Users with appropriate permissions can acknowledge and resolve alerts.

### FR-09 — Incident tracking
- Users with appropriate permissions can create and update incidents linked to an alert or resource.
- Incidents include a title, description, severity, status, owner/assignee when applicable, and timestamps.
- The UI supports filtering incidents by status and severity.

### FR-10 — REST API and documentation
- The NestJS API exposes documented REST endpoints using Swagger/OpenAPI.
- DTO validation rejects invalid input and returns clear validation errors.
- API errors use consistent HTTP status codes and response formats.
- List endpoints use pagination and relevant filters/search.

### FR-11 — Auditability and safe error handling
- Important changes should record created/updated timestamps and the responsible user where appropriate.
- Errors must not expose stack traces, passwords, tokens, database credentials, or other secrets in production.

## 5. Non-functional requirements

- **Security:** server-side authorization, password hashing, input validation, secrets via environment/configuration, least-privilege database and AWS access.
- **Maintainability:** separate frontend, backend, and database concerns; use clear naming and consistent formatting.
- **Usability:** responsive layouts, readable status indicators, accessible labels, and useful empty/loading/error states.
- **Reliability:** validate inputs, handle database/API failures, and avoid silent data loss.
- **Performance:** paginate large collections and index frequently queried foreign keys and timestamps where justified.
- **Testability:** Jest tests for important services/controllers and authorization rules; basic frontend checks for critical interactions.
- **Portability:** local development should be reproducible using documented commands and Docker Compose where supported.
- **Documentation:** README, setup instructions, API documentation, requirements, architecture, UML, and database diagrams.

## 6. Proposed data model baseline

The initial design uses these entities; the team may merge or split entities after agreeing on the ORM schema:

1. `User`
2. `Role`
3. `Project`
4. `Team`
5. `ProjectMember` (membership/assignment join entity)
6. `Environment`
7. `Server`
8. `Application`
9. `Metric`
10. `AlertRule`
11. `Alert`
12. `Incident`

Use foreign keys and explicit deletion rules. Do not rely on frontend state as the source of truth. Persist business data in PostgreSQL.

## 7. API scope target

The project target is **at least 20 documented endpoints**, subject to supervisor confirmation. A proposed endpoint inventory is:

| Area | Example endpoints |
|---|---|
| Auth | `POST /auth/login`, `GET /auth/me` |
| Users/roles | `GET /users`, `POST /users`, `PATCH /users/:id`, `GET /roles` |
| Projects | `GET /projects`, `POST /projects`, `GET /projects/:id`, `PATCH /projects/:id`, `DELETE /projects/:id` |
| Teams/members | `GET /teams`, `POST /teams`, `POST /projects/:id/members`, `DELETE /projects/:id/members/:userId` |
| Environments | `GET /environments`, `POST /environments`, `PATCH /environments/:id`, `DELETE /environments/:id` |
| Servers/apps | `GET /servers`, `POST /servers`, `GET /servers/:id`, `PATCH /servers/:id`, `DELETE /servers/:id`, `GET /applications`, `POST /applications` |
| Metrics | `GET /servers/:id/metrics`, `POST /servers/:id/metrics` (only if ingestion is in scope) |
| Alerts/incidents | `GET /alert-rules`, `POST /alert-rules`, `GET /alerts`, `PATCH /alerts/:id`, `GET /incidents`, `POST /incidents`, `PATCH /incidents/:id` |

This is a planning list, not an implemented API contract. Confirm exact endpoint names, payloads, pagination format, and role permissions before implementation. Avoid exposing public metric-ingestion endpoints without authentication and validation.

## 8. Validation and error handling

- Validate request bodies and route parameters with NestJS DTOs and validation pipes.
- Use `400` for invalid input, `401` for unauthenticated requests, `403` for insufficient permissions, `404` for missing resources, and appropriate `409` responses for conflicts.
- Return consistent errors and avoid revealing whether a private resource exists when that would leak information.
- Validate relationships so an application/server cannot accidentally reference a resource outside the user's authorized project scope.

## 9. Testing and acceptance criteria

The initial release is acceptable when:

- A user can authenticate and API permissions are enforced for all protected operations.
- Admin, DevOps, and Viewer behavior is demonstrated with positive and negative authorization tests.
- Core project, environment, server, application, alert, and incident flows persist in PostgreSQL.
- Dashboard totals and lists are sourced from the API, or explicitly labelled as demo data if not yet connected.
- Monitoring charts render with data and show a useful empty state when no metrics exist.
- DTO validation, pagination, filtering, and common error responses are demonstrated.
- Swagger documents the API, and the agreed endpoint target is met.
- Docker/local setup and environment variables are documented without committing secrets.
- Key backend services and authorization rules have automated tests.
- Architecture, UML, and database diagrams match the implemented system at submission time.

## 10. Assumptions and open decisions

- Choose **Prisma or TypeORM** and record the decision before creating migrations.
- Confirm whether metrics are simulated, manually submitted, or collected by an agent; do not imply real monitoring unless implemented.
- Confirm whether JWT is stored in an HTTP-only cookie or sent as a bearer token; document the chosen approach and its security trade-offs.
- Confirm alert evaluation cadence and whether it runs in-process or through a separate worker.
- Confirm AWS deployment components, budget, domain/HTTPS requirements, and whether a managed database is available.
- Keep this file updated when the team and supervisor approve scope changes.
