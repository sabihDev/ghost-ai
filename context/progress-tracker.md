# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Shape panel + custom node rendering complete

## Current Goal

- Ready for the next implementation feature unit.

## Completed

- Implemented feature spec 12: added a floating pill-shaped shape panel at the bottom-center of the canvas with 6 draggable shape buttons (rectangle, diamond, circle, pill, cylinder, hexagon), inline SVG icons for each shape, `SHAPE_DEFAULTS` (sensible default sizes per shape) and `ShapeDragPayload` type in `types/canvas.ts`, canvas `onDragOver`/`onDrop` handlers that convert screen position to flow coordinates and create Liveblocks-synced nodes via `NodeAddChange`/`onNodesChange`, node ID generation using `shape-timestamp-counter` pattern, and a basic `CanvasNodeComponent` custom node renderer with connection handles and bordered rectangle appearance. Wired the canvas with `ReactFlowProvider` for `useReactFlow`/`screenToFlowPosition` access.
- Implemented feature spec 11: replaced the canvas placeholder with a Liveblocks-backed React Flow canvas. Created `types/canvas.ts` with `CanvasNodeData`, `CanvasNode`, `CanvasEdge`, `NODE_COLORS`, and `NODE_SHAPES`. Created `components/editor/canvas.tsx` with a `LiveblocksProvider`/`RoomProvider`/`ClientSideSuspense`/error boundary wrapper, `useLiveblocksFlow` with suspense, `ReactFlow` with loose connections and `fitView`, dot-pattern `<Background>`, dark-themed `<MiniMap>`, and Liveblocks `<Cursors>`. Updated `editor-workspace-shell.tsx` to render the new canvas instead of the static placeholder. Updated `liveblocks.config.ts` `Storage` type from `object` to `Record<string, never>` to correctly signal empty storage.
- Implemented feature spec 10: installed `@liveblocks/node`, updated `liveblocks.config.ts` with Presence (cursor, isThinking) and UserMeta (name, avatar, cursorColor) types, created `lib/liveblocks.ts` (lazy cached node client singleton), created `lib/cursor-colors.ts` (deterministic color from a 20-color palette), created `POST /api/liveblocks-auth` (Clerk auth, project access check, room creation, ID token with user info, 403 for unauthorized).
- Implemented feature spec 01: installed and configured shadcn/ui, added Button, Card, Dialog, Input, Tabs, Textarea, and ScrollArea primitives, installed `lucide-react`, created `lib/utils.ts` with `cn()`, and mapped global theme tokens to the dark Ghost AI palette.
- Implemented feature spec 02: added the editor navbar, floating project sidebar shell with tabs and empty states, reusable editor dialog styling pattern, and a client editor shell mounted on the home page.
- Implemented feature spec 03: installed `@clerk/ui`, wrapped the root layout in `ClerkProvider` with Clerk's dark theme and app CSS variables, added sign-in/sign-up catch-all pages, protected routes with root `proxy.ts`, redirected `/` by auth state, moved the editor shell to `/editor`, and added Clerk's default `UserButton` to the editor navbar.
- Implemented feature spec 04: added the `/editor` home screen, mock owned/shared project data, create/rename/delete dialogs managed by a dedicated hook, sidebar project actions restricted to owned projects, live slug preview, and mobile sidebar backdrop dismissal.
- Implemented feature spec 05: added Prisma `Project` and `ProjectCollaborator` models with project status, ownership, collaborator uniqueness, cascade delete, and required indexes; added the cached `lib/prisma.ts` singleton with Accelerate/direct Postgres branching; ran migrations and generated the Prisma client.
- Implemented feature spec 06: added authenticated REST project APIs for list/create and owner-only rename/delete, using Clerk user IDs as project owners, Prisma persistence, request body validation, default project names, and explicit `401`/`403` JSON responses.
- Implemented feature spec 07: wired the editor home and sidebar to server-loaded project data, added a real project action hook for create/rename/delete API mutations, introduced `/editor/[projectId]` workspace URLs, aligned created project IDs with room IDs, and removed the mock project state.
- Implemented feature spec 08: replaced the project workspace route with `/editor/[roomId]`, added server-side Clerk identity and project access helpers, rendered `AccessDenied` for missing or unauthorized projects, and built the full-viewport editor workspace shell with project navbar, sidebar highlighting, canvas placeholder, and AI sidebar placeholder.
- Implemented feature spec 09: added the workspace share dialog, project-link copy feedback, owner-only collaborator invite/remove APIs, read-only collaborator access, and best-effort Clerk profile enrichment for collaborator names and avatars.
- Completed shared project management follow-up: `/api/projects` now returns both owned and shared projects, shared project discovery uses the authenticated Clerk primary email, and project rows can open the access dialog for owner management or collaborator read-only viewing.

