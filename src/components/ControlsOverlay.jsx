import React, { useRef } from 'react';
import { Upload, Download, Save, RefreshCw, UserPlus } from 'lucide-react';
import useStore from '../store/useStore';
import { parseTxtFile, generateRandomPosition, downloadSogFile } from '../utils/fileHelpers';
import { forceSimulation, forceLink, forceManyBody, forceCollide, forceCenter } from 'd3-force';

const ControlsOverlay = () => {
  const fileInputRef = useRef(null);
  const loadInputRef = useRef(null);
  const { nodes, edges, setNodes, loadGraph, projectName, setProjectName } = useStore();

  const handleImportTxt = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const names = await parseTxtFile(file);
    
    const newNodes = names.map(name => ({
      id: `node-${Math.random().toString(36).substr(2, 9)}`,
      type: 'sociographNode',
      position: generateRandomPosition(nodes), // position aléatoire
      data: { label: name },
    }));

    // Ajouter aux nœuds existants
    setNodes([...nodes, ...newNodes]);
    e.target.value = null; // Reset input
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
            alert("Fichier invalide");
        }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const handleSave = () => {
    downloadSogFile({ nodes, edges, projectName }, projectName);
  };

  // Algorithme de réorganisation (Physique D3)
  const handleAutoLayout = () => {
    if (nodes.length === 0) return;

    // Conversion simple pour D3 (on utilise le centre approximatif des boîtes)
    const d3Nodes = nodes.map(n => ({ 
        id: n.id,
        x: n.position.x + 75, 
        y: n.position.y + 25 
    }));
    const d3Links = edges.map(e => ({ source: e.source, target: e.target }));

    // Calcul des connexions entrantes pour la règle de saturation
    const incomingCounts = {};
    edges.forEach(e => { incomingCounts[e.target] = (incomingCounts[e.target] || 0) + 1; });
    const SATURATION_LIMIT = 5;

    const simulation = forceSimulation(d3Nodes)
      // Répulsion entre les boîtes pour qu'elles s'écartent
      .force("charge", forceManyBody().strength(-150)) 
      // Évite le chevauchement (taille approx d'une boîte + marge)
      .force("collide", forceCollide().radius(50).iterations(3)) 
      // Gestion des liens
      .force("link", forceLink(d3Links).id(d => d.id).distance(link => {
         const targetId = typeof link.target === 'object' ? link.target.id : link.target;
         // REGLE CLÉ : Si la cible est saturée, le lien est très court (attraction forte)
         if (incomingCounts[targetId] >= SATURATION_LIMIT) {
             return 70; 
         }
         return 250; // Distance standard plus lâche
      }).strength(0.5))
      // Ramène le graphe vers le centre de l'écran si isolé
      .force("center", forceCenter(window.innerWidth / 2, window.innerHeight / 2).strength(0.05))
      .stop();

    // On fait tourner la simulation "en arrière-plan" instantanément
    simulation.tick(300); 

    // On applique les nouvelles positions calculées
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
      <h1 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        Sociograph <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">v1.0</span>
      </h1>
      
      <div className="space-y-4">
        {/* Nom du projet */}
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

        {/* Boutons d'action */}
        <div className="grid grid-cols-2 gap-3">
            <button onClick={() => fileInputRef.current.click()} className="btn-secondary col-span-2">
                <UserPlus size={18} /> Importer Liste (.txt)
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImportTxt} accept=".txt" hidden />

            <button onClick={handleAutoLayout} className="btn-primary col-span-2 py-3">
                <RefreshCw size={18} /> Organiser (Physique)
            </button>

            <button onClick={handleSave} className="btn-secondary">
                <Save size={18} /> Sauvegarder
            </button>
            
            <button onClick={() => loadInputRef.current.click()} className="btn-secondary">
                <Upload size={18} /> Charger (.sog)
            </button>
            <input type="file" ref={loadInputRef} onChange={handleImportSog} accept=".sog,.json" hidden />
        </div>
      </div>

      <div className="mt-6 text-xs text-gray-500 border-t border-gray-100 pt-4 space-y-1">
        <p className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Glisser pour connecter</p>
        <p className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> Recevoir connexion</p>
        <p>• Touche <strong>Suppr</strong> pour effacer un lien</p>
        <p>• Saturation automatique à 5 liens.</p>
      </div>
    </div>
  );
};

export default ControlsOverlay;