class ClientConsultationApp {
    constructor() {
        this.clientAgent = null;
        this.mentorAgent = null;
        this.currentPhase = "discovery";
        this.isReady = false;
        
        this.init();
    }

    async init() {
        try {
            console.log('🏦 Initializing Client Consultation App...');
            
            // Check for API configuration
            if (!window.ENV || !window.ENV.GCP_API_KEY) {
                this.showError('⚠️ Configuration Error: GCP API key not found. Please check your .env file and rebuild.');
                return;
            }

            // Initialize agents
            this.clientAgent = new ClientAgent(window.ENV.GCP_API_KEY);
            this.mentorAgent = new ClientAgent(window.ENV.GCP_API_KEY); // Reuse for mentor responses
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize UI state
            this.updateRequirementSliders();
            this.updatePhaseUI();
            
            console.log('✅ Client Consultation App initialized successfully');
            
        } catch (error) {
            console.error('Error initializing Client Consultation App:', error);
            this.showError('Failed to initialize the consultation platform. Please refresh and try again.');
        }
    }

    setupEventListeners() {
        // Client chat input
        const clientTextInput = document.getElementById('clientTextInput');
        const sendClientBtn = document.getElementById('sendClientBtn');
        
        sendClientBtn.addEventListener('click', () => this.sendClientMessage());
        
        clientTextInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendClientMessage();
            }
        });

        // Requirements sliders
        const budgetSlider = document.getElementById('budgetSlider');
        const slaSlider = document.getElementById('slaSlider');
        const liabilitySlider = document.getElementById('liabilitySlider');
        const paymentSelect = document.getElementById('paymentSelect');

        budgetSlider.addEventListener('input', () => this.updateBudgetValue());
        slaSlider.addEventListener('input', () => this.updateSLAValue());
        liabilitySlider.addEventListener('input', () => this.updateLiabilityValue());
        paymentSelect.addEventListener('change', () => this.updatePaymentTerms());

        // Proceed button
        const proceedBtn = document.getElementById('proceedToNegotiation');
        proceedBtn.addEventListener('click', () => this.proceedToNegotiation());

        // Mentor chat input
        const mentorInput = document.getElementById('mentorInput');
        mentorInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.askMentor();
            }
        });
    }

    async sendClientMessage() {
        const textInput = document.getElementById('clientTextInput');
        const message = textInput.value.trim();
        
        if (!message) return;
        
        // Clear input
        textInput.value = '';
        
        // Add user message to chat
        this.addUserMessage(message);
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Get response from client agent
            const response = await this.clientAgent.generateResponse(message);
            
            // Remove typing indicator
            this.removeTypingIndicator();
            
            // Add client response
            this.addClientMessage(response.message);
            
            // Update UI state based on client response
            this.updateUIFromClientState(response);
            
        } catch (error) {
            console.error('Error getting client response:', error);
            this.removeTypingIndicator();
            this.addClientMessage("I'm sorry, I'm having some technical difficulties. Could you please repeat your question?");
        }
        
        // Scroll to bottom
        this.scrollToBottom();
    }

    addUserMessage(message) {
        const content = document.getElementById('consultationContent');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">YA</div>
            <div class="message-content">
                <div class="message-sender">You - Junior Associate</div>
                <div class="message-text">${this.escapeHtml(message)}</div>
            </div>
        `;
        
        content.appendChild(messageDiv);
    }

    addClientMessage(message) {
        const content = document.getElementById('consultationContent');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message client';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">MT</div>
            <div class="message-content">
                <div class="message-sender">Marcus Thompson - GlobalBank CTO</div>
                <div class="message-text">${this.escapeHtml(message)}</div>
            </div>
        `;
        
        content.appendChild(messageDiv);
    }

    showTypingIndicator() {
        const content = document.getElementById('consultationContent');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message client typing-indicator';
        typingDiv.id = 'typingIndicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">MT</div>
            <div class="message-content">
                <div class="message-sender">Marcus Thompson - GlobalBank CTO</div>
                <div class="message-text">
                    <em>Marcus is thinking...</em>
                </div>
            </div>
        `;
        
        content.appendChild(typingDiv);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    updateUIFromClientState(response) {
        if (response.clientState) {
            this.currentPhase = response.clientState.phase;
            this.updatePhaseUI();
        }
        
        if (response.nextSteps) {
            this.updateNextSteps(response.nextSteps);
        }
        
        if (response.readyForNegotiation) {
            this.isReady = true;
            this.enableProceedButton();
        }
    }

    updatePhaseUI() {
        // Update phase indicators
        const phases = ['discovery', 'clarification', 'finalization'];
        
        phases.forEach(phase => {
            const element = document.getElementById(`${phase}Phase`);
            if (element) {
                element.className = 'phase-item';
                
                if (phase === this.currentPhase) {
                    element.classList.add('active');
                } else if (phases.indexOf(phase) < phases.indexOf(this.currentPhase)) {
                    element.classList.add('completed');
                }
            }
        });

        // Update current phase text
        const phaseTexts = {
            discovery: "Discovery Phase: Understanding client's basic requirements",
            clarification: "Clarification Phase: Exploring priorities and constraints", 
            finalization: "Finalization Phase: Ready to prepare for negotiation"
        };
        
        const phaseTextElement = document.getElementById('currentPhaseText');
        if (phaseTextElement) {
            phaseTextElement.textContent = phaseTexts[this.currentPhase] || phaseTexts.discovery;
        }
    }

    updateNextSteps(nextSteps) {
        const container = document.getElementById('nextStepsContainer');
        if (container && nextSteps.nextActions) {
            container.innerHTML = '';
            
            nextSteps.nextActions.forEach(action => {
                const stepDiv = document.createElement('div');
                stepDiv.className = 'next-step-item';
                stepDiv.innerHTML = `<div class="next-step-text">${this.escapeHtml(action)}</div>`;
                container.appendChild(stepDiv);
            });
        }
    }

    updateRequirementSliders() {
        this.updateBudgetValue();
        this.updateSLAValue();
        this.updateLiabilityValue();
    }

    updateBudgetValue() {
        const slider = document.getElementById('budgetSlider');
        const display = document.getElementById('budgetValue');
        if (slider && display) {
            display.textContent = `£${slider.value}M`;
            this.updateClientRequirements();
        }
    }

    updateSLAValue() {
        const slider = document.getElementById('slaSlider');
        const display = document.getElementById('slaValue');
        if (slider && display) {
            display.textContent = `${parseFloat(slider.value).toFixed(2)}%`;
            this.updateClientRequirements();
        }
    }

    updateLiabilityValue() {
        const slider = document.getElementById('liabilitySlider');
        const display = document.getElementById('liabilityValue');
        if (slider && display) {
            display.textContent = `£${slider.value}M`;
            this.updateClientRequirements();
        }
    }

    updatePaymentTerms() {
        this.updateClientRequirements();
    }

    updateClientRequirements() {
        if (!this.clientAgent) return;
        
        const budgetSlider = document.getElementById('budgetSlider');
        const slaSlider = document.getElementById('slaSlider');
        const liabilitySlider = document.getElementById('liabilitySlider');
        const paymentSelect = document.getElementById('paymentSelect');
        
        const newRequirements = {
            financial: {
                budget: {
                    preferred: `£${budgetSlider.value}M`,
                    maximum: `£${Math.min(parseInt(budgetSlider.value) + 10, 70)}M`,
                    hardLimit: `£${Math.min(parseInt(budgetSlider.value) + 15, 75)}M`
                },
                paymentTerms: {
                    preferred: paymentSelect.value + " payments"
                }
            },
            technical: {
                sla: {
                    minimum: `${Math.max(parseFloat(slaSlider.value) - 0.05, 99.0).toFixed(2)}%`,
                    preferred: `${slaSlider.value}%`
                }
            },
            legal: {
                liability: {
                    minimumCap: `£${liabilitySlider.value}M`,
                    preferred: `£${Math.min(parseInt(liabilitySlider.value) + 25, 100)}M`
                }
            }
        };
        
        // Update client agent requirements
        this.clientAgent.updateRequirements(newRequirements);
    }

    async askMentor() {
        const input = document.getElementById('mentorInput');
        const question = input.value.trim();
        
        if (!question) return;
        
        input.value = '';
        
        // Add user question to mentor chat
        this.addMentorMessage(`<strong>You:</strong> ${this.escapeHtml(question)}`);
        
        try {
            // Generate mentor response
            const mentorPrompt = `You are an experienced legal mentor helping a junior associate with client consultation. The junior associate is working with a client (Marcus Thompson, CTO of GlobalBank) to understand requirements for a cloud technology services agreement.

Current consultation phase: ${this.currentPhase}

Junior associate's question: "${question}"

Provide practical advice in 1-2 sentences. Focus on:
- Effective questioning techniques
- Legal risk identification
- Business understanding
- Negotiation preparation

Be supportive and educational.`;

            const response = await this.callGeminiForMentor(mentorPrompt);
            this.addMentorMessage(`<strong>AI Mentor:</strong> ${response}`);
            
        } catch (error) {
            console.error('Error getting mentor response:', error);
            this.addMentorMessage('<strong>AI Mentor:</strong> I apologize, I\'m having technical difficulties. Please try again.');
        }
    }

    async callGeminiForMentor(prompt) {
        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.9,
                maxOutputTokens: 150,
            }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${window.ENV.GCP_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Mentor API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text.trim();
        } else {
            throw new Error('No response generated from Mentor API');
        }
    }

    addMentorMessage(message) {
        const content = document.getElementById('mentorContent');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'mentor-message';
        messageDiv.innerHTML = message;
        content.appendChild(messageDiv);
        
        // Scroll mentor chat to bottom
        content.scrollTop = content.scrollHeight;
    }

    enableProceedButton() {
        const button = document.getElementById('proceedToNegotiation');
        const navButton = document.getElementById('proceedBtn');
        
        if (button) {
            button.disabled = false;
            button.textContent = 'Ready! Proceed to Negotiation →';
        }
        
        if (navButton) {
            navButton.classList.remove('disabled');
        }
    }

    proceedToNegotiation() {
        if (this.isReady) {
            // Store client requirements in localStorage for the negotiation phase
            const requirementsData = {
                clientRequirements: this.clientAgent.clientRequirements,
                conversationHistory: this.clientAgent.conversationHistory,
                phase: this.currentPhase,
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem('clientConsultationData', JSON.stringify(requirementsData));
            
            // Navigate to negotiation
            window.location.href = 'negotiations.html';
        }
    }

    scrollToBottom() {
        const content = document.getElementById('consultationContent');
        content.scrollTop = content.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showError(message) {
        console.error(message);
        // You could add a toast notification or modal here
        const content = document.getElementById('consultationContent');
        if (content) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'message system';
            errorDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-text" style="background: #fee; border-left: 4px solid #f44; color: #800;">
                        ${this.escapeHtml(message)}
                    </div>
                </div>
            `;
            content.appendChild(errorDiv);
        }
    }
}

// Global function for mentor chat (called from HTML)
window.askMentor = function() {
    if (window.clientConsultationApp) {
        window.clientConsultationApp.askMentor();
    }
}; 