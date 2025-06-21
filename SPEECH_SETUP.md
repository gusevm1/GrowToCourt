# GrowToCourt - Speech-to-Text Setup (Frontend Only)

## 🎤 Quick Setup for Speech Recognition

We've simplified the speech-to-text integration to work entirely in the frontend - no backend required!

## 🚀 How to Use

### Option 1: Web Speech API (Easiest - No Setup Required)
1. Open `negotiations.html` in your browser
2. Click the 🎤 microphone button 
3. Allow microphone permissions
4. Speak naturally and the browser will transcribe your speech!

**Note**: This uses the browser's built-in Web Speech API and works immediately in Chrome/Edge.

### Option 2: Google Cloud Speech-to-Text API (Higher Quality)
If you want to use Google's more advanced speech recognition:

1. **Get a Google API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the Speech-to-Text API
   - Create an API key

2. **Update the Configuration**:
   - Open `js/negotiationApp.js`
   - Replace `YOUR_GOOGLE_API_KEY` with your actual API key:
   ```javascript
   const GOOGLE_API_KEY = 'your-actual-api-key-here';
   ```

3. **Test the Integration**:
   - Open `negotiations.html` in your browser
   - Click the 🎤 microphone button
   - Speak your negotiation response
   - Watch as Google's AI transcribes your speech!

## 🎯 Features

### ✅ What Works Now:
- **Microphone Recording**: Clean audio capture with permission handling
- **Web Speech API**: Instant transcription using browser capabilities  
- **Google Cloud API**: High-quality transcription (with API key)
- **Speech Analysis**: Confidence detection and language pattern analysis
- **Chat Integration**: Voice messages appear in the negotiation chat
- **Error Handling**: Graceful fallbacks and user-friendly error messages

### 🎙️ Speech Features:
- **Real-time transcription** with confidence scores
- **Language analysis** (confident vs. hedging language detection)
- **Audio quality feedback** 
- **Automatic fallback** from Google API to Web Speech API if needed

### 📱 Browser Compatibility:
- **Chrome/Edge**: Full support for both Web Speech API and MediaRecorder
- **Firefox**: MediaRecorder support (Google API works)
- **Safari**: Limited support (use Google API method)

## 🔧 Technical Details

### File Structure:
```
js/
├── audioRecorder.js     # Handles microphone and audio recording
├── speechAPI.js         # Google Cloud Speech-to-Text integration  
└── negotiationApp.js    # Main app that ties everything together
```

### How It Works:
1. **Audio Capture**: `audioRecorder.js` handles microphone permissions and recording
2. **Speech Processing**: `speechAPI.js` sends audio to Google or uses Web Speech API
3. **Integration**: `negotiationApp.js` manages the UI and chat integration

## 🧪 Testing

### Test the Web Speech API:
1. Open the page in Chrome
2. Click 🎤 and say: "We require strict GDPR compliance"
3. Should appear in chat immediately

### Test Google Cloud API:
1. Add your API key to `negotiationApp.js`
2. Click 🎤 and speak a longer sentence
3. Should get higher quality transcription with confidence score

## 🎨 UI Features

- **Visual feedback** during recording (pulsing red button)
- **Status updates** ("Recording...", "Processing...", "Ready")
- **Confidence scores** displayed with transcribed messages
- **Error messages** in the MentorChat sidebar
- **Speech analysis** with coaching feedback

## 💡 Pro Tips

1. **Speak clearly** for better transcription accuracy
2. **Use confident language** (will, must, require) to boost your confidence score
3. **Keep responses focused** - aim for 10-50 words for best feedback
4. **Test microphone** permissions if you get access errors

Perfect for quick hackathon demos - no backend setup required! 🚀 