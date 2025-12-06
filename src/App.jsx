import React, { useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

import useStore from './store/useStore';
import CustomNode from './components/CustomNode';
import ControlsOverlay from './components/ControlsOverlay';

// On définit les types de nœuds hors du render pour la perf
const nodeTypes = { sociographNode: CustomNode };

function Sociograph() {
  const { 
    nodes, edges, onNodesChange, onEdgesChange, onConnect
  } = useStore();

  return (
    <div className="w-screen h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-white"
          minZoom={0.1}
          deleteKeyCode="Delete"
        >
          <Background variant="dots" gap={20} size={1} color="#e5e7eb" />
          <Controls />
          <MiniMap nodeColor="#93c5fd" style={{ height: 120 }} zoomable pannable />
        </ReactFlow>
        
        {/* Interface utilisateur superposée */}
        <ControlsOverlay />
      </div>
    </div>
  );
}

export default () => (
  <ReactFlowProvider>
    <Sociograph />
  </ReactFlowProvider>
);