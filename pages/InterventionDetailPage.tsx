
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useLocalStorage from '../hooks/useLocalStorage';
import type { Intervention } from '../types';
import { InterventionStatus } from '../types';
import { LOCAL_STORAGE_KEY, getStatusColor, getPriorityColor, MapPinIcon, CalendarDaysIcon, PencilIcon, TrashIcon, ExclamationTriangleIcon, ArrowLeftIcon, STATUS_OPTIONS } from '../constants';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmationModal from '../components/ConfirmationModal';

const InterventionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [interventions, setInterventions] = useLocalStorage<Intervention[]>(LOCAL_STORAGE_KEY, []);
  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const foundIntervention = interventions.find(item => item.id === id);
    if (foundIntervention) {
      setIntervention(foundIntervention);
    } else {
      toast.error("Intervention non trouvée.");
      // navigate('/'); // Or a 404 page
    }
    setLoading(false);
  }, [id, interventions, navigate]);

  const handleDelete = () => {
    setInterventions(interventions.filter(item => item.id !== id));
    toast.success('Intervention supprimée avec succès.');
    navigate('/');
    setIsDeleteModalOpen(false);
  };
  
  const handleStatusChange = (newStatus: InterventionStatus) => {
    if (intervention) {
      const updatedIntervention = { ...intervention, status: newStatus, updatedAt: new Date().toISOString() };
      setIntervention(updatedIntervention); // Update local state for immediate UI feedback
      setInterventions(interventions.map(item => item.id === id ? updatedIntervention : item));
      toast.success(`Statut de l'intervention mis à jour à "${newStatus}".`);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!intervention) {
    return (
      <div className="pb-16">
        <Header title="Détail de l'Intervention" />
        <div className="p-4 text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-slate-700">Intervention non trouvée.</p>
          <Link to="/" className="mt-4 inline-block px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700">
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <Header title={intervention.title} />
      <div className="p-4 bg-white shadow-lg rounded-b-lg">
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center text-sky-600 hover:text-sky-800">
          <ArrowLeftIcon className="w-5 h-5 mr-1" />
          Retour
        </button>
        
        <div className="mb-4">
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(intervention.status)}`}>
            {intervention.status}
          </span>
          <span className={`ml-2 px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(intervention.priority)}`}>
            Priorité: {intervention.priority}
          </span>
        </div>

        <p className="text-slate-700 mb-2"><strong className="font-medium">Description:</strong> {intervention.description || 'Non spécifiée'}</p>
        <p className="text-slate-700 mb-2"><strong className="font-medium">Adresse:</strong> {intervention.address}</p>
        
        <div className="flex items-center text-sm text-slate-500 mb-2">
          <CalendarDaysIcon className="w-4 h-4 mr-2 text-sky-600" />
          Créé le: {new Date(intervention.createdAt).toLocaleString('fr-FR')}
        </div>
        <div className="flex items-center text-sm text-slate-500 mb-4">
          <CalendarDaysIcon className="w-4 h-4 mr-2 text-sky-600" />
          Modifié le: {new Date(intervention.updatedAt).toLocaleString('fr-FR')}
        </div>

        {intervention.location && (
          <div className="mb-4 p-3 bg-slate-50 rounded-md border border-slate-200">
            <h4 className="text-md font-semibold text-sky-700 mb-1 flex items-center">
              <MapPinIcon className="w-5 h-5 mr-2" />
              Localisation
            </h4>
            <p className="text-sm text-slate-600">Latitude: {intervention.location.latitude.toFixed(6)}</p>
            <p className="text-sm text-slate-600">Longitude: {intervention.location.longitude.toFixed(6)}</p>
            {intervention.location.accuracy && <p className="text-sm text-slate-600">Précision: {intervention.location.accuracy.toFixed(0)}m</p>}
             <a 
                href={`https://www.google.com/maps/search/?api=1&query=${intervention.location.latitude},${intervention.location.longitude}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-sky-600 hover:text-sky-800 underline"
              >
                Ouvrir dans Google Maps
              </a>
          </div>
        )}

        <div className="my-6">
          <label htmlFor="statusChange" className="block text-sm font-medium text-slate-700 mb-1">Changer le statut :</label>
          <select
            id="statusChange"
            value={intervention.status}
            onChange={(e) => handleStatusChange(e.target.value as InterventionStatus)}
            className="w-full p-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>


        <div className="mt-6 flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
          <Link
            to={`/intervention/${id}/edit`}
            className="flex-1 flex items-center justify-center px-4 py-2 border border-sky-600 text-sky-600 rounded-md shadow-sm hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            <PencilIcon className="w-5 h-5 mr-2" />
            Modifier
          </Link>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <TrashIcon className="w-5 h-5 mr-2" />
            Supprimer
          </button>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer l'intervention "${intervention.title}" ? Cette action est irréversible.`}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText="Supprimer"
      />
    </div>
  );
};

export default InterventionDetailPage;
