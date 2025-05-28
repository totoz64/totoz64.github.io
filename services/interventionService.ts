import { Intervention } from '../types';
import { LOCAL_STORAGE_KEY_INTERVENTIONS } from '../constants';

export const getInterventions = (): Intervention[] => {
  const storedInterventions = localStorage.getItem(LOCAL_STORAGE_KEY_INTERVENTIONS);
  if (storedInterventions) {
    try {
      const interventions = JSON.parse(storedInterventions) as Intervention[];
      // Sort by creation date, newest first
      return interventions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error("Erreur lors de la lecture des interventions depuis localStorage:", error);
      return [];
    }
  }
  return [];
};

export const saveInterventions = (interventions: Intervention[]): void => {
  try {
    // Sort by creation date before saving, newest first (maintains order)
    const sortedInterventions = interventions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    localStorage.setItem(LOCAL_STORAGE_KEY_INTERVENTIONS, JSON.stringify(sortedInterventions));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des interventions dans localStorage:", error);
  }
};

export const addIntervention = (newInterventionData: Omit<Intervention, 'id' | 'createdAt' | 'address'> & { address?: string }): Intervention => {
  const currentInterventions = getInterventions();
  const newIntervention: Intervention = {
    ...newInterventionData,
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date().toISOString(),
    address: newInterventionData.address || ( (newInterventionData.latitude && newInterventionData.longitude) ? `Coordonnées: ${newInterventionData.latitude.toFixed(4)}, ${newInterventionData.longitude.toFixed(4)}` : 'Adresse non spécifiée'),
  };
  // Add new intervention to the beginning of the array to show it first
  const updatedInterventions = [newIntervention, ...currentInterventions];
  saveInterventions(updatedInterventions);
  return newIntervention;
};

export const deleteIntervention = (id: string): void => {
  const currentInterventions = getInterventions();
  const updatedInterventions = currentInterventions.filter(intervention => intervention.id !== id);
  saveInterventions(updatedInterventions);
};
