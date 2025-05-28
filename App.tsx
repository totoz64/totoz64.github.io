
import React, { useState, useEffect, useCallback } from 'react';
import InterventionForm from './components/InterventionForm'; // Changed to default import
import { InterventionItem } from './components/InterventionItem';
import { addIntervention, getInterventions, deleteIntervention as removeIntervention } from './services/interventionService';
import { Intervention } from './types';
import { APP_TITLE } from './constants';
import { PlusCircleIcon } from './components/icons';

const App: React.FC = () => {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    setInterventions(getInterventions());
  }, []);

  const handleAddIntervention = useCallback((interventionData: Omit<Intervention, 'id' | 'createdAt'>) => {
    const newIntervention = addIntervention(interventionData);
    setInterventions(prevInterventions => [newIntervention, ...prevInterventions]);
    setShowForm(false); // Hide form after successful submission
    setNotification('Intervention ajoutée avec succès !');
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleDeleteIntervention = useCallback((id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette intervention ?")) {
      removeIntervention(id);
      setInterventions(prevInterventions => prevInterventions.filter(intervention => intervention.id !== id));
      setNotification('Intervention supprimée avec succès.');
      setTimeout(() => setNotification(null), 3000);
    }
  }, []);

  // Define animation classes directly if needed, or move to a CSS file
  // For simplicity, the 'animate-fadeInOut' class will rely on global CSS or Tailwind JIT.
  // If not available, the animation won't work, but the app won't crash.
  // A more robust solution would be to add these keyframes to a global CSS file.
  const notificationClasses = `fixed top-4 right-4 bg-green-500 text-white p-3 rounded-md shadow-lg ${notification ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`;
  const notificationTransition = `transition-all duration-500 ease-in-out`;


  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 py-8 px-4">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-sky-700">{APP_TITLE}</h1>
      </header>

      {notification && (
        <div 
          className={`${notificationClasses} ${notificationTransition}`}
          style={{ animation: notification ? 'fadeInThenOut 3s ease-in-out' : 'none' }}
          role="alert"
          onAnimationEnd={() => {
            // Optional: if you want to ensure notification state is cleared after animation
            // if (!notification) setNotification(null); 
          }}
        >
          {notification}
        </div>
      )}
      {/* We need to define the keyframes globally, e.g., in index.html or a global CSS file */}
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
      {/* Removed <style jsx global> block */}
    </div>
  );
};

export default App;
