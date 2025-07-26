const en = {
    appName: 'Namma Krushi',
    landing: {
        appName: 'Namma Krushi',
        headline: {
            part1: 'Namma Ooru',
            part2: 'Namma Krushi.',
        },
        tagline: 'Your AI Farming Ally. Proactive advice for your farm, in your language, backed by intelligent analysis.',
        cta: 'Enter Dashboard',
        footer: {
            voice: 'Voice-Powered',
            languages: 'English & ಕನ್ನಡ',
        }
    },
    sidebar: {
        dashboard: 'Dashboard',
        market: 'Market Advisory',
        schemes: 'Schemes',
        profile: 'Profile',
    },
    dashboard: {
        title: 'Dashboard',
    },
    crops: {
        sonaMasooriRice: 'Sona Masoori Rice',
        tomato: 'Tomato',
    },
    weather: {
        title: 'Weather Today',
        description: 'Current conditions and forecast.',
        condition: 'Partly Cloudy',
        humidity: 'Humidity',
        wind: 'Wind',
    },
    todos: {
        title: 'AI-Powered To-Dos',
        description: 'Personalized tasks for today.',
        generate: 'Generate',
        prompt: 'Click "Generate" to get your personalized to-do list.',
        toast: {
            fail: {
                title: 'Error',
                description: 'Failed to generate To-Dos. Please try again.',
            }
        }
    },
    advisories: {
        title: 'Latest Advisories',
        description: 'Pest, disease, and risk alerts.',
        pest: 'Leafhopper Alert',
        disease: 'Blast Risk',
        risk: 'Heavy Rain Forecast',
        types: {
            pest: 'Pest',
            disease: 'Disease',
            risk: 'Risk',
        },
        levels: {
            low: 'Low',
            moderate: 'Moderate',
            high: 'High',
        }
    },
    farmCard: {
        area: 'Area',
        mandiPrice: 'Mandi Price',
        estYield: 'Est. Yield',
        suggestions: {
            button: 'Suggestions',
            title: 'Suggestions for {{cropName}}',
            description: 'AI-powered recommendations to improve your yield.',
        },
        history: {
            button: 'History',
            title: 'History for {{cropName}}',
            description: 'Past observations and health check-ins.',
        },
    },
    addCrop: {
        title: 'Add a New Crop',
        button: 'Add Crop',
        form: {
            title: 'Add New Crop',
            description: 'Enter the details for your new crop.',
            area: {
                label: 'Area (e.g., 5 Acres)',
                placeholder: '5 Acres',
            },
            breed: {
                label: 'Breed',
                placeholder: 'Sona Masoori',
            },
            plantingDate: {
                label: 'Planting Date',
                placeholder: 'Pick a date',
            },
            yield: {
                label: 'Expected Yield (e.g., 25 quintals)',
                placeholder: '25 quintals',
            },
            stage: {
                label: 'Current Crop Stage',
                placeholder: 'Select a stage',
                seedling: 'Seedling',
                vegetative: 'Vegetative',
                flowering: 'Flowering',
                maturity: 'Maturity',
            },
            soil: {
                label: 'Soil Type',
                placeholder: 'Select a soil type',
                alluvial: 'Alluvial Soil',
                black: 'Black Soil',
                red: 'Red Soil',
                laterite: 'Laterite Soil',
                arid: 'Arid Soil',
                forest: 'Forest Soil',
                peat: 'Peat Soil',
                saline: 'Saline Soil',
                loam: 'Loam Soil',
                sandy: 'Sandy Soil',
                clay: 'Clay Loam',
                silt: 'Silt Soil',
            },
            save: 'Save Crop',
        }
    },
    market: {
        title: 'Market Advisory',
        chart: {
            title: 'Price Trend',
            description: 'Historical price data for {{produce}}.',
            daily: 'Daily',
            weekly: 'Weekly',
            monthly: 'Monthly',
        },
        recommendation: {
            title: 'Recommendation',
            sell: 'Sell',
            hold: 'Hold',
            reason: 'Reason',
            fail: 'Could not load recommendation.',
        },
        toast: {
            fail: {
                title: 'Analysis Failed',
                description: 'Could not retrieve market analysis.',
            }
        }
    },
    schemes: {
        title: 'Government Schemes',
        recommended: 'Recommended for You',
        other: 'All Other Schemes',
        list: {
            pmfby: {
                title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
                description: 'A comprehensive crop insurance scheme to protect farmers against yield losses due to unforeseen events.',
                eligibility: 'All farmers growing notified crops like Rice in designated areas are eligible.',
                benefits: 'Insurance coverage against natural calamities, pests, and diseases.',
                howToApply: 'Enroll through the national crop insurance portal or a financial institution.',
            },
            soilHealthCard: {
                title: 'Soil Health Card Scheme',
                description: 'Provides a soil health card with crop-wise nutrient recommendations.',
                eligibility: 'All farmers are eligible to get a soil health card for their holdings.',
                benefits: 'Informed decisions on fertilizer application, leading to improved soil health and productivity.',
                howToApply: 'Contact the local agriculture department to get your soil sampled.',
            },
            nfsm: {
                title: 'National Food Security Mission (NFSM)',
                description: 'Aims to increase the production of rice through area expansion and productivity enhancement.',
                eligibility: 'Targets districts with lower rice productivity. Assistance is provided to farmers for inputs and technology.',
                benefits: 'Subsidies on seeds, machinery, and other inputs.',
                howToApply: 'Schemes are implemented by state agriculture departments.',
            },
            kcc: {
                title: 'Kisan Credit Card (KCC) Scheme',
                description: 'Provides farmers with timely access to credit for their cultivation and other needs.',
                eligibility: 'All farmers, including small and marginal farmers, sharecroppers, and tenants.',
                benefits: 'Low-interest credit for agricultural and allied activities.',
                howToApply: 'Apply at any commercial bank, regional rural bank, or cooperative bank.',
            },
            pkvy: {
                title: 'Paramparagat Krishi Vikas Yojana (PKVY)',
                description: 'Promotes organic farming through the adoption of organic villages and PGS certification.',
                eligibility: 'Farmers in a cluster of 50 acres or more are eligible to participate.',
                benefits: 'Financial assistance for organic inputs, certification, and marketing.',
                howToApply: 'Join a cluster formed by the state agriculture department.',
            }
        },
        card: {
            learnMore: 'Learn More',
            descriptionTitle: 'Description',
            eligibilityTitle: 'Eligibility Criteria',
            benefitsTitle: 'Benefits',
            howToApplyTitle: 'How To Apply',
            explain: 'Explain in Voice',
            website: 'Official Website',
            toast: {
                title: 'Voice Explanation (Mock)',
                description: 'This will play an audio explanation of the scheme.',
            }
        }
    },
    profile: {
        title: 'Profile & Settings',
        open: 'Open profile page',
        language: {
            title: 'Language',
            description: 'Choose your preferred language for the app.',
        },
        account: {
            title: 'My Account',
            description: 'View your account details and support options.',
        },
        support: {
            title: 'Support',
            phone: 'Phone',
            email: 'Email',
        },
        logout: 'Logout',
    },
    assistant: {
        placeholder: 'Ask anything',
        upload: 'Upload Image',
        send: 'Send Message',
    },
    voice: {
        prompt: 'Say something...',
    },
};

