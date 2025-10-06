"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountDataSource = void 0;
require("reflect-metadata");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const typeorm_1 = require("typeorm");
const AccountOrmEntity_1 = require("./typeorm/AccountOrmEntity");
const PORT = process.env.ACCOUNT_SERVICE_PORT ? Number(process.env.ACCOUNT_SERVICE_PORT) : 3001;
exports.AccountDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.ACCOUNT_DB_HOST || 'localhost',
    port: +(process.env.ACCOUNT_DB_PORT || 3306),
    username: process.env.ACCOUNT_DB_USER || 'root',
    password: process.env.ACCOUNT_DB_PASSWORD || '',
    database: process.env.ACCOUNT_DB_NAME || 'accountdb',
    synchronize: true,
    logging: false,
    entities: [AccountOrmEntity_1.AccountOrmEntity],
    migrations: [],
    subscribers: [],
});
async function bootstrap() {
    await exports.AccountDataSource.initialize();
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    app.get('/health', (_req, res) => res.json({ status: 'ok' }));
    const repo = exports.AccountDataSource.getRepository(AccountOrmEntity_1.AccountOrmEntity);
    app.post('/accounts', async (req, res) => {
        try {
            const { userId } = req.body;
            const account = repo.create({ userId });
            const saved = await repo.save(account);
            res.status(201).json(saved);
        }
        catch (err) {
            res.status(500).json({ message: 'Error creating account', error: String(err) });
        }
    });
    app.delete('/accounts/:id', async (req, res) => {
        const id = Number(req.params.id);
        const result = await repo.delete(id);
        if (result.affected && result.affected > 0)
            res.sendStatus(204);
        else
            res.status(404).json({ message: 'Account not found' });
    });
    app.get('/accounts/user/:userId', async (req, res) => {
        const userId = Number(req.params.userId);
        const accounts = await repo.find({ where: { userId } });
        res.json(accounts);
    });
    app.listen(PORT, () => console.log(`Account Service running on port ${PORT}`));
}
bootstrap().catch(err => {
    console.error('Account service bootstrap error', err);
    process.exit(1);
});
