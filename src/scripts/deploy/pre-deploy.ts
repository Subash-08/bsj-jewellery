import { validateEnv } from '@/lib/env/validator';

async function preDeploy() {
    console.log('Running pre-deploy checks...');
    try {
        validateEnv();
        console.log('Environment variables valid.');
    } catch (e) {
        console.error('Environment validation failed.');
        process.exit(1);
    }
}

preDeploy();