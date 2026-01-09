import React, { useCallback } from 'react';
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    Background,
    Controls,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import roadmapData from '../data/backendRoadmapData.json';

// Separate nodes and edges from the combined data
const initialNodes = roadmapData.filter(item => 'position' in item).map(node => ({
    ...node,
    dragHandle: '.custom-drag-handle',
}));

const initialEdges = roadmapData.filter(item => !('position' in item));

const RoadmapCanvas = ({ onTopicClick }) => {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const onNodeClick = useCallback((_, node) => {
        // Extract topic ID from the node
        if (node.topicId && onTopicClick) {
            onTopicClick(node.topicId);
        }
    }, [onTopicClick]);

    return (
        <div style={{ width: '100%', height: 'calc(100vh - 200px)', minHeight: '500px' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
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
    );
};

export default RoadmapCanvas;
