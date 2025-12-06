import React, { useRef } from 'react';
import { Upload, Save, RefreshCw, UserPlus, MousePointer, Hand } from 'lucide-react';
import useStore from '../store/useStore';
import { parseTxtFile, generateRandomPosition, downloadSogFile } from '../utils/fileHelpers';
import { forceSimulation, forceLink, forceManyBody, forceCollide, forceCenter } from 'd3-force';

const ControlsOverlay = () => {
  const fileInputRef = useRef(null);
  const loadInputRef = useRef(null);
  
  const { 
      nodes, edges, setNodes, loadGraph, projectName, setProjectName,
      selectionMode, toggleSelectionMode 
  } = useStore();

  const handleImportTxt = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
        const names = await parseTxtFile(file);
        
        if (!names || names.length === 0) {
            alert("Le fichier est vide ou illisible.");
            return;
        }
        
        const newNodes = names.map(name => ({
          id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          type: 'sociographNode',
          position: generateRandomPosition(),
          data: { label: name },
        }));

        setNodes([...nodes, ...newNodes]);

    } catch (error) {
        console.error("Erreur import:", error);
        alert("Erreur lors de la lecture du fichier.");
    }
    e.target.value = null;
  };

  const handleImportSog = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            const data = JSON.parse(ev.target.result);
            loadGraph(data);
        } catch (err) {
            alert("Fichier de sauvegarde invalide");
        }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const handleSave = () => {
    downloadSogFile({ nodes, edges, projectName }, projectName);
  };

  const handleAutoLayout = () => {
    if (nodes.length === 0) return;

    const d3Nodes = nodes.map(n => ({ 
        id: n.id,
        x: n.position.x + 75, 
        y: n.position.y + 25 
    }));
    const d3Links = edges.map(e => ({ source: e.source, target: e.target }));

    const incomingCounts = {};
    edges.forEach(e => { incomingCounts[e.target] = (incomingCounts[e.target] || 0) + 1; });
    const SATURATION_LIMIT = 5;

    const simulation = forceSimulation(d3Nodes)
      .force("charge", forceManyBody().strength(-200))
      .force("collide", forceCollide().radius(80).iterations(3))
      .force("link", forceLink(d3Links).id(d => d.id).distance(link => {
         const targetId = typeof link.target === 'object' ? link.target.id : link.target;
         if (incomingCounts[targetId] >= SATURATION_LIMIT) {
             return 60; 
         }
         return 180;
      }).strength(0.5))
      .force("center", forceCenter(window.innerWidth / 2, window.innerHeight / 2).strength(0.1))
      .stop();

    simulation.tick(300); 

    const layoutedNodes = nodes.map((n) => {
      const d3Node = d3Nodes.find(dn => dn.id === n.id);
      return {
        ...n,
        position: { 
            x: d3Node.x - 75, 
            y: d3Node.y - 25 
        }
      };
    });

    setNodes(layoutedNodes);
  };

  return (
    <div className="absolute top-4 left-4 z-50 bg-white/95 backdrop-blur-sm p-5 rounded-xl shadow-xl border border-gray-200 w-80">
      <div className="flex justify-between items-start mb-4">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            Sociograph <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">v1.3</span>
          </h1>

          <button 
            onClick={toggleSelectionMode}
            className={`p-2 rounded-lg border transition-colors ${
                selectionMode 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
            title={selectionMode ? "Mode Sélection" : "Mode Panoramique"}
          >
            {selectionMode ? <MousePointer size={20} /> : <Hand size={20} />}
          </button>
      </div>
      
      <div className="space-y-4">
        <div>
            <label className="text-xs text-gray-500 font-medium ml-1">Nom du sociogramme</label>
            <input 
            type="text" 
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Mon projet..."
            />
        </div>

        <div className="grid grid-cols-2 gap-3">
            <button onClick={() => fileInputRef.current.click()} className="btn-secondary col-span-2">
                <UserPlus size={18} /> Importer Liste (.txt)
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImportTxt} 
                accept=".txt" 
                style={{ display: 'none' }} 
            />

            <button onClick={handleAutoLayout} className="btn-primary col-span-2 py-3">
                <RefreshCw size={18} /> Organiser (Physique)
            </button>

            <button onClick={handleSave} className="btn-secondary">
                <Save size={18} /> Sauvegarder
            </button>
            
            <button onClick={() => loadInputRef.current.click()} className="btn-secondary">
               Importer (.sog)
            </button>
            <input 
                type="file" 
                ref={loadInputRef} 
                onChange={handleImportSog} 
                accept=".sog,.json" 
                style={{ display: 'none' }} 
            />
        </div>
      </div>

      <div className="mt-6 text-xs text-gray-500 border-t border-gray-100 pt-4 space-y-1">
        <p className="font-medium text-blue-600 mb-1">
            {selectionMode ? "✋ Mode Sélection : Glissez pour encadrer" : "👆 Mode Pan : Glissez pour bouger la vue"}
        </p>
        <p className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Glisser pour connecter</p>
      </div>
    </div>
  );
};

export default ControlsOverlay;