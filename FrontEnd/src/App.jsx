import Login from "./components/login/Login"
import Sign from "./components/sign/Sign"

function App() {
  const path = window.location.pathname

  if (path === "/signup") return <Sign />
  return <Login />
}

export default App
