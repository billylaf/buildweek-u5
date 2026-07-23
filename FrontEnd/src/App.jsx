import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./components/login/Login"
import Sign from "./components/sign/Sign"
import CustomNavbar from "./components/navbar/CustomNavbar"
import "./Style.css"
import Fatture from "./components/fatture/Fatture"

export default function App() {
  return (
    <BrowserRouter>
      {/* La Navbar si nasconderà da sola finché non c'è il token */}
      <CustomNavbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Sign />} />
        <Route path="/fatture" element={<Fatture />} />
      </Routes>
    </BrowserRouter>
  )
}
