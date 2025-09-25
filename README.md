# User Management API — Partie A (N‑Layer)

API REST en Node.js + TypeScript + Express + TypeORM (MySQL) structurée en N‑Layer:

- Presentation: `src/index.ts`, `src/controllers/*`
- Service: `src/services/*`
- Repository: `src/repositories/*`
- Persistence config: `src/config/ormconfig.ts`
- Domain model: `src/models/*`

## Fonctionnalités

- CRUD utilisateur (create, read, update, delete)
- Règle métier: assignation automatique du profil
  - email se terminant par `@company.com` → `ADMIN`
  - sinon → `STANDARD`

## Démarrage

Prérequis: Node 20+, MySQL local (BDD `userdb`, user `root` sans mot de passe par défaut — modifiable dans `src/config/ormconfig.ts`).

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
