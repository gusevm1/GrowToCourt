class ClientAgent {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
        
        // Client profile - the user's client
        this.clientProfile = {
            name: "Marcus Thompson",
            title: "Chief Technology Officer",
            company: "GlobalBank International",
            experience: "15 years in financial technology",
            background: "Former investment banker, now leading digital transformation",
            personality: "Detail-oriented, risk-averse, but ambitious about innovation"
        };

        // Initial client requirements (customizable)
        this.clientRequirements = {
            project: {
                type: "Cloud Technology Services Agreement",
                scope: "Core banking infrastructure migration to cloud",
                timeline: "18-month implementation",
                criticalSuccess: "Zero downtime during migration"
            },
            financial: {
                budget: {
                    preferred: "£45M",
                    maximum: "£55M",
                    hardLimit: "£60M"
                },
                paymentTerms: {
                    preferred: "quarterly payments",
                    acceptable: "monthly payments",
                    redLine: "no upfront annual payments"
                }
            },
            technical: {
                sla: {
                    minimum: "99.9%",
                    preferred: "99.95%",
                    businessJustification: "Regulatory compliance requires high availability"
                },
                dataResidency: {
                    requirement: "EU only",
                    flexibility: "none",
                    reason: "GDPR and financial regulations"
                },
                security: {
                    requirements: ["SOC 2 Type II", "ISO 27001", "PCI DSS"],
                    audits: "quarterly third-party audits required"
                }
            },
            legal: {
                liability: {
                    minimumCap: "£50M",
                    preferred: "unlimited for data breaches",
                    businessReason: "Regulatory fines can exceed £50M"
                },
                ip: {
                    ownership: "GlobalBank retains all data ownership",
                    licensing: "limited use only for CloudTech"
                },
                termination: {
                    notice: "6 months minimum",
                    dataReturn: "30 days for complete data return"
                }
            },
            priorities: [
                { item: "Data security and compliance", importance: "critical", flexibility: "none" },
                { item: "Service availability", importance: "critical", flexibility: "limited" },
                { item: "Cost control", importance: "high", flexibility: "moderate" },
                { item: "Implementation speed", importance: "medium", flexibility: "high" }
            ]
        };

        // Conversation state
        this.conversationState = {
            phase: "discovery", // discovery, clarification, finalization
            topicsDiscussed: [],
            questionsAsked: [],
            clarificationsNeeded: [],
            clientConcerns: [],
            finalizedRequirements: {}
        };

        this.conversationHistory = [];
    }

    async generateResponse(userMessage, messageType = 'text') {
        try {
            // Add user message to history
            this.conversationHistory.push({
                speaker: 'lawyer',
                message: userMessage,
                timestamp: new Date(),
                type: messageType
            });

            // Analyze user input and update conversation state
            this.analyzeUserInput(userMessage);

            // Generate contextual response using Gemini
            const prompt = this.buildClientPrompt(userMessage);
            const response = await this.callGeminiAPI(prompt);
            
            // Add client response to history
            this.conversationHistory.push({
                speaker: 'client',
                message: response,
                timestamp: new Date(),
                type: 'text'
            });

            return {
                message: response,
                clientState: this.conversationState,
                requirements: this.clientRequirements,
                nextSteps: this.getNextSteps(),
                readyForNegotiation: this.isReadyForNegotiation()
            };

        } catch (error) {
            console.error('Error generating client response:', error);
            return {
                message: "I apologize, I'm having some technical difficulties. Could you please repeat your question about our requirements?",
                error: error.message
            };
        }
    }

    buildClientPrompt(userMessage) {
        const recentHistory = this.conversationHistory.slice(-6);
        
        return `You are ${this.clientProfile.name}, ${this.clientProfile.title} at ${this.clientProfile.company}. You are working with a junior lawyer to define requirements for a major cloud technology services agreement.

CLIENT PROFILE:
- Name: ${this.clientProfile.name}
- Title: ${this.clientProfile.title}
- Company: ${this.clientProfile.company}
- Background: ${this.clientProfile.background}
- Personality: ${this.clientProfile.personality}

PROJECT CONTEXT:
- Project: ${this.clientRequirements.project.type}
- Scope: ${this.clientRequirements.project.scope}
- Timeline: ${this.clientRequirements.project.timeline}
- Budget Range: ${this.clientRequirements.financial.budget.preferred} - ${this.clientRequirements.financial.budget.maximum}

YOUR REQUIREMENTS AND CONCERNS:
Financial:
- Budget: Prefer ${this.clientRequirements.financial.budget.preferred}, max ${this.clientRequirements.financial.budget.maximum}
- Payment: Prefer ${this.clientRequirements.financial.paymentTerms.preferred}

Technical:
- SLA: Need minimum ${this.clientRequirements.technical.sla.minimum}, prefer ${this.clientRequirements.technical.sla.preferred}
- Data: Must stay in ${this.clientRequirements.technical.dataResidency.requirement}
- Security: Require ${this.clientRequirements.technical.security.requirements.join(', ')}

Legal:
- Liability: Need minimum ${this.clientRequirements.legal.liability.minimumCap} cap
- Data ownership: ${this.clientRequirements.legal.ip.ownership}

CONVERSATION STATE:
- Current phase: ${this.conversationState.phase}
- Topics discussed: ${this.conversationState.topicsDiscussed.join(', ')}
- Outstanding concerns: ${this.conversationState.clientConcerns.join(', ')}

CONVERSATION HISTORY:
${recentHistory.map(msg => `${msg.speaker}: ${msg.message}`).join('\n')}

LAWYER'S LATEST MESSAGE: "${userMessage}"

INSTRUCTIONS:
1. Respond as a senior executive who knows their business needs but needs legal guidance
2. Be specific about business requirements and constraints
3. Ask clarifying questions about legal implications
4. Express concerns about risks to the business
5. Share context about why certain terms are important to GlobalBank
6. Be collaborative but firm on critical requirements
7. Show appreciation for the lawyer's expertise
8. Keep responses focused and business-oriented (75-150 words)
9. If asked about flexible areas, be honest about what can be negotiated
10. Express urgency appropriately - this is a major strategic project

Your response should sound like a real C-level executive working with their legal team, not an AI assistant.`;
    }

    async callGeminiAPI(prompt) {
        console.log('🏦 Calling Gemini API for Client Agent');
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.8,
                topK: 40,
                topP: 0.9,
                maxOutputTokens: 250,
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

        const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Client Agent API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text.trim();
        } else {
            throw new Error('No response generated from Client Agent API');
        }
    }

    analyzeUserInput(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Track topics being discussed
        if (message.includes('budget') || message.includes('cost') || message.includes('money')) {
            this.addTopicDiscussed('Financial Terms');
        }
        if (message.includes('sla') || message.includes('uptime') || message.includes('availability')) {
            this.addTopicDiscussed('Service Level Agreements');
        }
        if (message.includes('data') || message.includes('gdpr') || message.includes('security')) {
            this.addTopicDiscussed('Data Security & Compliance');
        }
        if (message.includes('liability') || message.includes('insurance') || message.includes('risk')) {
            this.addTopicDiscussed('Liability & Risk');
        }
        if (message.includes('timeline') || message.includes('schedule') || message.includes('deadline')) {
            this.addTopicDiscussed('Project Timeline');
        }

        // Track questions asked by lawyer
        if (message.includes('?')) {
            this.conversationState.questionsAsked.push(userMessage);
        }

        // Update conversation phase
        this.updateConversationPhase();
    }

    addTopicDiscussed(topic) {
        if (!this.conversationState.topicsDiscussed.includes(topic)) {
            this.conversationState.topicsDiscussed.push(topic);
        }
    }

    updateConversationPhase() {
        const topicsCount = this.conversationState.topicsDiscussed.length;
        const questionsCount = this.conversationState.questionsAsked.length;

        if (topicsCount < 3) {
            this.conversationState.phase = "discovery";
        } else if (topicsCount < 5 || questionsCount < 3) {
            this.conversationState.phase = "clarification";
        } else {
            this.conversationState.phase = "finalization";
        }
    }

    getNextSteps() {
        const allTopics = [
            "Financial Terms",
            "Service Level Agreements", 
            "Data Security & Compliance",
            "Liability & Risk",
            "Project Timeline"
        ];
        
        const remainingTopics = allTopics.filter(topic => 
            !this.conversationState.topicsDiscussed.includes(topic)
        );

        switch (this.conversationState.phase) {
            case "discovery":
                return {
                    phase: "Discovery Phase",
                    description: "Understanding client's basic requirements",
                    nextActions: remainingTopics.length > 0 ? 
                        [`Explore: ${remainingTopics[0]}`, "Ask about business drivers", "Understand constraints"] :
                        ["Move to clarification phase"]
                };
            case "clarification":
                return {
                    phase: "Clarification Phase", 
                    description: "Clarifying priorities and flexibility",
                    nextActions: ["Confirm hard vs soft requirements", "Understand business trade-offs", "Identify deal breakers"]
                };
            case "finalization":
                return {
                    phase: "Finalization Phase",
                    description: "Ready to prepare for negotiation",
                    nextActions: ["Summarize key requirements", "Confirm negotiation strategy", "Proceed to negotiation with counterparty"]
                };
            default:
                return { phase: "Unknown", description: "", nextActions: [] };
        }
    }

    isReadyForNegotiation() {
        return this.conversationState.phase === "finalization" && 
               this.conversationState.topicsDiscussed.length >= 4;
    }

    // Get customizable client requirements for UI
    getCustomizableRequirements() {
        return {
            financial: {
                budget: {
                    min: 35,
                    max: 70,
                    current: 50,
                    unit: "£M"
                },
                paymentTerms: {
                    options: ["monthly", "quarterly", "bi-annual", "annual"],
                    current: "quarterly"
                }
            },
            technical: {
                sla: {
                    min: 99.0,
                    max: 99.99,
                    current: 99.9,
                    unit: "%"
                }
            },
            legal: {
                liabilityCap: {
                    min: 25,
                    max: 100,
                    current: 50,
                    unit: "£M"
                }
            }
        };
    }

    // Update client requirements based on UI customization
    updateRequirements(newRequirements) {
        // Merge new requirements with existing ones
        this.clientRequirements = { ...this.clientRequirements, ...newRequirements };
        
        // Reset conversation state if major changes
        this.conversationState.phase = "discovery";
        this.conversationState.topicsDiscussed = [];
    }
} 