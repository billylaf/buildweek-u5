import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./customNavbar.css";

export default function CustomNavbar() {
  const navigate = useNavigate();
  useLocation(); // Serve per far aggiornare la Navbar ogni volta che si cambia pagina

  // Controlliamo se l'utente è autenticato se ha il token salvato
  const token = localStorage.getItem("token");

  // Se non c'è il token, la Navbar sparisce
  if (!token) {
    return null;
  }

  // Funzione per uscire
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="custom-navbar" variant="dark">
      <Container fluid className="px-4">
        {/* Brand EPIC ENERGY SERVICES */}
        <Navbar.Brand
          as={NavLink}
          to="/dashboard"
          className="d-flex align-items-center gap-2 navbar-logo"
        >
          <div className="logo-icon-box">
            <i className="bi bi-lightning-charge-fill"></i>
          </div>
          <div className="d-flex flex-column lh-1">
            <span className="brand-title">EPIC</span>
            <span className="brand-subtitle">ENERGY SERVICES</span>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" />

        <Navbar.Collapse id="main-navbar-nav">
          {/* Link di Navigazione */}
          <Nav className="mx-auto my-2 my-lg-0 nav-links-container">
            <Nav.Link as={NavLink} to="/dashboard" className="nav-item-custom">
              <i className="bi bi-grid-fill me-2"></i> Dashboard
            </Nav.Link>

            <Nav.Link as={NavLink} to="/fatture" className="nav-item-custom">
              <i className="bi bi-file-earmark-text-fill me-2"></i> Fatture
            </Nav.Link>

            <Nav.Link as={NavLink} to="/clienti" className="nav-item-custom">
              <i className="bi bi-people-fill me-2"></i> Clienti
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/amministrazione"
              className="nav-item-custom"
            >
              <i className="bi bi-shield-lock-fill me-2"></i> Amministrazione
              Utenti
            </Nav.Link>
          </Nav>

          {/* Pulsante Esci */}
          <div className="d-flex align-items-center">
            <Button
              variant="outline-light"
              size="sm"
              onClick={handleLogout}
              className="logout-btn"
            >
              <i className="bi bi-box-arrow-right me-1"></i> Esci
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
