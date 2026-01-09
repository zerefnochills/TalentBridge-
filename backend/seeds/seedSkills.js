const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Skill = require('../models/Skill');
const Role = require('../models/Role');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const skillsData = [
    // Programming Languages
    { name: "JavaScript", category: "Programming", description: "High-level, interpreted programming language for the web.", assessmentQuestions: [{ question: "Typeof null?", type: "mcq", options: ["object", "null"], correctAnswer: "object", difficulty: "medium" }] },
    { name: "Python", category: "Programming", description: "General-purpose programming language.", assessmentQuestions: [{ question: "Mutable type?", type: "mcq", options: ["List", "Tuple"], correctAnswer: "List", difficulty: "easy" }] },
    { name: "Java", category: "Programming", description: "Object-oriented language." },
    { name: "C++", category: "Programming", description: "Extension of C." },
    { name: "TypeScript", category: "Programming", description: "Typed superset of JavaScript." },
    { name: "Go", category: "Programming", description: "Statically typed language from Google." },
    { name: "Rust", category: "Programming", description: "Performance and safety focused." },
    { name: "Swift", category: "Programming", description: "Apple's programming language." },
    { name: "Kotlin", category: "Programming", description: "Modern Android language." },
    { name: "PHP", category: "Programming", description: "Server-side scripting language." },
    { name: "Ruby", category: "Programming", description: "Dynamic, open source language." },

    // Web Technologies
    { name: "HTML", category: "Programming", description: "Standard markup language." },
    { name: "CSS", category: "Programming", description: "Style sheet language." },

    // Frameworks & Libraries
    { name: "React", category: "Frameworks", description: "UI library." },
    { name: "Node.js", category: "Frameworks", description: "JS runtime." },
    { name: "Express.js", category: "Frameworks", description: "Web framework for Node." },
    { name: "Angular", category: "Frameworks", description: "Platform by Google." },
    { name: "Vue.js", category: "Frameworks", description: "Progressive framework." },
    { name: "Spring Boot", category: "Frameworks", description: "Java framework." },
    { name: "Django", category: "Frameworks", description: "Python Web framework." },
    { name: "Flask", category: "Frameworks", description: "Micro web framework for Python." },
    { name: "Flutter", category: "Frameworks", description: "UI toolkit by Google." },
    { name: "React Native", category: "Frameworks", description: "Mobile apps with React." },

    // Tools & Platforms
    { name: "SQL", category: "Tools", description: "Database language." },
    { name: "MongoDB", category: "Tools", description: "NoSQL Database." },
    { name: "PostgreSQL", category: "Tools", description: "Relational Database." },
    { name: "AWS", category: "Tools", description: "Cloud computing." },
    { name: "Docker", category: "Tools", description: "Containerization." },
    { name: "Kubernetes", category: "Tools", description: "Orchestration." },
    { name: "Git", category: "Tools", description: "Version control." },
    { name: "Linux", category: "Tools", description: "Operating System." },
    { name: "Jenkins", category: "Tools", description: "Automation server." },

    // Soft Skills
    { name: "Communication", category: "Soft Skills", description: "Effective information exchange." },
    { name: "Problem Solving", category: "Soft Skills", description: "Finding solutions." },
    { name: "Leadership", category: "Soft Skills", description: "Guiding others." },
    { name: "Teamwork", category: "Soft Skills", description: "Collaborative effort." }
];

const seedDB = async () => {
    try {
        console.log('Connecting to MongoDB...', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const skillMap = {};

        // 1. Seed Skills
        console.log('Seeding Skills...');
        for (const skill of skillsData) {
            const s = await Skill.findOneAndUpdate(
                { name: skill.name },
                skill,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            skillMap[skill.name] = s._id;
        }
        console.log(`Seeded ${skillsData.length} skills`);

        // 2. Seed Roles
        const rolesData = [
            {
                title: "Frontend Developer",
                description: "Specializes in building the client-side of web applications.",
                requiredSkills: [
                    { skillId: skillMap["JavaScript"], minimumSCI: 80 },
                    { skillId: skillMap["React"], minimumSCI: 75 },
                    { skillId: skillMap["HTML"], minimumSCI: 85 },
                    { skillId: skillMap["CSS"], minimumSCI: 80 },
                    { skillId: skillMap["TypeScript"], minimumSCI: 70 },
                    { skillId: skillMap["Git"], minimumSCI: 60 }
                ]
            },
            {
                title: "Backend Developer",
                description: "Focuses on server-side logic, databases, and APIs.",
                requiredSkills: [
                    { skillId: skillMap["Node.js"], minimumSCI: 80 },
                    { skillId: skillMap["Express.js"], minimumSCI: 75 },
                    { skillId: skillMap["MongoDB"], minimumSCI: 70 },
                    { skillId: skillMap["SQL"], minimumSCI: 65 },
                    { skillId: skillMap["Python"], minimumSCI: 60 },
                    { skillId: skillMap["Git"], minimumSCI: 65 }
                ]
            },
            {
                title: "Full Stack Developer",
                description: "Capable of working on both client and server sides.",
                requiredSkills: [
                    { skillId: skillMap["JavaScript"], minimumSCI: 85 },
                    { skillId: skillMap["React"], minimumSCI: 75 },
                    { skillId: skillMap["Node.js"], minimumSCI: 75 },
                    { skillId: skillMap["MongoDB"], minimumSCI: 70 },
                    { skillId: skillMap["AWS"], minimumSCI: 60 }
                ]
            },
            {
                title: "DevOps Engineer",
                description: "Focuses on CI/CD, infrastructure, and automation.",
                requiredSkills: [
                    { skillId: skillMap["AWS"], minimumSCI: 80 },
                    { skillId: skillMap["Docker"], minimumSCI: 85 },
                    { skillId: skillMap["Kubernetes"], minimumSCI: 75 },
                    { skillId: skillMap["Linux"], minimumSCI: 80 },
                    { skillId: skillMap["Python"], minimumSCI: 70 },
                    { skillId: skillMap["Jenkins"], minimumSCI: 70 }
                ]
            },
            {
                title: "Mobile Developer",
                description: "Builds applications for mobile devices.",
                requiredSkills: [
                    { skillId: skillMap["React Native"], minimumSCI: 80 },
                    { skillId: skillMap["Flutter"], minimumSCI: 75 },
                    { skillId: skillMap["JavaScript"], minimumSCI: 75 },
                    { skillId: skillMap["Swift"], minimumSCI: 60 },
                    { skillId: skillMap["Kotlin"], minimumSCI: 60 }
                ]
            },
            {
                title: "Java Developer",
                description: "Enterprise application development with Java.",
                requiredSkills: [
                    { skillId: skillMap["Java"], minimumSCI: 85 },
                    { skillId: skillMap["Spring Boot"], minimumSCI: 80 },
                    { skillId: skillMap["SQL"], minimumSCI: 75 },
                    { skillId: skillMap["Git"], minimumSCI: 65 }
                ]
            }
        ];

        console.log('Seeding Roles...');
        for (const role of rolesData) {
            // Filter out any undefined skillIds (e.g., if I missed a skill in skillsData)
            role.requiredSkills = role.requiredSkills.filter(s => s.skillId);

            await Role.findOneAndUpdate(
                { title: role.title },
                role,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }
        console.log(`Seeded ${rolesData.length} roles`);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seed Error:', err);
        process.exit(1);
    }
};

seedDB();
