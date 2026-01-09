// Full Stack Roadmap Topic Content Data

export const fullstackTopicContent = {
    "web-foundations": {
        id: "web-foundations",
        title: "Web Foundations",
        definition: "The fundamentals of how the web works - HTTP, browsers, servers, and the basic technologies that power the internet.",
        importance: "Understanding web fundamentals makes you a better developer. It helps you debug issues and make better architectural decisions.",
        usage: "Understanding request/response cycles, how browsers render pages, and how clients communicate with servers.",
        keyConcepts: [
            { id: "http", title: "HTTP Protocol", description: "GET, POST, PUT, DELETE methods" },
            { id: "browsers", title: "How Browsers Work", description: "Rendering, parsing, executing" },
            { id: "dns", title: "DNS & Domains", description: "How URLs resolve to servers" },
            { id: "hosting", title: "Web Hosting", description: "Where websites live" }
        ],
        resources: {
            videos: [
                { title: "How The Web Works", url: "https://www.youtube.com/watch?v=hJHvdBlSxug", type: "Video" }
            ],
            articles: [
                { title: "How the Web Works - MDN", url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works", type: "Article" }
            ]
        },
        studyPath: {
            prerequisites: ["Basic computer skills"],
            nextTopics: ["Frontend Development", "Backend Development"]
        },
        aiPrompts: ["Explain HTTP request lifecycle", "What happens when you type a URL?"]
    },

    "fs-frontend": {
        id: "fs-frontend",
        title: "Frontend Development",
        definition: "Building the user interface and client-side logic. Includes HTML, CSS, JavaScript, and a modern framework like React.",
        importance: "The frontend is what users see and interact with. Good frontend skills create great user experiences.",
        usage: "Creating responsive UIs, handling user interactions, fetching data from APIs.",
        keyConcepts: [
            { id: "html-css-js", title: "HTML, CSS, JavaScript", description: "Core web technologies" },
            { id: "react", title: "React / Vue", description: "Modern UI frameworks" },
            { id: "responsive", title: "Responsive Design", description: "Mobile-first development" },
            { id: "state", title: "State Management", description: "Managing application data" }
        ],
        resources: {
            videos: [
                { title: "Frontend Roadmap", url: "https://www.youtube.com/watch?v=9He4UBLyk8Y", type: "Video" }
            ],
            articles: [
                { title: "Frontend Developer Roadmap", url: "https://roadmap.sh/frontend", type: "Article" }
            ]
        },
        studyPath: {
            prerequisites: ["Web Foundations"],
            nextTopics: ["Databases & ORMs"]
        },
        aiPrompts: ["Best practices for React projects", "How to structure frontend code?"]
    },

    "fs-backend": {
        id: "fs-backend",
        title: "Backend Development",
        definition: "Server-side programming that handles business logic, data processing, and communication with databases and external services.",
        importance: "The backend powers your application. It handles data, authentication, and the complex logic users don't see.",
        usage: "Building APIs, processing data, handling user authentication, integrating third-party services.",
        keyConcepts: [
            { id: "nodejs", title: "Node.js / Express", description: "JavaScript backend framework" },
            { id: "python", title: "Python / Django", description: "Alternative backend stack" },
            { id: "rest", title: "REST API Design", description: "Creating well-structured APIs" },
            { id: "middleware", title: "Middleware", description: "Request processing pipelines" }
        ],
        resources: {
            videos: [
                { title: "Node.js Full Course", url: "https://www.youtube.com/watch?v=Oe421EPjeBE", type: "Video" }
            ],
            articles: [
                { title: "Backend Developer Roadmap", url: "https://roadmap.sh/backend", type: "Article" }
            ]
        },
        studyPath: {
            prerequisites: ["Web Foundations"],
            nextTopics: ["Databases & ORMs"]
        },
        aiPrompts: ["Express.js best practices", "How to structure a Node.js project?"]
    },

    "fs-databases": {
        id: "fs-databases",
        title: "Databases & ORMs",
        definition: "Storing and managing data with SQL or NoSQL databases, and using ORMs to interact with them efficiently.",
        importance: "Data is the heart of most applications. Understanding databases is critical for full-stack developers.",
        usage: "Designing schemas, writing queries, using Prisma/Sequelize/Mongoose ORMs.",
        keyConcepts: [
            { id: "sql", title: "SQL Databases", description: "PostgreSQL, MySQL" },
            { id: "nosql", title: "NoSQL Databases", description: "MongoDB, Redis" },
            { id: "orm", title: "ORMs", description: "Prisma, Mongoose, Sequelize" },
            { id: "schema", title: "Schema Design", description: "Modeling data relationships" }
        ],
        resources: {
            videos: [
                { title: "Database Design", url: "https://www.youtube.com/watch?v=ztHopE5Wnpc", type: "Video" }
            ],
            articles: [
                { title: "Prisma Docs", url: "https://www.prisma.io/docs", type: "Article" }
            ]
        },
        studyPath: {
            prerequisites: ["Frontend Development", "Backend Development"],
            nextTopics: ["API Design & Integration"]
        },
        aiPrompts: ["When to use SQL vs NoSQL?", "How does Prisma work?"]
    },

    "fs-apis": {
        id: "fs-apis",
        title: "API Design & Integration",
        definition: "Creating and consuming APIs that connect your frontend to your backend and to external services.",
        importance: "APIs are the glue that connects everything. Good API design makes your app easier to build and maintain.",
        usage: "Building REST/GraphQL APIs, integrating payment gateways, social login, third-party services.",
        keyConcepts: [
            { id: "rest", title: "REST API Design", description: "Resource-based endpoints" },
            { id: "graphql", title: "GraphQL", description: "Query-based API alternative" },
            { id: "validation", title: "Input Validation", description: "Zod, Joi for request validation" },
            { id: "integration", title: "Third-party APIs", description: "Stripe, Auth0, etc." }
        ],
        resources: {
            videos: [
                { title: "REST API Design", url: "https://www.youtube.com/watch?v=fgTGADljAeg", type: "Video" }
            ],
            articles: [
                { title: "API Design Best Practices", url: "https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/", type: "Article" }
            ]
        },
        studyPath: {
            prerequisites: ["Databases & ORMs"],
            nextTopics: ["Authentication & Security"]
        },
        aiPrompts: ["REST vs GraphQL comparison", "How to version APIs?"]
    },

    "fs-auth": {
        id: "fs-auth",
        title: "Authentication & Security",
        definition: "Securing your application through proper authentication, authorization, and security best practices.",
        importance: "Security vulnerabilities can destroy your app and reputation. Authentication is required for most apps.",
        usage: "Implementing login systems, protecting routes, storing secrets, preventing attacks.",
        keyConcepts: [
            { id: "jwt", title: "JWT Authentication", description: "Token-based auth" },
            { id: "oauth", title: "OAuth / Social Login", description: "Google, GitHub login" },
            { id: "sessions", title: "Session Management", description: "Cookie-based auth" },
            { id: "security", title: "Security Best Practices", description: "HTTPS, CORS, XSS prevention" }
        ],
        resources: {
            videos: [
                { title: "JWT Explained", url: "https://www.youtube.com/watch?v=7Q17ubqLfaM", type: "Video" }
            ],
            articles: [
                { title: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/", type: "Article" }
            ]
        },
        studyPath: {
            prerequisites: ["API Design & Integration"],
            nextTopics: ["Full Stack Deployment"]
        },
        aiPrompts: ["How does JWT authentication work?", "Common security vulnerabilities?"]
    },

    "fs-deployment": {
        id: "fs-deployment",
        title: "Full Stack Deployment",
        definition: "Deploying complete applications with frontend, backend, and database - making everything work together in production.",
        importance: "Deployment is the final step. Understanding it helps you ship products and debug production issues.",
        usage: "Setting up servers, configuring domains, managing environments, monitoring applications.",
        keyConcepts: [
            { id: "docker", title: "Docker", description: "Containerizing applications" },
            { id: "cloud", title: "Cloud Platforms", description: "AWS, Vercel, Railway" },
            { id: "ci-cd", title: "CI/CD Pipelines", description: "Automated deployments" },
            { id: "monitoring", title: "Monitoring & Logging", description: "Tracking app health" }
        ],
        resources: {
            videos: [
                { title: "Full Stack Deployment", url: "https://www.youtube.com/watch?v=l134cBAJCuc", type: "Video" }
            ],
            articles: [
                { title: "Railway Deployment", url: "https://docs.railway.app/", type: "Article" }
            ]
        },
        studyPath: {
            prerequisites: ["Authentication & Security"],
            nextTopics: []
        },
        aiPrompts: ["How to deploy a MERN stack app?", "Docker basics for beginners?"]
    }
};

export default fullstackTopicContent;
