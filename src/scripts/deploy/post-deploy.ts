import { revalidateStore } from '@/lib/cache/revalidate';

async function postDeploy() {
    console.log('Running post-deploy tasks...');
    // Revalidate critical paths
    revalidateStore();
    console.log('Cache warmed.');
}

postDeploy();