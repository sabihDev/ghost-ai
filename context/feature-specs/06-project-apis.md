The database schema is ready. Build the backend project API routes only.

## Routes

Create REST endpoints for:

- `GET /api/projects`  
  **Description:** List current user's projects  
  **Response:** `200 OK` – Returns object with two arrays:

  ```json
  {
    "ownedProjects": [
      {
        "id": "...",
        "name": "...",
        "ownerID": "...",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ],
    "sharedProjects": [
      {
        "id": "...",
        "name": "...",
        "ownerID": "...",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
  ```

- `POST /api/projects`  
  **Description:** Create project  
  **Request Body:**

  ```json
  {
    "name": "My Project" // optional, string, max 256 chars; defaults to "Untitled Project" if omitted
  }
  ```

  **Response:** `201 Created` – Returns created project object:

  ```json
  {
    "id": "proj_...",
    "name": "My Project",
    "ownerID": "user_...",
    "createdAt": "2026-05-26T12:00:00Z",
    "updatedAt": "2026-05-26T12:00:00Z"
  }
  ```

- `PATCH /api/projects/[projectId]`  
  **Description:** Update project (rename or update other fields)  
  **Request Body:**

  ```json
  {
    "name": "Updated Name" // optional, string, max 256 chars; only provided fields are updated
  }
  ```

  **Response:** `200 OK` – Returns updated project object with same schema as POST response  
  **Rules:** Only project owner can update; partial update semantics (only provided fields updated)

- `DELETE /api/projects/[projectId]`  
  **Description:** Delete project  
  **Response:** `200 OK` – Returns deleted project object or `{ "success": true }`  
  **Rules:** Only project owner can delete

## Rules

Use the authentication Clerk user ID as `ownerID`.

When creating:

- default missing project name to `Untitled Project`
- use the schema's existing ID strategy, do not add sequential IDs

Security:

- unauthenticated requests return `401`
- only project owner can rename or delete
- non-owner mutations return `403`

Keep this backend-only. Do not wire the UI yet.

## Check When Done

- routes exist for list/create/rename/delete
- owner checks are enforced for rename/delete
- `401` and `403` responses are handled successfully
- `npm run build` passes
