const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Skill = require('../models/Skill');
const Role = require('../models/Role');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const skills = [
    {
        name: 'JavaScript',
        category: 'Programming',
        description: 'Modern JavaScript programming language',
        assessmentQuestions: [
            {
                question: 'What is the output of: console.log(typeof null)?',
                type: 'mcq',
                options: ['null', 'object', 'undefined', 'number'],
                correctAnswer: 'object',
                difficulty: 'easy',
                points: 10
            },
            {
                question: 'Which method is used to add an element at the end of an array?',
                type: 'mcq',
                options: ['push()', 'pop()', 'shift()', 'unshift()'],
                correctAnswer: 'push()',
                difficulty: 'easy',
                points: 10
            },
            {
                question: 'What is a closure in JavaScript?',
                type: 'scenario',
                options: ['A function with access to parent scope', 'A loop structure', 'An object property', 'A data type'],
                correctAnswer: 'A function with access to parent scope',
                difficulty: 'medium',
                points: 15
            },
            {
                question: 'What does "use strict" do?',
                type: 'mcq',
                options: ['Enables strict mode', 'Comments code', 'Imports library', 'None'],
                correctAnswer: 'Enables strict mode',
                difficulty: 'medium',
                points: 10
            },
            {
                question: 'What is the result of: 2 + "2"?',
                type: 'code-output',
                options: ['4', '22', 'NaN', 'Error'],
                correctAnswer: '22',
                difficulty: 'easy',
                points: 10
            }
        ]
    },
    {
        name: 'React',
        category: 'Frameworks',
        description: 'React.js frontend library',
        assessmentQuestions: [
            {
                question: 'What is JSX?',
                type: 'mcq',
                options: ['JavaScript XML', 'Java Syntax', 'JSON Extension', 'None'],
                correctAnswer: 'JavaScript XML',
                difficulty: 'easy',
                points: 10
            },
            {
                question: 'Which hook is used for side effects?',
                type: 'mcq',
                options: ['useEffect', 'useState', 'useContext', 'useReducer'],
                correctAnswer: 'useEffect',
                difficulty: 'medium',
                points: 15
            },
            {
                question: 'What is Virtual DOM?',
                type: 'scenario',
                options: ['In-memory representation of DOM', 'Browser API', 'CSS property', 'HTML element'],
                correctAnswer: 'In-memory representation of DOM',
                difficulty: 'medium',
                points: 15
            },
            {
                question: 'How do you pass data to child components?',
                type: 'mcq',
                options: ['Props', 'State', 'Events', 'Functions'],
                correctAnswer: 'Props',
                difficulty: 'easy',
                points: 10
            }
        ]
    },
    {
        name: 'Node.js',
        category: 'Programming',
        description: 'Server-side JavaScript runtime',
        assessmentQuestions: [
            {
                question: 'What is Node.js built on?',
                type: 'mcq',
                options: ['V8 Engine', 'SpiderMonkey', 'Chakra', 'JavaScriptCore'],
                correctAnswer: 'V8 Engine',
                difficulty: 'easy',
                points: 10
            },
            {
                question: 'Which module is used for file operations?',
                type: 'mcq',
                options: ['fs', 'http', 'path', 'os'],
                correctAnswer: 'fs',
                difficulty: 'easy',
                points: 10
            },
            {
                question: 'What is middleware in Express?',
                type: 'scenario',
                options: ['Function with access to req/res', 'Database', 'Router', 'Template'],
                correctAnswer: 'Function with access to req/res',
                difficulty: 'medium',
                points: 15
            }
        ]
    },
    {
        name: 'MongoDB',
        category: 'Tools',
        description: 'NoSQL database',
        assessmentQuestions: [
            {
                question: 'What type of database is MongoDB?',
                type: 'mcq',
                options: ['NoSQL', 'SQL', 'Graph', 'NewSQL'],
                correctAnswer: 'NoSQL',
                difficulty: 'easy',
                points: 10
            },
            {
                question: 'What is a collection in MongoDB?',
                type: 'mcq',
                options: ['Group of documents', 'Single record', 'Database', 'Schema'],
                correctAnswer: 'Group of documents',
                difficulty: 'easy',
                points: 10
            }
        ]
    },
    {
        name: 'Git',
        category: 'Tools',
        description: 'Version control system',
        assessmentQuestions: [
            {
                question: 'Which command creates a new branch?',
                type: 'mcq',
                options: ['git branch name', 'git create name', 'git new name', 'git add name'],
                correctAnswer: 'git branch name',
                difficulty: 'easy',
                points: 10
            },
            {
                question: 'What does git pull do?',
                type: 'mcq',
                options: ['Fetch and merge', 'Only fetch', 'Only merge', 'Delete branch'],
                correctAnswer: 'Fetch and merge',
                difficulty: 'medium',
                points: 15
            }
        ]
    },
    {
        name: 'Communication',
        category: 'Soft Skills',
        description: 'Effective communication skills',
        assessmentQuestions: [
            {
                question: 'What is active listening?',
                type: 'scenario',
                options: ['Fully concentrating on speaker', 'Waiting to speak', 'Interrupting', 'Multitasking'],
                correctAnswer: 'Fully concentrating on speaker',
                difficulty: 'easy',
                points: 10
            }
        ]
    },
    {
        name: 'Python',
        category: 'Programming',
        description: 'Python programming language',
        assessmentQuestions: [
            {
                question: 'What is a list comprehension?',
                type: 'mcq',
                options: ['Concise way to create lists', 'Loop structure', 'Function', 'Class'],
                correctAnswer: 'Concise way to create lists',
                difficulty: 'medium',
                points: 15
            }
        ]
    },
    {
        name: 'SQL',
        category: 'Programming',
        description: 'Structured Query Language',
        assessmentQuestions: [
            {
                question: 'Which command retrieves data?',
                type: 'mcq',
                options: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'],
                correctAnswer: 'SELECT',
                difficulty: 'easy',
                points: 10
            }
        ]
    }
];

