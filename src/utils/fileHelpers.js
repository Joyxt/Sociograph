// Lecture du fichier TXT ligne par ligne
export const parseTxtFile = async (file) => {
  const text = await file.text();
  // Séparer par ligne, enlever les vides et les doublons potentiels
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line !== '');
  return [...new Set(lines)];
};

// Placement aléatoire basique pour les nouveaux nœuds
export const generateRandomPosition = () => {
  // On place dans une zone visible de l'écran par défaut
  const width = window.innerWidth * 0.6;
  const height = window.innerHeight * 0.6;
  const x = Math.random() * width + 100;
  const y = Math.random() * height + 100;

  return { x, y };
};

// Sauvegarde JSON (.sog)
export const downloadSogFile = (data, filename) => {
  // Nettoyage des données avant export (enlever les propriétés internes de ReactFlow si nécessaire)
  const cleanData = {
      ...data,
      nodes: data.nodes.map(({ id, type, position, data }) => ({ id, type, position, data })),
      edges: data.edges.map(({ id, source, target, sourceHandle, targetHandle }) => ({ id, source, target, sourceHandle, targetHandle }))
  };

  const blob = new Blob([JSON.stringify(cleanData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename.replace(/\s+/g, '_').toLowerCase()}.sog`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};