import React, { useState, useEffect, useCallback } from 'react';
import InterventionForm from './components/InterventionForm';
import { InterventionItem } from './components/InterventionItem';
import { addIntervention, getInterventions, deleteIntervention as removeIntervention } from './services/interventionService';
// import { Intervention } from './types'; // Type imports are not used in JS runtime
import { APP_TITLE } from './constants';
import { PlusCircleIcon } from './components/icons';

const App = () => {
  const [interventions, setInterventions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setInterventions(getInterventions());
  }, []);

  const handleAddIntervention = useCallback((interventionData) => {
    const newIntervention = addIntervention(interventionData);
    setInterventions(prevInterventions => [newIntervention, ...prevInterventions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setShowForm(false); // Hide form after successful submission
    setNotification('Intervention ajoutée avec succès !');
    // setTimeout(() => setNotification(null), 3000); // Notification will hide via animation
  }, []);

  const handleDeleteIntervention = useCallback((id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette intervention ?")) {
      removeIntervention(id);
      setInterventions(prevInterventions => prevInterventions.filter(intervention => intervention.id !== id));
      setNotification('Intervention supprimée avec succès.');
      // setTimeout(() => setNotification(null), 3000); // Notification will hide via animation
    }
  }, []);

  const notificationClasses = `fixed top-4 right-4 bg-green-500 text-white p-3 rounded-md shadow-lg`;
  // Animation controlled by keyframes and onAnimationEnd
  const notificationStyle = notification 
    ? { animation: 'fadeInThenOut 3s ease-in-out forwards' } 
    : { display: 'none' };


  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 py-8 px-4">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-sky-700">{APP_TITLE}</h1>
      </header>

      {notification && (
        <div 
          className={notificationClasses}
          style={notificationStyle}
          role="alert"
          onAnimationEnd={() => {
             setNotification(null); // Clear notification after animation
          }}
        >
          {notification}
        </div>
      )}
      <style>
        {`
          @keyframes fadeInThenOut {
            0% { opacity: 0; transform: translateY(-20px); }
            15% { opacity: 1; transform: translateY(0); }
            85% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
          }
        `}
      </style>


      <main className="max-w-2xl mx-auto">
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            aria-label="Ajouter une nouvelle intervention"
            className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out mb-8 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
          >
            <PlusCircleIcon className="w-6 h-6" />
            Ajouter une Intervention
          </button>
        )}

        {showForm && (
          <section aria-labelledby="form-title" className="mb-12">
             <InterventionForm onAddIntervention={handleAddIntervention} />
             <button 
                onClick={() => setShowForm(false)}
                className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Annuler
              </button>
          </section>
        )}
        
        <section aria-labelledby="interventions-list-title">
          <h2 id="interventions-list-title" className="text-2xl font-semibold text-sky-700 mb-6 border-b-2 border-sky-200 pb-2">
            Liste des Interventions ({interventions.length})
          </h2>
          {interventions.length === 0 && !showForm ? (
            <p className="text-center text-gray-500 py-4">Aucune intervention pour le moment. Cliquez sur "Ajouter une Intervention" pour commencer.</p>
          ) : (
            <ul className="space-y-6">
              {interventions.map(intervention => (
                <InterventionItem 
                  key={intervention.id} 
                  intervention={intervention} 
                  onDelete={handleDeleteIntervention} 
                />
              ))}
            </ul>
          )}
        </section>
      </main>
      <footer className="text-center mt-12 py-4 border-t border-slate-300">
        <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} Régie des Eaux Graulhet. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default App;