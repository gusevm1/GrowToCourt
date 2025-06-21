class ClientAgent {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';
        
        // Client profile - the user's client
        this.clientProfile = {
            name: "Dr. Rachel Chen",
            title: "Chief Technology Officer",
            company: "QuantumLink AI Ltd",
            experience: "12 years in AI research and startup leadership",
            background: "Former Cambridge AI researcher, now building legal document automation tools",
            personality: "Technically sophisticated, startup-focused, concerned about IP and scalability"
        };

        // Initial client requirements (customizable)
        this.clientRequirements = {
            project: {
                type: "Technology Services Agreement",
                scope: "Cloud infrastructure for AI document automation platform",
                timeline: "12-month implementation with NeuroSys Technologies Inc.",
                criticalSuccess: "Scalable AI workload performance and IP protection"
            },
            financial: {
                budget: {
                    preferred: "£2.5M annually",
                    maximum: "£3.5M annually",
                    hardLimit: "£4M annually"
                },
                paymentTerms: {
                    preferred: "monthly payments",
                    acceptable: "quarterly payments",
                    redLine: "no large upfront payments (startup cash flow)"
                }
            },
            technical: {
                sla: {
                    minimum: "99.5%",
                    preferred: "99.9%",
                    businessJustification: "AI workloads require consistent performance for end-users"
                },
                dataResidency: {
                    requirement: "UK/EU preferred",
                    flexibility: "limited - may need redundancy in other regions",
                    reason: "GDPR compliance but need global scalability"
                },
                security: {
                    requirements: ["SOC 2 Type II", "ISO 27001", "Cyber Essentials Plus"],
                    audits: "semi-annual audits acceptable"
                }
            },
            legal: {
                liability: {
                    minimumCap: "£5M",
                    preferred: "£10M with carve-outs for data breaches and IP claims",
                    businessReason: "Startup exposure but need protection for critical risks"
                },
                ip: {
                    ownership: "QuantumLink retains all proprietary AI models and data",
                    licensing: "limited use only for NeuroSys - no downstream rights without consent"
                },
                termination: {
                    notice: "3 months minimum",
                    dataReturn: "60 days for complete data return and model migration"
                }
            },
            priorities: [
                { item: "IP protection and ownership", importance: "critical", flexibility: "none" },
                { item: "Scalable AI performance", importance: "critical", flexibility: "limited" },
                { item: "Cost predictability", importance: "high", flexibility: "moderate" },
                { item: "Exit flexibility", importance: "high", flexibility: "limited" }
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
        
        return `You are ${this.clientProfile.name}, ${this.clientProfile.title} at ${this.clientProfile.company}. You are working with a junior lawyer to define requirements for a technology services agreement with NeuroSys Technologies Inc.

CLIENT PROFILE:
- Name: ${this.clientProfile.name}
- Title: ${this.clientProfile.title}
- Company: ${this.clientProfile.company} (UK-based AI startup)
- Background: ${this.clientProfile.background}
- Personality: ${this.clientProfile.personality}

PROJECT CONTEXT:
- Project: ${this.clientRequirements.project.type}
- Scope: ${this.clientRequirements.project.scope}
- Timeline: ${this.clientRequirements.project.timeline}
- Budget Range: ${this.clientRequirements.financial.budget.preferred} - ${this.clientRequirements.financial.budget.maximum}

YOUR KEY QUESTIONS AND CONCERNS:
1. IP Ownership: Do you plan to ingest open-source datasets? Will existing IP be co-developed with NeuroSys? What downstream rights do you want?
2. Service Levels: What availability do your end-users need? How quickly should issues be resolved? What service credits matter?
3. Data Privacy: Will you need non-EU/UK processing? What certifications do you require? How often will you audit?
4. Commercial Risk: What's your tolerance for fee increases? Do you need back-to-back terms? What insurance levels?
5. Exit Strategy: How long for transition support? Do you need technical migration help? What's acceptable exit fee?
6. Liability: What overall cap feels reasonable? Which risks must sit outside the cap? What specific coverage for NeuroSys?

Financial:
- Budget: Prefer ${this.clientRequirements.financial.budget.preferred}, max ${this.clientRequirements.financial.budget.maximum}
- Payment: Prefer ${this.clientRequirements.financial.paymentTerms.preferred}

Technical:
- SLA: Need minimum ${this.clientRequirements.technical.sla.minimum}, prefer ${this.clientRequirements.technical.sla.preferred}
- Data: ${this.clientRequirements.technical.dataResidency.requirement}
- Security: Require ${this.clientRequirements.technical.security.requirements.join(', ')}

Legal:
- Liability: Need minimum ${this.clientRequirements.legal.liability.minimumCap} cap
- IP ownership: ${this.clientRequirements.legal.ip.ownership}

CONVERSATION STATE:
- Current phase: ${this.conversationState.phase}
- Topics discussed: ${this.conversationState.topicsDiscussed.join(', ')}
- Outstanding concerns: ${this.conversationState.clientConcerns.join(', ')}

CONVERSATION HISTORY:
${recentHistory.map(msg => `${msg.speaker}: ${msg.message}`).join('\n')}

LAWYER'S LATEST MESSAGE: "${userMessage}"

INSTRUCTIONS:
1. Respond as a startup CTO who understands technology but needs legal guidance
2. Be specific about AI/tech requirements and startup constraints
3. Ask clarifying questions about legal implications for AI companies
4. Express concerns about IP protection and scalability risks
5. Share context about why certain terms are important to QuantumLink as a startup
6. Be collaborative but firm on critical requirements (especially IP)
7. Show appreciation for the lawyer's expertise
8. Keep responses focused and business-oriented (75-150 words)
9. Reference the 6 key question areas when relevant
10. Express startup urgency - need to move fast but get it right

Your response should sound like a real startup CTO working with their legal team, not an AI assistant.`;
    }

    async callGeminiAPI(prompt) {
        console.log('🏦 Calling Gemini API for Client Agent');
        
        // Handle demo mode when no API key is available
        if (!this.apiKey || this.apiKey.trim() === '') {
            console.log('🔧 Running in demo mode - generating simulated client response');
            return this.generateDemoResponse(prompt);
        }
        
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

    generateDemoResponse(prompt) {
        // Extract key topics from the user's message to generate contextual responses
        const userMessage = prompt.split('LAWYER\'S LATEST MESSAGE: "')[1]?.split('"')[0]?.toLowerCase() || '';
        
        const demoResponses = {
            greeting: "Hi there! I'm Rachel Chen, CTO at QuantumLink. Thanks for taking the time to help us with this NeuroSys agreement. We're excited to get our AI platform properly set up with reliable cloud infrastructure. What would you like to know about our requirements?",
            
            ip: "IP ownership is absolutely critical for us. We're building proprietary AI models for legal document automation, and we can't have NeuroSys claiming any rights to our algorithms or training data. We also need to be careful about open-source datasets - some have licensing restrictions. What's the best way to structure this?",
            
            sla: "Our end-users are law firms who need consistent AI performance. If our platform goes down or runs slowly, it directly impacts their client work. We're thinking 99.9% uptime minimum, but what's realistic? And how do service credits typically work for AI workloads?",
            
            privacy: "Data privacy is huge for us - we're processing legal documents that contain sensitive client information. We need UK/EU data residency for GDPR compliance, but might need some redundancy elsewhere for business continuity. What certifications should we require from NeuroSys?",
            
            commercial: "As a startup, we need predictable costs. Our budget is around £2.5-3M annually, but we're worried about unexpected fee increases. We also need to understand what happens if our usage scales rapidly - can we get volume discounts? What's typical for liability insurance requirements?",
            
            exit: "We've heard horror stories about vendor lock-in. If this partnership doesn't work out, we need a clear exit strategy. How long should transition support last? And what's reasonable for data migration assistance? We can't afford lengthy service interruptions.",
            
            liability: "Given we're a startup, we're concerned about liability exposure. What's a reasonable cap - maybe £5-10M? But we'd want carve-outs for data breaches and IP claims since those could be existential risks for us. What's market standard for cyber insurance requirements?",
            
            timeline: "We're under pressure to launch our enhanced platform by Q3. The integration with NeuroSys is critical path. How long do these negotiations typically take? We need to balance getting good terms with moving quickly - what are the key issues we should focus on first?",
            
            budget: "Our Series A gives us runway for about £3M annually on infrastructure, but we need to be careful about cost escalation. Monthly payments would be ideal for cash flow, but we might accept quarterly if there's a discount. What payment terms are typical?",
            
            default: "That's a great question. As a startup CTO, I'm always balancing technical requirements with business constraints. We need to make sure this agreement supports our growth while protecting our core IP. Can you help me understand the legal implications of what you're suggesting?"
        };

        // Simple keyword matching to return contextual responses
        if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('start')) {
            return demoResponses.greeting;
        } else if (userMessage.includes('ip') || userMessage.includes('intellectual') || userMessage.includes('property') || userMessage.includes('ownership')) {
            return demoResponses.ip;
        } else if (userMessage.includes('sla') || userMessage.includes('service level') || userMessage.includes('uptime') || userMessage.includes('availability')) {
            return demoResponses.sla;
        } else if (userMessage.includes('data') || userMessage.includes('privacy') || userMessage.includes('gdpr') || userMessage.includes('security')) {
            return demoResponses.privacy;
        } else if (userMessage.includes('cost') || userMessage.includes('budget') || userMessage.includes('money') || userMessage.includes('payment')) {
            return demoResponses.commercial;
        } else if (userMessage.includes('exit') || userMessage.includes('termination') || userMessage.includes('transition')) {
            return demoResponses.exit;
        } else if (userMessage.includes('liability') || userMessage.includes('insurance') || userMessage.includes('risk')) {
            return demoResponses.liability;
        } else if (userMessage.includes('timeline') || userMessage.includes('schedule') || userMessage.includes('when')) {
            return demoResponses.timeline;
        } else {
            return demoResponses.default;
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