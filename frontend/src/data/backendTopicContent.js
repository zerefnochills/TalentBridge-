// Backend Roadmap Topic Content Data

export const backendTopicContent = {
    intro: {
        id: "intro",
        title: "Introduction to Backend",
        definition: "Backend development focuses on server-side logic, databases, APIs, authentication, and scalability. It ensures data processing, security, and communication between frontend and servers.",
        importance: "The backend is the brain of any application. It handles business logic, stores data securely, and ensures that everything runs smoothly behind the scenes.",
        usage: "Every time you log in, make a payment, or send a message, backend code is running to process that request.",
        keyConcepts: [
            { id: "backend-def", title: "What is backend development?", description: "Understanding server-side vs client-side." },
            { id: "client-server", title: "Client-server architecture", description: "How browsers communicate with servers." },
            { id: "request-response", title: "Request-response cycle", description: "The lifecycle of an HTTP request." }
        ],
        resources: {
            videos: [
                { title: "How Backend Works", url: "https://www.youtube.com/watch?v=XBu54nfzxAQ", type: "Video" }
            ],
            articles: [
                { title: "What is Backend Development?", url: "https://www.roadmap.sh/guides/what-is-backend-development", type: "Article" }
            ]
        },
        studyPath: {
            prerequisites: ["Basic Computer Knowledge"],
            nextTopics: ["Programming Languages"]
        },
        aiPrompts: [
            "Explain the difference between frontend and backend.",
            "What happens when I type a URL in the browser?"
        ]
    },

    languages: {
        id: "languages",
        title: "Programming Languages",
        definition: "Backend languages are used to write server-side logic. Common choices include JavaScript (Node.js), Python, Java, Go, and PHP.",
        importance: "Choosing the right language depends on performance needs, developer productivity, and existing ecosystem.",
        usage: "Used to write the code that runs on the server, connects to databases, and handles API requests.",
        keyConcepts: [
            { id: "nodejs", title: "JavaScript (Node.js)", description: "Event-driven, non-blocking I/O." },
            { id: "python", title: "Python", description: "Great for data science and rapid development." },
            { id: "java", title: "Java", description: "Enterprise-grade, strongly typed." },
            { id: "go", title: "Go", description: "High performance, great for concurrency." },
            { id: "php", title: "PHP", description: "Powers a large portion of the web." }
        ],
        resources: {
            videos: [
                { title: "Backend Languages Explained", url: "https://www.youtube.com/watch?v=1gDhlt4c32k", type: "Video" }
            ],
            articles: [
                { title: "Choosing a Backend Language", url: "https://www.freecodecamp.org/news/best-backend-programming-languages/", type: "Article" }
            ]
        },
        studyPath: {
            prerequisites: ["Introduction to Backend"],
            nextTopics: ["Backend Frameworks"]
        },
        aiPrompts: [
            "Compare Node.js and Python for backend.",
            "Why is Go becoming popular?"
        ]
    },

    frameworks: {
        id: "frameworks",
        title: "Backend Frameworks",
        definition: "Frameworks provide a structure for building applications, handling routing, middleware, and database connections easier.",
        importance: "They speed up development by providing pre-built solutions for common problems.",
        usage: "Most backend developers use a framework rather than writing raw code for everything.",
        keyConcepts: [
            { id: "express", title: "Express.js", description: "Minimalist web framework for Node.js." },
            { id: "django", title: "Django", description: "High-level Python Web framework." },
            { id: "springboot", title: "Spring Boot", description: "Java framework for microservices." },
            { id: "flask", title: "Flask", description: "Micro web framework written in Python." },
            { id: "fastapi", title: "FastAPI", description: "Modern, high-performance Python web framework." }
        ],
        resources: {
            videos: [
                { title: "Framework Deep Dive", url: "https://www.youtube.com/watch?v=t_ispmWmdjY", type: "Video" }
            ],
            articles: [
                { title: "Backend Framework Comparison", url: "https://www.editorx.com/shaping-design/article/best-backend-frameworks", type: "Article" }
            ]
        },
        studyPath: {
            prerequisites: ["Programming Languages"],
            nextTopics: ["Databases"]
        },
        aiPrompts: [
            "Explain Express.js middleware.",
            "Django vs Flask: Which one to choose?"
        ]
    },

    databases: {
        id: "databases",
        title: "Databases",
        definition: "Databases are used to store, organize, and retrieve data. They can be Relational (SQL) or Non-Relational (NoSQL).",
        importance: "Data is the core of any application. Efficient storage and retrieval are critical for performance.",
        usage: "Storing user profiles, products, transactions, and logs.",
        keyConcepts: [
            { id: "mysql", title: "MySQL", description: "Popular open-source relational database." },
            { id: "postgres", title: "PostgreSQL", description: "Advanced, open source object-relational database system." },
            { id: "mongodb", title: "MongoDB", description: "NoSQL document database." },
            { id: "redis", title: "Redis", description: "In-memory data structure store, used as a database, cache, and message broker." }
        ],
        resources: {
            videos: [
                { title: "Database Fundamentals", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", type: "Video" }
            ],
            articles: [
                { title: "SQL vs NoSQL", url: "https://www.mongodb.com/nosql-explained/nosql-vs-sql", type: "Article" }
            ]
        },
        studyPath: {
            prerequisites: ["Backend Frameworks"],
            nextTopics: ["APIs & Authentication"]
        },
        aiPrompts: [
            "Explain ACID properties in databases.",
            "When should I use MongoDB instead of PostgreSQL?"
        ]
    },

    apis: {
        id: "apis",
        title: "APIs & Authentication",
        definition: "APIs (Application Programming Interfaces) allow different software systems to talk to each other. Authentication verifies user identity.",
        importance: "APIs power modern apps (mobile, single page apps). Authentication secures them.",
        usage: "Building RESTful services, securing endpoints with JWT or OAuth.",
        keyConcepts: [
            { id: "rest", title: "REST APIs", description: "Architectural style for designing networked applications." },
            { id: "jwt", title: "JWT", description: "JSON Web Token for secure information transmission." },
            { id: "oauth", title: "OAuth", description: "Open standard for access delegation." },
            { id: "sessions", title: "Sessions & Cookies", description: "Traditional state management." }
        ],
        resources: {
            videos: [
                { title: "Authentication Explained", url: "https://www.youtube.com/watch?v=SLf54oAMbbg", type: "Video" }
            ],
            articles: [
                { title: "API Design Best Practices", url: "https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/", type: "Article" }
            ]
        },
        studyPath: {
            prerequisites: ["Databases"],
            nextTopics: ["System Design Basics"]
        },
        aiPrompts: [
            "Explain how JWT works.",
            "What is the difference between Authentication and Authorization?"
        ]
    },

    "system-design": {
        id: "system-design",
        title: "System Design Basics",
        definition: "System design involves defining the architecture, components, modules, interfaces, and data for a system to satisfy specified requirements.",
        importance: "Essential for building scalable, reliable, and maintainable systems.",
        usage: "Designing systems that can handle high traffic and large amounts of data.",
        keyConcepts: [
            { id: "scalability", title: "Scalability", description: "Vertical vs Horizontal scaling." },
            { id: "load-balancing", title: "Load Balancing", description: "Distributing network traffic across multiple servers." },
            { id: "caching", title: "Caching", description: "Storing copies of data in a temporary storage location." },
            { id: "monolith-microservices", title: "Monolith vs Microservices", description: "Architectural patterns." }
        ],
        resources: {
            videos: [
                { title: "System Design for Beginners", url: "https://www.youtube.com/watch?v=m8Icp_Cid5o", type: "Video" }
            ],
            articles: [
                { title: "Intro to System Design", url: "https://github.com/donnemartin/system-design-primer", type: "Article" }
            ]
        },
        studyPath: {
            prerequisites: ["APIs & Authentication"],
            nextTopics: ["Deployment & DevOps Basics"]
        },
        aiPrompts: [
            "How does a Load Balancer work?",
            "Explain the CAP theorem."
        ]
    },

    devops: {
        id: "devops",
        title: "Deployment & DevOps Basics",
        definition: "DevOps is a set of practices that combines software development (Dev) and IT operations (Ops). Deployment is releasing your code to production.",
        importance: "Ensures rapid delivery of high-quality software.",
        usage: "Automating build, test, and release processes.",
        keyConcepts: [
            { id: "linux", title: "Linux basics", description: "Command line essentials." },
            { id: "docker", title: "Docker", description: "Containerization platform." },
            { id: "cicd", title: "CI/CD", description: "Continuous Integration and Continuous Deployment." },
            { id: "cloud", title: "Cloud (AWS/GCP basics)", description: "Cloud computing services." }
        ],
        resources: {
            videos: [
                { title: "DevOps Explained", url: "https://www.youtube.com/watch?v=0yWAtQ6wYNM", type: "Video" }
            ],
            articles: [
                { title: "How Deployment Works", url: "https://aws.amazon.com/devops/what-is-devops/", type: "Article" }
            ]
        },
        studyPath: {
            prerequisites: ["System Design Basics"],
            nextTopics: []
        },
        aiPrompts: [
            "What is Docker used for?",
            "Explain CI/CD pipeline."
        ]
    }
};

export default backendTopicContent;
