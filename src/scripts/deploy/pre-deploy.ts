import { validateEnv } from '@/lib/env/validator';

async function preDeploy() {
    try {
        validateEnv();
    } catch (e) {
        console.error('Environment validation failed.');
        process.exit(1);
    }
}

preDeploy();