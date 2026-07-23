import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/login/Login"
import Sign from "./components/sign/Sign"
import ListaClienti from "./components/cliente/ListaClienti"
import ListaFatture from "./components/fatture/ListaFatture"
import CustomNavbar from "./components/navbar/CustomNavbar"
import Dashboard from "./components/dashboard/Dashboard"
import "./Style.css"

export default function App() {
  return (
    <BrowserRouter>
      {/* La Navbar si nasconderà da sola finché non c'è il token */}
      <CustomNavbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Sign />} />
        {/* Pagina della Dashboard dopo il Login */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clienti" element={<ListaClienti />} />
        <Route path="/fatture" element={<ListaFatture />} />
        {/* Reindirizzamento di sicurezza: se la rotta non esiste, torna a "/" */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