## In Progress

- None yet.

## Next Up

- Select the next feature spec and implementation unit.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Project IDs created from the editor are validated slug-style room IDs so the Prisma project ID and Liveblocks room ID stay aligned.

## Session Notes

- Fixed shared project discovery so the sidebar Shared tab matches collaborator records against all Clerk email addresses on the signed-in account, not only the primary email.
- Added project counts to the My Projects and Shared sidebar tabs so populated shared lists are visible at a glance.
- Verified the shared sidebar rendering fix with `npm run lint` and `npm run build`.
- Added project owner enrichment to the share dialog API response using Clerk user lookup by `ownerId`.
- Rendered the project owner as a non-removable row above collaborators with an `Owner` badge and email/avatar fallback handling.
- Verified the owner row fix with `npm run lint` and `npm run build`.
- Added shared project listing to `GET /api/projects`, returning separate `ownedProjects` and `sharedProjects` arrays with owner filtering and collaborator email matching.
- Updated server-loaded editor project lists to use `getCurrentClerkIdentity()` so shared projects are resolved from Clerk's current primary email consistently with workspace access checks.
- Added a project-row access action in the sidebar: owned rows open collaborator management, while shared rows open the same dialog in read-only mode.
- Wired the share/access dialog into both the editor home shell and workspace sidebar project rows.
- Verified the shared project management follow-up with `npm run lint` and `npm run build`.
- Re-read `context/feature-specs/09-share-dialog.md` and verified the existing implementation against the owner/collaborator access requirements.
- Confirmed the workspace Share button opens `ShareDialog`, owners can invite/remove collaborators, collaborators get read-only controls, project-link copy shows temporary `Copied!` feedback, and collaborator profiles are enriched via Clerk with email-only fallback.
- Re-verified feature spec 09 with `npm run lint` and `npm run build`.
- Started implementation of `context/feature-specs/09-share-dialog.md` after reading the required project context files, local Next.js 16 Route Handler docs, and Clerk Backend API guidance.
- Added collaborator API routes under `/api/projects/[projectId]/collaborators` for listing and inviting collaborators, plus `/api/projects/[projectId]/collaborators/[collaboratorId]` for owner-only removal.
- Added `lib/api/collaborators.ts` for collaborator request validation, owner/access checks, lower-case email normalization, and Clerk user enrichment with email-only fallback.
- Added `components/editor/share-dialog.tsx` and wired the workspace navbar Share button to open it with copy-link feedback, owner management controls, and collaborator read-only mode.
- Verified feature spec 09 with `npm run lint` and `npm run build`.
- Started implementation of `context/feature-specs/08-editor-workspace-shell.md` after reading the required project context files and local Next.js 16 docs for dynamic pages, Server/Client Components, and redirects.
- Added `lib/project-access.ts` for current Clerk identity lookup and owner/collaborator project access checks.
- Added `components/editor/access-denied.tsx` for unavailable or unauthorized workspaces with a lock icon and return link.
- Added `/editor/[roomId]` as a server-rendered workspace route that redirects signed-out users to `/sign-in` and gates rendering on verified project access.
- Added the client workspace shell with project-name navbar, Share and AI sidebar controls, current project highlighting in `ProjectSidebar`, a centered canvas placeholder, and a right AI sidebar placeholder.
- Verified feature spec 08 with `npm run lint` and `npm run build`.
- Started implementation of `context/feature-specs/07-wire-editor-home.md` after reading the required project context files and local Next.js 16 Server/Client Components, data fetching, and `useRouter` docs.
- Added a server-side editor project list helper that loads owned projects by Clerk user ID and shared projects by collaborator email, mapping project IDs directly to Liveblocks room IDs for the sidebar.
- Updated project creation to accept a validated slug-style project ID so newly created project IDs can stay aligned with Liveblocks room IDs.
- Added the real project action hook under `hooks/`, with create, rename, and delete mutations calling the project REST API and navigating or refreshing through the App Router.
- Wired the editor pages, sidebar, and dialogs to server-loaded owned/shared project lists, with `/editor/[projectId]` as the workspace URL and room ID preview shown in the create dialog.
- Removed the old mock project dialog hook now that project state comes from the server and mutations go through the API.
- Verified feature spec 07 with `npm run lint` and `npm run build`.
- Started implementation of `context/feature-specs/06-project-apis.md` after reading the required project context files, the feature spec, local Next.js 16 Route Handler docs, and Clerk API route auth guidance.
- Added backend-only project REST routes for authenticated list/create and owner-only rename/delete, with JSON body validation and 401/403 responses.
- Verified feature spec 06 with `npm run lint` and `npm run build`.
- Started implementation of `context/feature-specs/04-project-dialogs.md` after reading the required project context files and local Next.js docs.
- Verified feature spec 04 with `npm run lint` and `npm run build`.
- Adjusted the editor home content to vertically center within the canvas area and increased description contrast with the secondary text token.
- Updated the auth page visual treatment to a 50/50 desktop split with a differentiated `bg-subtle` left brand panel, screenshot-style feature rows, and explicit Geist/Tailwind token usage across the auth shell and Clerk form styling.
- Updated auth routing so protected-route signed-out redirects use the local `/sign-up` page instead of Clerk's hosted accounts-domain sign-in URL.
- Started implementation of `context/feature-specs/01-design-system.md` after reading required project context and relevant local Next.js docs.
- Initialized shadcn/ui with the Radix Nova preset, added the requested primitive components, installed `lucide-react`, and mapped global CSS variables to the dark Ghost AI theme.
- Verified with `npm run lint` and `npm run build`; the build required network access so Next.js could fetch Geist font CSS.
- Started implementation of `context/feature-specs/02-editor.md` after reading the required context files, the editor spec, and local Next.js App Router server/client component docs.
- Added reusable editor chrome components under `components/editor/`, mounted the editor shell on `app/page.tsx`, and verified with `npm run lint` plus `npm run build`.
- Started implementation of `context/feature-specs/03-auth.md` after reading the required project context, auth spec, Clerk setup skill, and local Next.js 16 proxy/redirect docs.
- Installed `@clerk/ui` for Clerk's dark theme, added protected auth routing with root `proxy.ts`, created sign-in/sign-up pages, moved the editor shell to `/editor`, and added Clerk's default `UserButton` to the editor navbar.
- Verified feature spec 03 with `npm run lint` and `npm run build`; the build required network access so Next.js could fetch Geist font CSS.
- Started implementation of `context/feature-specs/05-prisma.md` after reading the required project context files and the local Next.js Server/Client Components docs.
- Added Prisma schema models under `prisma/models/project.prisma`, generated migrations `20260526005632_init` and `20260526005845_add_project_details`, and generated the client to `app/generated/prisma`.
- Verified feature spec 05 with `npx prisma validate`, `npx prisma generate`, `npm run lint`, and `npm run build`.
- Started implementation of `context/feature-specs/10-liveblocks-setup.md` after reading the required context files, Liveblocks documentation, and existing API route patterns.
- Installed `@liveblocks/node` for the server-side auth endpoint.
- Updated `liveblocks.config.ts` to define Presence (cursor, isThinking), UserMeta (id, name, avatar, cursorColor), and replaced empty object types with `object`/`Record<string, never>` for lint compliance.
- Added `lib/cursor-colors.ts` with a fixed 20-color palette and a deterministic hash-based `cursorColorFor(userId)` helper.
- Added `lib/liveblocks.ts` with a lazy cached `getLiveblocksClient()` singleton to avoid build-time env var checks.
- Added `app/api/liveblocks-auth/route.ts` — a `POST` handler that validates the room ID, authenticates via Clerk, checks project access with `getAccessibleProject()`, creates or ensures the Liveblocks room exists via `getOrCreateRoom` with user-specific `room:write` access, and returns an ID token with user display name, avatar, and generated cursor color.
- Fixed pre-existing type inference bug in `lib/projects.ts` and `app/api/projects/route.ts` by annotating `sharedProjectFilters` with `Prisma.ProjectWhereInput[]` to allow mixed `ownerId: string` and `ownerId: { not: string }` filter shapes.
- Verified feature spec 10 with `npm run lint` and `npm run build`.
- Started implementation of `context/feature-specs/11-base-canvas.md` after reading the required project context files, Liveblocks React Flow multiplayer reference, and local Next.js 16 docs.
- Added `types/canvas.ts` with `CanvasNodeData` (label, color, shape), `CanvasNode`, `CanvasEdge`, `NODE_COLORS` (8 color pairs), and `NODE_SHAPES` (6 shapes).
- Added `components/editor/canvas.tsx` with `LiveblocksProvider` (authEndpoint: `/api/liveblocks-auth`), `RoomProvider` (roomId, initialPresence with cursor/isThinking), `ClientSideSuspense` loading state, error boundary fallback, and `CanvasInner` using `useLiveblocksFlow` with suspense.
- Replaced the static canvas placeholder in `editor-workspace-shell.tsx` with the `<Canvas>` component rendering the React Flow viewport.
- Fixed `liveblocks.config.ts` `Storage` type from `object` to `Record<string, never>` to correctly signal empty storage to `RoomProvider`'s type system.
- Verified feature spec 11 with `npm run lint` and `npm run build`.
- Started implementation of `context/feature-specs/12-shape-panel.md` after reading the required project context files and the Liveblocks React Flow source for `useLiveblocksFlow` API.
- Added `SHAPE_DEFAULTS` and `ShapeDragPayload` type to `types/canvas.ts` for drag-and-drop shape creation.
- Created `components/editor/canvas-node.tsx` — a basic custom node renderer that renders a bordered rectangle with the node label and connection handles on top/bottom.
- Created `components/editor/shape-panel.tsx` — a floating pill toolbar at bottom-center with 6 draggable shape buttons using inline SVG icons, setting the shape payload on drag start via `application/x-canvas-shape` MIME type.
- Updated `components/editor/canvas.tsx` — added `ReactFlowProvider` wrapper for `useReactFlow()` access, `onDragOver`/`onDrop` handlers (`screenToFlowPosition` + `NodeAddChange`), `nodeTypes` registration for `canvasNode`, and the `ShapePanel` rendered as an overlay.
- Verified feature spec 12 with `npm run lint` and `npm run build`.
- Refined canvas UX for a Figma/Excalidraw feel: replaced left-click pan with selection-on-drag (`selectionOnDrag`, `panOnDrag={[1, 2]}`), added snap-to-grid (`snapToGrid`, `snapGrid={[20, 20]}`), added arrow markers on edges (`MarkerType.ArrowClosed`), added zoom Controls panel in bottom-right corner, hid connection handles by default with hover reveal (`group`, `opacity-0 group-hover:opacity-100`), and gave nodes subtle shadow and hover elevation.
