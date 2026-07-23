import { useEffect, useState, useCallback } from "react"
import { Modal, Container, Row, Col, Form, Button } from "react-bootstrap"
import { createCliente, updateCliente } from "./api"

const EMPTY = {
  ragioneSociale: "",
  partitaIva: "",
  email: "",
  pec: "",
  fatturatoAnnuale: "",
  tipoCliente: "SRL",
  telefono: "",
  nomeContatto: "",
  cognomeContatto: "",
  telefonoContatto: "",
  emailContatto: "",
  dataInserimento: "",
  dataUltimoContatto: "",
  logoAziendale: "",
}

export default function NuovoCliente({ show, onHide, cliente, onSaved }) {
  const [form, setForm] = useState(EMPTY)

  // 🔵 Carica dati in modifica
  useEffect(() => {
    setForm(cliente ? { ...EMPTY, ...cliente } : EMPTY)
  }, [cliente, show])

  // 🔵 Helper per aggiornare campi
  const updateField = useCallback(
    (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value })),
    [],
  )

  // 🔵 Submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      ...form,
      fatturatoAnnuale: Number(form.fatturatoAnnuale),
    }

    if (cliente) {
      await updateCliente(cliente.id, payload)
    } else {
      await createCliente(payload)
    }

    onSaved()
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {cliente ? "Modifica Cliente" : "Nuovo Cliente"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Container fluid className="px-0">
            <Row className="g-3">
              <Col md={6}>
                <Form.Label>Ragione Sociale *</Form.Label>
                <Form.Control
                  required
                  value={form.ragioneSociale}
                  onChange={updateField("ragioneSociale")}
                />
              </Col>

              <Col md={6}>
                <Form.Label>Partita IVA *</Form.Label>
                <Form.Control
                  required
                  maxLength={11}
                  value={form.partitaIva}
                  onChange={updateField("partitaIva")}
                />
              </Col>

              <Col md={6}>
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  required
                  value={form.email}
                  onChange={updateField("email")}
                />
              </Col>

              <Col md={6}>
                <Form.Label>PEC *</Form.Label>
                <Form.Control
                  type="email"
                  required
                  value={form.pec}
                  onChange={updateField("pec")}
                />
              </Col>

              <Col md={4}>
                <Form.Label>Fatturato Annuale *</Form.Label>
                <Form.Control
                  type="number"
                  required
                  value={form.fatturatoAnnuale}
                  onChange={updateField("fatturatoAnnuale")}
                />
              </Col>

              <Col md={4}>
                <Form.Label>Tipo Cliente *</Form.Label>
                <Form.Select
                  required
                  value={form.tipoCliente}
                  onChange={updateField("tipoCliente")}
                >
                  <option value="PA">PA</option>
                  <option value="SRL">SRL</option>
                  <option value="SPA">SPA</option>
                  <option value="SAS">SAS</option>
                </Form.Select>
              </Col>

              <Col md={4}>
                <Form.Label>Telefono</Form.Label>
                <Form.Control
                  value={form.telefono}
                  onChange={updateField("telefono")}
                />
              </Col>

              <Col md={6}>
                <Form.Label>Nome Contatto *</Form.Label>
                <Form.Control
                  required
                  value={form.nomeContatto}
                  onChange={updateField("nomeContatto")}
                />
              </Col>

              <Col md={6}>
                <Form.Label>Cognome Contatto *</Form.Label>
                <Form.Control
                  required
                  value={form.cognomeContatto}
                  onChange={updateField("cognomeContatto")}
                />
              </Col>

              <Col md={6}>
                <Form.Label>Telefono Contatto</Form.Label>
                <Form.Control
                  value={form.telefonoContatto}
                  onChange={updateField("telefonoContatto")}
                />
              </Col>

              <Col md={6}>
                <Form.Label>Email Contatto</Form.Label>
                <Form.Control
                  type="email"
                  value={form.emailContatto}
                  onChange={updateField("emailContatto")}
                />
              </Col>
            </Row>
          </Container>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide}>
            Annulla
          </Button>
          <Button type="submit" className="btn-epic-gold">
            {cliente ? "Salva" : "Crea"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
