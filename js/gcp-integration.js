// GCP Speech-to-Text Integration Layer
class GCPSpeechService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioStream = null;
        this.audioChunks = [];
        this.onTranscriptionCallback = null;
        this.onErrorCallback = null;
        
        // GCP Speech-to-Text API endpoint
        this.apiEndpoint = 'https://speech.googleapis.com/v1/speech:recognize';
    }

    // Initialize microphone access
    async initializeMicrophone() {
        try {
            this.audioStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            
            this.mediaRecorder = new MediaRecorder(this.audioStream, {
                mimeType: 'audio/webm;codecs=opus'
            });
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.onstop = () => {
                this.processAudioChunks();
            };
            
            return true;
        } catch (error) {
            console.error('Microphone initialization failed:', error);
            if (this.onErrorCallback) {
                this.onErrorCallback('Microphone access denied. Please allow microphone permissions.');
            }
            return false;
        }
    }

    // Start recording
    startRecording() {
        if (!this.mediaRecorder || this.isRecording) {
            return false;
        }
        
        this.audioChunks = [];
        this.mediaRecorder.start();
        this.isRecording = true;
        
        console.log('Recording started...');
        return true;
    }

    // Stop recording
    stopRecording() {
        if (!this.mediaRecorder || !this.isRecording) {
            return false;
        }
        
        this.mediaRecorder.stop();
        this.isRecording = false;
        
        console.log('Recording stopped...');
        return true;
    }

    // Process recorded audio chunks
    async processAudioChunks() {
        if (this.audioChunks.length === 0) {
            return;
        }

        try {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
            const base64Audio = await this.blobToBase64(audioBlob);
            
            // Remove the data URL prefix
            const base64Data = base64Audio.split(',')[1];
            
            await this.transcribeAudio(base64Data);
        } catch (error) {
            console.error('Audio processing failed:', error);
            if (this.onErrorCallback) {
                this.onErrorCallback('Audio processing failed. Please try again.');
            }
        }
    }

    // Convert blob to base64
    blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    // Send audio to GCP Speech-to-Text API
    async transcribeAudio(base64Audio) {
        const requestBody = {
            config: {
                encoding: 'WEBM_OPUS',
                sampleRateHertz: 16000,
                languageCode: 'en-US',
                model: 'latest_long',
                useEnhanced: true,
                enableAutomaticPunctuation: true,
                enableWordTimeOffsets: false,
                profanityFilter: false,
                speechContexts: [
                    {
                        phrases: [
                            'liability cap', 'service level agreement', 'SLA', 'GDPR',
                            'data protection', 'cloud services', 'uptime', 'breach',
                            'contract terms', 'negotiation', 'CloudTech Solutions',
                            'Global Banking Corp', 'intellectual property', 'compliance'
                        ]
                    }
                ]
            },
            audio: {
                content: base64Audio
            }
        };

        try {
            const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();
            
            if (result.error) {
                throw new Error(result.error.message);
            }

            if (result.results && result.results.length > 0) {
                const transcript = result.results
                    .map(result => result.alternatives[0].transcript)
                    .join(' ')
                    .trim();
                
                if (transcript && this.onTranscriptionCallback) {
                    this.onTranscriptionCallback(transcript, result.results[0].alternatives[0].confidence);
                }
            } else {
                if (this.onErrorCallback) {
                    this.onErrorCallback('No speech detected. Please try speaking more clearly.');
                }
            }
        } catch (error) {
            console.error('GCP API Error:', error);
            if (this.onErrorCallback) {
                this.onErrorCallback(`Transcription failed: ${error.message}`);
            }
        }
    }

    // Real-time streaming transcription (for future enhancement)
    async startStreamingRecognition() {
        // This would use WebSocket connection to GCP for real-time streaming
        // Implementation would require backend WebSocket server
        console.log('Streaming recognition not yet implemented - requires backend WebSocket server');
    }

    // Set callback for successful transcription
    onTranscription(callback) {
        this.onTranscriptionCallback = callback;
    }

    // Set callback for errors
    onError(callback) {
        this.onErrorCallback = callback;
    }

    // Clean up resources
    cleanup() {
        if (this.audioStream) {
            this.audioStream.getTracks().forEach(track => track.stop());
        }
        this.isRecording = false;
        this.audioChunks = [];
    }

    // Check if browser supports required features
    static isSupported() {
        return !!(navigator.mediaDevices && 
                 navigator.mediaDevices.getUserMedia && 
                 window.MediaRecorder &&
                 window.fetch);
    }

    // Get microphone permission status
    static async getMicrophonePermission() {
        try {
            const permission = await navigator.permissions.query({ name: 'microphone' });
            return permission.state;
        } catch (error) {
            return 'unknown';
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GCPSpeechService;
} 