const kn = {
    appName: 'ನಮ್ಮ ಕೃಷಿ',
    landing: {
        appName: 'ನಮ್ಮ ಕೃಷಿ',
        headline: {
            part1: 'ನಮ್ಮ ಊರು',
            part2: 'ನಮ್ಮ ಕೃಷಿ.',
        },
        tagline: 'ನಿಮ್ಮ AI ಕೃಷಿ ಮಿತ್ರ. ನಿಮ್ಮ ಫಾರ್ಮ್‌ಗೆ ಪೂರ್ವಭಾವಿ ಸಲಹೆ, ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ, ಬುದ್ಧಿವಂತ ವಿಶ್ಲೇಷಣೆಯಿಂದ ಬೆಂಬಲಿತವಾಗಿದೆ.',
        cta: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹೋಗಿ',
        footer: {
            voice: 'ಧ್ವನಿ-ಚಾಲಿತ',
            languages: 'ಕನ್ನಡ & English',
        }
    },
    sidebar: {
        dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        market: 'ಮಾರುಕಟ್ಟೆ ಸಲಹೆ',
        schemes: 'ಯೋಜನೆಗಳು',
        profile: 'ಪ್ರೊಫೈಲ್',
    },
    dashboard: {
        title: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    },
    crops: {
        sonaMasooriRice: 'ಸೋನಾ ಮಸೂರಿ ಅಕ್ಕಿ',
        tomato: 'ಟೊಮೆಟೊ',
    },
    weather: {
        title: 'ಇಂದಿನ ಹವಾಮಾನ',
        description: 'ಪ್ರಸ್ತುತ ಪರಿಸ್ಥಿತಿಗಳು ಮತ್ತು ಮುನ್ಸೂಚನೆ.',
        condition: 'ಭಾಗಶಃ ಮೋಡ',
        humidity: 'ಆರ್ದ್ರತೆ',
        wind: 'ಗಾಳಿ',
    },
    todos: {
        title: 'AI-ಚಾಲಿತ ಮಾಡಬೇಕಾದ ಪಟ್ಟಿ',
        description: 'ಇಂದಿನ ವೈಯಕ್ತಿಕ ಕಾರ್ಯಗಳು.',
        generate: 'ರಚಿಸಿ',
        prompt: 'ನಿಮ್ಮ ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಮಾಡಬೇಕಾದ ಪಟ್ಟಿಯನ್ನು ಪಡೆಯಲು "ರಚಿಸಿ" ಕ್ಲಿಕ್ ಮಾಡಿ.',
        toast: {
            fail: {
                title: 'ದೋಷ',
                description: 'ಮಾಡಬೇಕಾದ ಪಟ್ಟಿಗಳನ್ನು ರಚಿಸಲು ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
            }
        }
    },
    advisories: {
        title: 'ಇತ್ತೀಚಿನ ಸಲಹೆಗಳು',
        description: 'ಕೀಟ, ರೋಗ, ಮತ್ತು ಅಪಾಯದ ಎಚ್ಚರಿಕೆಗಳು.',
        pest: 'ಲೀಫ್‌ಹಾಪರ್ ಎಚ್ಚರಿಕೆ',
        disease: 'ಬ್ಲಾಸ್ಟ್ ರೋಗದ ಅಪಾಯ',
        risk: 'ಭಾರಿ ಮಳೆಯ ಮುನ್ಸೂಚನೆ',
        types: {
            pest: 'ಕೀಟ',
            disease: 'ರೋಗ',
            risk: 'ಅಪಾಯ',
        },
        levels: {
            low: 'ಕಡಿಮೆ',
            moderate: 'ಮಧ್ಯಮ',
            high: 'ಹೆಚ್ಚು',
        }
    },
    farmCard: {
        area: 'ಪ್ರದೇಶ',
        mandiPrice: 'ಮಂಡಿ ಬೆಲೆ',
        estYield: 'ಅಂದಾಜು ಇಳುವರಿ',
        suggestions: {
            button: 'ಸಲಹೆಗಳು',
            title: '{{cropName}} ಗಾಗಿ ಸಲಹೆಗಳು',
            description: 'ನಿಮ್ಮ ಇಳುವರಿಯನ್ನು ಸುಧಾರಿಸಲು AI-ಚಾಲಿತ ಶಿಫಾರಸುಗಳು.',
        },
        history: {
            button: 'ಇತಿಹಾಸ',
            title: '{{cropName}} ಗಾಗಿ ಇತಿಹಾಸ',
            description: 'ಹಿಂದಿನ наблюденияಗಳು ಮತ್ತು ಆರೋಗ್ಯ ತಪಾಸಣೆಗಳು.',
        },
    },
    addCrop: {
        title: 'ಹೊಸ ಬೆಳೆ ಸೇರಿಸಿ',
        button: 'ಬೆಳೆ ಸೇರಿಸಿ',
        form: {
            title: 'ಹೊಸ ಬೆಳೆ ಸೇರಿಸಿ',
            description: 'ನಿಮ್ಮ ಹೊಸ ಬೆಳೆಗೆ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.',
            area: {
                label: 'ಪ್ರದೇಶ (ಉದಾ., 5 ಎಕರೆ)',
                placeholder: '5 ಎಕರೆ',
            },
            breed: {
                label: 'ತಳಿ',
                placeholder: 'ಸೋನಾ ಮಸೂರಿ',
            },
            plantingDate: {
                label: 'ನಾಟಿ ದಿನಾಂಕ',
                placeholder: 'ದಿನಾಂಕವನ್ನು ಆರಿಸಿ',
            },
            yield: {
                label: 'ನಿರೀಕ್ಷಿತ ಇಳುವರಿ (ಉದಾ., 25 ಕ್ವಿಂಟಾಲ್)',
                placeholder: '25 ಕ್ವಿಂಟಾಲ್',
            },
            stage: {
                label: 'ಪ್ರಸ್ತುತ ಬೆಳೆ ಹಂತ',
                placeholder: 'ಒಂದು ಹಂತವನ್ನು ಆರಿಸಿ',
                seedling: 'ಸಸಿ',
                vegetative: 'ಸಸ್ಯಕ',
                flowering: 'ಹೂಬಿಡುವಿಕೆ',
                maturity: 'ಮಾಗಿದ',
            },
            soil: {
                label: 'ಮಣ್ಣಿನ ಪ್ರಕಾರ',
                placeholder: 'ಮಣ್ಣಿನ ಪ್ರಕಾರವನ್ನು ಆರಿಸಿ',
                alluvial: 'ಮೆಕ್ಕಲು ಮಣ್ಣು',
                black: 'ಕಪ್ಪು ಮಣ್ಣು',
                red: 'ಕೆಂಪು ಮಣ್ಣು',
                laterite: 'ಲ್ಯಾಟರೈಟ್ ಮಣ್ಣು',
                arid: 'ಶುಷ್ಕ ಮಣ್ಣು',
                forest: 'ಅರಣ್ಯ ಮಣ್ಣು',
                peat: 'ಪೀಟ್ ಮಣ್ಣು',
                saline: 'ಲವಣಯುಕ್ತ ಮಣ್ಣು',
                loam: 'ಜೇಡಿ ಮಣ್ಣು',
                sandy: 'ಮರಳು ಮಣ್ಣು',
                clay: 'ಜೇಡಿಮಣ್ಣಿನ ಲೋಮ್',
                silt: 'ಹೂಳು ಮಣ್ಣು',
            },
            save: 'ಬೆಳೆಯನ್ನು ಉಳಿಸಿ',
        }
    },
    market: {
        title: 'ಮಾರುಕಟ್ಟೆ ಸಲಹೆ',
        chart: {
            title: 'ಬೆಲೆ ಪ್ರವೃತ್ತಿ',
            description: '{{produce}} ಗಾಗಿ ಐತಿಹಾಸಿಕ ಬೆಲೆ ಡೇಟಾ.',
            daily: 'ದೈನಂದಿನ',
            weekly: 'ಸಾಪ್ತಾಹಿಕ',
            monthly: 'ಮಾಸಿಕ',
        },
        recommendation: {
            title: 'ಶಿಫಾರಸು',
            sell: 'ಮಾರಾಟ ಮಾಡಿ',
            hold: 'ಹಿಡಿದುಕೊಳ್ಳಿ',
            reason: 'ಕಾರಣ',
            fail: 'ಶಿಫಾರಸನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.',
        },
        toast: {
            fail: {
                title: 'ವಿಶ್ಲೇಷಣೆ ವಿಫಲವಾಗಿದೆ',
                description: 'ಮಾರುಕಟ್ಟೆ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಹಿಂಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.',
            }
        }
    },
    schemes: {
        title: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
        recommended: 'ನಿಮಗಾಗಿ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ',
        other: 'ಇತರ ಎಲ್ಲಾ ಯೋಜನೆಗಳು',
        list: {
            pmfby: {
                title: 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ (PMFBY)',
                description: 'ಅನಿರೀಕ್ಷಿತ ಘಟನೆಗಳಿಂದ ಉಂಟಾಗುವ ಇಳುವರಿ ನಷ್ಟದಿಂದ ರೈತರನ್ನು ರಕ್ಷಿಸಲು ಒಂದು ವ್ಯಾಪಕ ಬೆಳೆ ವಿಮಾ ಯೋಜನೆ.',
                eligibility: ' ಗೊತ್ತುಪಡಿಸಿದ ಪ್ರದೇಶಗಳಲ್ಲಿ ಅಕ್ಕಿಯಂತಹ ಅಧಿಸೂಚಿತ ಬೆಳೆಗಳನ್ನು ಬೆಳೆಯುವ ಎಲ್ಲಾ ರೈತರು ಅರ್ಹರು.',
                benefits: 'ನೈಸರ್ಗಿಕ ವಿಕೋಪಗಳು, ಕೀಟಗಳು ಮತ್ತು ರೋಗಗಳ ವಿರುದ್ಧ ವಿಮಾ ರಕ್ಷಣೆ.',
                howToApply: 'ರಾಷ್ಟ್ರೀಯ ಬೆಳೆ ವಿಮಾ ಪೋರ್ಟಲ್ ಅಥವಾ ಹಣಕಾಸು ಸಂಸ್ಥೆಯ ಮೂಲಕ ನೋಂದಾಯಿಸಿ.',
            },
            soilHealthCard: {
                title: 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಯೋಜನೆ',
                description: 'ಬೆಳೆವಾರು ಪೋಷಕಾಂಶಗಳ ಶಿಫಾರಸುಗಳೊಂದಿಗೆ ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಒದಗಿಸುತ್ತದೆ.',
                eligibility: 'ಎಲ್ಲಾ ರೈತರು ತಮ್ಮ ಹಿಡುವಳಿಗಳಿಗೆ ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಪಡೆಯಲು ಅರ್ಹರು.',
                benefits: 'ಗೊಬ್ಬರ ಬಳಕೆಯ ಬಗ್ಗೆ ತಿಳುವಳಿಕೆಯುಳ್ಳ ನಿರ್ಧಾರಗಳು, ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಮತ್ತು ಉತ್ಪಾದಕತೆ ಸುಧಾರಣೆಗೆ ಕಾರಣವಾಗುತ್ತದೆ.',
                howToApply: 'ನಿಮ್ಮ ಮಣ್ಣಿನ ಮಾದರಿಯನ್ನು ಪಡೆಯಲು ಸ್ಥಳೀಯ ಕೃಷಿ ಇಲಾಖೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ.',
            },
            nfsm: {
                title: 'ರಾಷ್ಟ್ರೀಯ ಆಹಾರ ಭದ್ರತಾ ಮಿಷನ್ (NFSM)',
                description: 'ಪ್ರದೇಶ ವಿಸ್ತರಣೆ ಮತ್ತು ಉತ್ಪಾದಕತೆ ಹೆಚ್ಚಳದ ಮೂಲಕ ಅಕ್ಕಿ ಉತ್ಪಾದನೆಯನ್ನು ಹೆಚ್ಚಿಸುವ ಗುರಿ ಹೊಂದಿದೆ.',
                eligibility: 'ಕಡಿಮೆ ಅಕ್ಕಿ ಉತ್ಪಾದಕತೆ ಹೊಂದಿರುವ ಜಿಲ್ಲೆಗಳನ್ನು ಗುರಿಯಾಗಿಸಿಕೊಂಡಿದೆ. ರೈತರಿಗೆ ಒಳಹರಿವು ಮತ್ತು ತಂತ್ರಜ್ಞಾನಕ್ಕಾಗಿ ನೆರವು ನೀಡಲಾಗುತ್ತದೆ.',
                benefits: 'ಬೀಜಗಳು, ಯಂತ್ರೋಪಕರಣಗಳು ಮತ್ತು ಇತರ ಒಳಹರಿವುಗಳ ಮೇಲೆ ಸಬ್ಸಿಡಿಗಳು.',
                howToApply: 'ರಾಜ್ಯ ಕೃಷಿ ಇಲಾಖೆಗಳು ಯೋಜನೆಗಳನ್ನು ಜಾರಿಗೊಳಿಸುತ್ತವೆ.',
            },
            kcc: {
                title: 'ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ (KCC) ಯೋಜನೆ',
                description: 'ರೈತರಿಗೆ ತಮ್ಮ ಕೃಷಿ ಮತ್ತು ಇತರ ಅಗತ್ಯಗಳಿಗಾಗಿ ಸಕಾಲದಲ್ಲಿ ಸಾಲ ಒದಗಿಸುತ್ತದೆ.',
                eligibility: 'ಸಣ್ಣ ಮತ್ತು ಅತಿ ಸಣ್ಣ ರೈತರು, ಪಾಲುದಾರರು ಮತ್ತು ಗೇಣಿದಾರರು ಸೇರಿದಂತೆ ಎಲ್ಲಾ ರೈತರು.',
                benefits: 'ಕೃಷಿ ಮತ್ತು ಸಂಬಂಧಿತ ಚಟುವಟಿಕೆಗಳಿಗೆ ಕಡಿಮೆ ಬಡ್ಡಿಯ ಸಾಲ.',
                howToApply: 'ಯಾವುದೇ ವಾಣಿಜ್ಯ ಬ್ಯಾಂಕ್, ಪ್ರಾದೇಶಿಕ ಗ್ರಾಮೀಣ ಬ್ಯಾಂಕ್ ಅಥವಾ ಸಹಕಾರಿ ಬ್ಯಾಂಕ್‌ನಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.',
            },
            pkvy: {
                title: 'ಪರಂಪರಾಗತ ಕೃಷಿ ವಿಕಾಸ ಯೋಜನೆ (PKVY)',
                description: 'ಸಾವಯವ ಗ್ರಾಮಗಳ ಅಳವಡಿಕೆ ಮತ್ತು ಪಿಜಿಎಸ್ ಪ್ರಮಾಣೀಕರಣದ ಮೂಲಕ ಸಾವಯವ ಕೃಷಿಯನ್ನು ಉತ್ತೇಜಿಸುತ್ತದೆ.',
                eligibility: '50 ಎಕರೆ ಅಥವಾ ಅದಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ಕ್ಲಸ್ಟರ್‌ನಲ್ಲಿರುವ ರೈತರು ಭಾಗವಹಿಸಲು ಅರ್ಹರು.',
                benefits: 'ಸಾವಯವ ಒಳಹರಿವು, ಪ್ರಮಾಣೀಕರಣ ಮತ್ತು ಮಾರುಕಟ್ಟೆಗಾಗಿ ಆರ್ಥಿಕ ನೆರವು.',
                howToApply: 'ರಾಜ್ಯ ಕೃಷಿ ಇಲಾಖೆಯಿಂದ ರಚಿಸಲಾದ ಕ್ಲಸ್ಟರ್‌ಗೆ ಸೇರಿ.',
            }
        },
        card: {
            learnMore: 'ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ',
            descriptionTitle: 'ವಿವರಣೆ',
            eligibilityTitle: 'ಅರ್ಹತಾ ಮಾನದಂಡ',
            benefitsTitle: 'ಪ್ರಯೋಜನಗಳು',
            howToApplyTitle: 'ಅನ್ವಯಿಸುವುದು ಹೇಗೆ',
            explain: 'ಧ್ವನಿಯಲ್ಲಿ ವಿವರಿಸಿ',
            website: 'ಅಧಿಕೃತ ಜಾಲತಾಣ',
            toast: {
                title: 'ಧ್ವನಿ ವಿವರಣೆ (ಅಣಕು)',
                description: 'ಇದು ಯೋಜನೆಯ ಆಡಿಯೋ ವಿವರಣೆಯನ್ನು ಪ್ಲೇ ಮಾಡುತ್ತದೆ.',
            }
        }
    },
    profile: {
        title: 'ಪ್ರೊಫೈಲ್ ಮತ್ತು ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
        open: 'ಪ್ರೊಫೈಲ್ ಪುಟ ತೆರೆಯಿರಿ',
        language: {
            title: 'ಭಾಷೆ',
            description: 'ಅಪ್ಲಿಕೇಶನ್‌ಗಾಗಿ ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆರಿಸಿ.',
        },
        account: {
            title: 'ನನ್ನ ಖಾತೆ',
            description: 'ನಿಮ್ಮ ಖಾತೆ ವಿವರಗಳನ್ನು ಮತ್ತು ಬೆಂಬಲ ಆಯ್ಕೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ.',
        },
        support: {
            title: 'ಬೆಂಬಲ',
            phone: 'ದೂರವಾಣಿ',
            email: 'ಇಮೇಲ್',
        },
        logout: 'ಲಾಗ್ ಔಟ್',
    },
    assistant: {
        placeholder: 'ಏನಾದರೂ ಕೇಳಿ',
        upload: 'ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
        send: 'ಸಂದೇಶ ಕಳುಹಿಸಿ',
    },
    voice: {
        prompt: 'ಏನಾದರೂ ಹೇಳಿ...',
    },
};

export const translations = { en, kn };

type NestedKey<T> = T extends object ? { [K in keyof T]: `${K & string}` | `${K & string}.${NestedKey<T[K]>}` }[keyof T] : never;
export type TranslationKey = NestedKey<typeof en>;
