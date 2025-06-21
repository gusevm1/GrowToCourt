# GCP-Powered AI Negotiation System

## 🚀 Overview

GrowToCourt now features a sophisticated AI negotiation system that leverages Google Cloud Platform services to provide realistic, intelligent contract negotiations. The system combines multiple GCP APIs to create an immersive legal training experience.

## 🔧 Architecture

### Core Components

1. **Negotiation Agent** (`js/negotiationAgent.js`)
   - Uses Gemini Pro API for intelligent responses
   - Advanced prompt engineering for legal scenarios
   - State tracking for negotiation progress
   - Strategic concession logic

2. **GCP Configuration** (`js/gcpConfig.js`)
   - Centralized API key management
   - Service validation and health checks
   - Demo mode for testing without keys

3. **Speech Integration** (`js/speechAPI.js`)
   - Google Speech-to-Text API
   - Web Speech API fallback
   - Real-time transcription with confidence scoring

4. **Application Orchestration** (`js/negotiationApp.js`)
   - Coordinates all services
   - UI management and updates
   - Error handling and fallbacks

## 🎯 GCP Services Used

### Primary Services

#### 1. Generative Language API (Gemini Pro)
- **Purpose**: AI-powered negotiation responses
- **Features**: 
  - Context-aware legal reasoning
  - Strategic negotiation tactics
  - Realistic business constraints
  - Professional communication style

#### 2. Speech-to-Text API
- **Purpose**: Voice input processing
- **Configuration**:
  - Model: `latest_long` (optimized for conversations)
  - Enhanced model enabled
  - Word-level confidence scoring
  - Time offset tracking

#### 3. Vertex AI (Optional Advanced Features)
- **Purpose**: Enhanced AI capabilities
- **Potential Uses**:
  - Sentiment analysis
  - Document summarization
  - Advanced embeddings

### Supporting Services
- **Cloud Console**: API management and monitoring
- **Cloud IAM**: Access control and security

## 🔐 Setup Instructions

### 1. Google Cloud Project Setup

```bash
# 1. Create or select a GCP project
gcloud projects create your-negotiation-project
gcloud config set project your-negotiation-project

# 2. Enable required APIs
gcloud services enable generativelanguage.googleapis.com
gcloud services enable speech.googleapis.com
gcloud services enable aiplatform.googleapis.com  # Optional for Vertex AI
```

### 2. API Key Generation

1. **Navigate to Google Cloud Console**
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Select your project

2. **Enable APIs**
   - Go to "APIs & Services" > "Library"
   - Enable:
     - Generative Language API
     - Speech-to-Text API
     - Vertex AI API (optional)

3. **Create API Keys**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Create separate keys for each service (recommended)
   - Restrict keys to specific APIs for security

### 3. Application Configuration

When you open the negotiation page, you'll see a configuration dialog:

1. **Enter API Keys**:
   - Generative AI API Key (required for AI responses)
   - Speech-to-Text API Key (optional, enhances voice features)
   - Google Project ID (your GCP project)

2. **Configuration Options**:
   - **Save Configuration**: Stores keys locally for the session
   - **Demo Mode**: Uses simulated responses without API calls

## 🎭 AI Agent Features

### Agent Persona: Sarah Chen
- **Role**: Senior Legal Counsel at CloudTech Solutions
- **Experience**: 12 years in technology law
- **Specialty**: Cloud services agreements and data privacy
- **Style**: Professional, strategic, collaborative

### Negotiation Capabilities

#### 1. Contextual Intelligence
```javascript
// Example of context awareness
{
  "dealType": "Cloud Technology Services Agreement",
  "clientCompany": "GlobalBank International", 
  "dealValue": "£50M over 3 years",
  "currentTopic": "Service Level Agreements",
  "negotiationPhase": "Exploration"
}
```

#### 2. Strategic Positioning
- **Red Lines**: Non-negotiable terms (data ownership, unlimited liability)
- **Flexible Areas**: Service levels, payment terms, implementation timelines
- **Concession Strategy**: Bundled offers with conditions

#### 3. Dynamic State Tracking
- Topics discussed and completed
- Client positions and demands
- Relationship building score
- Mood and tone adaptation

#### 4. Realistic Business Constraints
- "I need to check with our technical team"
- "Our insurance coverage supports..."
- "From a compliance perspective..."
- "Our standard terms include..."

## 📊 Performance Metrics

The system tracks and displays:

### Negotiation Confidence
- **Factors**: Topic familiarity, preparation level, response quality
- **Range**: 0-100%
- **Updates**: Real-time based on conversation flow

### Communication Performance  
- **Factors**: Relationship building, professional tone, strategic thinking
- **Calculation**: Based on agent state and user interactions
- **Display**: Visual progress bars with color coding

### Progress Tracking
- **Topics**: Service levels, liability, data residency, IP, payments
- **Phases**: Opening → Exploration → Bargaining → Closing
- **Completion**: Percentage based on topics addressed

