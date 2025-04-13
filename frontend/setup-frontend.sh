#!/bin/bash

# Install dev dependencies
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
npm install -D @tailwindcss/forms @tailwindcss/typography
npm install -D tailwindcss-animate

# Install UI component dependencies
npm install @radix-ui/react-dialog
npm install @radix-ui/react-select
npm install @radix-ui/react-slot
npm install class-variance-authority
npm install clsx
npm install tailwind-merge
npm install lucide-react

# Install additional required dependencies
npm install @hookform/resolvers
npm install react-hook-form
npm install zod
npm install @radix-ui/react-label
npm install @radix-ui/react-toast

# Clean install and build
rm -rf node_modules .next
rm package-lock.json
npm install
npm run build
