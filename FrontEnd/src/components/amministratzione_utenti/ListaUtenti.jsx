import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Badge,
  Spinner,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";

function ListaUtenti({
  searchQuery = "",
  selectedRole = "ALL",
  refreshSignal,
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("ROLE_USER");
  const [roleModalLoading, setRoleModalLoading] = useState(false);
  const [roleUpdateError, setRoleUpdateError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [refreshSignal]);

  const fetchUsers = () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/utenti", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Errore HTTP: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const usersArray = Array.isArray(data) ? data : data.content || [];
        setUsers(usersArray);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Impossibile caricare la lista degli utenti.");
        setLoading(false);
      });
  };

  const handleEditRole = (user) => {
    setSelectedUser(user);
    const currentRole =
      formatRole(user) === "ADMIN" ? "ROLE_ADMIN" : "ROLE_USER";
    setNewRole(currentRole);
    setRoleUpdateError(null);
    setShowRoleModal(true);
  };

  const handleCloseRoleModal = () => {
    setShowRoleModal(false);
    setSelectedUser(null);
    setRoleUpdateError(null);
  };

  const handleSaveRole = (e) => {
    e.preventDefault();
    setRoleModalLoading(true);
    setRoleUpdateError(null);
    const token = localStorage.getItem("token");

    const bodyData = {
      ruoli: [newRole],
    };

    fetch(`http://localhost:8080/utenti/${selectedUser.username}/ruoli`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore durante la modifica dei ruoli");
        return res.json();
      })
      .then((updatedUser) => {
        setUsers(
          users.map((u) =>
            u.username === updatedUser.username ? updatedUser : u,
          ),
        );
        setRoleModalLoading(false);
        handleCloseRoleModal();
      })
      .catch((err) => {
        console.error(err);
        setRoleUpdateError("Errore durante l'aggiornamento dei ruoli.");
        setRoleModalLoading(false);
      });
  };

  const handleDelete = (username) => {
    if (window.confirm("Sei sicuro di voler eliminare questo utente?")) {
      const token = localStorage.getItem("token");

      fetch(`http://localhost:8080/utenti/${username}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Errore durante l'eliminazione");
          setUsers(users.filter((user) => user.username !== username));
        })
        .catch((err) => console.error(err));
    }
  };

  const formatRole = (user) => {
    if (user.authorities && user.authorities.length > 0) {
      const hasAdmin = user.authorities.some(
        (a) => a.authority === "ROLE_ADMIN",
      );
      return hasAdmin ? "ADMIN" : "USER";
    }
    return user.ruolo || "USER";
  };

  const filteredUsers = users.filter((user) => {
    const userRole = formatRole(user);

    const matchesRole = selectedRole === "ALL" || userRole === selectedRole;

    const query = searchQuery.toLowerCase();
    const fullName = `${user.nome || ""} ${user.cognome || ""}`.toLowerCase();
    const matchesSearch =
      user.username.toLowerCase().includes(query) ||
      (user.email && user.email.toLowerCase().includes(query)) ||
      fullName.includes(query);

    return matchesRole && matchesSearch;
  });

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Caricamento utenti in corso...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <div className="mb-3">
        <h4 className="m-0">Elenco Utenti</h4>
      </div>

      <Table
        responsive
        hover
        className="align-middle bg-white rounded shadow-sm"
      >
        <thead className="table-light">
          <tr>
            <th>Utente</th>
            <th>Email</th>
            <th>Ruolo</th>
            <th className="text-end pe-4">Azioni</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4 text-muted">
                Nessun utente trovato con i filtri selezionati.
              </td>
            </tr>
          ) : (
            filteredUsers.map((user) => {
              const userRole = formatRole(user);
              return (
                <tr key={user.username}>
                  <td>
                    <div className="d-flex align-items-center">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="rounded-circle me-3"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-3 fw-bold"
                          style={{ width: "40px", height: "40px" }}
                        >
                          {user.nome
                            ? user.nome.charAt(0)
                            : user.username.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="fw-bold">
                          {user.nome && user.cognome
                            ? `${user.nome} ${user.cognome}`
                            : user.username}
                        </div>
                        <small className="text-muted">@{user.username}</small>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <Badge
                      bg={userRole === "ADMIN" ? "primary" : "info"}
                      className="px-2 py-1 fs-6 fw-normal"
                    >
                      {userRole}
                    </Badge>
                  </td>
                  <td className="text-end pe-3">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditRole(user)}
                      title="Modifica Ruolo"
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(user.username)}
                      title="Elimina"
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>

      <Modal show={showRoleModal} onHide={handleCloseRoleModal} centered>
        <Form onSubmit={handleSaveRole}>
          <Modal.Header closeButton>
            <Modal.Title>Modifica Ruolo Utente</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {roleUpdateError && (
              <Alert variant="danger">{roleUpdateError}</Alert>
            )}

            {selectedUser && (
              <>
                <p className="mb-3">
                  Stai modificando il ruolo per l'utente:{" "}
                  <strong>@{selectedUser.username}</strong>
                </p>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Seleziona Ruolo</Form.Label>
                  <Form.Select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                  >
                    <option value="ROLE_USER">USER</option>
                    <option value="ROLE_ADMIN">ADMIN</option>
                  </Form.Select>
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCloseRoleModal}
              disabled={roleModalLoading}
            >
              Annulla
            </Button>
            <Button variant="primary" type="submit" disabled={roleModalLoading}>
              {roleModalLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Salva Modifiche"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default ListaUtenti;
