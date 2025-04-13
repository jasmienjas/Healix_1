const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Copy directory recursively
const copyDir = (src, dest) => {
  createDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

// Ensure .next directory exists
createDir('.next');

// Copy UI components
console.log('Copying UI components...');
copyDir('components/ui', '.next/components/ui');

// Copy services
console.log('Copying services...');
copyDir('services', '.next/services');

console.log('Copy completed successfully!');
