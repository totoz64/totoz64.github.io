
import { useState, useCallback } from 'react';
import type { GeolocationCoords } from '../types';

interface GeolocationState {
  loading: boolean;
  error: GeolocationPositionError | null | Error;
  data: GeolocationCoords | null;
}

function useGeolocation(): [GeolocationState, () => void] {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    data: null,
  });

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({
        loading: false,
        error: new Error("La géolocalisation n'est pas supportée par votre navigateur."),
        data: null,
      });
      return;
    }

    setState({ loading: true, error: null, data: null });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          loading: false,
          error: null,
          data: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          },
        });
      },
      (error) => {
        setState({
          loading: false,
          error: error,
          data: null,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  return [state, getLocation];
}

export default useGeolocation;
