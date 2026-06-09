// Script postinstall pour Netlify
const { execSync } = require('child_process');

try {
  console.log('🔧 Génération du client Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });
} catch (error) {
  console.log('⚠️  Prisma generate failed, continuing build...');
}
