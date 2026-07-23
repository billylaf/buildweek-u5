import { useEffect, useState, useCallback } from "react"
import {
  Offcanvas,
  Container,
  Row,
  Col,
  Table,
  Button,
  Badge,
} from "react-bootstrap"
import { getFatture } from "./api"

export default function DettaglioCliente({ cliente, show, onHide, onEdit }) {
  const [fatture, setFatture] = useState([])

  const fetchFatture = useCallback(() => {
    if (!cliente || !show) return
    getFatture({ clienteId: cliente.id, size: 50 }).then((data) => {
      setFatture(data.content || [])
    })
  }, [cliente, show])

  useEffect(() => {
    fetchFatture()
  }, [fetchFatture])

  if (!cliente) return null

  const statoColor = {
    PAGATA: "success",
    INSOLUTA: "danger",
    NON_PAGATA: "danger",
    ANNULLATA: "secondary",
    IN_ATTESA: "secondary",
  }

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="end"
      style={{ width: "550px" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{cliente.ragioneSociale}</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        <Container fluid className="px-0">
          <Row className="mb-3">
            <Col className="text-end">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onEdit(cliente)}
              >
                <i className="bi bi-pencil me-1"></i> Modifica
              </Button>
            </Col>
          </Row>

          <Row className="g-3 mb-4">
            <Col md={6}>
              <div className="text-muted small">Partita IVA</div>
              <div className="fw-semibold">{cliente.partitaIva}</div>
            </Col>

            <Col md={6}>
              <div className="text-muted small">PEC</div>
              <div className="fw-semibold">{cliente.pec}</div>
            </Col>

            <Col md={6}>
              <div className="text-muted small">Email</div>
              <div className="fw-semibold">{cliente.email}</div>
            </Col>

            <Col md={6}>
              <div className="text-muted small">Fatturato</div>
              <div className="fw-semibold">
                € {cliente.fatturatoAnnuale?.toLocaleString("it-IT")}
              </div>
            </Col>

            <Col md={6}>
              <div className="text-muted small">Contatto</div>
              <div className="fw-semibold">
                {cliente.nomeContatto} {cliente.cognomeContatto}
              </div>
            </Col>

            <Col md={6}>
              <div className="text-muted small">Telefono Contatto</div>
              <div className="fw-semibold">
                {cliente.telefonoContatto || "-"}
              </div>
            </Col>
          </Row>

          <div className="fw-bold mb-2">Fatture Associate</div>

          <Table size="sm" responsive className="epic-table">
            <thead>
              <tr>
                <th>Numero</th>
                <th>Data</th>
                <th>Importo</th>
                <th>Stato</th>
              </tr>
            </thead>

            <tbody>
              {fatture.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-3">
                    Nessuna fattura
                  </td>
                </tr>
              )}

              {fatture.map((f) => (
                <tr key={f.id}>
                  <td>FAT-{f.numeroFattura}</td>
                  <td>{f.dataFattura}</td>
                  <td>€ {f.importo}</td>
                  <td>
                    <Badge bg={statoColor[f.statoFattura?.nome] || "secondary"}>
                      {f.statoFattura?.nome}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </Offcanvas.Body>
    </Offcanvas>
  )
}
