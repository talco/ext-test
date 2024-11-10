const { exec } = require('child_process');

const JWT_ISSUER = 'your-jwt-issuer';
const JWT_SECRET = 'your-jwt-secret';
const SOURCE_DIR = 'path/to/your/extension';
const ARTIFACTS_DIR = 'path/to/output';

const command = `web-ext sign --api-key=${JWT_ISSUER} --api-secret=${JWT_SECRET} --source-dir=${SOURCE_DIR} --artifacts-dir=${ARTIFACTS_DIR}`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error signing extension: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});