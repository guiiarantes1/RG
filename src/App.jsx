import Login from './pages/Login'
import { useTheme } from './hooks/useTheme'
import './App.css'

function App() {
  const { theme } = useTheme();

  return (
    <div className="App" data-theme={theme}>
      <Login />
    </div>
  )
}

export default App
