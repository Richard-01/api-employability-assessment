import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    DB_CONNECTION: string;
    DB_HOST: string;
    MONGO_HOST: string;
    DB_NAME: string;
    DB_USER: string;
    DB_CLUSTER: string;
    DB_PASSWORD: string;
    NODE_ENV: string;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    DB_HOST: joi.string().required(),
    MONGO_HOST: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_USER: joi.string().required(),
    DB_CLUSTER: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    NODE_ENV: joi.string().default('local'),
}).unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    dbHost: envVars.DB_HOST,
    mongoHost: envVars.MONGO_HOST,
    dbName: envVars.DB_NAME,
    dbUser: envVars.DB_USER,
    dbCluster: envVars.DB_CLUSTER,
    dbPassword: envVars.DB_PASSWORD,
    nodeEnv: envVars.NODE_ENV,
};