
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import type { Intervention } from '../types';
import { InterventionStatus, InterventionPriority } from '../types';
import InterventionCard from '../components/InterventionCard';
import { LOCAL_STORAGE_KEY, PlusIcon, STATUS_OPTIONS, PRIORITY_OPTIONS, ChevronDownIcon } from '../constants';
import Header from '../components/Header';

const InterventionListPage: React.FC = () => {
  const [interventions] = useLocalStorage<Intervention[]>(LOCAL_STORAGE_KEY, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InterventionStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<InterventionPriority | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'date-desc' | 'date-asc' | 'priority'>('date-desc');

  const filteredAndSortedInterventions = useMemo(() => {
    let filtered = interventions.filter(intervention => 
      intervention.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intervention.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter(intervention => intervention.status === statusFilter);
    }
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(intervention => intervention.priority === priorityFilter);
    }
    
    return [...filtered].sort((a, b) => {
        if (sortOrder === 'priority') {
            const priorityOrder = [InterventionPriority.URGENT, InterventionPriority.HIGH, InterventionPriority.MEDIUM, InterventionPriority.LOW];
            return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority) || (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        if (sortOrder === 'date-asc') {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        // Default 'date-desc'
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [interventions, searchTerm, statusFilter, priorityFilter, sortOrder]);

  return (
    <div className="pb-20"> {/* Padding bottom for BottomNav */}
      <Header title="Liste des Interventions" />
      <div className="p-4">
        <input
          type="text"
          placeholder="Rechercher par titre ou adresse..."
          className="w-full p-3 mb-4 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-slate-700 mb-1">Filtrer par statut</label>
            <div className="relative">
              <select
                id="statusFilter"
                className="w-full p-2 border border-slate-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as InterventionStatus | 'all')}
              >
                <option value="all">Tous les statuts</option>
                {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <ChevronDownIcon className="w-5 h-5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div>
            <label htmlFor="priorityFilter" className="block text-sm font-medium text-slate-700 mb-1">Filtrer par priorité</label>
             <div className="relative">
              <select
                id="priorityFilter"
                className="w-full p-2 border border-slate-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as InterventionPriority | 'all')}
              >
                <option value="all">Toutes les priorités</option>
                {PRIORITY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <ChevronDownIcon className="w-5 h-5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div>
            <label htmlFor="sortOrder" className="block text-sm font-medium text-slate-700 mb-1">Trier par</label>
            <div className="relative">
              <select
                id="sortOrder"
                className="w-full p-2 border border-slate-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'date-desc' | 'date-asc' | 'priority')}
              >
                <option value="date-desc">Date (plus récent)</option>
                <option value="date-asc">Date (plus ancien)</option>
                <option value="priority">Priorité</option>
              </select>
              <ChevronDownIcon className="w-5 h-5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {filteredAndSortedInterventions.length === 0 ? (
          <p className="text-center text-slate-500 py-8">Aucune intervention trouvée.</p>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedInterventions.map(intervention => (
              <InterventionCard key={intervention.id} intervention={intervention} />
            ))}
          </div>
        )}
      </div>
      <Link
        to="/new"
        className="fixed bottom-20 right-6 bg-sky-600 text-white p-4 rounded-full shadow-lg hover:bg-sky-700 transition-colors z-40"
        title="Nouvelle intervention"
      >
        <PlusIcon className="w-6 h-6" />
      </Link>
    </div>
  );
};

export default InterventionListPage;
