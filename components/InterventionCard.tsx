
import React from 'react';
import { Link } from 'react-router-dom';
import { Intervention } from '../types';
import { getStatusColor, getPriorityColor, MapPinIcon, CalendarDaysIcon } from '../constants';

interface InterventionCardProps {
  intervention: Intervention;
}

const InterventionCard: React.FC<InterventionCardProps> = ({ intervention }) => {
  const { id, title, address, status, priority, createdAt, location } = intervention;

  return (
    <Link to={`/intervention/${id}`} className="block bg-white shadow-lg rounded-lg p-4 mb-4 hover:shadow-xl transition-shadow duration-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-sky-700">{title}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>
      <p className="text-sm text-slate-600 mb-1 truncate">{address}</p>
      <div className="flex items-center text-xs text-slate-500 mb-2">
        <CalendarDaysIcon className="w-4 h-4 mr-1" />
        <span>Créé le: {new Date(createdAt).toLocaleDateString('fr-FR')}</span>
      </div>
      {location && (
        <div className="flex items-center text-xs text-sky-600 mb-2">
          <MapPinIcon className="w-4 h-4 mr-1" />
          <span>Localisation enregistrée</span>
        </div>
      )}
      <div className="flex justify-between items-center mt-3">
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getPriorityColor(priority)}`}>
          Priorité: {priority}
        </span>
      </div>
    </Link>
  );
};

export default InterventionCard;
