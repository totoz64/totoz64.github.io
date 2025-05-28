import React, { useState, useCallback, useEffect } from 'react';
// import { Intervention, GeolocationState, Coordinates } from '../types'; // Types are for static analysis
import { GeolocationErrorType, MOCKED_ADDRESS_API_NOTICE } from '../constants';
import { fetchAddressFromCoordinates } from '../services/geocodingService';
import { LocationPinIcon, PlayIcon, StopIcon, SaveIcon } from './icons'; // CalendarIcon, ClockIcon removed as not used

const InterventionForm = ({ onAddIntervention }) => {
  const [name, setName] = useState('');
  const [remarks, setRemarks] = useState('');
  const [startTime, setStartTime] = useState(undefined);
  const [endTime, setEndTime] = useState(undefined);
  const [geolocation, setGeolocation] = useState({ loading: false });
  const [showAddressNotice, setShowAddressNotice] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const handleGetLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setGeolocation({ loading: false, error: GeolocationErrorType.UNSUPPORTED_BROWSER });
      return;
    }

    setGeolocation({ loading: true, error: undefined }); 
    setShowAddressNotice(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        try {
          const address = await fetchAddressFromCoordinates(coords);
          setGeolocation({ coordinates: coords, address, loading: false });
          setShowAddressNotice(true); 
        } catch (error) {
          console.error("Erreur de géocodage inversé:", error);
          setGeolocation({ coordinates: coords, loading: false, error: "Impossible de récupérer l'adresse." });
        }
      },
      (error) => {
        let errorMessage = GeolocationErrorType.UNKNOWN_ERROR;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = GeolocationErrorType.PERMISSION_DENIED;
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = GeolocationErrorType.POSITION_UNAVAILABLE;
            break;
          case error.TIMEOUT:
            errorMessage = GeolocationErrorType.TIMEOUT;
            break;
        }
        setGeolocation({ loading: false, error: errorMessage });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  const handleSetTime = (type) => {
    const now = new Date();
    const isoString = now.toISOString();

    if (type === 'start') {
      setStartTime(isoString);
      if (endTime && new Date(endTime) < now) {
        setEndTime(undefined); // Clear end time if it becomes invalid
      }
    } else { // 'end'
      if (startTime && now < new Date(startTime)) {
        alert("L'heure de fin ne peut pas être antérieure à l'heure de début.");
        return;
      }
      setEndTime(isoString);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAttemptedSubmit(true);

    if (!name.trim() || !startTime) {
      // UI should already indicate errors, alert is fallback
      return;
    }
    
    if (startTime && endTime && new Date(endTime) < new Date(startTime)) {
      // UI should already indicate this error
      return;
    }

    onAddIntervention({
      name,
      remarks,
      startTime,
      endTime,
      latitude: geolocation.coordinates?.latitude,
      longitude: geolocation.coordinates?.longitude,
      address: geolocation.address,
    });

    setName('');
    setRemarks('');
    setStartTime(undefined);
    setEndTime(undefined);
    setGeolocation({ loading: false });
    setShowAddressNotice(false);
    setAttemptedSubmit(false);
  };
  
  const formatDateTimeInput = (isoString) => {
    if (!isoString) return '';
    try {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
        return ''; 
    }
  };
  
  const inputBaseClass = "block w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500";
  const inputErrorClass = "border-red-500 focus:ring-red-500";
  const inputValidClass = "border-gray-300";

  const isNameInvalid = attemptedSubmit && !name.trim();
  const isStartTimeInvalid = attemptedSubmit && !startTime;
  const isEndTimeInvalid = startTime && endTime && new Date(endTime) < new Date(startTime);


  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl space-y-6 mb-8" noValidate>
      <h2 id="form-title" className="text-3xl font-bold text-sky-700 mb-8 text-center">
        Créer une Intervention
      </h2>
      
      <div>
        <label htmlFor="interventionName" className="block text-md font-semibold text-gray-800 mb-1">
          Nom de l'intervention <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="interventionName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`${inputBaseClass} ${isNameInvalid ? inputErrorClass : inputValidClass}`}
          required
          aria-required="true"
          aria-invalid={isNameInvalid}
          aria-describedby={isNameInvalid ? "nameError" : undefined}
        />
        {isNameInvalid && <p id="nameError" className="text-red-500 text-xs mt-1">Le nom est requis.</p>}
      </div>

      <fieldset className="border border-gray-300 p-4 rounded-lg">
        <legend className="text-md font-semibold text-gray-800 px-2">Localisation</legend>
        <button 
          type="button" 
          onClick={handleGetLocation}
          disabled={geolocation.loading}
          className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-4 rounded-md transition-colors disabled:bg-teal-300 mb-3"
          aria-busy={geolocation.loading}
        >
          <LocationPinIcon className="w-5 h-5" />
          {geolocation.loading ? 'Obtention des coordonnées...' : 'Obtenir ma position actuelle'}
        </button>
        {geolocation.coordinates && (
          <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
            <p>Latitude: {geolocation.coordinates.latitude.toFixed(5)}</p>
            <p>Longitude: {geolocation.coordinates.longitude.toFixed(5)}</p>
            {geolocation.address && <p className="mt-1 font-medium">Adresse: {geolocation.address}</p>}
          </div>
        )}
        {geolocation.error && <p className="text-red-500 text-sm mt-2" role="alert">{geolocation.error}</p>}
        {showAddressNotice && <p className="text-xs text-amber-600 mt-2">{MOCKED_ADDRESS_API_NOTICE}</p>}
      </fieldset>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="startTime" className="block text-md font-semibold text-gray-800 mb-1">
            Début <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input 
              type="datetime-local" 
              id="startTime"
              value={formatDateTimeInput(startTime)}
              onChange={(e) => setStartTime(e.target.value ? new Date(e.target.value).toISOString() : undefined)}
              className={`${inputBaseClass} ${isStartTimeInvalid ? inputErrorClass : inputValidClass}`}
              required
              aria-required="true"
              aria-invalid={isStartTimeInvalid}
              aria-describedby={isStartTimeInvalid ? "startTimeError" : undefined}
            />
            <button type="button" onClick={() => handleSetTime('start')} className="p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600" aria-label="Utiliser l'heure actuelle pour le début">
              <PlayIcon className="w-5 h-5"/>
            </button>
          </div>
           {isStartTimeInvalid && <p id="startTimeError" className="text-red-500 text-xs mt-1">L'heure de début est requise.</p>}
        </div>
        
        <div>
          <label htmlFor="endTime" className="block text-md font-semibold text-gray-800 mb-1">
            Fin (Optionnel)
          </label>
           <div className="flex items-center gap-2">
            <input 
              type="datetime-local" 
              id="endTime"
              value={formatDateTimeInput(endTime)}
              onChange={(e) => setEndTime(e.target.value ? new Date(e.target.value).toISOString() : undefined)}
              min={startTime ? formatDateTimeInput(startTime) : undefined}
              className={`${inputBaseClass} ${isEndTimeInvalid ? inputErrorClass : inputValidClass}`}
              aria-invalid={isEndTimeInvalid}
              aria-describedby={isEndTimeInvalid ? "endTimeError" : undefined}
            />
            <button type="button" onClick={() => handleSetTime('end')} className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600" aria-label="Utiliser l'heure actuelle pour la fin">
              <StopIcon className="w-5 h-5"/>
            </button>
          </div>
          {isEndTimeInvalid && <p id="endTimeError" className="text-red-500 text-xs mt-1">La fin ne peut être avant le début.</p>}
        </div>
      </div>

      <div>
        <label htmlFor="remarks" className="block text-md font-semibold text-gray-800 mb-1">
          Remarques (Optionnel)
        </label>
        <textarea
          id="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          rows={4}
          className={`${inputBaseClass} ${inputValidClass}`}
        ></textarea>
      </div>

      <button 
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        disabled={isNameInvalid || isStartTimeInvalid || isEndTimeInvalid} // Disable if known client-side errors exist
      >
        <SaveIcon className="w-5 h-5" />
        Enregistrer l'Intervention
      </button>
    </form>
  );
};

export default InterventionForm;