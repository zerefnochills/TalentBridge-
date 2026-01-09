// Frontend Roadmap Topic Content Data

export const frontendTopicContent = {
    "html-css": {
        id: "html-css",
        title: "HTML & CSS Basics",
        definition: "HTML (HyperText Markup Language) structures web content, while CSS (Cascading Style Sheets) styles and layouts that content. Together they form the foundation of all web pages.",
        importance: "Every website you visit is built on HTML and CSS. Mastering these fundamentals is essential before moving to any framework.",
        usage: "Creating web page structure, styling elements, building layouts, and making websites visually appealing.",
        keyConcepts: [
            { id: "html-structure", title: "HTML Document Structure", description: "DOCTYPE, head, body, semantic elements" },
            { id: "css-selectors", title: "CSS Selectors & Specificity", description: "How to target elements effectively" },
            { id: "box-model", title: "Box Model", description: "Margin, border, padding, content" },
            { id: "flexbox", title: "Flexbox", description: "One-dimensional layouts" },
            { id: "grid", title: "CSS Grid", description: "Two-dimensional layouts" }
        ],
        resources: {
            videos: [
                { title: "HTML & CSS Full Course", url: "https://www.youtube.com/watch?v=mU6anWqZJcc", type: "Video" }
            ],
            articles: [
                { title: "MDN Web Docs - HTML", url: "https://developer.mozilla.org/en-US/docs/Learn/HTML", type: "Article" },
                { title: "CSS Tricks - Flexbox Guide", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/", type: "Article" }
            ]
        },
        studyPath: {
            prerequisites: ["Basic computer skills"],
            nextTopics: ["JavaScript Fundamentals"]
        },
        aiPrompts: ["Explain the CSS box model", "When should I use Flexbox vs Grid?"]
    },

    "javascript": {
        id: "javascript",
        title: "JavaScript Fundamentals",
        definition: "JavaScript is the programming language of the web. It adds interactivity, handles events, manipulates the DOM, and powers modern web applications.",
        importance: "JavaScript is essential for creating dynamic, interactive web experiences. It's the only programming language that runs natively in browsers.",
        usage: "Form validation, animations, API calls, DOM manipulation, and building interactive features.",
        keyConcepts: [
            { id: "variables", title: "Variables & Data Types", description: "let, const, strings, numbers, objects, arrays" },
            { id: "functions", title: "Functions & Scope", description: "Function declarations, arrows, closures" },
            { id: "dom", title: "DOM Manipulation", description: "Selecting and modifying elements" },
            { id: "events", title: "Event Handling", description: "Click, submit, keyboard events" },
            { id: "async", title: "Async JavaScript", description: "Promises, async/await, fetch API" }
        ],
        resources: {
            videos: [
                { title: "JavaScript Full Course", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg", type: "Video" }
            ],
            articles: [
                { title: "JavaScript.info", url: "https://javascript.info/", type: "Article" }
            ]
        },
        studyPath: {
            prerequisites: ["HTML & CSS Basics"],
            nextTopics: ["Responsive Design"]
        },
        aiPrompts: ["Explain closures in JavaScript", "What is the difference between let and const?"]
    },

    "responsive": {
        id: "responsive",
        title: "Responsive Design",
        definition: "Responsive design ensures websites work well on all devices and screen sizes, from mobile phones to large desktop monitors.",
        importance: "Over 50% of web traffic comes from mobile devices. Responsive design is now a requirement, not an option.",
        usage: "Creating fluid layouts, mobile-first design, handling different screen sizes and orientations.",
        keyConcepts: [
            { id: "media-queries", title: "Media Queries", description: "Applying styles based on screen size" },
            { id: "mobile-first", title: "Mobile-First Design", description: "Designing for mobile, enhancing for desktop" },
            { id: "fluid-layouts", title: "Fluid Layouts", description: "Using relative units like %, em, rem" },
            { id: "breakpoints", title: "Breakpoints", description: "Common device width thresholds" }
        ],
        resources: {
            videos: [
                { title: "Responsive Web Design", url: "https://www.youtube.com/watch?v=srvUrASNj0s", type: "Video" }
            ],
            articles: [
                { title: "Responsive Design Basics", url: "https://web.dev/responsive-web-design-basics/", type: "Article" }
            ]
        },
        studyPath: {
            prerequisites: ["JavaScript Fundamentals"],
            nextTopics: ["React / Vue / Angular"]
        },
        aiPrompts: ["How do I implement mobile-first design?", "What are common breakpoints?"]
    },

    "fe-frameworks": {
        id: "fe-frameworks",
        title: "Frontend Frameworks",
        definition: "Frontend frameworks like React, Vue, and Angular provide structured ways to build complex, interactive user interfaces with reusable components.",
        importance: "Frameworks dramatically speed up development and are required for most frontend jobs. React is the most popular choice.",
        usage: "Building single-page applications (SPAs), component-based architecture, managing complex UI state.",
        keyConcepts: [
            { id: "react", title: "React", description: "Component-based library by Facebook" },
            { id: "vue", title: "Vue.js", description: "Progressive framework, great for beginners" },
            { id: "angular", title: "Angular", description: "Full-featured framework by Google" },
            { id: "components", title: "Components", description: "Reusable UI building blocks" },
            { id: "virtual-dom", title: "Virtual DOM", description: "Efficient UI updates" }
        ],
        resources: {
            videos: [
                { title: "React Tutorial for Beginners", url: "https://www.youtube.com/watch?v=bMknfKXIFA8", type: "Video" }
            ],
            articles: [
                { title: "React Official Docs", url: "https://react.dev/learn", type: "Article" }
            ]
        },
        studyPath: {
            prerequisites: ["Responsive Design"],
            nextTopics: ["State Management"]
        },
        aiPrompts: ["Should I learn React or Vue first?", "Explain React hooks"]
    },

    "state-mgmt": {
        id: "state-mgmt",
        title: "State Management",
        definition: "State management handles data that changes over time in your application - user inputs, fetched data, UI state, and more.",
        importance: "As apps grow, managing state becomes complex. Proper state management prevents bugs and improves maintainability.",
        usage: "Managing global state, handling form data, caching API responses, synchronizing UI.",
        keyConcepts: [
            { id: "local-state", title: "Local State", description: "Component-level state (useState)" },
            { id: "context", title: "React Context", description: "Sharing state across components" },
            { id: "redux", title: "Redux / Zustand", description: "External state management libraries" },
            { id: "server-state", title: "Server State", description: "React Query, SWR for API data" }
        ],
        resources: {
            videos: [
                { title: "Redux Tutorial", url: "https://www.youtube.com/watch?v=poQXNp9ItL4", type: "Video" }
            ],
            articles: [
                { title: "State Management Guide", url: "https://kentcdodds.com/blog/application-state-management-with-react", type: "Article" }
            ]
        },
        studyPath: {
            prerequisites: ["React / Vue / Angular"],
            nextTopics: ["Testing & Performance"]
        },
        aiPrompts: ["When should I use Redux vs Context?", "Explain React Query benefits"]
    },

    "fe-testing": {
        id: "fe-testing",
        title: "Testing & Performance",
        definition: "Testing ensures your code works correctly. Performance optimization makes your app fast and responsive.",
        importance: "Professional developers write tests. Fast websites rank better in search and provide better user experience.",
        usage: "Writing unit tests, integration tests, measuring and improving performance metrics.",
        keyConcepts: [
            { id: "unit-testing", title: "Unit Testing", description: "Jest, Vitest for testing functions" },
            { id: "component-testing", title: "Component Testing", description: "React Testing Library" },
            { id: "e2e-testing", title: "E2E Testing", description: "Cypress, Playwright for full app tests" },
            { id: "performance", title: "Web Vitals", description: "LCP, FID, CLS metrics" }
        ],
        resources: {
            videos: [
                { title: "React Testing Tutorial", url: "https://www.youtube.com/watch?v=8Xwq35cPwYg", type: "Video" }
            ],
            articles: [
                { title: "Web.dev Performance", url: "https://web.dev/performance/", type: "Article" }
            ]
        },
        studyPath: {
            prerequisites: ["State Management"],
            nextTopics: ["Build & Deployment"]
        },
        aiPrompts: ["How do I test React components?", "What are Core Web Vitals?"]
    },

    "fe-deployment": {
        id: "fe-deployment",
        title: "Build & Deployment",
        definition: "Build tools bundle and optimize your code. Deployment makes your app available on the internet.",
        importance: "Understanding the build process and deployment is essential for shipping production-ready applications.",
        usage: "Bundling with Vite/Webpack, deploying to Vercel/Netlify, setting up CI/CD.",
        keyConcepts: [
            { id: "vite", title: "Vite / Webpack", description: "Build tools and bundlers" },
            { id: "vercel", title: "Vercel / Netlify", description: "Easy deployment platforms" },
            { id: "ci-cd", title: "CI/CD", description: "Automated testing and deployment" },
            { id: "cdn", title: "CDN", description: "Content delivery for fast loading" }
        ],
        resources: {
            videos: [
                { title: "Deploy React to Vercel", url: "https://www.youtube.com/watch?v=9XEDULXm3Mc", type: "Video" }
            ],
            articles: [
                { title: "Vercel Deployment Guide", url: "https://vercel.com/docs", type: "Article" }
            ]
        },
        studyPath: {
            prerequisites: ["Testing & Performance"],
            nextTopics: []
        },
        aiPrompts: ["How do I deploy a React app?", "What's the difference between Vite and Webpack?"]
    }
};

export default frontendTopicContent;
