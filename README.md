# User Management API — v2-clean (Clean Architecture)

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
