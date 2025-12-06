import React, { memo } from 'react';
import { Handle, Position, useStore as useReactFlowStore } from 'reactflow';
import clsx from 'clsx';

const SATURATION_LIMIT = 5;

const CustomNode = ({ id, data, selected }) => {
  // Récupérer les connexions entrantes (target) pour ce nœud via le store interne de ReactFlow
  // Note: On utilise un sélecteur pour éviter des re-renders inutiles
  const targetConnections = useReactFlowStore(
    (s) => s.edges.filter((e) => e.target === id).length
  );
  
  const isSaturated = targetConnections >= SATURATION_LIMIT;
  
  // Calcul de la taille du halo : commence à 100% et augmente de 5% par connexion supplémentaire
  const extraConnections = Math.max(0, targetConnections - SATURATION_LIMIT);
  // Base scale 1.5 + 5% par connexion extra
  const haloScale = 1.5 + (extraConnections * 0.05 * 1.5);

  return (
    <div className="relative group rounded-lg">
      {/* Halo de saturation (Image 4) */}
      {isSaturated && (
        <div 
          className="absolute inset-0 bg-red-500 rounded-lg blur-xl opacity-50 transition-all duration-500 -z-10"
          style={{ 
            transform: `scale(${haloScale})`, 
          }}
        />
      )}

      {/* Boîte principale (Image 1) */}
      <div className={clsx(
        "flex items-center justify-center px-6 py-3 min-w-[150px] bg-blue-100 border-2 rounded-lg transition-all shadow-sm",
        selected ? "border-blue-600 shadow-md" : "border-gray-400",
        isSaturated ? "!border-red-500" : ""
      )}>
        {/* Point d'entrée (Vert - Gauche - Image 1/3) */}
        <Handle
          type="target"
          position={Position.Left}
          className="!w-4 !h-4 !bg-green-500 !border-2 !border-white !-left-2.5"
        />

        <span className="text-gray-900 font-semibold text-base pointer-events-none select-none text-center">
          {data.label}
        </span>

        {/* Point de sortie (Rouge - Droite - Image 1/2) */}
        <Handle
          type="source"
          position={Position.Right}
          className="!w-4 !h-4 !bg-red-500 !border-2 !border-white !-right-2.5"
        />
      </div>

       {/* Badge compteur si saturé */}
       {targetConnections > 0 && (
        <div className={clsx(
            "absolute -top-2 -right-2 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm text-white border-2 border-white",
            isSaturated ? "bg-red-600" : "bg-gray-400"
        )}>
          {targetConnections}
        </div>
      )}
    </div>
  );
};

export default memo(CustomNode);