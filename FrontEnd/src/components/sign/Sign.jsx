import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Container,
  Card,
  Form,
  InputGroup,
  Button,
  Row,
  Col,
} from "react-bootstrap"
import "./sign.css"

export default function Sign() {
  const [form, setForm] = useState({
    username: "",
    nome: "",
    cognome: "",
    email: "",
    password: "",
    confirm: "",
    ruolo: "USER",
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.password !== form.confirm) {
      alert("Le password non coincidono!")
      return
    }

    try {
      const res = await fetch("http://localhost:8080/utenti/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          nome: form.nome,
          cognome: form.cognome,
          email: form.email,
          password: form.password,
          ruolo: form.ruolo,
        }),
      })

      if (res.ok) {
        alert(
          "Registrazione completata con successo! Ora puoi effettuare il login.",
        )
        navigate("/")
      } else {
        alert(
          "Errore durante la registrazione. Riprova con un altro username o email.",
        )
      }
    } catch (error) {
      console.error("Errore di rete:", error)
      alert("Impossibile contattare il server.")
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-background">
        <Container className="d-flex justify-content-center align-items-center min-vh-100 py-4">
          <Card className="auth-card auth-card-wide">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-3">
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <i className="bi bi-lightning-charge-fill text-warning fs-1"></i>
                  <span className="auth-brand">EPIC</span>
                </div>
                <div className="auth-brand-sub">ENERGY SERVICES</div>
              </div>

              <hr />

              <p className="text-center text-muted mb-4">Crea il tuo account</p>

              <Form onSubmit={handleSubmit}>
                <Row className="g-3 mb-3">
                  <Col md={6}>
                    <InputGroup>
                      <InputGroup.Text className="bg-white">
                        <i className="bi bi-person"></i>
                      </InputGroup.Text>
                      <Form.Control
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        required
                      />
                    </InputGroup>
                  </Col>
                  <Col md={6}>
                    <InputGroup>
                      <InputGroup.Text className="bg-white">
                        <i className="bi bi-envelope"></i>
                      </InputGroup.Text>
                      <Form.Control
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </InputGroup>
                  </Col>
                  <Col md={6}>
                    <InputGroup>
                      <InputGroup.Text className="bg-white">
                        <i className="bi bi-person-badge"></i>
                      </InputGroup.Text>
                      <Form.Control
                        name="nome"
                        placeholder="Nome"
                        value={form.nome}
                        onChange={handleChange}
                        required
                      />
                    </InputGroup>
                  </Col>
                  <Col md={6}>
                    <InputGroup>
                      <InputGroup.Text className="bg-white">
                        <i className="bi bi-person-badge"></i>
                      </InputGroup.Text>
                      <Form.Control
                        name="cognome"
                        placeholder="Cognome"
                        value={form.cognome}
                        onChange={handleChange}
                        required
                      />
                    </InputGroup>
                  </Col>
                  <Col md={6}>
                    <InputGroup>
                      <InputGroup.Text className="bg-white">
                        <i className="bi bi-lock"></i>
                      </InputGroup.Text>
                      <Form.Control
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                    </InputGroup>
                  </Col>
                  <Col md={6}>
                    <InputGroup>
                      <InputGroup.Text className="bg-white">
                        <i className="bi bi-lock-fill"></i>
                      </InputGroup.Text>
                      <Form.Control
                        name="confirm"
                        type="password"
                        placeholder="Conferma Password"
                        value={form.confirm}
                        onChange={handleChange}
                        required
                      />
                    </InputGroup>
                  </Col>
                </Row>

                <Button
                  type="submit"
                  className="w-100 btn-epic-gold fw-bold py-2"
                >
                  Crea Account
                </Button>
              </Form>

              <hr className="my-4" />

              <p className="text-center mb-0">
                Hai già un account?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    navigate("/")
                  }}
                >
                  Accedi
                </a>
              </p>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  )
}
