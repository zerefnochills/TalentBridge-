import React, { useState, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    Background,
    Controls,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TopicDetailPanel from '../../components/TopicDetailPanel';
import api from '../../utils/api';

// Import all roadmap data
import backendRoadmapData from '../../data/backendRoadmapData.json';
import frontendRoadmapData from '../../data/frontendRoadmapData.json';
import fullstackRoadmapData from '../../data/fullstackRoadmapData.json';
import datascienceRoadmapData from '../../data/datascienceRoadmapData.json';

// Import all topic content
import { backendTopicContent } from '../../data/backendTopicContent';
import { frontendTopicContent } from '../../data/frontendTopicContent';
import { fullstackTopicContent } from '../../data/fullstackTopicContent';
import { datascienceTopicContent } from '../../data/datascienceTopicContent';

// Import practice projects
import { practiceProjects } from '../../data/practiceProjects';

// Define available roadmaps
const ROADMAPS = {
    frontend: {
        id: 'frontend',
        title: 'Frontend Development',
        description: 'Build beautiful user interfaces with modern frameworks',
        icon: '🎨',
        color: 'from-orange-500 to-yellow-500',
        data: frontendRoadmapData,
        content: frontendTopicContent
    },
    backend: {
        id: 'backend',
        title: 'Backend Development',
        description: 'Build scalable server-side applications and APIs',
        icon: '⚙️',
        color: 'from-purple-500 to-indigo-500',
        data: backendRoadmapData,
        content: backendTopicContent
    },
    fullstack: {
        id: 'fullstack',
        title: 'Full Stack Development',
        description: 'Master both frontend and backend technologies',
        icon: '🚀',
        color: 'from-blue-500 to-cyan-500',
        data: fullstackRoadmapData,
        content: fullstackTopicContent
    },
    datascience: {
        id: 'datascience',
        title: 'Data Science & AI',
        description: 'Analyze data and build machine learning models',
        icon: '🤖',
        color: 'from-green-500 to-teal-500',
        data: datascienceRoadmapData,
        content: datascienceTopicContent
    }
};

function RoadmapPage() {
    const [selectedRoadmap, setSelectedRoadmap] = useState('frontend');
    const [selectedTopicId, setSelectedTopicId] = useState(null);

    // AI Tutor State
    const [chatMessages, setChatMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const currentRoadmap = ROADMAPS[selectedRoadmap];
    const currentProjects = practiceProjects[selectedRoadmap] || [];

    // Parse nodes and edges from roadmap data
    const { initialNodes, initialEdges } = useMemo(() => {
        const data = currentRoadmap.data;
        return {
            initialNodes: data.filter(item => 'position' in item),
            initialEdges: data.filter(item => !('position' in item))
        };
    }, [selectedRoadmap]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Update nodes/edges when roadmap changes
    React.useEffect(() => {
        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [initialNodes, initialEdges, setNodes, setEdges]);

    // Reset chat when roadmap changes
    React.useEffect(() => {
        setChatMessages([{
            role: 'assistant',
            content: `Hi! I'm your AI Tutor for ${currentRoadmap.title}. Ask me anything about this roadmap, concepts, or how to get started!`
        }]);
    }, [selectedRoadmap]);

    const handleTopicClick = useCallback((topicId) => {
        setSelectedTopicId(topicId);
    }, []);

    const handleClosePanel = () => {
        setSelectedTopicId(null);
    };

    const onNodeClick = useCallback((_, node) => {
        if (node.topicId) {
            handleTopicClick(node.topicId);
        }
    }, [handleTopicClick]);

    const selectedTopic = selectedTopicId ? currentRoadmap.content[selectedTopicId] : null;

    const handleRoadmapChange = (roadmapId) => {
        setSelectedRoadmap(roadmapId);
        setSelectedTopicId(null);
    };

    // AI Tutor Chat
    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMsg = { role: 'user', content: inputMessage };
        setChatMessages(prev => [...prev, userMsg]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const res = await api.post('/tutor/chat', {
                message: `[Context: User is learning ${currentRoadmap.title}] ${inputMessage}`,
                conversationHistory: chatMessages.slice(-6)
            });
            setChatMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
        } catch (err) {
            setChatMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm having trouble connecting right now. Try checking the AI Tutor page for full functionality, or ask me simpler questions about your roadmap!"
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="container relative">
            {/* Page Header */}
            <div className="mb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-text-main mb-1">Career Roadmaps</h1>
                        <p className="text-text-muted text-sm">
                            Interactive visual guides for different tech careers
                        </p>
                    </div>
                    <Link to="/student/navigator" className="btn btn-outline text-sm">
                        AI Personalized Roadmap
                    </Link>
                </div>
            </div>

            {/* Roadmap Selector */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {Object.values(ROADMAPS).map((roadmap) => (
                    <button
                        key={roadmap.id}
                        onClick={() => handleRoadmapChange(roadmap.id)}
                        className={`p-3 rounded-xl border-2 transition-all duration-300 text-left ${selectedRoadmap === roadmap.id
                            ? 'border-primary-500 bg-primary-500/20'
                            : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                            }`}
                    >
                        <div className="text-xl mb-1">{roadmap.icon}</div>
                        <h3 className="font-bold text-text-main text-sm">{roadmap.title}</h3>
                    </button>
                ))}
            </div>

            {/* Main Content: Roadmap + AI Tutor Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                {/* Roadmap Canvas - 3/4 width */}
                <div className="lg:col-span-3">
                    {/* Current Roadmap Header */}
                    <div className={`bg-gradient-to-r ${currentRoadmap.color} p-3 rounded-xl mb-3`}>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{currentRoadmap.icon}</span>
                            <div>
                                <h2 className="text-lg font-bold text-white">{currentRoadmap.title}</h2>
                                <p className="text-white/80 text-xs">{currentRoadmap.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Pro Tip */}
                    <div className="mb-3 bg-white/5 border border-white/10 p-2 rounded-xl">
                        <p className="text-text-muted text-xs">
                            <span className="text-primary-400 font-bold">Pro Tip:</span> Click on any node to explore detailed resources and key concepts!
                        </p>
                    </div>

                    {/* Roadmap Canvas */}
                    <div className="card p-0 overflow-hidden" style={{ height: '450px' }}>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onNodeClick={onNodeClick}
                            fitView
                            snapToGrid
                            snapGrid={[15, 15]}
                            style={{ background: 'transparent' }}
                            colorMode="dark"
                            nodesDraggable={false}
                            nodesConnectable={false}
                            elementsSelectable={true}
                        >
                            <Controls
                                showInteractive={false}
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}
                            />
                            <Background color="rgba(255,255,255,0.05)" gap={20} />
                        </ReactFlow>
                    </div>
                </div>

                {/* AI Tutor Sidebar - 1/4 width */}
                <div className="lg:col-span-1">
                    <div className="card h-full flex flex-col p-0 overflow-hidden" style={{ height: '550px' }}>
                        {/* Sidebar Header */}
                        <div className="bg-gradient-to-r from-primary-500/20 to-purple-500/20 p-3 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">🤖</span>
                                <div>
                                    <h3 className="font-bold text-text-main text-sm">AI Tutor</h3>
                                    <p className="text-xs text-text-muted">Ask about {currentRoadmap.title}</p>
                                </div>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-3">
                            {chatMessages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[90%] rounded-xl px-3 py-2 text-xs ${msg.role === 'user'
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-white/10 text-text-main'
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/10 rounded-xl px-3 py-2 text-xs text-text-muted">
                                        Thinking...
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-white/10 p-2">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask a question..."
                                    className="flex-1 input-field text-xs py-2"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={isLoading || !inputMessage.trim()}
                                    className="btn btn-primary px-3 py-2 text-xs disabled:opacity-50"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Practice Projects Section */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-text-main mb-3">Practice Projects</h2>
                <p className="text-text-muted text-sm mb-4">Build these projects to reinforce your {currentRoadmap.title} skills</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentProjects.map((project) => (
                        <div key={project.id} className="card hover:border-primary-500/50 transition-all duration-300">
                            <div className="flex items-start gap-3">
                                <span className="text-3xl">{project.icon}</span>
                                <div className="flex-1">
                                    <h3 className="font-bold text-text-main mb-1">{project.title}</h3>
                                    <p className="text-xs text-text-muted mb-2">{project.description}</p>

                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {project.skills.map((skill, idx) => (
                                            <span key={idx} className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-text-muted">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center text-xs">
                                        <span className={`px-2 py-0.5 rounded-full ${project.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                                                project.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                            }`}>
                                            {project.difficulty}
                                        </span>
                                        <span className="text-text-muted">{project.duration}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Topic Detail Panel */}
            <AnimatePresence>
                {selectedTopic && (
                    <TopicDetailPanel
                        topic={selectedTopic}
                        onClose={handleClosePanel}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default RoadmapPage;
