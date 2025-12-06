import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges, MarkerType } from 'reactflow';

const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  projectName: 'Mon Sociogramme',
  
  // --- CES LIGNES SONT OBLIGATOIRES POUR LE NOUVEAU CODE ---
  selectionMode: false, 
  toggleSelectionMode: () => set((state) => ({ selectionMode: !state.selectionMode })),
  // ---------------------------------------------------------

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge({ 
        ...connection, 
        type: 'default',
        animated: false,
        style: { stroke: '#0ea5e9', strokeWidth: 3 }, 
        markerEnd: { type: MarkerType.ArrowClosed, color: '#0ea5e9' },
      }, get().edges),
    });
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setProjectName: (name) => set({ projectName: name }),

  loadGraph: (data) => {
    set({
      nodes: data.nodes || [],
      edges: data.edges || [],
      projectName: data.projectName || 'Sans titre'
    });
  },
}));

export default useStore;