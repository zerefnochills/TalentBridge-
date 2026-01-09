// Practice Projects Data for each roadmap

export const practiceProjects = {
    frontend: [
        {
            id: 'fe-1',
            title: 'Personal Portfolio',
            description: 'Build a responsive portfolio showcasing your skills and projects.',
            difficulty: 'Beginner',
            skills: ['HTML', 'CSS', 'JavaScript'],
            duration: '1-2 weeks',
            icon: '💼'
        },
        {
            id: 'fe-2',
            title: 'Weather Dashboard',
            description: 'Create a weather app that fetches data from a public API.',
            difficulty: 'Intermediate',
            skills: ['React', 'API Integration', 'CSS'],
            duration: '1 week',
            icon: '🌤️'
        },
        {
            id: 'fe-3',
            title: 'E-commerce Product Page',
            description: 'Build a product page with cart functionality and animations.',
            difficulty: 'Intermediate',
            skills: ['React', 'State Management', 'Responsive Design'],
            duration: '2 weeks',
            icon: '🛒'
        }
    ],
    backend: [
        {
            id: 'be-1',
            title: 'REST API Server',
            description: 'Build a RESTful API with CRUD operations and validation.',
            difficulty: 'Beginner',
            skills: ['Node.js', 'Express', 'MongoDB'],
            duration: '1 week',
            icon: '🔌'
        },
        {
            id: 'be-2',
            title: 'Authentication System',
            description: 'Implement JWT-based auth with login, register, and protected routes.',
            difficulty: 'Intermediate',
            skills: ['JWT', 'bcrypt', 'Middleware'],
            duration: '1-2 weeks',
            icon: '🔐'
        },
        {
            id: 'be-3',
            title: 'Real-time Chat Server',
            description: 'Create a WebSocket-based chat server with rooms and messages.',
            difficulty: 'Advanced',
            skills: ['WebSockets', 'Socket.io', 'Redis'],
            duration: '2-3 weeks',
            icon: '💬'
        }
    ],
    fullstack: [
        {
            id: 'fs-1',
            title: 'Blog Platform',
            description: 'Full-stack blog with auth, posts, comments, and admin panel.',
            difficulty: 'Intermediate',
            skills: ['React', 'Node.js', 'MongoDB'],
            duration: '2-3 weeks',
            icon: '📝'
        },
        {
            id: 'fs-2',
            title: 'Task Management App',
            description: 'Kanban-style task manager with drag-drop and team collaboration.',
            difficulty: 'Intermediate',
            skills: ['Full Stack', 'State Management', 'Real-time'],
            duration: '2-3 weeks',
            icon: '✅'
        },
        {
            id: 'fs-3',
            title: 'Social Dashboard',
            description: 'Dashboard with user profiles, feeds, and notifications.',
            difficulty: 'Advanced',
            skills: ['React', 'Node.js', 'PostgreSQL'],
            duration: '3-4 weeks',
            icon: '📊'
        }
    ],
    datascience: [
        {
            id: 'ds-1',
            title: 'Data Visualization Dashboard',
            description: 'Create interactive charts and graphs from datasets.',
            difficulty: 'Beginner',
            skills: ['Python', 'Pandas', 'Matplotlib'],
            duration: '1 week',
            icon: '📈'
        },
        {
            id: 'ds-2',
            title: 'ML Price Predictor',
            description: 'Build a regression model to predict prices from features.',
            difficulty: 'Intermediate',
            skills: ['Scikit-learn', 'Pandas', 'Feature Engineering'],
            duration: '2 weeks',
            icon: '🤖'
        },
        {
            id: 'ds-3',
            title: 'Sentiment Analysis Tool',
            description: 'Analyze text sentiment using NLP techniques.',
            difficulty: 'Advanced',
            skills: ['NLP', 'TensorFlow', 'Text Processing'],
            duration: '2-3 weeks',
            icon: '💭'
        }
    ]
};

export default practiceProjects;
