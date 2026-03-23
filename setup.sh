#!/bin/bash

echo "🚀 AudioResume - Setup Script"
echo "=============================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Create backend .env if not exists
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend/.env file..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please update backend/.env with your OpenAI API key"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

# Create necessary directories
mkdir -p data uploads

echo ""
echo "✨ Setup completed!"
echo ""
echo "🎯 Next steps:"
echo "1. Update backend/.env with your OpenAI API key"
echo "2. Run: npm run dev"
echo ""
echo "🌐 Acceso:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend API: http://localhost:5000"
