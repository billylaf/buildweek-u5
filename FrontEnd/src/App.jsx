import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./components/login/Login"
import Sign from "./components/sign/Sign"
import ListaClienti from "./components/cliente/ListaClienti"
import CustomNavbar from "./components/navbar/CustomNavbar"
import "./Style.css"

export default function App() {
  return (
    <BrowserRouter>
      {/* La Navbar si nasconderà da sola finché non c'è il token */}
      <CustomNavbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Sign />} />
        <Route path="/clienti" element={<ListaClienti />} />
      </Routes>
    </BrowserRouter>
  )
}
