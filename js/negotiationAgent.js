class NegotiationAgent {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
        
        // Agent profile and company information
        this.agentProfile = {
            name: "Sarah Chen",
            title: "Senior Legal Counsel",
            company: "CloudTech Solutions",
            experience: "12 years in technology law",
            specialty: "Cloud services agreements and data privacy"
        };

        // Negotiation state tracking
        this.negotiationState = {
            currentTopic: "Service Level Agreements",
            topicsDiscussed: [],
            concessionsMade: {},
            clientPositions: {},
            agentPositions: {
                sla: { uptime: "99.5%", credits: "monthly service credits" },
                liability: { cap: "£25M", exclusions: "indirect damages" },
                dataResidency: { primary: "EU", flexibility: "disaster recovery" },
                ip: { license: "limited use", ownership: "CloudTech retains" },
                payment: { terms: "monthly", advance: "quarterly" }
            },
            redLines: ["data ownership", "unlimited liability", "free termination"],
            mood: "professional", // professional, cautious, accommodating, firm
            relationshipBuilding: 0.7 // 0-1 scale of rapport
        };

        // Contract negotiation context
        this.contractContext = {
            dealType: "Cloud Technology Services Agreement",
            clientCompany: "GlobalBank International",
            dealValue: "£50M over 3 years",
            startDate: "Q2 2024",
            criticalRequirements: ["GDPR compliance", "financial regulations", "24/7 support"]
        };

        this.conversationHistory = [];
    }

    async generateResponse(userMessage, messageType = 'text') {
        try {
            // Add user message to history
            this.conversationHistory.push({
                speaker: 'client',
                message: userMessage,
                timestamp: new Date(),
                type: messageType
            });

            // Analyze user input and update negotiation state
            this.analyzeUserInput(userMessage);

            // Generate contextual response using Gemini
            const prompt = this.buildNegotiationPrompt(userMessage);
            const response = await this.callGeminiAPI(prompt);
            
            // Add agent response to history
            this.conversationHistory.push({
                speaker: 'agent',
                message: response,
                timestamp: new Date(),
                type: 'text'
            });

            return {
                message: response,
                agentState: this.negotiationState,
                suggestedTopics: this.getSuggestedTopics(),
                negotiationProgress: this.calculateProgress()
            };

        } catch (error) {
            console.error('Error generating agent response:', error);
            return {
                message: "I apologize, but I'm having technical difficulties. Could you please repeat your last point?",
                error: error.message
            };
        }
    }

    buildNegotiationPrompt(userMessage) {
        const recentHistory = this.conversationHistory.slice(-6); // Last 3 exchanges
        
        return `You are ${this.agentProfile.name}, ${this.agentProfile.title} at ${this.agentProfile.company}. You are negotiating a ${this.contractContext.dealType} with ${this.contractContext.clientCompany}.

AGENT PROFILE:
- Experience: ${this.agentProfile.experience}
- Specialty: ${this.agentProfile.specialty}
- Negotiation style: Professional, knowledgeable, strategic

DEAL CONTEXT:
- Contract: ${this.contractContext.dealType}
- Client: ${this.contractContext.clientCompany} (major international bank)
- Value: ${this.contractContext.dealValue}
- Critical requirements: ${this.contractContext.criticalRequirements.join(', ')}

CURRENT NEGOTIATION STATE:
- Current topic: ${this.negotiationState.currentTopic}
- Topics already discussed: ${this.negotiationState.topicsDiscussed.join(', ')}
- Your company's positions:
  * SLA: ${this.negotiationState.agentPositions.sla.uptime} uptime with ${this.negotiationState.agentPositions.sla.credits}
  * Liability: Capped at ${this.negotiationState.agentPositions.liability.cap}, excluding ${this.negotiationState.agentPositions.liability.exclusions}
  * Data: Primary ${this.negotiationState.agentPositions.dataResidency.primary} residency, ${this.negotiationState.agentPositions.dataResidency.flexibility} exceptions
  * IP: ${this.negotiationState.agentPositions.ip.license}, ${this.negotiationState.agentPositions.ip.ownership}
  * Payment: ${this.negotiationState.agentPositions.payment.terms} payments, ${this.negotiationState.agentPositions.payment.advance} billing

RED LINES (non-negotiable): ${this.negotiationState.redLines.join(', ')}

CONVERSATION HISTORY:
${recentHistory.map(msg => `${msg.speaker}: ${msg.message}`).join('\n')}

CLIENT'S LATEST MESSAGE: "${userMessage}"

INSTRUCTIONS:
1. Respond as an experienced legal counsel would in a real negotiation
2. Show expertise in cloud services law and data protection
3. Ask clarifying questions when appropriate
4. Make strategic concessions on smaller points to gain ground on important ones
5. Reference business constraints realistically ("I need to check with our technical team")
6. Build rapport while protecting your company's interests
7. Keep responses focused and professional (50-150 words)
8. If they make a good point, acknowledge it before presenting alternatives
9. Guide the conversation naturally through different contract terms
10. Show flexibility where possible while maintaining firm positions on red lines

Your response should sound like a real lawyer in a negotiation, not an AI assistant.`;
    }

    async callGeminiAPI(prompt) {
        console.log('🤖 Calling Gemini API with prompt length:', prompt.length);
        console.log('🔑 API Key available:', !!this.apiKey, 'Length:', this.apiKey.length);
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.8,
                maxOutputTokens: 200,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        console.log('📤 Request URL:', `${this.baseURL}?key=${this.apiKey.substring(0, 10)}...`);
        console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));

        const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        console.log('📥 Response status:', response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error Response:', errorText);
            throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('📥 Response data:', data);
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const responseText = data.candidates[0].content.parts[0].text.trim();
            console.log('✅ Generated response:', responseText);
            return responseText;
        } else {
            console.error('❌ No valid response in data:', data);
            throw new Error('No response generated from Gemini API');
        }
    }

    analyzeUserInput(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Topic detection
        if (message.includes('sla') || message.includes('uptime') || message.includes('service level')) {
            this.negotiationState.currentTopic = "Service Level Agreements";
        } else if (message.includes('liability') || message.includes('damages') || message.includes('insurance')) {
            this.negotiationState.currentTopic = "Liability Terms";
        } else if (message.includes('data') || message.includes('gdpr') || message.includes('residency')) {
            this.negotiationState.currentTopic = "Data Protection & Residency";
        } else if (message.includes('ip') || message.includes('intellectual property') || message.includes('licensing')) {
            this.negotiationState.currentTopic = "Intellectual Property";
        } else if (message.includes('payment') || message.includes('billing') || message.includes('invoice')) {
            this.negotiationState.currentTopic = "Payment Terms";
        }

        // Track topics discussed
        if (!this.negotiationState.topicsDiscussed.includes(this.negotiationState.currentTopic)) {
            this.negotiationState.topicsDiscussed.push(this.negotiationState.currentTopic);
        }

        // Detect client positions and demands
        if (message.includes('99.9') || message.includes('four nines')) {
            this.negotiationState.clientPositions.sla = "99.9% uptime required";
        }
        if (message.includes('50m') || message.includes('fifty million')) {
            this.negotiationState.clientPositions.liability = "£50M liability cap requested";
        }
        if (message.includes('eu only') || message.includes('no exceptions')) {
            this.negotiationState.clientPositions.dataResidency = "Strict EU residency";
        }

        // Assess mood and tone
        if (message.includes('must') || message.includes('require') || message.includes('non-negotiable')) {
            this.negotiationState.mood = "firm";
        } else if (message.includes('understand') || message.includes('appreciate') || message.includes('flexible')) {
            this.negotiationState.mood = "accommodating";
        } else if (message.includes('concern') || message.includes('risk') || message.includes('compliance')) {
            this.negotiationState.mood = "cautious";
        }
    }

    getSuggestedTopics() {
        const allTopics = [
            "Service Level Agreements",
            "Liability Terms", 
            "Data Protection & Residency",
            "Intellectual Property",
            "Payment Terms"
        ];
        
        return allTopics.filter(topic => !this.negotiationState.topicsDiscussed.includes(topic));
    }

    calculateProgress() {
        const totalTopics = 5;
        const discussedTopics = this.negotiationState.topicsDiscussed.length;
        const progress = (discussedTopics / totalTopics) * 100;
        
        return {
            percentage: Math.round(progress),
            topicsCompleted: discussedTopics,
            totalTopics: totalTopics,
            currentPhase: progress < 25 ? "Opening" : 
                         progress < 50 ? "Exploration" :
                         progress < 75 ? "Bargaining" : "Closing"
        };
    }

    // Strategic concession logic
    makeStrategicConcession(topic) {
        const concessions = {
            "Service Level Agreements": {
                from: "99.5% uptime",
                to: "99.7% uptime with performance credits",
                condition: "if client accepts our liability terms"
            },
            "Liability Terms": {
                from: "£25M cap",
                to: "£35M cap",
                condition: "excluding indirect damages and with insurance verification"
            },
            "Data Protection & Residency": {
                from: "EU primary with DR flexibility",
                to: "Strict EU residency",
                condition: "with additional infrastructure costs"
            }
        };

        return concessions[topic] || null;
    }

    // Reset negotiation for new session
    resetNegotiation() {
        this.negotiationState.topicsDiscussed = [];
        this.negotiationState.concessionsMade = {};
        this.negotiationState.clientPositions = {};
        this.negotiationState.currentTopic = "Service Level Agreements";
        this.negotiationState.mood = "professional";
        this.negotiationState.relationshipBuilding = 0.7;
        this.conversationHistory = [];
    }

    // Get agent insights for learning purposes
    getAgentInsights() {
        return {
            negotiationStrategy: "Collaborative problem-solving with strategic concessions",
            keyTechniques: [
                "Active listening and acknowledgment",
                "Asking clarifying questions",
                "Bundling concessions with conditions",
                "Building rapport while protecting interests",
                "Using business constraints to justify positions"
            ],
            currentStrategy: `Focusing on ${this.negotiationState.currentTopic} while building toward overall agreement`,
            learningPoints: [
                "Notice how the agent balances firmness with flexibility",
                "Observe strategic question-asking to understand client needs",
                "See how business constraints are used to justify positions"
            ]
        };
    }

    // Debug method to test API connection
    async testAPIConnection() {
        console.log('🔍 Testing Gemini API connection...');
        console.log('🔑 API Key:', this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'NOT SET');
        console.log('🌐 Base URL:', this.baseURL);
        
        const testPrompt = "Hello, please respond with 'API test successful'";
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: testPrompt
                }]
            }],
            generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 50,
            }
        };

        try {
            console.log('📤 Test request:', JSON.stringify(requestBody, null, 2));
            
            const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            console.log('📥 Test response status:', response.status, response.statusText);
            console.log('📥 Test response headers:', [...response.headers.entries()]);

            const responseText = await response.text();
            console.log('📥 Raw response text:', responseText);

            if (!response.ok) {
                console.error('❌ API Error Details:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: responseText
                });
                return {
                    success: false,
                    error: `HTTP ${response.status}: ${responseText}`,
                    details: {
                        status: response.status,
                        statusText: response.statusText,
                        body: responseText
                    }
                };
            }

            const data = JSON.parse(responseText);
            console.log('📥 Parsed response data:', data);
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                console.log('✅ API test successful!');
                return {
                    success: true,
                    response: data.candidates[0].content.parts[0].text.trim(),
                    message: 'API connection working correctly'
                };
            } else {
                console.error('❌ Unexpected response format:', data);
                return {
                    success: false,
                    error: 'Unexpected response format',
                    details: data
                };
            }

        } catch (error) {
            console.error('❌ API test failed:', error);
            return {
                success: false,
                error: error.message,
                details: error
            };
        }
    }
} 