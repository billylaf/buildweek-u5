import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./components/login/Login"
import Sign from "./components/sign/Sign"
import ListaClienti from "./components/cliente/ListaClienti"
import CustomNavbar from "./components/navbar/CustomNavbar"
import "./Style.css"
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Login from "./components/login/Login";
import Sign from "./components/sign/Sign";
import CustomNavbar from "./components/navbar/CustomNavbar";
import "./Style.css";
import Dashboard from "./components/dashboard/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      {/* La Navbar si nasconderà da sola finché non c'è il token */}
      <CustomNavbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Sign />} />
        <Route path="/clienti" element={<ListaClienti />} />
        {/* Pagina della Dashboard dopo il Login */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Reindirizzamento di sicurezza: se la rotta non esiste, torna a "/" */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
