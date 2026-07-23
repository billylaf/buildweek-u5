import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

function NavScrollExample() {
  const [userProfile, setUserProfile] = useState({
    username: "Mario Rossi",
    avatar: "https://via.placeholder.com/150",
    ruolo: "Amministratore",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");

  useEffect(() => {
    fetch("http://localhost:8080/api/user/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore nella risposta del server");
        }
        return response.json();
      })
      .then((data) => {
        setUserProfile({
          username: data.username,
          avatar: data.avatar,
          ruolo: data.authorities.authority[1],
        });
      })
      .catch((error) => {
        console.error(
          "Errore durante il recupero dei dati del profilo:",
          error,
        );
      });
  }, []);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedRole("ALL");
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const dropdownTitle = (
    <div className="d-inline-flex align-items-center me-1">
      <img
        src={userProfile.avatarUrl}
        alt="Foto Profilo"
        className="rounded-circle me-2"
        style={{ width: "38px", height: "38px", objectFit: "cover" }}
      />
      <div className="d-flex flex-column text-start justify-content-center me-1">
        <span className="fw-bold fs-6 lh-sm">{userProfile.name}</span>
        <small className="text-muted lh-1" style={{ fontSize: "0.75rem" }}>
          {userProfile.role}
        </small>
      </div>
    </div>
  );

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container
        fluid
        className="d-flex align-items-center justify-content-between position-relative"
      >
        <div className="d-flex align-items-center" style={{ flex: "1 1 0px" }}>
          <Navbar.Brand href="#">Amministrazione Utenti</Navbar.Brand>
        </div>

        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll" className="w-100">
          <div
            className="d-flex justify-content-center my-2 my-lg-0"
            style={{ flex: "2 1 0px" }}
          >
            <Form
              onSubmit={handleSearch}
              className="d-flex align-items-center gap-2"
            >
              <Form.Control
                type="search"
                placeholder="Cerca..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ maxWidth: "180px" }}
                aria-label="Search"
              />

              <NavDropdown
                title={selectedRole === "ALL" ? "Tutti i Ruoli" : selectedRole}
                id="role-filter-dropdown"
                className="border rounded px-2 bg-white"
              >
                <NavDropdown.Item onClick={() => setSelectedRole("ALL")}>
                  Tutti i Ruoli
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => setSelectedRole("USER")}>
                  USER
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => setSelectedRole("ADMIN")}>
                  ADMIN
                </NavDropdown.Item>
              </NavDropdown>

              <Button
                variant="outline-secondary"
                onClick={handleResetFilters}
                size="sm"
              >
                Reset
              </Button>

              <Button type="submit" variant="outline-success" size="sm">
                Cerca
              </Button>
            </Form>
          </div>

          <div
            className="d-flex justify-content-end align-items-center"
            style={{ flex: "1 1 0px" }}
          >
            <Nav>
              <NavDropdown
                title={dropdownTitle}
                id="navbarScrollingDropdown"
                align="end"
              >
                <NavDropdown.Item href="#profile">
                  Il mio profilo
                </NavDropdown.Item>
                <NavDropdown.Item href="#settings">
                  Impostazioni
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#logout" className="text-danger">
                  Esci
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;
