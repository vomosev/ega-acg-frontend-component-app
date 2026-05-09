#!/bin/bash

# =============================================================================
# EGA ACG FRONTEND FULL NEXT.JS REPAIR
# =============================================================================

echo "======================================================="
echo "Cleaning existing install..."
echo "======================================================="

rm -rf node_modules
rm -rf .next
rm -rf src
rm -rf public

rm -f package-lock.json
rm -f package.json
rm -f next.config.js
rm -f tsconfig.json
rm -f tailwind.config.js
rm -f postcss.config.js
rm -f .eslintrc.json

# =============================================================================
# CREATE PACKAGE.JSON
# =============================================================================

cat > package.json <<'EOF'
{
  "name": "ega-acg-frontend-component-app",
  "version": "1.0.0",
  "private": true,

  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },

  "dependencies": {
    "lucide-react": "^0.511.0",
    "next": "^15.3.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hot-toast": "^2.5.2",
    "recharts": "^2.15.3"
  },

  "devDependencies": {
    "@types/node": "^22.15.3",
    "@types/react": "^19.1.4",
    "@types/react-dom": "^19.1.5",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.26.0",
    "eslint-config-next": "^15.3.2",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.3"
  }
}
EOF

# =============================================================================
# INSTALL DEPENDENCIES
# =============================================================================

echo "======================================================="
echo "Installing dependencies..."
echo "======================================================="

npm install

# =============================================================================
# CREATE FOLDER STRUCTURE
# =============================================================================

mkdir -p src/app
mkdir -p src/app/telecom
mkdir -p src/components
mkdir -p public

# =============================================================================
# NEXT CONFIG
# =============================================================================

cat > next.config.js <<'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true
};

module.exports = nextConfig;
EOF

# =============================================================================
# TSCONFIG
# =============================================================================

cat > tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": ["node_modules"]
}
EOF

# =============================================================================
# POSTCSS
# =============================================================================

cat > postcss.config.js <<'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# =============================================================================
# TAILWIND CONFIG
# =============================================================================

cat > tailwind.config.js <<'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

# =============================================================================
# GLOBAL CSS
# =============================================================================

cat > src/app/globals.css <<'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  padding: 0;
  margin: 0;
  font-family: Arial, sans-serif;
  background: #F4F7FB;
}
EOF

# =============================================================================
# ROOT LAYOUT
# =============================================================================

cat > src/app/layout.tsx <<'EOF'
import "./globals.css";

export const metadata = {
  title: "EGA Autonomous AI Edge",
  description: "AI Edge Orchestration Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
EOF

# =============================================================================
# HOME PAGE
# =============================================================================

cat > src/app/page.tsx <<'EOF'
import Link from "next/link";

export default function HomePage() {

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="text-center">

        <h1 className="text-5xl font-bold text-[#5871A7]">
          EGA Autonomous AI Edge
        </h1>

        <p className="mt-4 text-gray-500">
          CAMARA QoD + Edge AI + Telecom Analytics
        </p>

        <Link
          href="/telecom"
          className="inline-block mt-8 px-6 py-4 bg-[#5871A7] text-white rounded-2xl"
        >
          Open Dashboard
        </Link>

      </div>
    </div>
  );
}
EOF

# =============================================================================
# TELECOM PAGE
# =============================================================================

cat > src/app/telecom/page.tsx <<'EOF'
export default function TelecomPage() {

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-10">

      <h1 className="text-4xl font-semibold text-clgeodrops">
        Telecom AI Edge Dashboard
      </h1>

      <div className="mt-8 bg-white rounded-3xl p-8 shadow-sm border">

        <h2 className="text-2xl font-semibold">
          Platform Online
        </h2>

        <p className="mt-4 text-gray-500">
          Frontend successfully deployed.
        </p>

      </div>
    </div>
  );
}
EOF

# =============================================================================
# ENV
# =============================================================================

cat > .env.local <<'EOF'
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_MAPS_API_KEY=YOUR_GOOGLE_MAPS_KEY
EOF

# =============================================================================
# GITIGNORE
# =============================================================================

cat > .gitignore <<'EOF'
node_modules
.next
.env
.env.local
.vercel
EOF

# =============================================================================
# NEXT ENV TYPES
# =============================================================================

touch next-env.d.ts

# =============================================================================
# BUILD TEST
# =============================================================================

echo "======================================================="
echo "Testing build..."
echo "======================================================="

npm run build