class GCPConfig {
    constructor() {
        // Load from environment variables
        const ENV_API_KEY = window.ENV?.GCP_API_KEY || '';
        const ENV_PROJECT_ID = window.ENV?.GCP_PROJECT_ID || 'demo-project';
        
        console.log('🔧 GCP Config initializing with environment variables');
        console.log('🔑 ENV API Key available:', !!ENV_API_KEY);
        console.log('📋 ENV Project ID:', ENV_PROJECT_ID);
        
        // These values come from environment variables loaded from .env
        this.config = {
            // Generative AI API Key
            generativeAI: {
                apiKey: ENV_API_KEY || this.getAPIKey('GOOGLE_GENERATIVE_AI_KEY'),
                projectId: ENV_PROJECT_ID,
                location: 'us-central1'
            },
            
            // Speech-to-Text API
            speechToText: {
                apiKey: ENV_API_KEY || this.getAPIKey('GOOGLE_SPEECH_KEY'),
                config: {
                    encoding: 'WEBM_OPUS',
                    sampleRateHertz: 48000,
                    languageCode: 'en-US',
                    model: 'latest_long',
                    useEnhanced: true,
                    enableWordTimeOffsets: true,
                    enableWordConfidence: true,
                    enableSpeakerDiarization: false,
                    profanityFilter: false
                }
            },

            // Vertex AI settings (for advanced features)
            vertexAI: {
                apiKey: ENV_API_KEY || this.getAPIKey('GOOGLE_VERTEX_AI_KEY'),
                projectId: ENV_PROJECT_ID,
                location: 'us-central1',
                models: {
                    textGeneration: 'text-bison@001',
                    chat: 'chat-bison@001',
                    embeddings: 'textembedding-gecko@001'
                }
            },

            // Feature flags
            features: {
                useVertexAI: false, // Set to true for advanced features
                enableSpeechAnalysis: true,
                enableSentimentAnalysis: true,
                enableRealTimeTranscription: true,
                logConversations: true
            }
        };

        this.isConfigured = this.validateConfiguration();
    }

    getAPIKey(keyName) {
        // Try to get from window.gcpKeys first (set by user through UI)
        if (window.gcpKeys && window.gcpKeys[keyName]) {
            console.log('🔑 Using UI-configured API key for', keyName);
            return window.gcpKeys[keyName];
        }
        
        // Try to get from localStorage
        const stored = localStorage.getItem(keyName);
        if (stored) {
            console.log('🔑 Using stored API key for', keyName);
            return stored;
        }

        // Return placeholder for demo
        console.log('⚠️ No API key found for', keyName);
        return '';
    }

    setAPIKey(keyName, value) {
        // Initialize gcpKeys if it doesn't exist
        if (!window.gcpKeys) {
            window.gcpKeys = {};
        }
        
        // Store in window object
        window.gcpKeys[keyName] = value;
        
        // Optionally store in localStorage (be careful with sensitive data)
        if (this.shouldPersistKey(keyName)) {
            localStorage.setItem(keyName, value);
        }

        // Update config
        this.updateConfigFromKeys();
        this.isConfigured = this.validateConfiguration();
    }

    shouldPersistKey(keyName) {
        // For demo purposes, we'll persist keys, but in production
        // you'd want more secure handling
        return true;
    }

    updateConfigFromKeys() {
        // Check for universal API key first
        const universalKey = this.getAPIKey('GOOGLE_UNIVERSAL_API_KEY');
        
        if (universalKey) {
            // Use universal key for all services
            this.config.generativeAI.apiKey = universalKey;
            this.config.speechToText.apiKey = universalKey;
            this.config.vertexAI.apiKey = universalKey;
        } else {
            // Fall back to individual keys
            this.config.generativeAI.apiKey = this.getAPIKey('GOOGLE_GENERATIVE_AI_KEY');
            this.config.speechToText.apiKey = this.getAPIKey('GOOGLE_SPEECH_KEY');
            this.config.vertexAI.apiKey = this.getAPIKey('GOOGLE_VERTEX_AI_KEY');
        }
        
        this.config.generativeAI.projectId = this.getAPIKey('GOOGLE_PROJECT_ID') || 'your-project-id';
        this.config.vertexAI.projectId = this.getAPIKey('GOOGLE_PROJECT_ID') || 'your-project-id';
    }

