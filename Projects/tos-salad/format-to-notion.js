#!/usr/bin/env node

const { Client } = require('@notionhq/client');
const dotenv = require('dotenv');

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

// Microsoft analysis data extracted from provided Gemini analysis
const microsoftData = {
    company: "Microsoft",
    riskLevel: "Critical",
    redFlagsCount: 6,
    transparencyScore: 20,
    manipulationTactics: ["Forced Arbitration", "Vague Language", "Buried Clauses", "Broad Data Sharing"],
    industryCategory: "Cloud/Productivity",
    userBase: 1400000000, // 1.4 billion
    keyRedFlags: [
        {
            category: "Information Is Not Advice Disclaimer",
            concern: "Total lack of responsibility for accuracy of any information"
        },
        {
            category: "Submission Clause",
            concern: "Your ideas and content become theirs with broad license"
        },
        {
            category: "Aggressive Liability Shield",
            concern: "Zero responsibility for any damages whatsoever"
        },
        {
            category: "No Guarantees of Safety",
            concern: "No warranty that sites are virus-free or secure"
        },
        {
            category: "Forced Arbitration & Class Action Waiver",
            concern: "Cannot sue them in court or join class action"
        },
        {
            category: "Right to Terminate Access",
            concern: "Can block access at any time without notice"
        }
    ]
};

async function addMicrosoftToNotion() {
    console.log('📝 Adding Microsoft ToS analysis to Notion database...');

    try {
        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                'Company': {
                    title: [
                        {
                            text: {
                                content: microsoftData.company
                            }
                        }
                    ]
                },
                'Risk Level': {
                    select: {
                        name: microsoftData.riskLevel
                    }
                },
                'Red Flags Count': {
                    number: microsoftData.redFlagsCount
                },
                'Transparency Score': {
                    number: microsoftData.transparencyScore
                },
                'Industry Category': {
                    select: {
                        name: microsoftData.industryCategory
                    }
                },
                'User Base': {
                    number: microsoftData.userBase
                },
                'Manipulation Tactics': {
                    multi_select: microsoftData.manipulationTactics.map(tactic => ({ name: tactic }))
                },
                'Analysis Status': {
                    select: {
                        name: 'Complete'
                    }
                },
                'Analysis Date': {
                    date: {
                        start: new Date().toISOString().split('T')[0]
                    }
                }
            },
            children: [
                {
                    object: 'block',
                    type: 'heading_2',
                    heading_2: {
                        rich_text: [{ type: 'text', text: { content: 'Key Red Flags Identified' } }]
                    }
                },
                ...microsoftData.keyRedFlags.map(flag => ({
                    object: 'block',
                    type: 'bulleted_list_item',
                    bulleted_list_item: {
                        rich_text: [
                            {
                                type: 'text',
                                text: { content: `${flag.category}: ` },
                                annotations: { bold: true }
                            },
                            {
                                type: 'text',
                                text: { content: flag.concern }
                            }
                        ]
                    }
                })),
                {
                    object: 'block',
                    type: 'heading_2',
                    heading_2: {
                        rich_text: [{ type: 'text', text: { content: 'Summary Assessment' } }]
                    }
                },
                {
                    object: 'block',
                    type: 'paragraph',
                    paragraph: {
                        rich_text: [
                            {
                                type: 'text',
                                text: { content: `Microsoft's Terms of Use received a transparency score of ${microsoftData.transparencyScore}/100, indicating critical concerns for user rights. The document contains ${microsoftData.redFlagsCount} major red flags including forced arbitration, comprehensive liability shields, and broad content licensing agreements that heavily favor Microsoft over users.` }
                            }
                        ]
                    }
                }
            ]
        });

        console.log('✅ Microsoft ToS analysis added to Notion database');
        console.log(`📄 Page ID: ${response.id}`);
        console.log(`🔗 URL: https://notion.so/${response.id.replace(/-/g, '')}`);

    } catch (error) {
        console.error('❌ Failed to add to Notion:', error.message);
    }
}

addMicrosoftToNotion();