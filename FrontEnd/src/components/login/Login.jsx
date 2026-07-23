import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Card, Form, InputGroup, Button } from "react-bootstrap"
import "./login.css"

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        const data = await res.json()
        localStorage.setItem("token", data.accessToken || data.token)
        if (data.username) localStorage.setItem("username", data.username)

        navigate("/dashboard")
      } else {
        alert("Credenziali errate!")
      }
    } catch (error) {
      console.error("Errore durante il login:", error)
      alert("Impossibile connettersi al server.")
    }
  }

  return (
    <div className="auth-page">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="auth-card">
          <Card.Body className="p-4 p-md-5">
            <div className="text-center mb-3">
              <div className="d-flex align-items-center justify-content-center gap-2">
                <i className="bi bi-lightning-charge-fill text-warning fs-1"></i>
                <span className="auth-brand">EPIC</span>
              </div>
              <div className="auth-brand-sub">ENERGY SERVICES</div>
            </div>

            <hr />

            <p className="text-center text-muted mb-4">
              CRM - Gestione Clienti
            </p>

            <Form onSubmit={handleSubmit}>
              <InputGroup className="mb-3">
                <InputGroup.Text className="bg-white">
                  <i className="bi bi-envelope text-muted"></i>
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

              <InputGroup className="mb-4">
                <InputGroup.Text className="bg-white">
                  <i className="bi bi-lock text-muted"></i>
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

              <Button
                type="submit"
                className="w-100 btn-epic-gold fw-bold py-2"
              >
                Accedi
              </Button>
            </Form>

            <hr className="my-4" />

            <p className="text-center mb-0">
              Non hai un account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  navigate("/signup")
                }}
              >
                Registrati
              </a>
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}
