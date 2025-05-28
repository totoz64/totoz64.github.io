
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useLocalStorage from '../hooks/useLocalStorage';
import type { Intervention } from '../types';
import InterventionForm from '../components/InterventionForm';
import { LOCAL_STORAGE_KEY, ExclamationTriangleIcon } from '../constants';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';

const EditInterventionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [interventions, setInterventions] = useLocalStorage<Intervention[]>(LOCAL_STORAGE_KEY, []);
  const [initialData, setInitialData] = useState<Intervention | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interventionToEdit = interventions.find(item => item.id === id);
    if (interventionToEdit) {
      setInitialData(interventionToEdit);
    } else {
       toast.error("Intervention non trouvée pour modification.");
      // navigate('/'); // Or a 404 like page
    }
    setLoading(false);
  }, [id, interventions, navigate]);

  const handleSubmit = (updatedIntervention: Intervention) => {
    setInterventions(interventions.map(item => (item.id === id ? updatedIntervention : item)));
    toast.success('Intervention modifiée avec succès!');
    navigate(`/intervention/${id}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!initialData) {
    return (
       <div className="pb-16">
        <Header title="Modifier l'Intervention" />
        <div className="p-4 text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-slate-700">Impossible de charger les données de l'intervention.</p>
          <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700">
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <Header title="Modifier l'Intervention" />
       <div className="p-0 md:p-4">
        <InterventionForm onSubmit={handleSubmit} initialData={initialData} isEditMode={true} />
      </div>
    </div>
  );
};

export default EditInterventionPage;
