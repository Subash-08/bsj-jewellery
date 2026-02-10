import { envSchema } from './schema';

export function validateEnv() {
    const _env = process.env;

    const parsed = envSchema.safeParse(_env);

    if (!parsed.success) {
        console.error(
            '❌ Invalid environment variables:',
            parsed.error.flatten().fieldErrors
        );
        throw new Error('Invalid environment variables');
    }

    return parsed.data;
}