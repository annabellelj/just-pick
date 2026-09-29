import { useCallback, useState } from 'react'

export type Coords = {
  latitude: number
  longitude: number
  accuracy: number
}

export type LocationState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; coords: Coords }
  | { status: 'error'; message: string }

function getErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Location access was denied. Allow location for this site in your browser settings, then try again.'
    case error.POSITION_UNAVAILABLE:
      return "We couldn't determine your location. Check that location services are turned on."
    case error.TIMEOUT:
      return 'Getting your location took too long. Please try again.'
    default:
      return 'Something went wrong while getting your location.'
  }
}

export function useGeolocation() {
  const [state, setState] = useState<LocationState>({ status: 'idle' })

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState({
        status: 'error',
        message: "Your browser doesn't support location services.",
      })
      return
    }

    setState({ status: 'loading' })

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          status: 'success',
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          },
        })
      },
      (error) => {
        setState({ status: 'error', message: getErrorMessage(error) })
      },
      {
        enableHighAccuracy: false,
        timeout: 10_000,
        maximumAge: 60_000,
      },
    )
  }, [])

  return { state, requestLocation }
}