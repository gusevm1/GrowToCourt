class MentorAgent {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
        
        // Mentor profile
        this.mentorProfile = {
            name: "Professor Elizabeth Warren",
            title: "Senior Legal Mentor",
            institution: "Clifford Chance Training Academy",
            experience: "25 years in commercial law, former partner",
            specialty: "Contract analysis and legal reasoning development"
        };

        // Teaching context
        this.teachingContext = {
            scenario: "QuantumLink AI Ltd Technology Services Agreement",
            clientType: "UK AI startup seeking cloud infrastructure services",
            providerType: "US-based cloud technology provider (NeuroSys Technologies)",
            complexity: "Cross-border AI/data contract with regulatory compliance issues",
            learningObjectives: [
                "Identify missing information in client demands",
                "Recognize potential legal risks and commercial issues", 
                "Develop systematic contract analysis skills",
                "Apply critical thinking to complex commercial scenarios"
            ]
        };

        // Template solution for comparison
        this.templateSolution = {
            intellectual_property: [
                "Definition of 'proprietary AI models' and scope of IP ownership",
                "Clarification of 'derivative works' and AI training outputs",
                "Rights to pre-existing IP vs newly created IP",
                "Background IP ownership and licensing arrangements",
                "IP indemnification and warranty provisions"
            ],
            technical_sla: [
                "Specific uptime percentage targets and measurement methodology",
                "Performance benchmarks definition (speed, latency, throughput)",
                "Service credit calculation and penalty structure",
                "Planned vs unplanned downtime distinctions",
                "Escalation procedures for service failures"
            ],
            data_privacy: [
                "Specific data residency requirements and geographic restrictions",
                "GDPR compliance mechanisms and data processing agreements",
                "Cross-border data transfer prohibitions and safeguards",
                "Audit rights scope, frequency, and access procedures",
                "Data breach notification and response procedures"
            ],
            commercial_risk: [
                "Change management cost controls and approval thresholds",
                "Scope creep prevention mechanisms (De Beers v Atos lessons)",
                "Pricing escalation caps and benchmarking",
                "Contract value and payment terms clarity",
                "Budget protection and cost control measures"
            ],
            exit_termination: [
                "Data extraction and migration assistance requirements",
                "Proprietary system lock-in prevention measures",
                "Termination notice periods and transition support",
                "Data deletion and return procedures",
                "Business continuity during provider transition"
            ],
            liability_indemnity: [
                "Liability cap definitions and carve-out exceptions",
                "IP infringement indemnification scope",
                "Data breach liability allocation",
                "Privacy law compliance indemnification",
                "Mutual vs one-sided indemnity provisions"
            ]
        };

        // Student progress tracking
        this.studentProgress = {
            clarificationItems: [],
            categoriesCovered: [],
            strengthAreas: [],
            improvementAreas: [],
            readinessLevel: "beginner", // beginner, developing, proficient, advanced
            lastInteraction: null
        };

        this.conversationHistory = [];
    }

    async generateResponse(userMessage, clarificationList = []) {
        try {
            this.conversationHistory.push({
                speaker: 'student',
                message: userMessage,
                timestamp: new Date()
            });

            // Check if we should use demo mode
            if (!this.apiKey || this.apiKey.length < 10) {
                console.log('🎭 Using demo mode for mentor agent');
                const demoResponse = this.generateDemoResponse(userMessage, clarificationList);
                
                this.conversationHistory.push({
                    speaker: 'mentor',
                    message: demoResponse,
                    timestamp: new Date()
                });

                return {
                    message: demoResponse,
                    success: true
                };
            }

            const prompt = this.buildMentorPrompt(userMessage, clarificationList);
            const response = await this.callGeminiAPI(prompt);
            
            this.conversationHistory.push({
                speaker: 'mentor',
                message: response,
                timestamp: new Date()
            });

            return {
                message: response,
                success: true
            };

        } catch (error) {
            console.error('Error generating mentor response:', error);
            // Fall back to demo mode on API error
            const demoResponse = this.generateDemoResponse(userMessage, clarificationList);
            return {
                message: demoResponse,
                success: false,
                error: error.message
            };
        }
    }

    generateDemoResponse(userMessage, clarificationList = []) {
        const message = userMessage.toLowerCase();
        
        // Negotiation strategy questions
        if (message.includes('strategy') || message.includes('approach') || message.includes('negotiate')) {
            const strategyResponses = [
                "That's a great question about negotiation strategy. What patterns are you noticing in how Sarah Chen is positioning her arguments? Think about whether she's being collaborative or competitive, and how that might affect your approach.",
                "Good thinking about strategy. Consider what you've learned about the counterparty's priorities from their responses. Are there areas where their interests might align with yours? How might you use that to create win-win solutions?",
                "Excellent strategic thinking. What leverage points do you think each party has in this negotiation? Remember, successful negotiations often involve understanding what the other side truly needs, not just what they're asking for."
            ];
            return strategyResponses[Math.floor(Math.random() * strategyResponses.length)];
        }
        
        // Progress and feedback questions
        if (message.includes('progress') || message.includes('doing') || message.includes('feedback') || message.includes('how am i')) {
            const progressResponses = [
                "You're making solid progress in identifying the key issues. I notice you're starting to think about the commercial implications, which is excellent. What patterns are you seeing in how different contract terms interconnect?",
                "Good work so far. You're demonstrating strong analytical skills. One area to focus on next: are you considering the business context behind each legal position? What might be driving the counterparty's requirements?",
                "You're developing good negotiation instincts. I can see you're thinking about both legal and practical considerations. How might you test whether your proposed solutions actually address the underlying business needs?"
            ];
            return progressResponses[Math.floor(Math.random() * progressResponses.length)];
        }
        
        // Questions about specific issues
        if (message.includes('liability') || message.includes('damages')) {
            return "Liability is always a complex area. What do you think drives each party's position on liability caps? Consider both the legal risks and the business realities - what would happen if something actually went wrong?";
        }
        
        if (message.includes('data') || message.includes('privacy') || message.includes('gdpr')) {
            return "Data privacy is crucial in this context. Are you thinking about why data residency matters so much to financial institutions? What are the real business and regulatory drivers behind these requirements?";
        }
        
        if (message.includes('sla') || message.includes('uptime') || message.includes('service')) {
            return "Service levels are interesting to analyze. What do you think the real cost difference is between 99.5% and 99.9% uptime? How might that affect your negotiation position?";
        }
        
        if (message.includes('money') || message.includes('cost') || message.includes('budget') || message.includes('price')) {
            return "Budget discussions are always revealing. What do you think the counterparty's response tells you about their pricing flexibility? Are there ways to structure the commercial terms that might work better for both parties?";
        }
        
        if (message.includes('ip') || message.includes('intellectual property')) {
            return "IP ownership is fundamental in technology contracts. What concerns do you think each party has about their intellectual property? How might you address those concerns while protecting your client's interests?";
        }
        
        // Questions about resolution or agreement
        if (message.includes('resolved') || message.includes('agreed') || message.includes('settled')) {
            return "Good observation about reaching agreement. What made that particular issue easier to resolve? Can you apply those same principles to the remaining open items?";
        }
        
        // General guidance and encouragement
        if (message.includes('stuck') || message.includes('difficult') || message.includes('hard')) {
            return "I understand this feels challenging - that's normal for complex commercial negotiations. Try stepping back and asking: what does each party really need here? Sometimes the stated position isn't the underlying interest.";
        }
        
        if (message.includes('next') || message.includes('what should')) {
            return "That's good forward thinking. Look at what issues remain unresolved and consider which ones might be easier to tackle first. Sometimes building momentum on smaller items helps with the bigger challenges.";
        }
        
        // Default Socratic responses
        const defaultResponses = [
            "That's an interesting observation. What do you think might be driving that particular position? Try to think about the business reasons behind the legal requirements.",
            "Good question. Let me turn that back to you - what patterns are you noticing in how the counterparty responds to different types of proposals?",
            "I can see you're thinking carefully about this. What would you do if you were in the counterparty's position? How might that inform your approach?",
            "That's worth exploring further. What are the potential consequences if this issue isn't resolved properly? How might that affect your negotiation priorities?"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    buildMentorPrompt(userMessage, clarificationList) {
        const recentHistory = this.conversationHistory.slice(-4);
        
        return `You are ${this.mentorProfile.name}, ${this.mentorProfile.title} at ${this.mentorProfile.institution}. You are mentoring a junior lawyer learning contract analysis through the Socratic method.

MENTOR PROFILE:
- Experience: ${this.mentorProfile.experience}
- Teaching Style: Socratic method, guided discovery
- Specialty: ${this.mentorProfile.specialty}

TEACHING SCENARIO:
- Case: QuantumLink AI Ltd Technology Services Agreement
- Client: UK AI startup seeking cloud infrastructure services
- Provider: US-based cloud technology provider (NeuroSys Technologies)
- Complexity: Cross-border AI/data contract with regulatory compliance issues

STUDENT'S CURRENT CLARIFICATION LIST:
${clarificationList.length > 0 ? clarificationList.map((item, i) => `${i + 1}. ${item}`).join('\n') : 'No items added yet'}

CONVERSATION HISTORY:
${recentHistory.map(msg => `${msg.speaker}: ${msg.message}`).join('\n')}

STUDENT'S QUESTION: "${userMessage}"

TEACHING INSTRUCTIONS:
1. Use the Socratic method - ask probing questions rather than giving direct answers
2. Provide hints and guidance to help them discover gaps themselves
3. Acknowledge good analytical thinking when you see it
4. For missing items questions: Guide them toward specific gaps without listing everything
5. For feedback requests: Highlight strengths and suggest areas for deeper exploration
6. Encourage critical thinking about business risks and legal implications
7. Reference real-world examples when helpful (De Beers v Atos, GDPR cases, etc.)
8. Keep responses focused and educational (75-150 words)
9. Build confidence while challenging them to think deeper
10. Focus on these key areas: IP ownership, technical SLAs, data privacy, server locations, commercial risk, exit strategies, liability
11. IMPORTANT: Use plain text formatting only - no markdown symbols like ** or • - write naturally for chat display
12. When listing items, use simple dashes (-) or write in paragraph form

Your response should sound like an experienced legal mentor guiding a student's discovery, not an AI assistant providing answers.`;
    }

    async callGeminiAPI(prompt) {
        console.log('🎓 Calling Gemini API for Mentor Agent');
        
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

        const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Gemini API Error:', response.status, errorText);
            throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Mentor Agent Response received');

        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            console.error('❌ Unexpected response format:', data);
            throw new Error('Unexpected response format from Gemini API');
        }
    }

    async provideFeedback(clarificationList) {
        const feedbackPrompt = `Analyze this student's clarification list for the QuantumLink AI contract analysis:

STUDENT'S CLARIFICATION ITEMS:
${clarificationList.map((item, i) => `${i + 1}. ${item}`).join('\n')}

KEY AREAS TO ASSESS:
- Intellectual Property (AI models, derivative works, ownership)
- Technical SLAs (performance benchmarks, uptime, service credits)
- Data Privacy (GDPR compliance, data residency, cross-border transfers)
- Server Location (where computation happens, jurisdictional implications)
- Commercial Risk (change management, cost controls, De Beers v Atos lessons)
- Exit Strategy (data migration, vendor lock-in prevention)
- Liability/Indemnity (caps, carve-outs, IP infringement)

FEEDBACK INSTRUCTIONS:
1. Acknowledge their analytical progress positively
2. Identify 2-3 strongest areas they've covered well
3. Suggest 1-2 critical areas they might explore further
4. Ask a probing question to guide their next thinking
5. Encourage them while maintaining challenge
6. Keep response to 100-150 words
7. Sound like an encouraging but rigorous legal mentor
8. IMPORTANT: Use plain text only - no markdown symbols like ** or • - write naturally for chat
9. When listing items, use simple dashes (-) or write in paragraph form

Provide constructive feedback that builds confidence while identifying improvement opportunities.`;

        try {
            const response = await this.callGeminiAPI(feedbackPrompt);
            return {
                message: response,
                success: true
            };
        } catch (error) {
            console.error('Error generating feedback:', error);
            return {
                message: `You've identified ${clarificationList.length} areas - that's solid analytical work! I can see you're thinking systematically about the contract. Consider whether you've covered the high-risk areas like IP ownership and data privacy comprehensively. What aspect of this AI startup's relationship with the cloud provider concerns you most from a legal risk perspective?`,
                success: false,
                error: error.message
            };
        }
    }
} 