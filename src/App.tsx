import './App.css'
import { useGeolocation } from './hooks/useGeolocation'

function App() {
  const { state, requestLocation } = useGeolocation()
  const isLoading = state.status === 'loading'

  return (
    <section id="center">
      <h1>Just Pick</h1>

      <button type="button" onClick={requestLocation} disabled={isLoading}>
        {isLoading ? 'Getting your location…' : 'Use my location'}
      </button>

      {state.status === 'success' && (
        <p>
          Your location: {state.coords.latitude.toFixed(4)},{' '}
          {state.coords.longitude.toFixed(4)} (accurate to about{' '}
          {Math.round(state.coords.accuracy)} m)
        </p>
      )}

      {state.status === 'error' && <p role="alert">{state.message}</p>}
    </section>
  )
}

export default App