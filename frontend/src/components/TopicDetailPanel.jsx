import React from 'react';
import { motion } from 'framer-motion';

const TopicDetailPanel = ({ topic, onClose }) => {
    if (!topic) return null;

    return (
        <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-dark-secondary/95 backdrop-blur-xl border-l border-white/10 z-50 overflow-y-auto"
        >
            {/* Header */}
            <div className="sticky top-0 bg-dark-secondary/95 backdrop-blur-xl border-b border-white/10 p-6 flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-text-main">{topic.title}</h2>
                    <p className="text-sm text-text-muted mt-1">Learning Roadmap</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                    <svg className="w-5 h-5 text-text-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Definition */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h3 className="text-sm font-semibold text-primary-400 mb-2">What is it?</h3>
                    <p className="text-text-muted text-sm leading-relaxed">{topic.definition}</p>
                </div>

                {/* Importance */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h3 className="text-sm font-semibold text-success mb-2">Why is it important?</h3>
                    <p className="text-text-muted text-sm leading-relaxed">{topic.importance}</p>
                </div>

                {/* Usage */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h3 className="text-sm font-semibold text-warning mb-2">How is it used?</h3>
                    <p className="text-text-muted text-sm leading-relaxed">{topic.usage}</p>
                </div>

                {/* Key Concepts */}
                {topic.keyConcepts && topic.keyConcepts.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold text-text-main mb-3">Key Concepts</h3>
                        <div className="space-y-2">
                            {topic.keyConcepts.map((concept) => (
                                <div key={concept.id} className="bg-white/5 rounded-xl p-3 border border-white/10">
                                    <h4 className="font-medium text-text-main text-sm">{concept.title}</h4>
                                    {concept.description && (
                                        <p className="text-xs text-text-muted mt-1">{concept.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Resources */}
                {topic.resources && (
                    <div>
                        <h3 className="text-lg font-semibold text-text-main mb-3">Free Resources</h3>
                        <div className="space-y-2">
                            {topic.resources.videos?.map((resource, idx) => (
                                <a
                                    key={`video-${idx}`}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-colors"
                                >
                                    <span className="text-xl">🎥</span>
                                    <div>
                                        <p className="font-medium text-text-main text-sm">{resource.title}</p>
                                        <p className="text-xs text-text-muted">Video</p>
                                    </div>
                                </a>
                            ))}
                            {topic.resources.articles?.map((resource, idx) => (
                                <a
                                    key={`article-${idx}`}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-colors"
                                >
                                    <span className="text-xl">📄</span>
                                    <div>
                                        <p className="font-medium text-text-main text-sm">{resource.title}</p>
                                        <p className="text-xs text-text-muted">Article</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Study Path */}
                {topic.studyPath && (
                    <div className="bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-xl p-4 border border-primary-500/30">
                        <h3 className="text-sm font-semibold text-primary-400 mb-3">Study Path</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-text-muted mb-1">Prerequisites</p>
                                <ul className="space-y-1">
                                    {topic.studyPath.prerequisites?.map((prereq, idx) => (
                                        <li key={idx} className="text-sm text-text-main">• {prereq}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <p className="text-xs text-text-muted mb-1">Up Next</p>
                                <ul className="space-y-1">
                                    {topic.studyPath.nextTopics?.map((next, idx) => (
                                        <li key={idx} className="text-sm text-text-main">• {next}</li>
                                    ))}
                                    {(!topic.studyPath.nextTopics || topic.studyPath.nextTopics.length === 0) && (
                                        <li className="text-sm text-success">You've completed the roadmap!</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default TopicDetailPanel;
