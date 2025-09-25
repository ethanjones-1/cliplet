#!/bin/bash

# Cliplet Deployment Script
# This script sets up and deploys the Cliplet application

set -e

echo "🚀 Starting Cliplet deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm found"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file and add your OpenAI API key if desired"
fi

# Build the React app for production
echo "🔨 Building React application..."
cd client
npm run build
cd ..

# Create production start script
cat > start.sh << 'EOF'
#!/bin/bash
echo "Starting Cliplet application..."
NODE_ENV=production node server/index.js
EOF

chmod +x start.sh

echo "✅ Cliplet deployment completed!"
echo ""
echo "🎉 Quick start options:"
echo "   Development: npm run dev"
echo "   Production:  ./start.sh"
echo ""
echo "📖 Documentation: See README.md for detailed instructions"
echo "🌐 Application will be available at: http://localhost:5001"
echo ""
echo "🔑 Optional: Edit .env file to add your OpenAI API key for enhanced AI features"
echo "   Without API key: Application works with intelligent fallback responses"
echo "   With API key: Enhanced AI summaries, notes, flashcards, and quizzes"