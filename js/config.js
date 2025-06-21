// GrowToCourt Configuration
const CONFIG = {
    // GCP Configuration
    GCP: {
        // Replace with your actual GCP API key
        API_KEY: 'YOUR_GCP_API_KEY_HERE',
        
        // Speech-to-Text Configuration
        SPEECH: {
            LANGUAGE_CODE: 'en-US',
            SAMPLE_RATE: 16000,
            MODEL: 'latest_long',
            USE_ENHANCED: true,
            ENABLE_PUNCTUATION: true,
            
            // Legal-specific vocabulary for better recognition
            LEGAL_PHRASES: [
                'liability cap', 'service level agreement', 'SLA', 'GDPR',
                'data protection', 'cloud services', 'uptime', 'breach',
                'contract terms', 'negotiation', 'CloudTech Solutions',
                'Global Banking Corp', 'intellectual property', 'compliance',
                'force majeure', 'indemnification', 'termination clause',
                'confidentiality', 'non-disclosure', 'arbitration'
            ]
        }
    },

    // Application Settings
    APP: {
        NAME: 'GrowToCourt',
        VERSION: '1.0.0',
        DEMO_MODE: true,
        
        // Speech Recognition Settings
        SPEECH_RECOGNITION: {
            MAX_RECORDING_TIME: 30000, // 30 seconds
            MIN_RECORDING_TIME: 1000,  // 1 second
            CONFIDENCE_THRESHOLD: 0.7,
            AUTO_SEND_TRANSCRIPTION: true
        },
        
        // Negotiation Meters Settings
        METERS: {
            PERCEPTION: {
                INITIAL_VALUE: 75,
                MIN_VALUE: 0,
                MAX_VALUE: 100
            },
            CONFIDENCE: {
                INITIAL_VALUE: 65,
                MIN_VALUE: 0,
                MAX_VALUE: 100
            }
        }
    },

    // UI Settings
    UI: {
        COLORS: {
            PRIMARY_BLACK: '#1a1a1a',
            PRIMARY_GREY: '#2a2a2a',
            LIGHT_GREY: '#f5f5f5',
            SUCCESS_GREEN: '#10b981',
            WARNING_ORANGE: '#f59e0b',
            DANGER_RED: '#ef4444'
        },
        
        ANIMATIONS: {
            METER_TRANSITION: '0.8s ease-in-out',
            CARD_HOVER_TRANSITION: '0.3s ease'
        }
    }
};

// Validation function for GCP API key
function validateGCPConfig() {
    if (!CONFIG.GCP.API_KEY || CONFIG.GCP.API_KEY === 'YOUR_GCP_API_KEY_HERE') {
        console.warn('⚠️ GCP API Key not configured. Speech-to-text functionality will not work.');
        return false;
    }
    return true;
}

// Initialize configuration
function initializeConfig() {
    // Check if we're in development mode
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isDevelopment) {
        console.log('🚀 GrowToCourt initialized in development mode');
        console.log('📋 Configuration loaded:', CONFIG.APP);
    }
    
    // Validate GCP configuration
    const gcpValid = validateGCPConfig();
    
    return {
        isValid: gcpValid,
        config: CONFIG
    };
}

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, validateGCPConfig, initializeConfig };
} 