
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Intervention, GeolocationCoords } from '../types';
import { InterventionStatus, InterventionPriority } from '../types';
import { STATUS_OPTIONS, PRIORITY_OPTIONS, MapPinIcon } from '../constants';
import useGeolocation from '../hooks/useGeolocation';
import toast from 'react-hot-toast';

interface InterventionFormProps {
  onSubmit: (intervention: Intervention) => void;
  initialData?: Intervention | null;
  isEditMode?: boolean;
}

const InterventionForm: React.FC<InterventionFormProps> = ({ onSubmit, initialData, isEditMode = false }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<InterventionStatus>(InterventionStatus.TODO);
  const [priority, setPriority] = useState<InterventionPriority>(InterventionPriority.MEDIUM);
  const [location, setLocation] = useState<GeolocationCoords | null>(null);

  const [geolocationState, getLocation] = useGeolocation();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setAddress(initialData.address);
      setStatus(initialData.status);
      setPriority(initialData.priority);
      setLocation(initialData.location || null);
    }
  }, [initialData]);

  useEffect(() => {
    if (geolocationState.data) {
      setLocation(geolocationState.data);
      toast.success('Localisation acquise!');
    }
    if (geolocationState.error) {
      toast.error(`Erreur de géolocalisation: ${geolocationState.error.message}`);
    }
  }, [geolocationState.data, geolocationState.error]);

  const handleGetLocation = () => {
    getLocation();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !address.trim()) {
      toast.error("Le titre et l'adresse sont requis.");
      return;
    }

    const now = new Date().toISOString();
    const interventionData: Intervention = {
      id: initialData?.id || Date.now().toString(),
      title,
      description,
      address,
      status,
      priority,
      location,
      createdAt: initialData?.createdAt || now,
      updatedAt: now,
    };
    onSubmit(interventionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white shadow-md rounded-lg">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700">Titre</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-slate-700">Adresse</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row sm:space-x-4">
        <div className="flex-1">
          <label htmlFor="status" className="block text-sm font-medium text-slate-700">Statut</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as InterventionStatus)}
            className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 mt-4 sm:mt-0">
          <label htmlFor="priority" className="block text-sm font-medium text-slate-700">Priorité</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as InterventionPriority)}
            className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
          >
            {PRIORITY_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={handleGetLocation}
          disabled={geolocationState.loading}
          className="w-full flex items-center justify-center px-4 py-2 border border-sky-600 text-sky-600 rounded-md shadow-sm hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
        >
          <MapPinIcon className="w-5 h-5 mr-2" />
          {geolocationState.loading ? 'Acquisition en cours...' : (location ? 'Actualiser la localisation' : 'Obtenir la localisation actuelle')}
        </button>
        {location && (
          <p className="mt-2 text-xs text-slate-500">
            Lat: {location.latitude.toFixed(5)}, Lon: {location.longitude.toFixed(5)}
            {location.accuracy && `, Précision: ${location.accuracy.toFixed(0)}m`}
          </p>
        )}
         {geolocationState.error && (
          <p className="mt-2 text-xs text-red-500">
            Erreur: Impossible d'obtenir la localisation.
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          {isEditMode ? 'Enregistrer les modifications' : 'Créer l\'intervention'}
        </button>
      </div>
    </form>
  );
};

export default InterventionForm;
