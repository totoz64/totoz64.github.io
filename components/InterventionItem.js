
import React from 'react';
// import { Intervention } from '../types'; // Types are for static analysis
import { LocationPinIcon, CalendarIcon, ClockIcon, TrashIcon } from './icons';


export const InterventionItem = ({ intervention, onDelete }) => { // React.FC removed
  
  const formatDateTimeDisplay = (isoString) => {
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
    React.createElement("li", { className: "bg-white shadow-lg rounded-xl p-5 border border-slate-200 hover:shadow-xl transition-shadow duration-200" },
      React.createElement("div", { className: "flex justify-between items-start mb-3" },
        React.createElement("h3", { className: "text-xl font-semibold text-sky-700" }, intervention.name),
        React.createElement("button", {
          onClick: () => onDelete(intervention.id),
          "aria-label": `Supprimer l'intervention ${intervention.name}`,
          className: "text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-100"
        },
          React.createElement(TrashIcon, { className: "w-6 h-6" })
        )
      ),
      React.createElement("div", { className: "space-y-2 text-sm text-slate-600" },
        intervention.address && (
          React.createElement("p", { className: "flex items-center" },
            React.createElement(LocationPinIcon, { className: "w-4 h-4 mr-2 text-sky-500 flex-shrink-0" }),
            React.createElement("span", { className: "truncate", title: intervention.address }, intervention.address)
          )
        ),
        (intervention.latitude && intervention.longitude && !intervention.address) && (
           React.createElement("p", { className: "flex items-center" },
            React.createElement(LocationPinIcon, { className: "w-4 h-4 mr-2 text-sky-500 flex-shrink-0" }),
            "Lat: ", intervention.latitude.toFixed(4), ", Lon: ", intervention.longitude.toFixed(4)
          )
        ),
        intervention.startTime && (
          React.createElement("p", { className: "flex items-center" },
            React.createElement(CalendarIcon, { className: "w-4 h-4 mr-2 text-green-500 flex-shrink-0" }),
            "Début: ", formatDateTimeDisplay(intervention.startTime)
          )
        ),
        intervention.endTime && (
          React.createElement("p", { className: "flex items-center" },
            React.createElement(ClockIcon, { className: "w-4 h-4 mr-2 text-orange-500 flex-shrink-0" }),
            "Fin: ", formatDateTimeDisplay(intervention.endTime)
          )
        ),
        intervention.remarks && (
          React.createElement("div", { className: "mt-3 pt-3 border-t border-slate-200" },
            React.createElement("p", { className: "font-medium text-slate-700" }, "Remarques:"),
            React.createElement("p", { className: "text-sm text-slate-600 whitespace-pre-wrap" }, intervention.remarks)
          )
        )
      ),
       React.createElement("p", { className: "text-xs text-slate-400 mt-3 pt-2 border-t border-slate-100" },
        "Créée le: ", formatDateTimeDisplay(intervention.createdAt)
      )
    )
  );
};