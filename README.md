# User Management API — v2-clean (Clean Architecture)

## Messaging / RabbitMQ (Outbox)

- Variables d'environnement:
  - `RABBITMQ_URL=amqp://localhost`
  - `RABBITMQ_USER_EXCHANGE=user.events`
  - `USE_SYNC_SAGA=false` pour activer la saga asynchrone via outbox

- Flux:
  - Création utilisateur: écrit un événement `UserCreated` dans l'outbox; un dispatcher publie vers `user.events`.
  - Suppression utilisateur: `UserDeletionRequested` publié; le service comptes consomme et supprime les comptes.

- Démarrage local:
  1. Lancer RabbitMQ (Docker: `docker run -p 5672:5672 -p 15672:15672 rabbitmq:3-management`).
  2. `npm run dev:all` (API + service comptes). Assurez-vous que `USE_SYNC_SAGA=false` si vous voulez tester le flux async.

API REST en Node.js + TypeScript + Express + TypeORM (MySQL) structurée selon Clean Architecture en 5 couches:

- Presentation: `src/presentation/*` (routes Express)
- Application: `src/application/*` (use cases, ports, DTO, mapping)
- Domain: `src/domain/*` (entités, types, règles métier)
- Persistence: `src/persistence/*` (implémentations ORM des ports)
- External: `src/external/*` (composition root, serveur Express, datasource)

## Fonctionnalités

- CRUD utilisateur (create, read, update, delete)
- Règle métier: assignation automatique du profil (dans `Domain`)
  - email se terminant par `@company.com` → `ADMIN`
  - sinon → `STANDARD`

## Démarrage

Prérequis: Node 20+, MySQL local (BDD `userdb`, user `root` sans mot de passe par défaut — modifiable dans `src/external/datasource.ts`).

Installation:

```bash
npm install
```

Développement (reload):

```bash
npm run dev
```

L’API écoute sur `http://localhost:3000`.

## Endpoints

- POST `/users` — créer un utilisateur
- GET `/users` — lister les utilisateurs
- GET `/users/:id` — récupérer par id
- PUT `/users/:id` — mettre à jour
- DELETE `/users/:id` — supprimer

## Règles d’architecture

- Dépendances autorisées: `Presentation → Application → Domain` ; `Application → (Ports)` ; `Persistence/External → Application` (impl. des ports).
- `Domain` ne dépend d’aucun ORM/framework. Pas de DTO ni d’I/O dans `Domain`.
- Mapping centralisé: `Application/mapping` (Domain ↔ DTO) et `Persistence/typeorm/mapping` (Domain ↔ ORM).
- Contrôleurs/Routes appellent uniquement les use cases.
- Erreurs et validations gérées au niveau `Application` (à étoffer selon besoins).

## CQRS (v2-clean)

- Séparation des use cases:
  - Commands: `src/application/usecases/commands/*` (Create/Update/Delete)
  - Queries: `src/application/usecases/queries/*` (GetAll/GetById)
- Ports dédiés:
  - Command port: `src/application/ports/UserCommandRepositoryPort.ts`
  - Query port: `src/application/ports/UserQueryRepositoryPort.ts`
- Persistence: adaptateurs séparés
  - `src/persistence/typeorm/UserCommandRepositoryImpl.ts`
  - `src/persistence/typeorm/UserQueryRepositoryImpl.ts`
- Routes: composition par injection des deux ports via `createUserRouter(commandRepo, queryRepo)`
- Point d’entrée: `src/external/server.ts`

## Legacy (v1)

Les anciens fichiers N‑Layer ont été archivés dans `src/legacy/` (controllers/services/repositories/models/config/index) pour référence. Le point d’entrée est désormais `src/external/server.ts`.

## Tags/branches

- Branche: `clean-architecture`
- Tag livrable: `v2-clean`

## Structure des dossiers

```
src/
  config/ormconfig.ts
  controllers/UserController.ts
  models/UserEntity.ts
  repositories/UserRepository.ts
  services/UserService.ts
  index.ts
```

## Notes

- TypeORM `synchronize: true` pour le développement.
- ESM activé (TypeScript `NodeNext`), exécution via `nodemon` + `ts-node/esm`.

---

Étapes suivantes (Partie B & C): migration vers Clean Architecture, puis CQRS (branches et tags dédiés).

## Microservices & Orchestration

- Services:
  - User Service (port 3000) — dossier racine, Clean Architecture + CQRS
  - Account Service (port 3001) — `services/account-service` (DB dédiée `accountdb`)
- Orchestration (Saga):
  - Création utilisateur: User créé → appel Account Service `/accounts` → si échec, suppression compensatoire de l’utilisateur
  - Suppression utilisateur: suppression des comptes (`/accounts/:id`) puis suppression de l’utilisateur
- Endpoints agrégés:
  - GET `/users/:id/with-accounts` → retourne l’utilisateur + ses comptes (appel Account Service)
- Lancement en dev:
  - `npm run dev:all` (démarre User Service et Account Service)

Variables utiles:
- `ACCOUNT_SERVICE_URL` (par défaut `http://localhost:3001`)
- `ACCOUNT_DB_*` pour le service comptes (host, port, user, password, name)
