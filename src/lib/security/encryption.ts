import 'server-only';
import { env } from '@/lib/env';

const ALGORITHM = 'AES-GCM';
const IV_LENGTH = 12;

export async function encrypt(text: string): Promise<string> {
    const enc = new TextEncoder();
    const key = await getCryptoKey();
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    const encrypted = await crypto.subtle.encrypt(
        { name: ALGORITHM, iv },
        key,
        enc.encode(text)
    );

    const ivHex = Buffer.from(iv).toString('hex');
    const encryptedHex = Buffer.from(encrypted).toString('hex');

    return `${ivHex}:${encryptedHex}`;
}

export async function decrypt(text: string): Promise<string> {
    const [ivHex, encryptedHex] = text.split(':');
    if (!ivHex || !encryptedHex) throw new Error('Invalid encrypted string');

    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    const key = await getCryptoKey();

    const decrypted = await crypto.subtle.decrypt(
        { name: ALGORITHM, iv },
        key,
        encrypted
    );

    return new TextDecoder().decode(decrypted);
}

async function getCryptoKey(): Promise<CryptoKey> {
    const secret = env.ENCRYPTION_KEY;
    const enc = new TextEncoder();
    return crypto.subtle.importKey(
        'raw',
        enc.encode(secret),
        { name: ALGORITHM },
        false,
        ['encrypt', 'decrypt']
    );
}