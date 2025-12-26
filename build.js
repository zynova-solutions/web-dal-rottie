const { execSync } = require('child_process');

try {
  // Set environment variables to disable ESLint and TypeScript checking
  process.env.NEXT_DISABLE_ESLINT = '1';
  process.env.NEXT_DISABLE_TYPECHECK = '1';
  
  console.log('Building with ESLint and TypeScript checking disabled...');
  
  // Execute the build command
  execSync('next build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
