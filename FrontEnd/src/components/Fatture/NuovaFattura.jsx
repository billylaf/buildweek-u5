import { useEffect, useState, useCallback } from "react"
import { Modal, Container, Row, Col, Form, Button } from "react-bootstrap"
import {
  createFattura,
  updateFattura,
  getClienti,
  getStatiFattura,
} from "./api"

const EMPTY = {
  clienteId: "",
  statoFatturaId: "",
  numeroFattura: "",
  dataFattura: "",
  importo: "",
}

export default function NuovaFattura({ show, onHide, fattura, onSaved }) {
  const [form, setForm] = useState(EMPTY)
  const [clienti, setClienti] = useState([])
  const [stati, setStati] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (fattura && show) {
      setForm({
        clienteId: fattura.cliente?.id || "",
        statoFatturaId: fattura.statoFattura?.id || "",
        numeroFattura: fattura.numeroFattura || "",
        dataFattura: fattura.dataFattura || "",
        importo: fattura.importo || "",
      })
    } else {
      setForm(EMPTY)
    }
  }, [fattura, show])

  useEffect(() => {
    if (show) {
      setLoading(true)
      Promise.all([getClienti({ size: 100 }), getStatiFattura()])
        .then(([clientiData, statiData]) => {
          console.log("Clienti ricevuti:", clientiData)
          console.log("Stati ricevuti:", statiData)
          console.log("Stati è array?", Array.isArray(statiData))

          setClienti(clientiData?.content || [])

          if (Array.isArray(statiData)) {
            setStati(statiData)
          } else if (
            statiData &&
            typeof statiData === "object" &&
            statiData.content
          ) {
            setStati(statiData.content)
          } else {
            setStati([])
          }
        })
        .catch((error) => {
          console.error("Errore nel caricamento dati:", error)
          setClienti([])
          setStati([])
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [show])

  const updateField = useCallback(
    (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value })),
    [],
  )

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      clienteId: Number(form.clienteId),
      statoFatturaId: Number(form.statoFatturaId),
      numeroFattura: Number(form.numeroFattura),
      dataFattura: form.dataFattura,
      importo: Number(form.importo),
    }

    if (fattura) {
      await updateFattura(fattura.id, payload)
    } else {
      await createFattura(payload)
    }

    onSaved()
  }

  const isStatiArray = Array.isArray(stati)

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {fattura ? "Modifica Fattura" : "Nuova Fattura"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Container fluid className="px-0">
            {loading && (
              <div className="text-center text-muted py-2">
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Caricamento dati...
              </div>
            )}

            <Row className="g-3">
              <Col md={6}>
                <Form.Label>Cliente *</Form.Label>
                <Form.Select
                  required
                  value={form.clienteId}
                  onChange={updateField("clienteId")}
                  disabled={loading}
                >
                  <option value="">Seleziona un cliente...</option>
                  {Array.isArray(clienti) &&
                    clienti.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.ragioneSociale} - {c.partitaIva}
                      </option>
                    ))}
                </Form.Select>
              </Col>

              <Col md={6}>
                <Form.Label>Stato *</Form.Label>
                <Form.Select
                  required
                  value={form.statoFatturaId}
                  onChange={updateField("statoFatturaId")}
                  disabled={loading}
                >
                  <option value="">Seleziona uno stato...</option>
                </Form.Select>
                {!isStatiArray && (
                  <Form.Text className="text-danger">
                    Errore nel caricamento degli stati
                  </Form.Text>
                )}
              </Col>

              <Col md={6}>
                <Form.Label>Numero Fattura *</Form.Label>
                <Form.Control
                  required
                  type="number"
                  min="1"
                  step="1"
                  value={form.numeroFattura}
                  onChange={updateField("numeroFattura")}
                  disabled={loading}
                  placeholder="es. 1, 2, 3..."
                />
              </Col>

              <Col md={6}>
                <Form.Label>Data Fattura *</Form.Label>
                <Form.Control
                  required
                  type="date"
                  value={form.dataFattura}
                  onChange={updateField("dataFattura")}
                  disabled={loading}
                />
              </Col>

              <Col md={12}>
                <Form.Label>Importo *</Form.Label>
                <Form.Control
                  required
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={form.importo}
                  onChange={updateField("importo")}
                  disabled={loading}
                  placeholder="es. 100.50"
                />
                <Form.Text className="text-muted">
                  Inserisci l'importo con due decimali (es. 100.50)
                </Form.Text>
              </Col>
            </Row>
          </Container>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={onHide}
            disabled={loading}
          >
            Annulla
          </Button>
          <Button type="submit" className="btn-epic-gold" disabled={loading}>
            {loading ? "Salvataggio..." : fattura ? "Salva" : "Crea"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
