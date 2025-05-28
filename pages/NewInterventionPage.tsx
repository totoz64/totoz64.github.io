
import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useLocalStorage from '../hooks/useLocalStorage';
import type { Intervention } from '../types';
import InterventionForm from '../components/InterventionForm';
import { LOCAL_STORAGE_KEY } from '../constants';
import Header from '../components/Header';

const NewInterventionPage: React.FC = () => {
  const navigate = useNavigate();
  const [interventions, setInterventions] = useLocalStorage<Intervention[]>(LOCAL_STORAGE_KEY, []);

  const handleSubmit = (newIntervention: Intervention) => {
    setInterventions([...interventions, newIntervention]);
    toast.success('Intervention créée avec succès!');
    navigate('/');
  };

  return (
    <div className="pb-16">
      <Header title="Nouvelle Intervention" />
      <div className="p-0 md:p-4">
        <InterventionForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default NewInterventionPage;
