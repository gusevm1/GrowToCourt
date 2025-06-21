class SpeechAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://speech.googleapis.com/v1/speech:recognize';
    }

    async transcribeAudio(audioBlob) {
        try {
            console.log('Starting transcription...');
            
            // Convert audio to base64
            const base64Audio = await this.audioToBase64(audioBlob);
            
            // Prepare request body
            const requestBody = {
                config: {
                    encoding: 'WEBM_OPUS',
                    sampleRateHertz: 16000,
                    languageCode: 'en-US',
                    enableAutomaticPunctuation: true,
                    model: 'latest_long',
                    useEnhanced: true
                },
                audio: {
                    content: base64Audio
                }
            };

            // Make API request
            const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                throw new Error(`API request failed with status ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log('API Response:', data);

            // Extract transcription
            if (data.results && data.results.length > 0) {
                const result = data.results[0];
                if (result.alternatives && result.alternatives.length > 0) {
                    const alternative = result.alternatives[0];
                    return {
                        transcription: alternative.transcript,
                        confidence: alternative.confidence || 0,
                        success: true
                    };
                }
            }

            return {
                transcription: '',
                confidence: 0,
                success: false,
                error: 'No transcription results found'
            };

        } catch (error) {
            console.error('Transcription error:', error);
            return {
                transcription: '',
                confidence: 0,
                success: false,
                error: error.message
            };
        }
    }

    async audioToBase64(audioBlob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                // Remove the data URL prefix (e.g., "data:audio/webm;codecs=opus;base64,")
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(audioBlob);
        });
    }

    // Alternative method using Web Speech API (for testing/fallback)
    static testWebSpeechAPI() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.log('Web Speech API not supported');
            return null;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        return recognition;
    }
}

// Simple fallback using Web Speech API for testing
class WebSpeechRecognition {
    constructor() {
        this.recognition = null;
        this.isListening = false;
    }

    isSupported() {
        return ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
    }

    startListening() {
        return new Promise((resolve, reject) => {
            if (!this.isSupported()) {
                reject(new Error('Web Speech API not supported'));
                return;
            }

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                this.isListening = true;
                console.log('Web Speech API listening started');
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                const confidence = event.results[0][0].confidence;
                
                resolve({
                    transcription: transcript,
                    confidence: confidence,
                    success: true
                });
            };

            this.recognition.onerror = (event) => {
                console.error('Web Speech API error:', event.error);
                reject(new Error(`Speech recognition error: ${event.error}`));
            };

            this.recognition.onend = () => {
                this.isListening = false;
                console.log('Web Speech API listening ended');
            };

            this.recognition.start();
        });
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }
} 