# GrowToCourt - AI Legal Mentorship Platform

## 🚀 Clifford Chance Hackathon Demo

GrowToCourt is an innovative AI-powered legal mentorship platform designed to train junior lawyers through realistic scenarios and real-time feedback. Built for the Clifford Chance hackathon, this demo showcases how AI can enhance legal education and preserve the partner/apprentice model in a digital-first world.

## 🎯 Key Features

### Core Platform
- **6-Step Contract Journey**: From initial demand through court proceedings
- **AI Negotiation Simulator**: Practice with realistic counterparty responses
- **Real-time Performance Meters**: Counterparty perception and confidence tracking
- **MentorChat**: AI-powered guidance and strategic advice

### Advanced Features
- **🎤 Speech-to-Text Integration**: Practice verbal negotiation skills using Google Cloud Platform
- **📊 Dynamic Analytics**: Real-time feedback on communication effectiveness
- **🎨 Professional UI**: Sleek grey/white/black design matching legal industry standards
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Speech Recognition**: Google Cloud Platform Speech-to-Text API
- **Audio Processing**: Web Audio API, MediaRecorder API
- **Design**: Modern CSS Grid/Flexbox, Custom CSS Variables
- **Architecture**: Modular JavaScript with clean separation of concerns

## 📋 Setup Instructions

