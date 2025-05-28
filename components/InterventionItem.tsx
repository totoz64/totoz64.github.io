import React from 'react';
import { Intervention } from '../types';
import { LocationPinIcon, CalendarIcon, ClockIcon, TrashIcon } from './icons';

interface InterventionItemProps {
  intervention: Intervention;
  onDelete: (id: string) => void;
}

export const InterventionItem: React.FC<InterventionItemProps> = ({ intervention, onDelete }) => {
  
  const formatDateTimeDisplay = (isoString?: string): string => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return 'Date invalide';
      return date.toLocaleString('fr-FR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (e) {
      return 'Date invalide';
    }
  };

  return (
    <li className="bg-white shadow-lg rounded-xl p-5 border border-slate-200 hover:shadow-xl transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-sky-700">{intervention.name}</h3>
        <button
          onClick={() => onDelete(intervention.id)}
          aria-label={`Supprimer l'intervention ${intervention.name}`}
          className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-100"
        >
          <TrashIcon className="w-6 h-6" />
        </button>
      </div>
      
      <div className="space-y-2 text-sm text-slate-600">
        {intervention.address && (
          <p className="flex items-center">
            <LocationPinIcon className="w-4 h-4 mr-2 text-sky-500 flex-shrink-0" />
            <span className="truncate" title={intervention.address}>{intervention.address}</span>
          </p>
        )}
        {(intervention.latitude && intervention.longitude && !intervention.address) && (
           <p className="flex items-center">
            <LocationPinIcon className="w-4 h-4 mr-2 text-sky-500 flex-shrink-0" />
            Lat: {intervention.latitude.toFixed(4)}, Lon: {intervention.longitude.toFixed(4)}
          </p>
        )}
        
        {intervention.startTime && (
          <p className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
            Début: {formatDateTimeDisplay(intervention.startTime)}
          </p>
        )}
        
        {intervention.endTime && (
          <p className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
            Fin: {formatDateTimeDisplay(intervention.endTime)}
          </p>
        )}
        
        {intervention.remarks && (
          <div className="mt-3 pt-3 border-t border-slate-200">
            <p className="font-medium text-slate-700">Remarques:</p>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{intervention.remarks}</p>
          </div>
        )}
      </div>
       <p className="text-xs text-slate-400 mt-3 pt-2 border-t border-slate-100">
        Créée le: {formatDateTimeDisplay(intervention.createdAt)}
      </p>
    </li>
  );
};
