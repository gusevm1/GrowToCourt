# GrowToCourt - GCP Speech-to-Text Setup Guide

## 🎤 Voice Recording Integration

This guide will help you set up the GCP Speech-to-Text API integration for real-time voice recording and transcription in the negotiations module.

## Prerequisites

1. **Google Cloud Platform Account** with Speech-to-Text API enabled
2. **Python 3.7+** installed
3. **gcloud CLI** installed and configured

## Quick Setup

### 1. GCP Authentication
Make sure you're authenticated with GCP:
```bash
gcloud auth application-default login
```

### 2. Start the Speech Service
Run the automated setup script:
```bash
./start_speech_service.sh
```

Or manually:
```bash
# Install dependencies
pip3 install -r requirements.txt

# Start the service
python3 speech_service.py
```

### 3. Open the Application
1. Open `negotiations.html` in your web browser
2. Click the microphone button (🎤) to start recording
3. Allow microphone permissions when prompted
4. Speak your negotiation response
5. Click the stop button to process with GCP Speech-to-Text

## Features

### 🎯 Real Voice Recording
- Uses WebRTC MediaRecorder API
- Automatic 30-second timeout
- Real-time visual feedback

### 🧠 GCP Speech-to-Text Integration
- High-quality transcription using GCP's latest models
- Confidence scoring
- Automatic punctuation
- Optimized for English legal language

### 📊 Intelligent Analysis
- **Confidence Detection**: Analyzes language patterns for assertiveness
- **Speech Quality**: Evaluates audio clarity and transcription confidence
- **Communication Coaching**: Provides real-time feedback on negotiation language

### 💬 Chat Integration
- Transcribed speech appears as chat messages
- Confidence scores displayed
- AI counterparty responds to voice input
- MentorChat provides speech coaching feedback

## Technical Details

### Backend Service (`speech_service.py`)
- **Framework**: Flask with CORS support
- **Endpoint**: `POST /transcribe`
- **Audio Format**: WebM Opus (browser native)
- **GCP Config**: Latest long model, automatic punctuation

### Frontend Integration
- **Audio Capture**: MediaRecorder API
- **Format**: WebM with Opus codec
- **Transport**: Base64 encoding via JSON
- **UI Updates**: Real-time status and feedback

## Troubleshooting

### Authentication Issues
```bash
# Check active account
gcloud auth list

# Re-authenticate if needed
gcloud auth application-default login
```

### Microphone Access
- Ensure browser has microphone permissions
- Use HTTPS for production deployment
- Check browser console for WebRTC errors

### Service Connection
- Verify Flask server is running on port 5000
- Check CORS settings if deploying remotely
- Confirm GCP API credentials are properly set

## API Usage

### Request Format
```json
{
  "audio": "data:audio/webm;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEA..."
}
```

### Response Format
```json
{
  "transcription": "We require strict GDPR compliance for this agreement.",
  "confidence": 0.95,
  "success": true
}
```

## Next Steps

1. **Production Deployment**: Configure for HTTPS and production GCP credentials
2. **Enhanced Analysis**: Add sentiment analysis and legal terminology detection
3. **Multi-language Support**: Expand beyond English for international negotiations
4. **Voice Coaching**: Implement advanced speech pattern analysis

## Support

For issues or questions:
1. Check the browser console for JavaScript errors
2. Verify GCP API quotas and billing
3. Test microphone access in browser settings
4. Confirm Flask service logs for backend errors 