
import React, { useState, useEffect, useCallback } from 'react';
import InterventionForm from './components/InterventionForm'; 
import { InterventionItem } from './components/InterventionItem';
import { addIntervention, getInterventions, deleteIntervention as removeIntervention } from './services/interventionService';
// types.js will be resolved by esm.sh or implicitly
// import { Intervention } from './types'; 
// constants.js will be resolved by esm.sh or implicitly
// import { APP_TITLE } from './constants';
import { PlusCircleIcon } from './components/icons';

// Assuming APP_TITLE is defined in constants.js which is now also a .js file
const APP_TITLE = "Régie des Eaux Graulhet - Suivi d'Interventions";


const App = () => { // React.FC can be removed for simplicity in .js if not strictly needed
  const [interventions, setInterventions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setInterventions(getInterventions());
  }, []);

  const handleAddIntervention = useCallback((interventionData) => {
    const newIntervention = addIntervention(interventionData);
    setInterventions(prevInterventions => [newIntervention, ...prevInterventions]);
    setShowForm(false); // Hide form after successful submission
    setNotification('Intervention ajoutée avec succès !');
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleDeleteIntervention = useCallback((id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette intervention ?")) {
      removeIntervention(id);
      setInterventions(prevInterventions => prevInterventions.filter(intervention => intervention.id !== id));
      setNotification('Intervention supprimée avec succès.');
      setTimeout(() => setNotification(null), 3000);
    }
  }, []);

  const notificationClasses = `fixed top-4 right-4 bg-green-500 text-white p-3 rounded-md shadow-lg ${notification ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`;
  const notificationTransition = `transition-all duration-500 ease-in-out`;


  return (
    React.createElement("div", { className: "min-h-screen bg-slate-100 text-slate-800 py-8 px-4" },
      React.createElement("header", { className: "text-center mb-10" },
        React.createElement("h1", { className: "text-4xl font-bold text-sky-700" }, APP_TITLE)
      ),
      notification && (
        React.createElement("div", { 
          className: `${notificationClasses} ${notificationTransition}`,
          style: { animation: notification ? 'fadeInThenOut 3s ease-in-out' : 'none' },
          role: "alert",
          onAnimationEnd: () => {
            // Optional: if you want to ensure notification state is cleared after animation
            // if (!notification) setNotification(null); 
          }
        },
        notification
        )
      ),
      React.createElement("style", null, `
          @keyframes fadeInThenOut {
            0% { opacity: 0; transform: translateY(-20px); }
            15% { opacity: 1; transform: translateY(0); }
            85% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
          }
        `),
      React.createElement("main", { className: "max-w-2xl mx-auto" },
        !showForm && (
          React.createElement("button", {
            onClick: () => setShowForm(true),
            "aria-label": "Ajouter une nouvelle intervention",
            className: "w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out mb-8 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
          },
            React.createElement(PlusCircleIcon, { className: "w-6 h-6" }),
            "Ajouter une Intervention"
          )
        ),
        showForm && (
          React.createElement("section", { "aria-labelledby": "form-title", className: "mb-12" },
             React.createElement(InterventionForm, { onAddIntervention: handleAddIntervention }),
             React.createElement("button", { 
                onClick: () => setShowForm(false),
                className: "mt-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
              },
                "Annuler"
              )
          )
        ),
        React.createElement("section", { "aria-labelledby": "interventions-list-title" },
          React.createElement("h2", { id: "interventions-list-title", className: "text-2xl font-semibold text-sky-700 mb-6 border-b-2 border-sky-200 pb-2" },
            "Liste des Interventions (", interventions.length, ")"
          ),
          interventions.length === 0 && !showForm ? (
            React.createElement("p", { className: "text-center text-gray-500 py-4" }, "Aucune intervention pour le moment. Cliquez sur \"Ajouter une Intervention\" pour commencer.")
          ) : (
            React.createElement("ul", { className: "space-y-6" },
              interventions.map(intervention => (
                React.createElement(InterventionItem, { 
                  key: intervention.id, 
                  intervention: intervention, 
                  onDelete: handleDeleteIntervention 
                })
              ))
            )
          )
        )
      ),
      React.createElement("footer", { className: "text-center mt-12 py-4 border-t border-slate-300" },
        React.createElement("p", { className: "text-sm text-slate-500" }, "\u00A9 ", new Date().getFullYear(), " Régie des Eaux Graulhet. Tous droits réservés.")
      )
    )
  );
};

export default App;