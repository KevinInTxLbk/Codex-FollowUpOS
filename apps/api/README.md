# FollowUpOS API

The FollowUpOS API exposes CRUD endpoints and a deterministic health diagnostic route.

## Base URL

`http://localhost:3000`

## Response envelope

```json
{
  "ok": true,
  "data": {}
}
```

Errors:

```json
{
  "ok": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {}
  }
}
```

## Health

**GET /health**

```json
{
  "ok": true,
  "data": {
    "service": "api",
    "port": 3000,
    "expectedPort": 3000,
    "expectedWebBaseUrl": "http://localhost:3001",
    "nodeEnv": "development"
  }
}
```

## CRUD endpoints

### Agencies

- `POST /agencies`
- `GET /agencies`
- `GET /agencies/:id`
- `PUT /agencies/:id`
- `DELETE /agencies/:id`

Example:

```json
POST /agencies
{
  "name": "FollowUpOS Agency"
}
```

### Users

- `POST /users`
- `GET /users`
- `GET /users/:id`
- `PUT /users/:id`
- `DELETE /users/:id`

### Clients

- `POST /clients`
- `GET /clients`
- `GET /clients/:id`
- `PUT /clients/:id`
- `DELETE /clients/:id`

### Leads

- `POST /leads`
- `GET /leads`
- `GET /leads/:id`
- `PUT /leads/:id`
- `DELETE /leads/:id`

### Campaigns

- `POST /campaigns`
- `GET /campaigns`
- `GET /campaigns/:id`
- `PUT /campaigns/:id`
- `DELETE /campaigns/:id`

### Outcomes

- `POST /outcomes`
- `GET /outcomes`
- `GET /outcomes/:id`
- `PUT /outcomes/:id`
- `DELETE /outcomes/:id`

### Messages

- `POST /messages`
- `GET /messages`
- `GET /messages/:id`

### Agent decision logs

- `POST /agent-decision-logs`
- `GET /agent-decision-logs?agencyId=&agentId=&leadId=&campaignId=`
