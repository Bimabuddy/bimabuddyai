# Insurance Policy Narrator - Bima Buddy

An AI-powered platform that simplifies complex insurance policy documents for layman understanding in multiple Indian languages.

## 🎯 Problem Solved

Insurance policies are written in complex legal language that most people cannot understand. This leads to:
- Low insurance penetration due to fear of unknown terms
- Claim rejections due to misunderstanding of exclusions
- Trust deficit between customers and insurance companies

## 🚀 Solution

Bima Buddy converts complex policy documents into:
- Simple, layman language explanations
- Relatable analogies and examples
- Multi-language support (Hindi, Tamil, English, and more)
- Interactive Q&A with source citations
- Audio narration with virtual avatar

## 🏗️ Architecture

### Frontend (React + TypeScript)
- Modern React application with TypeScript
- Tailwind CSS for responsive design
- File upload with drag & drop
- Real-time Q&A interface
- Multi-language support

### Backend (Node.js + Express)
- RESTful API architecture
- PDF text extraction
- AI-powered policy analysis
- Translation services
- Text-to-speech synthesis

### AI Components
- **Simplification Engine**: Converts legalese to layman language
- **RAG System**: Question answering with source citations
- **Translation**: Multi-language support for Indian languages
- **TTS**: Natural speech synthesis

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite for fast development
- Tailwind CSS
- Lucide React icons
- Axios for API calls

### Backend
- Node.js + Express
- Multer for file uploads
- PDF-parse for text extraction
- OpenAI API for AI analysis
- Azure/ElevenLabs for TTS
- Google Translate for translations

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start

1. **Clone and setup**
   ```bash
   cd insurance-narrator
   npm run install:all
   ```

2. **Environment Configuration**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Start Development Servers**
   ```bash
   # From root directory
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Required API Keys

Create a `.env` file in the backend directory with:

```env
OPENAI_API_KEY=your_openai_api_key
GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

## 🚀 Features

### Phase 1: MVP ✅
- [x] PDF policy document upload
- [x] Policy summary generation
- [x] Key clause simplification with analogies
- [x] Basic Q&A with source citations
- [x] Multi-language support (English, Hindi, Tamil)
- [x] Responsive web interface

### Phase 2: Enhanced Features 🚧
- [ ] Real-time audio narration
- [ ] Virtual avatar with lip-sync
- [ ] Advanced RAG with vector search
- [ ] Mobile app (React Native)
- [ ] Policy comparison tool
- [ ] Claim assistance chatbot

### Phase 3: Advanced AI 🎯
- [ ] OCR for scanned documents
- [ ] Sentiment analysis of policy terms
- [ ] Personalized recommendations
- [ ] Integration with insurance providers
- [ ] Regulatory compliance checker

## 📱 User Journey

1. **Upload**: User uploads insurance policy PDF
2. **Process**: AI analyzes and simplifies the document
3. **Understand**: User reads simple explanations and analogies
4. **Ask**: User asks questions in natural language
5. **Listen**: User listens to explanations in their native language

## 🔒 Safety & Compliance

- **No Hallucinations**: RAG system ensures all answers are backed by the policy document
- **Source Citations**: Every answer includes page number and clause reference
- **Disclaimer**: Clear labeling as educational tool, not financial advice
- **IRDAI Compliance**: Follows Indian insurance regulations

## 🎨 UI/UX Design

- **Clean Interface**: Simple, intuitive design for non-technical users
- **Visual Avatar**: Friendly virtual guide for building trust
- **Progressive Disclosure**: Show relevant information at each step
- **Mobile First**: Optimized for Indian smartphone users

## 🧪 Testing

The MVP includes:
- Mock data for demonstration
- Keyword-based Q&A for testing
- Sample policy analysis
- Translation placeholders

## 📈 Scalability

The architecture supports:
- Horizontal scaling with load balancers
- Database integration for user accounts
- Vector databases for advanced RAG
- CDN for static assets
- API rate limiting and caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

For questions or support:
- Create an issue on GitHub
- Email: support@bimabuddy.com
- WhatsApp: +91-XXXX-XXXX-XXXX

---

**Bima Buddy** - Making insurance understandable for everyone 🇮🇳