## 🎯 Advanced Prompt Engineering

### System Prompt Structure

```
AGENT PROFILE:
- Experience: 12 years in technology law
- Specialty: Cloud services agreements and data privacy
- Negotiation style: Professional, knowledgeable, strategic

DEAL CONTEXT:
- Contract: Cloud Technology Services Agreement
- Client: GlobalBank International (major international bank)
- Value: £50M over 3 years
- Critical requirements: GDPR compliance, financial regulations, 24/7 support

CURRENT NEGOTIATION STATE:
- Current topic: [Dynamic]
- Your company's positions: [Detailed breakdown]
- Red lines: [Non-negotiable terms]
- Conversation history: [Recent context]

INSTRUCTIONS:
1. Respond as an experienced legal counsel would
2. Show expertise in cloud services law and data protection
3. Make strategic concessions on smaller points
4. Reference business constraints realistically
5. Build rapport while protecting interests
```

### Response Generation Parameters

```javascript
generationConfig: {
  temperature: 0.7,        // Balanced creativity/consistency
  topK: 40,               // Focused vocabulary
  topP: 0.8,              // Natural language flow
  maxOutputTokens: 200,    // Concise responses
}
```

## 🔍 Error Handling & Fallbacks

### Multi-Layer Fallback System

1. **Primary**: Gemini Pro API responses
2. **Secondary**: Predefined intelligent responses  
3. **Tertiary**: Generic professional responses
4. **Demo Mode**: Simulated negotiation scenarios

### Error Recovery
```javascript
try {
  // AI response generation
} catch (error) {
  console.error('AI generation failed:', error);
  return fallbackResponse(); // Graceful degradation
}
```

## 🔒 Security Considerations

### API Key Management
- Keys stored locally in browser session
- Option to persist in localStorage (dev/demo only)
- Production should use secure backend proxy

### Data Privacy
- Conversation history stored locally only
- No sensitive data transmitted to unauthorized endpoints
- GDPR-compliant data handling

### Rate Limiting
- Built-in request throttling
- Graceful handling of quota exceeded errors
- Fallback to cached responses when needed

## 🎲 Demo Mode Features

When API keys are not configured:

### Simulated Intelligence
- Rule-based response selection
- Context-aware fallback responses
- Realistic negotiation flow
- Progress tracking simulation

### Learning Value
- Demonstrates system capabilities
- Shows UI/UX functionality
- Provides immediate testing environment

## 🚀 Usage Examples

### Starting a Negotiation
```javascript
// User types: "We need 99.9% uptime guarantee"
// AI analyzes and responds:
"I understand GlobalBank's requirements for high availability. 
Our standard offering is 99.5% uptime with service credits, 
but let me discuss with our technical team what's possible 
for a client of your caliber. What's driving the 99.9% requirement 
specifically?"
```

### Voice Input Processing
```javascript
// User speaks: "The liability cap is too low"
// System processes:
1. Speech-to-Text → transcription + confidence
2. Sentiment analysis → tone detection  
3. AI response → strategic counter-proposal
4. UI updates → metrics and progress
```

### Strategic Concessions
```javascript
// Context-aware concession example:
if (topic === "SLA" && clientPressure > 0.7) {
  return {
    concession: "99.7% uptime with performance credits",
    condition: "if you can accept our liability terms",
    rationale: "technical infrastructure constraints"
  };
}
```

## 📈 Future Enhancements

### Planned Features
1. **Multi-party negotiations** (3+ participants)
2. **Document analysis** (contract markup and review)
3. **Historical learning** (improving from past negotiations)
4. **Advanced analytics** (negotiation pattern analysis)
5. **Integration with legal databases** (precedent lookup)

### Vertex AI Integration
```javascript
// Advanced features when Vertex AI is enabled
- Document summarization
- Clause recommendation
- Risk assessment scoring
- Compliance checking
```

## 🎓 Educational Value

### Learning Objectives
- **Strategic Thinking**: Multi-issue negotiation tactics
- **Legal Reasoning**: Contract law application
- **Communication Skills**: Professional negotiation style
- **Business Acumen**: Commercial constraint understanding

### Mentor Integration
- Real-time coaching suggestions
- Post-negotiation analysis
- Best practice recommendations
- Skill development tracking

## 🏆 Success Metrics

### System Performance
- Response time < 3 seconds
- 95%+ uptime for GCP services  
- User satisfaction > 4.5/5
- Learning objective completion rate

### Educational Impact
- Negotiation confidence improvement
- Legal reasoning skill development
- Professional communication enhancement
- Strategic thinking advancement

---

## 🤝 Ready to Negotiate!

The GCP-powered negotiation system represents a significant advancement in legal education technology. By combining the power of Google's AI services with sophisticated prompt engineering and realistic business scenarios, we've created an immersive learning environment that prepares junior lawyers for real-world contract negotiations.

**Get started**: Open `negotiations.html` and configure your GCP credentials to experience the future of legal training! 