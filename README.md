# Cliplet 📎

**AI-Powered Content Analysis and Study Material Generator**

Cliplet is a modern web application that transforms YouTube videos and documents into structured study materials using artificial intelligence. Upload a document, paste a YouTube link, and instantly generate summaries, notes, flashcards, and quizzes.

![Cliplet Demo](https://via.placeholder.com/800x400?text=Cliplet+Demo)

## ✨ Features

- **🎥 YouTube Integration**: Extract transcripts from YouTube videos for analysis
- **📄 Document Processing**: Support for PDF, DOCX, and TXT files
- **🤖 AI-Powered Analysis**: Generate summaries, notes, flashcards, and quizzes
- **📝 Smart Summaries**: Get concise overviews with key points and topics
- **📋 Structured Notes**: Create organized study notes in multiple formats
- **🃏 Interactive Flashcards**: Generate and flip through study flashcards
- **❓ Custom Quizzes**: Create multiple-choice quizzes with explanations
- **📱 Responsive Design**: Beautiful UI that works on all devices
- **🔄 Real-time Processing**: Live updates and loading states

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ethanjones-1/cliplet.git
   cd cliplet
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Set up environment variables (optional)**
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key for enhanced AI features
   # The app works with fallback responses if no API key is provided
   ```

4. **Start the development server**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately:
   npm run server  # Backend on port 5000
   npm run client  # Frontend on port 3000
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` to use the application.

## 🛠️ Technology Stack

### Frontend
- **React** - Modern UI framework
- **CSS3** - Custom styling with gradients and animations
- **Responsive Design** - Mobile-first approach

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Multer** - File upload handling
- **OpenAI API** - AI-powered content analysis (optional)

### File Processing
- **pdf-parse** - PDF text extraction
- **mammoth** - DOCX document processing
- **youtube-transcript** - YouTube transcript extraction

## 📖 How to Use

### 1. Choose Your Input Method
- **YouTube**: Paste any YouTube video URL
- **File Upload**: Upload PDF, DOCX, or TXT documents

### 2. Process Your Content
Click "Process" to extract and analyze the content.

### 3. Generate Study Materials
Choose from four AI-powered options:
- **📝 Summary**: Get key points and overview
- **📋 Notes**: Create structured study notes
- **🃏 Flashcards**: Generate interactive flashcards
- **❓ Quiz**: Create multiple-choice questions

### 4. Study and Learn
Interact with your generated materials - flip flashcards, take quizzes, and review notes.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# OpenAI Configuration (optional)
OPENAI_API_KEY=your_openai_api_key_here

# File Upload Configuration
MAX_FILE_SIZE=100MB
```

### Supported File Types

- **Documents**: PDF, DOCX, DOC, TXT (up to 100MB)
- **Videos**: YouTube URLs with available transcripts
- **Future**: Direct video file upload (MP4, AVI, MOV, etc.)

## 📡 API Endpoints

### Content Processing
- `POST /api/content/youtube` - Process YouTube URL
- `POST /api/content/upload` - Upload and process file

### AI Features
- `POST /api/ai/summarize` - Generate summary
- `POST /api/ai/notes` - Create structured notes
- `POST /api/ai/flashcards` - Generate flashcards
- `POST /api/ai/quiz` - Create quiz questions
- `GET /api/ai/features` - List available AI features

### Utility
- `GET /api/health` - Server health check

## 🎨 Screenshots

| Home Screen | Processing | Results |
|-------------|------------|---------|
| ![Home](https://via.placeholder.com/300x200?text=Home+Screen) | ![Processing](https://via.placeholder.com/300x200?text=Processing) | ![Results](https://via.placeholder.com/300x200?text=Results) |

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow ESLint configuration
- Write clear commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Roadmap

### Version 1.1
- [ ] User authentication and saved content
- [ ] Enhanced AI models and customization
- [ ] Export functionality (PDF, Word, etc.)
- [ ] Collaborative features

### Version 1.2
- [ ] Video file upload and processing
- [ ] Advanced analytics and insights
- [ ] Mobile app development
- [ ] Integration with learning management systems

## 🐛 Issues and Support

Found a bug or have a feature request? Please check our [Issues](https://github.com/ethanjones-1/cliplet/issues) page.

For support, email us at [support@cliplet.com](mailto:support@cliplet.com) or join our [Discord community](https://discord.gg/cliplet).

## ⭐ Acknowledgments

- OpenAI for GPT API
- React community for excellent documentation
- YouTube for transcript accessibility
- All contributors and beta testers

---

**Made with ❤️ by the Cliplet team**

[Website](https://cliplet.com) • [Documentation](https://docs.cliplet.com) • [Twitter](https://twitter.com/clipletapp)