async function seedSkills() {
    try {
        await Skill.deleteMany({});
        const createdSkills = await Skill.insertMany(skills);
        console.log('✅ Skills seeded:', createdSkills.length);
        return createdSkills;
    } catch (error) {
        console.error('Error seeding skills:', error);
        throw error;
    }
}

async function seedRoles(skillsData) {
    try {
        const skillMap = {};
        skillsData.forEach(skill => {
            skillMap[skill.name] = skill._id;
        });

        const roles = [
            {
                title: 'Frontend Developer',
                description: 'Build user interfaces with modern frameworks',
                requiredSkills: [
                    { skillId: skillMap['JavaScript'], minimumSCI: 70 },
                    { skillId: skillMap['React'], minimumSCI: 65 },
                    { skillId: skillMap['Git'], minimumSCI: 50 }
                ],
                nextRoles: [],
                avgSalary: '$60,000 - $90,000',
                workEnvironment: 'Remote-friendly, collaborative team setting with frequent design reviews and agile sprints.',
                keyCompetencies: [
                    'UI/UX Design Principles',
                    'Responsive Design',
                    'State Management',
                    'API Integration',
                    'Performance Optimization'
                ],
                learningResources: [
                    { title: 'React Official Docs', url: 'https://react.dev', type: 'documentation' },
                    { title: 'JavaScript.info', url: 'https://javascript.info', type: 'article' },
                    { title: 'Frontend Masters', url: 'https://frontendmasters.com', type: 'course' }
                ]
            },
            {
                title: 'Backend Developer',
                description: 'Build server-side applications',
                requiredSkills: [
                    { skillId: skillMap['Node.js'], minimumSCI: 70 },
                    { skillId: skillMap['MongoDB'], minimumSCI: 60 },
                    { skillId: skillMap['Git'], minimumSCI: 50 }
                ],
                nextRoles: [],
                avgSalary: '$65,000 - $95,000',
                workEnvironment: 'Focus on system architecture, database design, and API development. Often involves code reviews and performance tuning.',
                keyCompetencies: [
                    'RESTful API Design',
                    'Database Management',
                    'Authentication & Security',
                    'Server Optimization',
                    'Microservices Architecture'
                ],
                learningResources: [
                    { title: 'Node.js Official Docs', url: 'https://nodejs.org/docs', type: 'documentation' },
                    { title: 'MongoDB University', url: 'https://university.mongodb.com', type: 'course' },
                    { title: 'Express.js Guide', url: 'https://expressjs.com/en/guide/routing.html', type: 'documentation' }
                ]
            },
            {
                title: 'Full Stack Developer',
                description: 'Work on both frontend and backend',
                requiredSkills: [
                    { skillId: skillMap['JavaScript'], minimumSCI: 70 },
                    { skillId: skillMap['React'], minimumSCI: 65 },
                    { skillId: skillMap['Node.js'], minimumSCI: 65 },
                    { skillId: skillMap['MongoDB'], minimumSCI: 60 }
                ],
                nextRoles: [],
                avgSalary: '$70,000 - $110,000',
                workEnvironment: 'Versatile role requiring end-to-end ownership of features. Involves cross-functional collaboration with designers and product managers.',
                keyCompetencies: [
                    'Full Application Lifecycle',
                    'DevOps Basics',
                    'System Design',
                    'Cross-Browser Compatibility',
                    'Deployment & CI/CD'
                ],
                learningResources: [
                    { title: 'The Odin Project', url: 'https://www.theodinproject.com', type: 'course' },
                    { title: 'Full Stack Open', url: 'https://fullstackopen.com', type: 'course' },
                    { title: 'freeCodeCamp', url: 'https://www.freecodecamp.org', type: 'course' }
                ]
            }
        ];

        await Role.deleteMany({});
        const createdRoles = await Role.insertMany(roles);
        console.log('✅ Roles seeded:', createdRoles.length);

        // Update nextRoles
        await Role.findByIdAndUpdate(createdRoles[0]._id, {
            nextRoles: [createdRoles[2]._id]
        });
        await Role.findByIdAndUpdate(createdRoles[1]._id, {
            nextRoles: [createdRoles[2]._id]
        });

        return createdRoles;
    } catch (error) {
        console.error('Error seeding roles:', error);
        throw error;
    }
}

async function seed() {
    try {
        console.log('🌱 Starting database seeding...');
        const skills = await seedSkills();
        await seedRoles(skills);
        console.log('✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();
