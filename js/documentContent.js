// Document content for the research phase
function getDocumentContent(docId) {
    const documents = {
        'policy1': {
            title: 'Cloud Services Agreement Guidelines',
            body: `
                <h3>Executive Summary</h3>
                <p>This document outlines Clifford Chance's standard approach to negotiating cloud technology services agreements for financial services clients. Key considerations include regulatory compliance, operational resilience, and risk allocation.</p>

                <h3>Key Risk Areas</h3>
                <ul>
                    <li><strong>Data Residency & GDPR Compliance:</strong> Ensure all data remains within EU/UK jurisdiction unless adequate transfer mechanisms are in place</li>
                    <li><strong>Service Level Agreements:</strong> Banking clients typically require 99.9%+ uptime with meaningful service credits</li>
                    <li><strong>Liability Caps:</strong> Should reflect potential regulatory fines (often £50M+ for major banks)</li>
                    <li><strong>Operational Resilience:</strong> Must comply with FCA/PRA operational resilience requirements</li>
                    <li><strong>Exit Rights:</strong> Critical for banks to maintain ability to switch providers</li>
                </ul>

                <h3>Standard Negotiation Positions</h3>
                <p><strong>Service Level Agreements:</strong></p>
                <ul>
                    <li>Minimum 99.9% uptime (aim for 99.95% for critical systems)</li>
                    <li>Service credits: 10% of monthly fees for each 0.1% below SLA</li>
                    <li>Maximum planned downtime: 4 hours per month with 48-hour notice</li>
                </ul>

                <p><strong>Liability and Insurance:</strong></p>
                <ul>
                    <li>Liability cap should be 12-24 months of annual fees or £50M minimum</li>
                    <li>Unlimited liability for data breaches, IP infringement, and confidentiality breaches</li>
                    <li>Provider must maintain £100M+ professional indemnity insurance</li>
                </ul>

                <p><strong>Data Protection:</strong></p>
                <ul>
                    <li>All data processing within EU/UK unless SCCs or adequacy decision applies</li>
                    <li>Separate data processing agreement required</li>
                    <li>Client retains full ownership of all data</li>
                    <li>30-day data return period upon termination</li>
                </ul>

                <h3>Common Vendor Pushbacks</h3>
                <p>Vendors typically resist unlimited liability, high SLA requirements, and strict data residency. Be prepared to justify these requirements based on regulatory obligations and business criticality.</p>
            `
        },
        'precedent1': {
            title: 'Similar Banking Client Agreement - Precedent',
            body: `
                <h3>Deal Overview</h3>
                <p><strong>Client:</strong> Major UK Bank (anonymized)<br>
                <strong>Provider:</strong> Leading Cloud Services Provider<br>
                <strong>Value:</strong> £45M over 3 years<br>
                <strong>Completion:</strong> November 2024</p>

                <h3>Key Terms Achieved</h3>
                <p><strong>Service Level Agreement:</strong></p>
                <ul>
                    <li>99.95% uptime commitment</li>
                    <li>Service credits: 15% of monthly fees for first breach, escalating to 50% for repeated breaches</li>
                    <li>Maximum 2 hours planned downtime per month</li>
                    <li>4-hour response time for critical issues</li>
                </ul>

                <p><strong>Liability Terms:</strong></p>
                <ul>
                    <li>General liability cap: £60M (18 months of fees)</li>
                    <li>Unlimited liability for: data breaches, IP infringement, confidentiality breaches, regulatory violations</li>
                    <li>Provider insurance: £150M professional indemnity</li>
                </ul>

                <p><strong>Data Protection:</strong></p>
                <ul>
                    <li>All data processing within UK/EU</li>
                    <li>Comprehensive data processing agreement</li>
                    <li>Quarterly security audits by client</li>
                    <li>Annual third-party penetration testing</li>
                </ul>

                <h3>Negotiation Challenges & Solutions</h3>
                <p><strong>Challenge:</strong> Provider initially offered only 99.5% SLA<br>
                <strong>Solution:</strong> Demonstrated business impact of downtime (£2M per hour) and regulatory requirements</p>

                <p><strong>Challenge:</strong> Provider resisted unlimited liability for data breaches<br>
                <strong>Solution:</strong> Highlighted GDPR fines can exceed £500M, negotiated £200M sub-cap for data breaches</p>

                <p><strong>Challenge:</strong> Data residency restrictions increased costs by 15%<br>
                <strong>Solution:</strong> Accepted cost increase but negotiated enhanced SLAs and additional security measures</p>

                <h3>Payment Terms</h3>
                <ul>
                    <li>Monthly payment in arrears</li>
                    <li>No upfront payments required</li>
                    <li>Price protection: maximum 3% annual increases</li>
                    <li>Volume discounts for additional services</li>
                </ul>
            `
        },
        'regulation1': {
            title: 'FCA Cloud Computing Guidance',
            body: `
                <h3>Operational Resilience Requirements</h3>
                <p>The FCA requires firms to maintain operational resilience when using cloud services. Key requirements include:</p>

                <h3>Risk Management</h3>
                <ul>
                    <li><strong>Due Diligence:</strong> Thorough assessment of cloud provider's security, resilience, and regulatory compliance</li>
                    <li><strong>Risk Assessment:</strong> Ongoing monitoring of operational risks and dependencies</li>
                    <li><strong>Business Continuity:</strong> Robust plans for service disruption and provider failure</li>
                </ul>

                <h3>Data Protection & Location</h3>
                <ul>
                    <li>Data must remain within appropriate jurisdictions unless adequate safeguards exist</li>
                    <li>Clear data classification and handling procedures required</li>
                    <li>Regular data mapping and flow analysis</li>
                    <li>Encryption requirements for data at rest and in transit</li>
                </ul>

                <h3>Vendor Management</h3>
                <ul>
                    <li><strong>Right to Audit:</strong> Firms must retain right to audit cloud providers</li>
                    <li><strong>Regulatory Access:</strong> FCA must have access to cloud provider facilities and records</li>
                    <li><strong>Notification Requirements:</strong> Immediate notification of security incidents and service disruptions</li>
                    <li><strong>Exit Planning:</strong> Clear procedures for data return and service migration</li>
                </ul>

                <h3>Important Business Services (IBS)</h3>
                <p>For services deemed "Important Business Services":</p>
                <ul>
                    <li>Maximum tolerable downtime: typically 2-4 hours for critical banking functions</li>
                    <li>Recovery time objectives must be clearly defined and tested</li>
                    <li>Alternative arrangements required if cloud service fails</li>
                </ul>

                <h3>Outsourcing Requirements</h3>
                <ul>
                    <li>Written agreement covering all regulatory requirements</li>
                    <li>Cloud provider must cooperate with regulatory supervision</li>
                    <li>Firm remains fully responsible for regulatory compliance</li>
                    <li>No delegation of regulatory obligations to cloud provider</li>
                </ul>

                <h3>Incident Reporting</h3>
                <p>Firms must report operational incidents to the FCA within specific timeframes:</p>
                <ul>
                    <li>Immediate notification for incidents affecting Important Business Services</li>
                    <li>Detailed incident reports within 72 hours</li>
                    <li>Root cause analysis and remediation plans</li>
                </ul>
            `
        },
        'template1': {
            title: 'Banking Industry SLA Benchmarks',
            body: `
                <h3>Industry SLA Standards</h3>
                <p>Based on analysis of 50+ cloud services agreements in the banking sector (Q4 2024):</p>

                <h3>Service Level Commitments</h3>
                <p><strong>Uptime Requirements:</strong></p>
                <ul>
                    <li>Tier 1 Banks: 99.95% - 99.99% (average: 99.97%)</li>
                    <li>Tier 2 Banks: 99.9% - 99.95% (average: 99.92%)</li>
                    <li>Regional Banks: 99.5% - 99.9% (average: 99.8%)</li>
                </ul>

                <p><strong>Response Times:</strong></p>
                <ul>
                    <li>Critical Issues: 1-4 hours (average: 2 hours)</li>
                    <li>High Priority: 4-8 hours (average: 6 hours)</li>
                    <li>Medium Priority: 24-48 hours (average: 24 hours)</li>
                    <li>Low Priority: 72-120 hours (average: 96 hours)</li>
                </ul>

                <h3>Service Credits</h3>
                <p><strong>Typical Credit Structure:</strong></p>
                <ul>
                    <li>99.0% - 99.89%: 10% of monthly fees</li>
                    <li>98.0% - 98.99%: 25% of monthly fees</li>
                    <li>Below 98.0%: 50% of monthly fees</li>
                    <li>Maximum credits: 100% of monthly fees</li>
                </ul>

                <h3>Liability Caps by Institution Size</h3>
                <p><strong>Large Banks (>£100B assets):</strong></p>
                <ul>
                    <li>General Liability: £50M - £200M</li>
                    <li>Data Breach: Often unlimited or £500M+ cap</li>
                    <li>IP Infringement: Unlimited</li>
                </ul>

                <p><strong>Mid-Size Banks (£10B - £100B assets):</strong></p>
                <ul>
                    <li>General Liability: £25M - £75M</li>
                    <li>Data Breach: £100M - £250M cap</li>
                    <li>IP Infringement: 2x annual contract value</li>
                </ul>

                <h3>Payment Terms Analysis</h3>
                <ul>
                    <li><strong>Monthly in Arrears:</strong> 65% of agreements</li>
                    <li><strong>Quarterly in Arrears:</strong> 25% of agreements</li>
                    <li><strong>Annual in Advance:</strong> 10% of agreements (usually with discount)</li>
                </ul>

                <h3>Data Residency Requirements</h3>
                <ul>
                    <li><strong>UK/EU Only:</strong> 75% of UK banks</li>
                    <li><strong>UK/EU + Approved Jurisdictions:</strong> 20% of UK banks</li>
                    <li><strong>Global with Safeguards:</strong> 5% of UK banks</li>
                </ul>

                <h3>Contract Duration Trends</h3>
                <ul>
                    <li><strong>3 Years:</strong> 45% of agreements</li>
                    <li><strong>5 Years:</strong> 35% of agreements</li>
                    <li><strong>2 Years:</strong> 15% of agreements</li>
                    <li><strong>7+ Years:</strong> 5% of agreements</li>
                </ul>

                <p><strong>Note:</strong> Longer terms typically achieve 10-20% cost savings but reduce flexibility</p>
            `
        },
        'regulation2': {
            title: 'GDPR Cloud Services Checklist',
            body: `
                <h3>Data Processing Fundamentals</h3>
                <p>When using cloud services, banks must ensure full GDPR compliance across all data processing activities.</p>

                <h3>Legal Basis & Data Processing Agreement</h3>
                <ul>
                    <li><strong>Article 28 DPA Required:</strong> Separate data processing agreement covering all GDPR obligations</li>
                    <li><strong>Processing Instructions:</strong> Clear, written instructions for all data processing activities</li>
                    <li><strong>Purpose Limitation:</strong> Cloud provider may only process data for specified purposes</li>
                    <li><strong>Data Minimization:</strong> Only necessary data should be processed</li>
                </ul>

                <h3>International Data Transfers</h3>
                <p><strong>If data leaves EU/UK:</strong></p>
                <ul>
                    <li>Adequacy decision for destination country, OR</li>
                    <li>Standard Contractual Clauses (SCCs) with additional safeguards, OR</li>
                    <li>Binding Corporate Rules (BCRs) for multinational providers</li>
                    <li>Transfer Impact Assessment (TIA) required for all transfers</li>
                </ul>

                <h3>Technical & Organizational Measures</h3>
                <p><strong>Security Requirements:</strong></p>
                <ul>
                    <li>Encryption of personal data at rest and in transit</li>
                    <li>Pseudonymization where technically feasible</li>
                    <li>Regular security testing and vulnerability assessments</li>
                    <li>Access controls and authentication measures</li>
                    <li>Data backup and recovery procedures</li>
                </ul>

                <h3>Data Subject Rights</h3>
                <p>Cloud provider must assist with:</p>
                <ul>
                    <li><strong>Access Requests:</strong> Ability to retrieve specific individual's data</li>
                    <li><strong>Rectification:</strong> Correction of inaccurate personal data</li>
                    <li><strong>Erasure:</strong> Deletion of personal data when required</li>
                    <li><strong>Portability:</strong> Data export in machine-readable format</li>
                    <li><strong>Restriction:</strong> Limiting processing in certain circumstances</li>
                </ul>

                <h3>Breach Notification Requirements</h3>
                <ul>
                    <li><strong>Provider to Controller:</strong> Notification within 24 hours of becoming aware</li>
                    <li><strong>Controller to Supervisory Authority:</strong> Within 72 hours (where feasible)</li>
                    <li><strong>Controller to Data Subjects:</strong> Without undue delay if high risk</li>
                    <li><strong>Documentation:</strong> All breaches must be documented</li>
                </ul>

                <h3>Audit & Compliance Monitoring</h3>
                <ul>
                    <li><strong>Right to Audit:</strong> Controller must retain audit rights</li>
                    <li><strong>Compliance Certificates:</strong> SOC 2, ISO 27001, etc.</li>
                    <li><strong>Regular Reviews:</strong> Annual compliance assessments</li>
                    <li><strong>Sub-processor Management:</strong> Prior approval for all sub-processors</li>
                </ul>

                <h3>Data Return & Deletion</h3>
                <ul>
                    <li><strong>Data Return:</strong> All data returned within 30 days of termination</li>
                    <li><strong>Secure Deletion:</strong> Certified destruction of all copies</li>
                    <li><strong>Format Requirements:</strong> Data returned in usable, machine-readable format</li>
                    <li><strong>Backup Deletion:</strong> All backup copies must be securely deleted</li>
                </ul>

                <h3>Key Contract Clauses</h3>
                <p><strong>Essential GDPR clauses to include:</strong></p>
                <ul>
                    <li>Detailed data processing terms and limitations</li>
                    <li>Security incident notification procedures</li>
                    <li>Data subject rights assistance obligations</li>
                    <li>International transfer safeguards</li>
                    <li>Sub-processor approval and management</li>
                    <li>Audit rights and compliance monitoring</li>
                    <li>Data return and deletion procedures</li>
                </ul>
            `
        },
        'policy2': {
            title: 'Tech Contract Negotiation Playbook',
            body: `
                <h3>Pre-Negotiation Strategy</h3>
                <p>Successful technology contract negotiations require thorough preparation and clear strategy.</p>

                <h3>Understanding Vendor Motivations</h3>
                <ul>
                    <li><strong>Revenue Recognition:</strong> Vendors prefer upfront or quarterly payments</li>
                    <li><strong>Risk Limitation:</strong> Standard terms heavily favor vendors</li>
                    <li><strong>Scalability:</strong> Vendors want standardized terms across clients</li>
                    <li><strong>Competitive Pressure:</strong> Use market alternatives as leverage</li>
                </ul>

                <h3>Key Negotiation Tactics</h3>
                <p><strong>Service Level Agreements:</strong></p>
                <ul>
                    <li>Start with industry benchmarks, then justify higher requirements</li>
                    <li>Link SLAs to business impact and regulatory requirements</li>
                    <li>Negotiate meaningful service credits (not just token amounts)</li>
                    <li>Include availability measurement methodology</li>
                </ul>

                <p><strong>Liability Negotiations:</strong></p>
                <ul>
                    <li>Emphasize regulatory fine exposure (often £50M+ for banks)</li>
                    <li>Separate caps for different types of damages</li>
                    <li>Unlimited liability for fundamental breaches</li>
                    <li>Require adequate insurance coverage</li>
                </ul>

                <h3>Common Vendor Objections & Responses</h3>
                <p><strong>"Our standard terms are non-negotiable"</strong></p>
                <ul>
                    <li>Response: "We understand your position, but our regulatory obligations require specific protections"</li>
                    <li>Provide specific regulatory citations</li>
                    <li>Offer alternative solutions that meet both parties' needs</li>
                </ul>

                <p><strong>"Unlimited liability would make this deal uneconomical"</strong></p>
                <ul>
                    <li>Response: "We can discuss sub-caps for specific risks, but data breaches carry unlimited regulatory exposure"</li>
                    <li>Focus on fundamental breaches vs. operational issues</li>
                    <li>Highlight vendor's insurance coverage</li>
                </ul>

                <p><strong>"99.95% SLA is technically impossible"</strong></p>
                <ul>
                    <li>Response: "Other providers offer this level, and our business requires it"</li>
                    <li>Provide industry benchmarks and competitor examples</li>
                    <li>Discuss technical solutions and redundancy measures</li>
                </ul>

                <h3>Effective Concession Strategy</h3>
                <ul>
                    <li><strong>Bundle Concessions:</strong> Trade multiple items together</li>
                    <li><strong>Conditional Concessions:</strong> "If you can do X, we can accept Y"</li>
                    <li><strong>Time-Limited Offers:</strong> Create urgency for vendor decisions</li>
                    <li><strong>Alternative Solutions:</strong> Offer different ways to meet both parties' needs</li>
                </ul>

                <h3>Building Leverage</h3>
                <ul>
                    <li><strong>Competitive Alternatives:</strong> Maintain other vendor options</li>
                    <li><strong>Deal Size:</strong> Emphasize total contract value and future opportunities</li>
                    <li><strong>Reference Value:</strong> Highlight reputational benefits for vendor</li>
                    <li><strong>Timing:</strong> Understand vendor's quarterly/annual targets</li>
                </ul>

                <h3>Negotiation Phases</h3>
                <p><strong>Phase 1: Information Gathering</strong></p>
                <ul>
                    <li>Understand vendor's standard positions</li>
                    <li>Identify areas of flexibility</li>
                    <li>Map decision-making authority</li>
                </ul>

                <p><strong>Phase 2: Position Setting</strong></p>
                <ul>
                    <li>Present client requirements with business justification</li>
                    <li>Establish negotiation framework</li>
                    <li>Identify potential trade-offs</li>
                </ul>

                <p><strong>Phase 3: Active Negotiation</strong></p>
                <ul>
                    <li>Focus on highest priority items first</li>
                    <li>Use conditional language for concessions</li>
                    <li>Document all agreements in writing</li>
                </ul>

                <p><strong>Phase 4: Final Settlement</strong></p>
                <ul>
                    <li>Package remaining issues together</li>
                    <li>Set deadline for final agreement</li>
                    <li>Prepare walk-away alternatives</li>
                </ul>
            `
        }
    };

    return documents[docId] || { title: 'Document Not Found', body: '<p>Document content not available.</p>' };
} 