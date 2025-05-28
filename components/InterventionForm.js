
import React, { useState, useCallback, useEffect } from 'react';
// import { Intervention, GeolocationState, Coordinates } from '../types'; // Types are for static analysis
// import { GeolocationErrorType, MOCKED_ADDRESS_API_NOTICE } from '../constants'; // Constants can be directly used or imported if also .js
import { fetchAddressFromCoordinates } from '../services/geocodingService';
import { LocationPinIcon, PlayIcon, StopIcon, SaveIcon, CalendarIcon, ClockIcon } from './icons';

// Constants previously from constants.ts
const GeolocationErrorType = {
  PERMISSION_DENIED: "Permission de géolocalisation refusée.",
  POSITION_UNAVAILABLE: "Position actuelle indisponible.",
  TIMEOUT: "Délai d'attente pour la géolocalisation dépassé.",
  UNSUPPORTED_BROWSER: "La géolocalisation n'est pas supportée par ce navigateur.",
  UNKNOWN_ERROR: "Erreur inconnue de géolocalisation."
};
const MOCKED_ADDRESS_API_NOTICE = "Note: L'adresse est simulée. Une intégration API de géocodage réelle est requise.";


const InterventionForm = ({ onAddIntervention }) => { // React.FC removed for .js
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
        setEndTime(undefined);
      }
    } else {
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
      alert("Veuillez remplir tous les champs obligatoires: Nom et Heure de début.");
      return;
    }
    
    if (startTime && endTime && new Date(endTime) < new Date(startTime)) {
      alert("L'heure de fin ne peut pas être antérieure à l'heure de début.");
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

  return (
    React.createElement("form", { onSubmit: handleSubmit, className: "bg-white p-6 sm:p-8 rounded-xl shadow-2xl space-y-6 mb-8", noValidate: true },
      React.createElement("h2", { id: "form-title", className: "text-3xl font-bold text-sky-700 mb-8 text-center" },
        "Créer une Intervention"
      ),
      React.createElement("div", null,
        React.createElement("label", { htmlFor: "interventionName", className: "block text-md font-semibold text-gray-800 mb-1" },
          "Nom de l'intervention ", React.createElement("span", { className: "text-red-500" }, "*")
        ),
        React.createElement("input", {
          type: "text",
          id: "interventionName",
          value: name,
          onChange: (e) => setName(e.target.value),
          className: `${inputBaseClass} ${attemptedSubmit && !name.trim() ? inputErrorClass : inputValidClass}`,
          required: true,
          "aria-required": "true"
        }),
        attemptedSubmit && !name.trim() && React.createElement("p", { className: "text-red-500 text-xs mt-1" }, "Le nom est requis.")
      ),
      React.createElement("fieldset", { className: "border border-gray-300 p-4 rounded-lg" },
        React.createElement("legend", { className: "text-md font-semibold text-gray-800 px-2" }, "Localisation"),
        React.createElement("button", { 
          type: "button", 
          onClick: handleGetLocation,
          disabled: geolocation.loading,
          className: "w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-4 rounded-md transition-colors disabled:bg-teal-300 mb-3",
          "aria-busy": geolocation.loading
        },
          React.createElement(LocationPinIcon, { className: "w-5 h-5" }),
          geolocation.loading ? 'Obtention des coordonnées...' : 'Obtenir ma position actuelle'
        ),
        geolocation.coordinates && (
          React.createElement("div", { className: "text-sm text-gray-700 bg-gray-50 p-3 rounded-md" },
            React.createElement("p", null, "Latitude: ", geolocation.coordinates.latitude.toFixed(5)),
            React.createElement("p", null, "Longitude: ", geolocation.coordinates.longitude.toFixed(5)),
            geolocation.address && React.createElement("p", { className: "mt-1 font-medium" }, "Adresse: ", geolocation.address)
          )
        ),
        geolocation.error && React.createElement("p", { className: "text-red-500 text-sm mt-2", role: "alert" }, geolocation.error),
        showAddressNotice && React.createElement("p", { className: "text-xs text-amber-600 mt-2" }, MOCKED_ADDRESS_API_NOTICE)
      ),
      React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
        React.createElement("div", null,
          React.createElement("label", { htmlFor: "startTime", className: "block text-md font-semibold text-gray-800 mb-1" },
            "Début ", React.createElement("span", { className: "text-red-500" }, "*")
          ),
          React.createElement("div", { className: "flex items-center gap-2" },
            React.createElement("input", { 
              type: "datetime-local", 
              id: "startTime",
              value: formatDateTimeInput(startTime),
              onChange: (e) => setStartTime(e.target.value ? new Date(e.target.value).toISOString() : undefined),
              className: `${inputBaseClass} ${attemptedSubmit && !startTime ? inputErrorClass : inputValidClass}`,
              required: true,
              "aria-required": "true"
            }),
            React.createElement("button", { type: "button", onClick: () => handleSetTime('start'), className: "p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600", "aria-label": "Utiliser l'heure actuelle pour le début" },
              React.createElement(PlayIcon, { className: "w-5 h-5" })
            )
          ),
           attemptedSubmit && !startTime && React.createElement("p", { className: "text-red-500 text-xs mt-1" }, "L'heure de début est requise.")
        ),
        React.createElement("div", null,
          React.createElement("label", { htmlFor: "endTime", className: "block text-md font-semibold text-gray-800 mb-1" },
            "Fin (Optionnel)"
          ),
           React.createElement("div", { className: "flex items-center gap-2" },
            React.createElement("input", { 
              type: "datetime-local", 
              id: "endTime",
              value: formatDateTimeInput(endTime),
              onChange: (e) => setEndTime(e.target.value ? new Date(e.target.value).toISOString() : undefined),
              min: startTime ? formatDateTimeInput(startTime) : undefined,
              className: `${inputBaseClass} ${inputValidClass}`
            }),
            React.createElement("button", { type: "button", onClick: () => handleSetTime('end'), className: "p-3 bg-red-500 text-white rounded-lg hover:bg-red-600", "aria-label": "Utiliser l'heure actuelle pour la fin" },
              React.createElement(StopIcon, { className: "w-5 h-5" })
            )
          ),
          startTime && endTime && new Date(endTime) < new Date(startTime) && React.createElement("p", { className: "text-red-500 text-xs mt-1" }, "La fin ne peut être avant le début.")
        )
      ),
      React.createElement("div", null,
        React.createElement("label", { htmlFor: "remarks", className: "block text-md font-semibold text-gray-800 mb-1" },
          "Remarques (Optionnel)"
        ),
        React.createElement("textarea", {
          id: "remarks",
          value: remarks,
          onChange: (e) => setRemarks(e.target.value),
          rows: 4,
          className: `${inputBaseClass} ${inputValidClass}`
        })
      ),
      React.createElement("button", { 
        type: "submit",
        className: "w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      },
        React.createElement(SaveIcon, { className: "w-5 h-5" }),
        "Enregistrer l'Intervention"
      )
    )
  );
};

export default InterventionForm;