import { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

function MyNavbar({
  searchQuery,
  setSearchQuery,
  selectedRole,
  setSelectedRole,
  onUserCreated,
}) {
  const [userProfile, setUserProfile] = useState({
    name: "Mario Rossi",
    avatarUrl: "https://via.placeholder.com/150",
    role: "Amministratore",
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    nome: "",
    cognome: "",
    email: "",
    password: "",
    ruolo: "ROLE_USER",
  });

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState(null);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [emailSuccess, setEmailSuccess] = useState(null);
  const [emailData, setEmailData] = useState({
    emailDestinatario: "",
    messaggio: "",
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/utenti/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel recupero dati profilo");
        return res.json();
      })
      .then((data) => {
        const hasAdmin = data.authorities?.some(
          (auth) => auth.authority === "ROLE_ADMIN",
        );
        const mainRole = hasAdmin
          ? "ADMIN"
          : data.authorities?.[0]?.authority.replace("ROLE_", "") || "USER";

        setUserProfile({
          name:
            data.nome && data.cognome
              ? `${data.nome} ${data.cognome}`
              : data.username,
          avatarUrl: data.avatar || "https://via.placeholder.com/150",
          role: mainRole,
        });
      })
      .catch((err) => console.error(err));
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedRole("ALL");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenCreateModal = () => {
    setFormData({
      username: "",
      nome: "",
      cognome: "",
      email: "",
      password: "",
      ruolo: "ROLE_USER",
    });
    setCreateError(null);
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setCreateError(null);
  };

  const handleCreateUserSubmit = (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);

    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/utenti/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 403) {
            throw new Error("Non hai i permessi per creare utenti!");
          }
          throw new Error("Errore durante la creazione dell'utente");
        }
        return res.json();
      })
      .then(() => {
        setCreateLoading(false);
        handleCloseCreateModal();
        if (onUserCreated) onUserCreated();
      })
      .catch((err) => {
        console.error(err);
        setCreateError(
          err.message ||
            "Impossibile creare l'utente. Verifica i dati inseriti.",
        );
        setCreateLoading(false);
      });
  };

  const handleOpenAvatarModal = (e) => {
    e.stopPropagation();
    setAvatarFile(null);
    setAvatarError(null);
    setShowAvatarModal(true);
  };

  const handleCloseAvatarModal = () => {
    setShowAvatarModal(false);
    setAvatarFile(null);
    setAvatarError(null);
  };

  const handleAvatarFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleAvatarSubmit = (e) => {
    e.preventDefault();
    if (!avatarFile) {
      setAvatarError("Seleziona un file prima di procedere.");
      return;
    }

    setAvatarLoading(true);
    setAvatarError(null);

    const token = localStorage.getItem("token");
    const uploadFormData = new FormData();
    uploadFormData.append("avatar", avatarFile);

    fetch("http://localhost:8080/utenti/me/avatar", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: uploadFormData,
    })
      .then((res) => {
        if (!res.ok)
          throw new Error("Errore durante l'aggiornamento dell'immagine");
        fetchProfile();
        setAvatarLoading(false);
        handleCloseAvatarModal();
      })
      .catch((err) => {
        console.error(err);
        setAvatarError("Errore durante il caricamento dell'immagine. Riprova.");
        setAvatarLoading(false);
      });
  };

  const handleOpenEmailModal = () => {
    setEmailData({ emailDestinatario: "", messaggio: "" });
    setEmailError(null);
    setEmailSuccess(null);
    setShowEmailModal(true);
  };

  const handleCloseEmailModal = () => {
    setShowEmailModal(false);
    setEmailError(null);
    setEmailSuccess(null);
  };

  const handleEmailInputChange = (e) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendEmailSubmit = (e) => {
    e.preventDefault();

    const isConfirmed = window.confirm("Sei sicuro di voler mandare la mail?");
    if (!isConfirmed) return;

    setEmailLoading(true);
    setEmailError(null);
    setEmailSuccess(null);

    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/utenti/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(emailData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore durante l'invio dell'email");
        setEmailSuccess("Email inviata con successo!");
        setEmailLoading(false);
        setTimeout(() => {
          handleCloseEmailModal();
        }, 1500);
      })
      .catch((err) => {
        console.error(err);
        setEmailError(
          err.message || "Impossibile inviare l'email. Riprova più tardi.",
        );
        setEmailLoading(false);
      });
  };

  const dropdownTitle = (
    <div className="d-inline-flex align-items-center me-1">
      <div
        className="position-relative me-2 style-avatar-wrapper"
        onClick={handleOpenAvatarModal}
        title="Clicca per cambiare immagine del profilo"
        style={{ cursor: "pointer" }}
      >
        <img
          src={userProfile.avatarUrl}
          alt="Foto Profilo"
          className="rounded-circle"
          style={{ width: "38px", height: "38px", objectFit: "cover" }}
        />
        <div
          className="position-absolute bottom-0 end-0 bg-dark text-white rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: "14px", height: "14px", fontSize: "9px" }}
        >
          <i className="bi bi-camera-fill"></i>
        </div>
      </div>
      <div className="d-flex flex-column text-start justify-content-center me-1">
        <span className="fw-bold fs-6 lh-sm">{userProfile.name}</span>
        <small className="text-muted lh-1" style={{ fontSize: "0.75rem" }}>
          {userProfile.role}
        </small>
      </div>
    </div>
  );

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container
          fluid
          className="d-flex align-items-center justify-content-between position-relative"
        >
          <div
            className="d-flex align-items-center"
            style={{ flex: "1 1 0px" }}
          >
            <Navbar.Brand href="#">Amministrazione Utenti</Navbar.Brand>
          </div>

          <Navbar.Toggle aria-controls="navbarScroll" />

          <Navbar.Collapse id="navbarScroll" className="w-100">
            <div
              className="d-flex justify-content-center my-2 my-lg-0"
              style={{ flex: "2 1 0px" }}
            >
              <div className="d-flex align-items-center gap-2">
                <Form.Control
                  type="search"
                  placeholder="Cerca per nome o email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ maxWidth: "220px" }}
                  aria-label="Search"
                />

                <NavDropdown
                  title={
                    selectedRole === "ALL" ? "Tutti i Ruoli" : selectedRole
                  }
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
              </div>
            </div>

            <div
              className="d-flex justify-content-end align-items-center gap-3"
              style={{ flex: "1 1 0px" }}
            >
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleOpenEmailModal}
                title="Invia Email"
              >
                <i className="bi bi-envelope-fill me-1"></i> Invia Email
              </Button>

              <NavDropdown
                title={dropdownTitle}
                id="navbarScrollingDropdown"
                align="end"
              >
                <NavDropdown.Item onClick={handleOpenAvatarModal}>
                  Cambia immagine profilo
                </NavDropdown.Item>
                <NavDropdown.Item href="#settings">
                  Impostazioni
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#logout" className="text-danger">
                  Esci
                </NavDropdown.Item>
              </NavDropdown>

              {userProfile.role === "ADMIN" && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleOpenCreateModal}
                >
                  <i className="bi bi-person-plus me-1"></i> Crea Utente
                </Button>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showEmailModal} onHide={handleCloseEmailModal} centered>
        <Form onSubmit={handleSendEmailSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Invia un'Email</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {emailError && <Alert variant="danger">{emailError}</Alert>}
            {emailSuccess && <Alert variant="success">{emailSuccess}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Indirizzo Email</Form.Label>
              <Form.Control
                type="email"
                name="emailDestinatario"
                placeholder="esempio@dominio.com"
                value={emailData.emailDestinatario}
                onChange={handleEmailInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Contenuto Email</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="messaggio"
                placeholder="Scrivi qui il testo del messaggio..."
                value={emailData.messaggio}
                onChange={handleEmailInputChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCloseEmailModal}
              disabled={emailLoading}
            >
              Annulla
            </Button>
            <Button variant="primary" type="submit" disabled={emailLoading}>
              {emailLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Invia Email"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showAvatarModal} onHide={handleCloseAvatarModal} centered>
        <Form onSubmit={handleAvatarSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Modifica Foto Profilo</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            {avatarError && <Alert variant="danger">{avatarError}</Alert>}

            <div className="mb-3">
              <img
                src={
                  avatarFile
                    ? URL.createObjectURL(avatarFile)
                    : userProfile.avatarUrl
                }
                alt="Anteprima Foto"
                className="rounded-circle img-thumbnail"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
            </div>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Seleziona un'immagine dal tuo computer
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleAvatarFileChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCloseAvatarModal}
              disabled={avatarLoading}
            >
              Annulla
            </Button>
            <Button variant="primary" type="submit" disabled={avatarLoading}>
              {avatarLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Carica Foto"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showCreateModal} onHide={handleCloseCreateModal} centered>
        <Form onSubmit={handleCreateUserSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Crea Nuovo Utente</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {createError && <Alert variant="danger">{createError}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Nome</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Cognome</Form.Label>
              <Form.Control
                type="text"
                name="cognome"
                value={formData.cognome}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Ruolo</Form.Label>
              <Form.Select
                name="ruolo"
                value={formData.ruolo}
                onChange={handleInputChange}
              >
                <option value="ROLE_USER">USER</option>
                <option value="ROLE_ADMIN">ADMIN</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCloseCreateModal}
              disabled={createLoading}
            >
              Annulla
            </Button>
            <Button variant="primary" type="submit" disabled={createLoading}>
              {createLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Crea Utente"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default MyNavbar;
