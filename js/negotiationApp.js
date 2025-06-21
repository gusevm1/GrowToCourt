// Configuration
const USE_WEB_SPEECH_FALLBACK = true; // Set to true to use Web Speech API as fallback

class NegotiationApp {
    constructor() {
        this.audioRecorder = new AudioRecorder();
        this.speechAPI = new SpeechAPI();
        this.webSpeechRecognition = new WebSpeechRecognition();
        this.negotiationAgent = null; // Will be initialized when GCP is configured
        this.isRecording = false;
        this.isAgentThinking = false;
        this.currentConfidence = 72;
        this.currentPerformance = 68;
        
        this.initializeEventListeners();
        this.setupAudioRecorder();
        this.checkGCPConfiguration();
    }

    initializeEventListeners() {
        // Text input handling
        document.getElementById('sendTextBtn').addEventListener('click', () => {
            const textInput = document.getElementById('textInput');
            const message = textInput.value.trim();
            
            if (message) {
                this.sendTextMessage(message);
                textInput.value = '';
            }
        });

        // Enter key for text input
        document.getElementById('textInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const message = e.target.value.trim();
                if (message) {
                    this.sendTextMessage(message);
                    e.target.value = '';
                }
            }
        });

        // Speech button handling
        document.getElementById('speechBtn').addEventListener('click', () => {
            if (!this.isRecording) {
                this.startRecording();
            } else {
                this.stopRecording();
            }
        });

        // MentorChat functionality
        document.getElementById('mentorInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.askMentor();
            }
        });
    }

    setupAudioRecorder() {
        this.audioRecorder.onRecordingComplete = (audioBlob) => {
            this.processAudioRecording(audioBlob);
        };
    }

    async startRecording() {
        try {
            // Update UI
            this.isRecording = true;
            document.getElementById('speechBtn').classList.add('recording');
            document.getElementById('speechBtn').textContent = '⏹️';
            document.getElementById('speechStatus').textContent = 'Recording...';

            // Try Web Speech API first if available and fallback is enabled
            if (USE_WEB_SPEECH_FALLBACK && this.webSpeechRecognition.isSupported()) {
                console.log('Using Web Speech API');
                try {
                    const result = await this.webSpeechRecognition.startListening();
                    this.handleTranscriptionResult(result);
                    return;
                } catch (error) {
                    console.warn('Web Speech API failed, falling back to recording:', error);
                }
            }

            // Fallback to audio recording
            console.log('Using audio recording method');
            await this.audioRecorder.startRecording();

            // Auto-stop after 30 seconds
            setTimeout(() => {
                if (this.isRecording) {
                    this.stopRecording();
                }
            }, 30000);

        } catch (error) {
            console.error('Error starting recording:', error);
            this.showError('Could not start recording: ' + error.message);
            this.resetRecordingUI();
        }
    }

    stopRecording() {
        if (this.isRecording) {
            this.isRecording = false;
            
            // Stop Web Speech API if it's running
            this.webSpeechRecognition.stopListening();
            
            // Stop audio recording
            this.audioRecorder.stopRecording();
            
            // Update UI
            document.getElementById('speechStatus').textContent = 'Processing...';
        }
    }

    async processAudioRecording(audioBlob) {
        try {
            console.log('Processing audio blob, size:', audioBlob.size);
            
            // Check if we have a valid API key
            if (GOOGLE_API_KEY === 'YOUR_GOOGLE_API_KEY') {
                throw new Error('Please set your Google API key in negotiationApp.js');
            }

            const result = await this.speechAPI.transcribeAudio(audioBlob);
            this.handleTranscriptionResult(result);

        } catch (error) {
            console.error('Error processing audio:', error);
            this.showError('Transcription failed: ' + error.message);
        } finally {
            this.resetRecordingUI();
        }
    }

    handleTranscriptionResult(result) {
        if (result.success && result.transcription) {
            console.log('Transcription successful:', result.transcription);
            this.addTranscribedMessage(result.transcription, result.confidence);
            this.addSpeechAnalysisFeedback(result.transcription, result.confidence);
        } else {
            this.showError(result.error || 'Transcription failed');
        }
        this.resetRecordingUI();
    }

    resetRecordingUI() {
        this.isRecording = false;
        document.getElementById('speechBtn').classList.remove('recording');
        document.getElementById('speechBtn').textContent = '🎤';
        document.getElementById('speechStatus').textContent = 'Ready to record';
    }

    sendTextMessage(message) {
        // Add user message to chat
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.innerHTML = `
            <div class="message-avatar">You</div>
            <div class="message-content">
                <div class="message-sender">Junior Associate - Clifford Chance</div>
                <div class="message-text">${message}</div>
            </div>
        `;
        
        document.getElementById('negotiationContent').appendChild(userMessage);
        this.scrollToBottom();
        
        // Generate AI counterparty response after delay
        setTimeout(() => this.generateCounterpartyResponse(message), 2000);
    }

    addTranscribedMessage(transcription, confidence) {
        // Add the transcribed speech as a user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.innerHTML = `
            <div class="message-avatar">🎤</div>
            <div class="message-content">
                <div class="message-sender">Your Voice Response (${Math.round(confidence * 100)}% confidence)</div>
                <div class="message-text">${transcription}</div>
            </div>
        `;
        
        document.getElementById('negotiationContent').appendChild(userMessage);
        this.scrollToBottom();
        
        // Generate AI counterparty response to voice input
        setTimeout(() => this.generateCounterpartyResponse(transcription), 2000);
    }

    checkGCPConfiguration() {
        console.log('🔧 Checking GCP configuration...');
        console.log('🌍 Environment variables available:', !!window.ENV);
        
        // Check if we have environment variables loaded
        if (window.ENV && window.ENV.GCP_API_KEY) {
            console.log('✅ API key loaded from environment variables');
            
            // Initialize the negotiation agent with environment API key
            this.negotiationAgent = new NegotiationAgent(window.ENV.GCP_API_KEY);
            this.showConfigurationStatus('✅ GCP AI Agent initialized from .env file');
            
        } else {
            console.log('⚠️ No environment variables found, checking manual configuration...');
            
            // Try to get from GCP config
            const config = window.gcpConfig.getConfig();
            console.log('📋 GCP Config:', config);
            
            if (config.generativeAI.apiKey) {
                console.log('🔑 API Key found in config, initializing agent...');
                this.negotiationAgent = new NegotiationAgent(config.generativeAI.apiKey);
                this.showConfigurationStatus('✅ GCP AI Agent initialized successfully');
            } else {
                console.log('⚠️ No API key configured, using demo mode with fallback responses');
                this.showConfigurationStatus('🎲 Demo mode enabled - using intelligent fallback responses');
            }
        }
        
        // Check for client consultation data
        this.loadAndIntegrateClientData();
    }

    loadAndIntegrateClientData() {
        try {
            const clientData = this.loadClientConsultationData();
            if (clientData) {
                console.log('📋 Client consultation data found:', clientData);
                this.integrateClientContext(clientData);
                this.showClientSummary(clientData);
            } else {
                console.log('ℹ️ No client consultation data found. User can start with direct negotiation.');
            }
        } catch (error) {
            console.error('Error loading client consultation data:', error);
        }
    }

    loadClientConsultationData() {
        const data = localStorage.getItem('clientConsultationData');
        if (data) {
            try {
                return JSON.parse(data);
            } catch (error) {
                console.error('Error parsing client consultation data:', error);
                return null;
            }
        }
        return null;
    }

    integrateClientContext(clientData) {
        if (this.negotiationAgent && clientData.clientRequirements) {
            // Update Sarah Chen's knowledge of the client's requirements
            // This will affect how she negotiates
            this.negotiationAgent.updateClientContext(clientData.clientRequirements);
            console.log('🔄 Sarah Chen updated with client context');
        }
    }

    showClientSummary(clientData) {
        if (clientData.clientRequirements) {
            const requirements = clientData.clientRequirements;
            const summaryMessage = document.createElement('div');
            summaryMessage.className = 'message system client-summary';
            
            const budgetInfo = requirements.financial ? requirements.financial.budget : { preferred: 'Not specified' };
            const slaInfo = requirements.technical ? requirements.technical.sla : { preferred: 'Not specified' };
            const liabilityInfo = requirements.legal ? requirements.legal.liability : { minimumCap: 'Not specified' };
            
            summaryMessage.innerHTML = `
                <div style="background: #e3f2fd; border: 2px solid #2563eb; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                    <h4 style="color: #1565c0; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                        <span>📋</span> Client Requirements Summary
                    </h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                        <div>
                            <strong>Budget:</strong><br>
                            Preferred: ${budgetInfo.preferred || 'Not specified'}<br>
                            Maximum: ${budgetInfo.maximum || 'Not specified'}
                        </div>
                        <div>
                            <strong>SLA Requirements:</strong><br>
                            Minimum: ${slaInfo.minimum || 'Not specified'}<br>
                            Preferred: ${slaInfo.preferred || 'Not specified'}
                        </div>
                        <div>
                            <strong>Liability Cap:</strong><br>
                            Minimum: ${liabilityInfo.minimumCap || 'Not specified'}
                        </div>
                    </div>
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #90caf9;">
                        <strong>Consultation Phase:</strong> ${clientData.phase || 'Completed'} | 
                        <strong>Data Residency:</strong> ${requirements.technical?.dataResidency?.requirement || 'EU only'}
                    </div>
                    <div style="margin-top: 0.5rem; font-size: 0.9rem; color: #1565c0;">
                        💡 <em>Sarah Chen is now aware of your client's requirements and will negotiate accordingly.</em>
                    </div>
                </div>
            `;
            
            document.getElementById('negotiationContent').appendChild(summaryMessage);
            this.scrollToBottom();
        }
    }

    showConfigurationDialog() {
        const status = window.gcpConfig ? window.gcpConfig.getConfigurationStatus() : null;
        
        if (!status || !status.configured) {
            const dialog = document.createElement('div');
            dialog.className = 'config-dialog';
            dialog.innerHTML = `
                <div class="config-overlay">
                    <div class="config-modal">
                        <h3>🔧 GCP Configuration Required</h3>
                        <p>To enable AI-powered negotiations, please configure your Google Cloud APIs:</p>
                        
                        <div class="config-form">
                            <div class="config-field">
                                <label>Universal Google Cloud API Key:</label>
                                <input type="password" id="universalApiKey" placeholder="Enter your universal Google Cloud API key">
                                <small style="color: var(--medium-grey); font-size: 0.8rem;">Use this if you have a single API key that works for all Google Cloud services</small>
                            </div>
                            
                            <div style="text-align: center; margin: 1rem 0; color: var(--medium-grey);">
                                <strong>— OR —</strong>
                            </div>
                            
                            <div class="config-field">
                                <label>Generative AI API Key:</label>
                                <input type="password" id="generativeAiKey" placeholder="Enter your Generative AI API key">
                            </div>
                            <div class="config-field">
                                <label>Speech-to-Text API Key (optional):</label>
                                <input type="password" id="speechKey" placeholder="Enter your Speech-to-Text API key">
                            </div>
                            <div class="config-field">
                                <label>Google Project ID:</label>
                                <input type="text" id="projectId" placeholder="Enter your Google Cloud Project ID">
                            </div>
                        </div>
                        
                        <div class="config-actions">
                            <button onclick="window.negotiationApp.saveConfiguration()" class="btn btn-primary">Save Configuration</button>
                            <button onclick="window.negotiationApp.enableDemoMode()" class="btn btn-secondary">Demo Mode</button>
                        </div>
                        
                        <div class="config-help">
                            <p><strong>Need help?</strong> <a href="#" onclick="window.negotiationApp.showSetupInstructions()">View setup instructions</a></p>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(dialog);
        }
    }

    saveConfiguration() {
        const universalApiKey = document.getElementById('universalApiKey')?.value;
        const generativeAiKey = document.getElementById('generativeAiKey')?.value;
        const speechKey = document.getElementById('speechKey')?.value;
        const projectId = document.getElementById('projectId')?.value;

        // Prefer universal key if provided
        if (universalApiKey) {
            window.gcpConfig.setAPIKey('GOOGLE_UNIVERSAL_API_KEY', universalApiKey);
            console.log('✅ Using universal API key for all Google Cloud services');
        } else {
            // Use individual keys
            if (generativeAiKey) {
                window.gcpConfig.setAPIKey('GOOGLE_GENERATIVE_AI_KEY', generativeAiKey);
            }
            if (speechKey) {
                window.gcpConfig.setAPIKey('GOOGLE_SPEECH_KEY', speechKey);
            }
        }
        
        if (projectId) {
            window.gcpConfig.setAPIKey('GOOGLE_PROJECT_ID', projectId);
        }

        // Initialize the negotiation agent with the appropriate key
        const apiKeyToUse = universalApiKey || generativeAiKey;
        if (apiKeyToUse) {
            this.negotiationAgent = new NegotiationAgent(apiKeyToUse);
            this.showConfigurationStatus('✅ Configuration saved! AI Agent ready with ' + (universalApiKey ? 'universal' : 'individual') + ' API key.');
        }

        // Remove dialog
        const dialog = document.querySelector('.config-dialog');
        if (dialog) {
            dialog.remove();
        }
    }

    enableDemoMode() {
        window.gcpConfig.enableDemoMode();
        this.showConfigurationStatus('⚠️ Demo mode enabled - using simulated responses');
        
        // Remove dialog
        const dialog = document.querySelector('.config-dialog');
        if (dialog) {
            dialog.remove();
        }
    }

    showConfigurationStatus(message) {
        const statusDiv = document.createElement('div');
        statusDiv.className = 'config-status';
        statusDiv.innerHTML = `
            <div class="alert alert-info">
                ${message}
                <button onclick="this.parentElement.parentElement.remove()" style="float: right; border: none; background: none; font-size: 1.2em;">&times;</button>
            </div>
        `;
        
        // Insert after header
        const header = document.querySelector('header');
        header.insertAdjacentElement('afterend', statusDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (statusDiv.parentElement) {
                statusDiv.remove();
            }
        }, 5000);
    }

    async generateCounterpartyResponse(userMessage = '') {
        // Show typing indicator
        this.showAgentTyping();

        try {
            let response;
            
            console.log('🎯 generateCounterpartyResponse called with:', userMessage);
            console.log('🤖 Negotiation agent available:', !!this.negotiationAgent);
            
            if (this.negotiationAgent) {
                // Use AI agent for intelligent response
                console.log('🔄 Generating AI response for:', userMessage);
                const agentResponse = await this.negotiationAgent.generateResponse(userMessage);
                console.log('✅ Agent response received:', agentResponse);
                response = agentResponse.message;
                
                // Update negotiation state
                this.updateNegotiationProgress(agentResponse.negotiationProgress);
                this.updateMetricsFromAgent(agentResponse.agentState);
                
            } else {
                // Fallback to predefined responses
                console.log('⚠️ No AI agent available, using fallback response');
                response = this.getFallbackResponse();
            }

            // Add response to chat
            this.addCounterpartyMessage(response);
            
        } catch (error) {
            console.error('❌ Error generating response:', error);
            console.error('❌ Error stack:', error.stack);
            
            // Show more helpful error message in dev mode
            const errorMessage = error.message.includes('API') 
                ? `API Error: ${error.message}. Please check your API key and try again.`
                : "I apologize, but I'm having technical difficulties. Could you please repeat that?";
                
            this.addCounterpartyMessage(errorMessage);
        } finally {
            this.hideAgentTyping();
        }
    }

    getFallbackResponse() {
        const responses = [
            "That's an interesting perspective on the service levels. From CloudTech's standpoint, we typically offer 99.5% uptime with service credits. What specific business requirements are driving your need for higher availability?",
            "I understand GlobalBank's position on liability caps. Our standard coverage is £25M, but let me discuss with our risk management team what flexibility we might have for a client of your caliber.",
            "Your concerns about data residency are completely valid, especially given the regulatory environment in financial services. We can certainly accommodate EU-only data storage, though it may impact our disaster recovery planning.",
            "That's a fair point about the IP licensing terms. CloudTech typically retains ownership, but we're open to discussing more limited licensing arrangements that work for both parties.",
            "I appreciate your perspective on the payment terms. While we prefer quarterly billing in advance, I can explore monthly options with our finance team if that works better for GlobalBank's cash flow.",
            "The GDPR compliance requirements you've outlined are absolutely critical. We have extensive experience with financial services regulations and can provide detailed compliance documentation.",
            "You raise a good question about implementation timelines. Typically we see 6-8 weeks for a deployment of this scale, but we could explore accelerated timelines if needed.",
            "Your concerns about the termination clauses are understandable. Perhaps we could structure the contract with milestone-based exit points to provide more flexibility?",
            "That's an important consideration about business continuity. Let me check with our technical team on what additional SLA guarantees we could provide for critical banking operations.",
            "I hear what you're saying about the indemnification terms. Given the sensitive nature of financial data, we should definitely explore enhanced liability protections."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    showAgentTyping() {
        this.isAgentThinking = true;
        
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message counterparty typing-indicator';
        typingIndicator.id = 'typing-indicator';
        typingIndicator.innerHTML = `
            <div class="message-avatar">CT</div>
            <div class="message-content">
                <div class="message-sender">Sarah Chen - CloudTech Legal Counsel</div>
                <div class="message-text">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <em>Sarah is thinking...</em>
                </div>
            </div>
        `;
        
        document.getElementById('negotiationContent').appendChild(typingIndicator);
        this.scrollToBottom();
    }

    hideAgentTyping() {
        this.isAgentThinking = false;
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    addCounterpartyMessage(message) {
        const counterpartyMessage = document.createElement('div');
        counterpartyMessage.className = 'message counterparty';
        counterpartyMessage.innerHTML = `
            <div class="message-avatar">CT</div>
            <div class="message-content">
                <div class="message-sender">Sarah Chen - CloudTech Legal Counsel</div>
                <div class="message-text">${message}</div>
            </div>
        `;
        
        document.getElementById('negotiationContent').appendChild(counterpartyMessage);
        this.scrollToBottom();
    }

    updateNegotiationProgress(progress) {
        if (!progress) return;
        
        // Update progress indicators in sidebars
        const progressItems = document.querySelectorAll('.progress-item');
        progressItems.forEach((item, index) => {
            const status = item.querySelector('.progress-status');
            if (index < progress.topicsCompleted) {
                status.className = 'progress-status status-completed';
                status.textContent = 'Completed';
            } else if (index === progress.topicsCompleted) {
                status.className = 'progress-status status-current';
                status.textContent = 'In Progress';
            }
        });

        // Update current phase info
        const currentTopic = document.querySelector('.current-topic');
        if (currentTopic) {
            currentTopic.textContent = `Current Phase: ${progress.currentPhase} (${progress.percentage}% complete)`;
        }
    }

    updateMetricsFromAgent(agentState) {
        if (!agentState) return;
        
        // Update confidence based on mood and relationship building
        let confidenceScore = 72; // Base confidence
        
        switch (agentState.mood) {
            case 'accommodating':
                confidenceScore += 10;
                break;
            case 'firm':
                confidenceScore += 5;
                break;
            case 'cautious':
                confidenceScore -= 5;
                break;
        }
        
        // Adjust based on topics discussed
        confidenceScore += agentState.topicsDiscussed.length * 3;
        
        // Cap at 100
        confidenceScore = Math.min(confidenceScore, 100);
        
        this.currentConfidence = confidenceScore;
        
        // Update performance based on relationship building
        this.currentPerformance = Math.round(agentState.relationshipBuilding * 100);
        
        // Update UI
        this.updateMetrics();
    }

    addSpeechAnalysisFeedback(transcription, confidence) {
        // Analyze the speech for feedback
        const wordCount = transcription.split(' ').length;
        const hasConfidentLanguage = /\b(will|must|require|essential|critical|absolutely)\b/i.test(transcription);
        const hasHedgingLanguage = /\b(maybe|perhaps|might|possibly|I think|I believe)\b/i.test(transcription);
        
        let feedback = "Speech analysis: ";
        
        if (confidence > 0.9) {
            feedback += "Excellent audio quality and clear articulation. ";
        } else if (confidence > 0.7) {
            feedback += "Good audio quality. ";
        } else {
            feedback += "Consider speaking more clearly. ";
        }
        
        if (hasConfidentLanguage) {
            feedback += "Strong, confident language detected. ";
            // Boost confidence meter
            this.currentConfidence = Math.min(100, this.currentConfidence + 5);
            this.updateMetrics();
        }
        
        if (hasHedgingLanguage) {
            feedback += "Consider using more assertive language. ";
        }
        
        if (wordCount < 10) {
            feedback += "Try to provide more detailed responses. ";
        } else if (wordCount > 50) {
            feedback += "Good balance of detail and brevity. ";
        }
        
        this.addMentorMessage(`<strong>AI Speech Coach:</strong> ${feedback}`);
    }

    updateMetrics() {
        document.getElementById('confidenceValue').textContent = this.currentConfidence + '%';
        document.getElementById('confidenceFill').style.width = this.currentConfidence + '%';
        document.getElementById('performanceValue').textContent = this.currentPerformance + '%';
        document.getElementById('performanceFill').style.width = this.currentPerformance + '%';
    }

    askMentor() {
        const input = document.getElementById('mentorInput');
        const question = input.value.trim();
        
        if (!question) return;
        
        // Add user question
        this.addMentorMessage(`<strong>You:</strong> ${question}`);
        
        // Simulate AI response
        setTimeout(() => {
            const responses = {
                'liability': 'Liability caps in tech services agreements typically range from 1x to 3x annual fees. Consider the specific risks your client faces.',
                'sla': 'SLAs should be commercially reasonable but protect your client\'s operational needs. Consider graduated remedies.',
                'data': 'GDPR compliance requires careful attention to data processing agreements and cross-border transfer mechanisms.',
                'speech': 'Good speech recognition! The transcription quality depends on audio clarity and background noise.',
                'default': 'That\'s a great question. In this scenario, focus on balancing your client\'s requirements with commercial reasonableness.'
            };
            
            let response = responses.default;
            const lowerQuestion = question.toLowerCase();
            if (lowerQuestion.includes('liability')) response = responses.liability;
            if (lowerQuestion.includes('sla') || lowerQuestion.includes('service')) response = responses.sla;
            if (lowerQuestion.includes('data') || lowerQuestion.includes('gdpr')) response = responses.data;
            if (lowerQuestion.includes('speech') || lowerQuestion.includes('voice')) response = responses.speech;
            
            this.addMentorMessage(`<strong>AI Mentor:</strong> ${response}`);
        }, 1000);
        
        input.value = '';
    }

    addMentorMessage(html) {
        const mentorMessage = document.createElement('div');
        mentorMessage.className = 'mentor-message';
        mentorMessage.innerHTML = html;
        document.getElementById('mentorContent').appendChild(mentorMessage);
        document.getElementById('mentorContent').scrollTop = 
            document.getElementById('mentorContent').scrollHeight;
    }

    async testAPIConnection() {
        if (this.negotiationAgent) {
            console.log('🧪 Running API connection test...');
            const result = await this.negotiationAgent.testAPIConnection();
            
            if (result.success) {
                this.showConfigurationStatus(`✅ API Test Successful: ${result.response}`);
            } else {
                this.showConfigurationStatus(`❌ API Test Failed: ${result.error}`);
                console.error('API Test Details:', result.details);
            }
        } else {
            this.showConfigurationStatus('⚠️ No negotiation agent initialized - check your API key configuration');
        }
    }

    showError(message) {
        this.addMentorMessage(`<strong>Error:</strong> ${message}`);
    }

    scrollToBottom() {
        const content = document.getElementById('negotiationContent');
        content.scrollTop = content.scrollHeight;
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Negotiation App...');
    window.negotiationApp = new NegotiationApp();
}); 