### Prerequisites
- Modern web browser with microphone support
- Google Cloud Platform account with Speech-to-Text API enabled
- Web server (for local development, can use Python's built-in server)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd GrowToCourt
```

### 2. GCP Speech-to-Text Setup

#### Enable the API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Note your **Project ID** (you'll need this)
4. Enable the **Speech-to-Text API**
5. Go to **APIs & Services > Credentials**

#### Authentication Setup (Choose One)

**Option A: OAuth 2.0 (Recommended)**
1. Click **Create Credentials > OAuth client ID**
2. Choose **Web application**
3. Add authorized origins:
   - For local: `http://localhost:8000`
   - For production: `https://yourdomain.com`
4. Copy the **Client ID**

**Option B: API Key (Testing Only)**
1. Click **Create Credentials > API key**
2. Copy the API key
3. Restrict to Speech-to-Text API (recommended)

#### Configure Credentials
When you first open the negotiations page, click the configuration button (⚙️) and enter:
- **Project ID**: Your Google Cloud project ID
- **OAuth Client ID**: Your OAuth client ID (recommended)
- **API Key**: Your API key (optional, for testing)

**Note**: Credentials are stored securely in your browser's localStorage.

### 3. Start the Application

#### Simple Python Server (Recommended):
```bash
python3 -m http.server 8000
```

#### Alternative Options:

**Node.js Server:**
```bash
npx http-server -p 8000
```

**VS Code Live Server:**
- Install Live Server extension
- Right-click `index.html` → "Open with Live Server"

### 4. Access the Application
- Open browser to `http://localhost:8000`
- Navigate to Negotiations module
- Configure Speech-to-Text when prompted (⚙️ button)
- Grant microphone permissions when prompted
- Test with the "Test API" button

## 🎤 Speech-to-Text Features

### Capabilities
- **Real-time transcription** of spoken negotiations
- **Legal terminology recognition** optimized for contract negotiations
- **Confidence scoring** with visual feedback
- **Auto-send functionality** for high-confidence transcriptions
- **Manual review** for low-confidence results

### Usage
1. Click the microphone button in the chat input
2. Speak your negotiation response clearly
3. Click again to stop recording
4. Review transcription and confidence score
5. Message automatically sends or allows manual review

### Browser Support
- ✅ Chrome 47+ (recommended)
- ✅ Firefox 29+
- ✅ Safari 14+
- ✅ Edge 79+

## 🔧 Troubleshooting

### Common Issues

**"Access denied" or "403 Forbidden" errors:**
- Ensure Speech-to-Text API is enabled in your Google Cloud project
- Verify your API key or OAuth client ID is correct
- Check that billing is enabled for your Google Cloud project
- For OAuth: ensure your domain is in authorized JavaScript origins

**"Authentication failed" errors:**
- Sign in with the Google account that has access to the project
- Ensure OAuth client ID is configured for web applications
- Clear browser cache and try again

**"Microphone access denied":**
- Allow microphone access when prompted by the browser
- Ensure you're using HTTPS or localhost (required for microphone access)
- Test your microphone in other applications

**Configuration button (⚙️) not working:**
- Check browser console for error messages
- Ensure you're entering the correct Project ID format
- Try using OAuth instead of API key for better compatibility

### Testing Your Setup
1. Use the **Test API** button in the right panel
2. Check browser console for detailed error messages
3. Verify your Google Cloud setup follows the instructions above

## 🎯 Demo Scenario: Global Bank Technology Services Agreement

The demo focuses on a realistic scenario highly relevant to Clifford Chance:

**Scenario**: Negotiating a comprehensive cloud technology services agreement between a major international bank and a leading cloud provider.

**Key Negotiation Points**:
- Data Protection & GDPR Compliance
- Service Level Agreements (99.95% vs 99.9%)
- Liability Caps ($50M vs $5M vs $25M)
- Cross-border Data Transfer Protocols
- Intellectual Property Licensing
- Termination & Exit Clauses

## 📊 Performance Metrics

### Counterparty Perception Meter
- **Scale**: Hostile → Neutral → Professional → Highly Favorable
- **Factors**: Professional language, aggressive terms, balanced approach
- **Visual**: Color gradient from red (hostile) to green (favorable)

### Confidence Projection Meter
- **Scale**: Uncertain → Hesitant → Knowledgeable → Confident → Commanding
- **Factors**: Decisive language, message length, certainty indicators
- **Visual**: Gradient from orange (uncertain) to green (commanding)

## 🔧 Configuration

### Speech Recognition Settings
```javascript
SPEECH_RECOGNITION: {
    MAX_RECORDING_TIME: 30000, // 30 seconds
    MIN_RECORDING_TIME: 1000,  // 1 second
    CONFIDENCE_THRESHOLD: 0.7, // 70% confidence
    AUTO_SEND_TRANSCRIPTION: true
}
```

### Legal Vocabulary
The system includes legal-specific phrases for better recognition:
- Contract terms (liability cap, SLA, GDPR)
- Negotiation language (propose, consider, require)
- Legal procedures (indemnification, arbitration)
- Company names (CloudTech Solutions, Global Banking Corp)

## 🚀 Future Enhancements

### Real-time Streaming
- WebSocket integration for continuous speech recognition
- Live transcription during extended negotiations
- Real-time meter updates as you speak

### Additional Modules
- **Step 1**: Initial Demand & Client Consultation
- **Step 2**: Client Onboarding & Offer Development  
- **Step 4**: Acceptance & Contract Conclusion
- **Step 5**: Non-Performance & Notifications
- **Step 6**: Court Proceedings & Litigation

### Advanced AI Features
- **Document Analysis**: Upload and analyze real contracts
- **Risk Assessment**: AI-powered contract risk scoring
- **Precedent Search**: Integration with legal databases
- **Multi-language Support**: International negotiation scenarios

## 🔐 Security Considerations

### API Key Security
- Never commit API keys to version control
- Use environment variables in production
- Implement proper CORS headers
- Consider backend proxy for API calls in production

### Data Privacy
- Audio data is sent to Google Cloud for processing
- Transcriptions are not stored permanently
- No personal data collection beyond demo purposes
- GDPR-compliant data handling practices

## 🎨 Design System

### Color Palette
- **Primary Black**: `#1a1a1a`
- **Primary Grey**: `#2a2a2a`
- **Light Grey**: `#f5f5f5`
- **Success Green**: `#10b981`
- **Warning Orange**: `#f59e0b`
- **Danger Red**: `#ef4444`

### Typography
- **Font Family**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Headings**: Light weight (300), large spacing
- **Body**: Regular weight (400), 1.6 line height
- **UI Elements**: Medium weight (500) for emphasis

## 🤝 Contributing

This is a hackathon demonstration project. For production deployment:

1. Implement proper backend authentication
2. Add comprehensive error handling
3. Include automated testing suite
4. Set up CI/CD pipeline
5. Add monitoring and analytics

## 📄 License

Created for the Clifford Chance Legal Technology Hackathon 2024.

## 📞 Support

For questions about the GCP integration or demo setup, refer to:
- [Google Cloud Speech-to-Text Documentation](https://cloud.google.com/speech-to-text/docs)
- [Web Audio API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [MediaRecorder API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)

---

**Built with ❤️ for the future of legal education** 