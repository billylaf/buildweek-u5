import Login from "./components/login/Login"
import Sign from "./components/sign/Sign"
import "./Style.css"
function App() {
  const path = window.location.pathname

  if (path === "/signup") return <Sign />
  return <Login />
}

export default App
