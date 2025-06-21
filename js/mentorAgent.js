class MentorAgent {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
        
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
            return {
                message: "I'm having some technical difficulties. Let me try a different approach to help you with your analysis.",
                success: false,
                error: error.message
            };
        }
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