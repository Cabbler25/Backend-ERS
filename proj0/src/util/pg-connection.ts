import { roles } from "../models/Role";
import { Pool } from 'pg';

const db = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'admin',
    port: 5432,
});

export default db;
