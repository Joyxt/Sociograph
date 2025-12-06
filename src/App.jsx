import React, { useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Import correct du store
import useStore from './store/useStore';
// Import correct des composants
import CustomNode from './components/CustomNode';
import ControlsOverlay from './components/ControlsOverlay';

const nodeTypes = { sociographNode: CustomNode };

function Sociograph() {
  const { 
    nodes, edges, onNodesChange, onEdgesChange, onConnect,
    selectionMode 
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
          
          // Gestion du mode Sélection vs Pan
          panOnDrag={!selectionMode} 
          selectionOnDrag={selectionMode}
          panOnScroll={true} 
          selectionMode={selectionMode ? 'partial' : 'full'}
        >
          <Background variant="dots" gap={20} size={1} color="#e5e7eb" />
          <Controls />
          <MiniMap nodeColor="#93c5fd" style={{ height: 120 }} zoomable pannable />
        </ReactFlow>
        
        {/* L'interface de contrôle v1.3 */}
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