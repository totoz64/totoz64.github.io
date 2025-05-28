// import { Intervention } from '../types'; // Type information removed for JS
import { LOCAL_STORAGE_KEY_INTERVENTIONS } from '../constants'; // Ensure this points to constants.js

export const getInterventions = () => { 
  const storedInterventions = localStorage.getItem(LOCAL_STORAGE_KEY_INTERVENTIONS);
  if (storedInterventions) {
    try {
      const interventions = JSON.parse(storedInterventions); 
      return interventions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error("Erreur lors de la lecture des interventions depuis localStorage:", error);
      return [];
    }
  }
  return [];
};

export const saveInterventions = (interventions) => { 
  try {
    const sortedInterventions = interventions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    localStorage.setItem(LOCAL_STORAGE_KEY_INTERVENTIONS, JSON.stringify(sortedInterventions));
  } catch (error)    {
    console.error("Erreur lors de la sauvegarde des interventions dans localStorage:", error);
  }
};

export const addIntervention = (newInterventionData) => { 
  const currentInterventions = getInterventions();
  const newIntervention = { 
    ...newInterventionData,
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date().toISOString(),
    address: newInterventionData.address || ( (newInterventionData.latitude && newInterventionData.longitude) ? `Coordonnées: ${newInterventionData.latitude.toFixed(4)}, ${newInterventionData.longitude.toFixed(4)}` : 'Adresse non spécifiée'),
  };
  const updatedInterventions = [newIntervention, ...currentInterventions];
  saveInterventions(updatedInterventions);
  return newIntervention;
};

export const deleteIntervention = (id) => { 
  const currentInterventions = getInterventions();
  const updatedInterventions = currentInterventions.filter(intervention => intervention.id !== id);
  saveInterventions(updatedInterventions);
};