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
        this.clientContext = null; // Will be populated from client consultation
    }

    // Method to update Sarah Chen's knowledge of client requirements
    updateClientContext(clientRequirements) {
        this.clientContext = clientRequirements;
        console.log('🔄 Sarah Chen updated with client requirements:', clientRequirements);
        
        // Reset some negotiation state to adjust strategy based on client context
        if (clientRequirements.financial?.budget) {
            this.negotiationState.clientBudgetRange = clientRequirements.financial.budget;
        }
        if (clientRequirements.technical?.sla) {
            this.negotiationState.clientSLARequirements = clientRequirements.technical.sla;
        }
        if (clientRequirements.legal?.liability) {
            this.negotiationState.clientLiabilityExpectations = clientRequirements.legal.liability;
        }
        if (clientRequirements.technical?.dataResidency) {
            this.negotiationState.clientDataRequirements = clientRequirements.technical.dataResidency;
        }
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

            // Check if we should use demo mode
            if (!this.apiKey || this.apiKey.length < 10) {
                console.log('🎭 Using demo mode for negotiation agent');
                const demoResponse = this.generateDemoResponse(userMessage);
                
                // Add demo response to history
                this.conversationHistory.push({
                    speaker: 'agent',
                    message: demoResponse,
                    timestamp: new Date(),
                    type: 'text'
                });

                return {
                    message: demoResponse,
                    agentState: this.negotiationState,
                    suggestedTopics: this.getSuggestedTopics(),
                    negotiationProgress: this.calculateProgress()
                };
            }

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
            // Fall back to demo mode on API error
            const demoResponse = this.generateDemoResponse(userMessage);
            return {
                message: demoResponse,
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

${this.clientContext ? `
CLIENT'S REQUIREMENTS (from their lawyer's consultation):
- Budget: ${this.clientContext.financial?.budget?.preferred || 'Not specified'} (max: ${this.clientContext.financial?.budget?.maximum || 'Not specified'})
- SLA: Minimum ${this.clientContext.technical?.sla?.minimum || 'Not specified'}, preferred ${this.clientContext.technical?.sla?.preferred || 'Not specified'}
- Liability Cap: Minimum ${this.clientContext.legal?.liability?.minimumCap || 'Not specified'}
- Data Residency: ${this.clientContext.technical?.dataResidency?.requirement || 'EU only'} (${this.clientContext.technical?.dataResidency?.flexibility || 'no flexibility'})
- Payment Terms: Prefer ${this.clientContext.financial?.paymentTerms?.preferred || 'quarterly payments'}
- Key Priorities: ${this.clientContext.priorities?.map(p => `${p.item} (${p.importance})`).join(', ') || 'Data security, Service availability, Cost control'}

NOTE: You know these requirements because you're negotiating with their legal team. Adjust your strategy accordingly - be more flexible where they have flexibility, firm where they have hard requirements.
` : ''}

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

    generateDemoResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Money/budget related responses
        if (message.includes('money') || message.includes('cost') || message.includes('budget') || message.includes('price') || message.includes('payment')) {
            const budgetResponses = [
                "I understand budget is a key consideration. For a contract of this scope, we're looking at £50M over 3 years, which breaks down to approximately £16.7M annually. This includes our premium cloud infrastructure, 24/7 support, and full GDPR compliance. Given the scale and complexity of GlobalBank's requirements, this represents strong value. What specific budget parameters are you working within?",
                "Regarding costs, our standard pricing for enterprise clients like GlobalBank is structured around usage tiers and service levels. The base cost is £45M over 3 years, but with your enhanced SLA requirements and data residency needs, we're at £50M total. We can discuss payment terms - would quarterly payments work better than annual?",
                "Budget discussions are always important. Our proposal is £50M over the 3-year term, which covers all infrastructure, compliance, and support costs. However, I'm authorized to discuss volume discounts if GlobalBank can commit to additional services or extend the contract term. What's your target budget range?",
                "The financial terms we're proposing reflect the premium nature of our services. At £50M over 3 years, this includes disaster recovery, full EU data residency, and dedicated account management. I understand this is a significant investment, but given the regulatory requirements in financial services, the compliance value alone justifies the premium. Are there specific cost components you'd like to break down?"
            ];
            return budgetResponses[Math.floor(Math.random() * budgetResponses.length)];
        }
        
        // SLA related responses
        if (message.includes('sla') || message.includes('uptime') || message.includes('availability') || message.includes('service level')) {
            const slaResponses = [
                "Our standard SLA offers 99.5% uptime with monthly service credits for any shortfall. However, I understand GlobalBank requires higher availability. We can commit to 99.7% uptime, but this would require additional redundancy infrastructure. The cost impact would be approximately £3M over the contract term. Would this meet your requirements?",
                "For service levels, we typically guarantee 99.5% availability, but I recognize that financial services have stricter requirements. We can offer 99.8% uptime with our premium tier, including dedicated infrastructure and priority support. This would require adjusting our commercial terms. What's your minimum acceptable uptime requirement?",
                "Service level agreements are critical for your operations. Our enhanced SLA includes 99.7% uptime, 4-hour response times for critical issues, and dedicated technical account management. The service credits would be calculated monthly and applied automatically. Would you prefer quarterly or annual SLA reporting?"
            ];
            return slaResponses[Math.floor(Math.random() * slaResponses.length)];
        }
        
        // Liability related responses
        if (message.includes('liability') || message.includes('insurance') || message.includes('damages') || message.includes('indemnity')) {
            const liabilityResponses = [
                "Liability caps are always a key negotiation point. Our standard position is £25M annual liability cap, excluding indirect damages. However, given GlobalBank's scale, I can discuss increasing this to £35M annually, provided we maintain our standard exclusions for consequential damages and data breach scenarios where we're not at fault.",
                "For liability terms, we typically cap at £25M per incident with standard exclusions. I understand financial institutions often require higher coverage. We could consider £40M annual aggregate, but we'd need to maintain exclusions for indirect damages and require proof of your own cyber insurance coverage.",
                "Our liability framework is designed to be fair to both parties. The £25M cap covers direct damages from service failures. For a client of GlobalBank's importance, I could propose £35M with quarterly reviews. We'd need to exclude liability for data breaches caused by your internal security failures though."
            ];
            return liabilityResponses[Math.floor(Math.random() * liabilityResponses.length)];
        }
        
        // Data privacy/residency responses
        if (message.includes('data') || message.includes('privacy') || message.includes('gdpr') || message.includes('residency')) {
            const dataResponses = [
                "Data residency is absolutely critical for financial services. Our standard offering includes primary EU data centers with disaster recovery flexibility. For GlobalBank, we can commit to strict EU-only processing with no exceptions, but this would require additional infrastructure investment of approximately £2M over the contract term.",
                "GDPR compliance is built into our core platform. All data processing occurs within EU boundaries, with full audit trails and automated data subject request handling. We can provide additional guarantees around data location if needed, though this may impact our disaster recovery capabilities.",
                "Data protection is a cornerstone of our service. We offer comprehensive GDPR compliance, including data processing agreements, regular compliance audits, and dedicated data protection officers. For enhanced data residency guarantees, we'd need to discuss additional costs and any impact on service resilience."
            ];
            return dataResponses[Math.floor(Math.random() * dataResponses.length)];
        }
        
        // IP related responses
        if (message.includes('ip') || message.includes('intellectual property') || message.includes('licensing') || message.includes('ownership')) {
            const ipResponses = [
                "Intellectual property terms are straightforward in our standard agreement. GlobalBank retains full ownership of your data and any configurations you create. CloudTech retains ownership of our platform IP and any general improvements we make. We're open to discussing specific licensing terms for any custom development work.",
                "IP ownership is clearly delineated - you own your data and business logic, we own our platform technology. Any custom integrations developed specifically for GlobalBank would be jointly owned, with GlobalBank having unlimited usage rights. Are there specific IP concerns you'd like to address?",
                "Our IP framework protects both parties' interests. GlobalBank maintains full rights to your data and business processes, while CloudTech retains our platform IP. For any bespoke development, we typically grant perpetual usage licenses to the client while retaining the ability to create similar solutions for other clients."
            ];
            return ipResponses[Math.floor(Math.random() * ipResponses.length)];
        }
        
        // Exit/termination responses
        if (message.includes('exit') || message.includes('termination') || message.includes('migration') || message.includes('transition')) {
            const exitResponses = [
                "Exit provisions are important for both parties. Our standard terms include 12 months' notice for termination, with comprehensive data migration support included at no additional cost. We provide data in standard formats and 90 days of transition support. Would you prefer shorter notice periods?",
                "For contract termination, we offer flexible exit terms including data portability guarantees and transition assistance. The 12-month notice period allows for proper planning, but we can discuss shorter terms for specific circumstances. All data migration is included in our standard service.",
                "Termination clauses are designed to be fair and practical. We provide comprehensive exit support including data extraction, format conversion, and 60 days of parallel running if needed. The notice period ensures continuity of service during transition. Are there specific exit scenarios you're concerned about?"
            ];
            return exitResponses[Math.floor(Math.random() * exitResponses.length)];
        }
        
        // General/greeting responses
        if (message.includes('hello') || message.includes('hi') || message.includes('start') || message.length < 20) {
            return "Good morning. I'm Sarah Chen, Senior Legal Counsel at CloudTech Solutions. I'm here to discuss the cloud services agreement for GlobalBank International. I have the draft contract terms ready for review. Shall we begin with service level agreements, or would you prefer to start with another aspect of the contract?";
        }
        
        // Agreement/positive responses
        if (message.includes('agree') || message.includes('acceptable') || message.includes('yes') || message.includes('good') || message.includes('ok')) {
            const agreementResponses = [
                "Excellent, I'm glad we can find common ground on this point. Let me document this agreement and we can move on to the next item. What aspect of the contract would you like to address next?",
                "That's great progress. I'll make note of our agreement on this term. To keep momentum going, shall we tackle the liability provisions next, or would you prefer to discuss data residency requirements?",
                "Perfect, I'm pleased we could reach agreement on this issue. I'll have our legal team draft the specific language. What other contract terms are priorities for GlobalBank?"
            ];
            return agreementResponses[Math.floor(Math.random() * agreementResponses.length)];
        }
        
        // Default response for other topics
        const defaultResponses = [
            "That's an interesting point. Could you elaborate on GlobalBank's specific requirements in this area? I want to make sure we address all your concerns comprehensively.",
            "I understand your position. Let me consider how we can accommodate this within our standard framework. What flexibility do you have on your side?",
            "Thank you for raising that issue. It's important we get the details right. Could you walk me through GlobalBank's specific needs and any regulatory requirements we need to consider?",
            "I appreciate you bringing this up. Let me think about how we can structure this to work for both parties. What would be your ideal outcome on this point?"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
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