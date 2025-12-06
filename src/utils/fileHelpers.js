// src/utils/fileHelpers.js

// Lecture du fichier TXT avec Promise
export const parseTxtFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const text = event.target.result;
      // Découper par ligne, nettoyer les espaces, retirer les vides
      const lines = text.split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line !== '');
      
      // Retirer les doublons
      const uniqueLines = [...new Set(lines)];
      resolve(uniqueLines);
    };

    reader.onerror = (error) => reject(error);
    
    reader.readAsText(file);
  });
};

// Nouvelle version du placement (ne demande plus d'arguments)
export const generateRandomPosition = () => {
  // Génère une position aléatoire visible à l'écran
  // Marge de 50px pour ne pas être collé au bord
  const x = Math.random() * (window.innerWidth * 0.5) + 50;
  const y = Math.random() * (window.innerHeight * 0.5) + 50;

  return { x, y };
};

// Sauvegarde JSON
export const downloadSogFile = (data, filename) => {
  const cleanData = {
      projectName: data.projectName,
      nodes: data.nodes.map(({ id, type, position, data }) => ({ id, type, position, data })),
      edges: data.edges.map(({ id, source, target }) => ({ id, source, target }))
  };

  const blob = new Blob([JSON.stringify(cleanData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  const safeName = (filename || 'sociograph').replace(/[^a-z0-9]/gi, '_').toLowerCase();
  a.download = `${safeName}.sog`;
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};