    validateConfiguration() {
        const hasGenerativeAI = !!this.config.generativeAI.apiKey;
        const hasSpeech = !!this.config.speechToText.apiKey;
        const hasProjectId = !!this.config.generativeAI.projectId && this.config.generativeAI.projectId !== 'demo-project';
        
        console.log('🔍 Configuration validation:', {
            'Generative AI Key': hasGenerativeAI,
            'Speech API Key': hasSpeech,
            'Project ID': hasProjectId,
            'Environment Variables': !!window.ENV
        });
        
        return {
            isValid: hasGenerativeAI || hasSpeech,
            generativeAI: hasGenerativeAI,
            speechToText: hasSpeech,
            vertexAI: !!this.config.vertexAI.apiKey,
            hasProjectId: hasProjectId,
            missingKeys: this.getMissingKeys()
        };
    }

    getMissingKeys() {
        const missing = [];
        const hasUniversalKey = !!this.getAPIKey('GOOGLE_UNIVERSAL_API_KEY');
        
        if (hasUniversalKey) {
            // Only need project ID if using universal key
            if (!this.config.generativeAI.projectId || this.config.generativeAI.projectId === 'your-project-id') {
                missing.push('GOOGLE_PROJECT_ID');
            }
        } else {
            // Need individual keys
            if (!this.config.generativeAI.apiKey) {
                missing.push('GOOGLE_GENERATIVE_AI_KEY or GOOGLE_UNIVERSAL_API_KEY');
            }
            if (!this.config.speechToText.apiKey) {
                missing.push('GOOGLE_SPEECH_KEY (optional if using universal key)');
            }
            if (!this.config.vertexAI.apiKey) {
                missing.push('GOOGLE_VERTEX_AI_KEY (optional)');
            }
            if (!this.config.generativeAI.projectId || this.config.generativeAI.projectId === 'your-project-id') {
                missing.push('GOOGLE_PROJECT_ID');
            }
        }

        return missing;
    }

    // Configuration setup UI helper
    getConfigurationStatus() {
        const status = this.validateConfiguration();
        
        return {
            configured: status.isValid,
            services: {
                'Generative AI (Gemini)': status.generativeAI ? '✅ Configured' : '❌ Missing API Key',
                'Speech-to-Text': status.speechToText ? '✅ Configured' : '❌ Missing API Key',
                'Vertex AI': status.vertexAI ? '✅ Configured' : '⚠️ Optional - Not configured'
            },
            missingKeys: status.missingKeys,
            setupInstructions: this.getSetupInstructions()
        };
    }

    getSetupInstructions() {
        return {
            title: "GCP API Configuration Required",
            steps: [
                "1. Go to Google Cloud Console (console.cloud.google.com)",
                "2. Create a new project or select existing project",
                "3. Enable the following APIs:",
                "   • Generative Language API (for AI responses)",
                "   • Speech-to-Text API (for voice input)",
                "   • Vertex AI API (optional, for advanced features)",
                "4. Create API keys in the Credentials section",
                "5. Enter your keys in the configuration dialog"
            ],
            securityNote: "API keys are stored locally in your browser. For production use, implement proper key management."
        };
    }

    // Demo mode configuration
    enableDemoMode() {
        // For demo purposes, we can simulate some responses
        this.config.features.demoMode = true;
        console.log('GCP Demo Mode enabled - using simulated responses where APIs are not configured');
    }

    getConfig() {
        return this.config;
    }

    isReady() {
        return this.isConfigured.isValid;
    }

    // Advanced configuration methods
    enableAdvancedFeatures() {
        this.config.features.useVertexAI = true;
        this.config.features.enableSentimentAnalysis = true;
        this.config.features.logConversations = true;
    }

    getVertexAIEndpoint(model) {
        const { projectId, location } = this.config.vertexAI;
        return `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:predict`;
    }

    getGenerativeAIEndpoint() {
        return `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.config.generativeAI.apiKey}`;
    }

    getSpeechToTextEndpoint() {
        return `https://speech.googleapis.com/v1/speech:recognize?key=${this.config.speechToText.apiKey}`;
    }
}

// Global configuration instance
window.gcpConfig = new GCPConfig(); 