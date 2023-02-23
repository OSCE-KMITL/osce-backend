import { DataSource } from 'typeorm';
import 'reflect-metadata';
import { config } from 'dotenv';
config();
import { DATABASE_PORT, DATABASE_PASSWORD, DATABASE_USERNAME, DATABASE_NAME } from './src/shared/constants';
export const MySqlDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: parseInt(DATABASE_PORT!) || 3306,
    username: DATABASE_USERNAME || 'devteam',
    password: DATABASE_PASSWORD || '123456',
    database: DATABASE_NAME || 'osce',
    dropSchema: false,
    synchronize: true,
    logging: false,
    entities: ['src/entity/**/*.{ts,js}'],
    migrations: ['migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    charset: 'UTF8_GENERAL_CI',
});
