import { registerAs } from '@nestjs/config';
import { envs } from './env.validation';

export default registerAs('dbConfig', () => {
    const Config = {
        db: {
            host: envs.dbHost,
            mongoHost: envs.mongoHost,
            name: envs.dbName,
            user: envs.dbUser,
            cluster: envs.dbCluster,
            password: envs.dbPassword,
        },
        env: envs.nodeEnv,
    };
    return Config;
});