import { Offcanvas, Container, Row, Col, Button, Badge } from "react-bootstrap";
import { getUserRoleInfo } from "../../auth/auth";

export default function DettaglioFattura({ fattura, show, onHide, onEdit }) {
  // Controlliamo se l'utente è ADMIN
const { isAdmin } = getUserRoleInfo();

  if (!fattura) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("it-IT");
  };

  const formatCurrency = (amount) => {
    return `€ ${amount?.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0,00"}`;
  };

  const statoColor = {
    PAGATA: "success",
    INSOLUTA: "danger",
    NON_PAGATA: "danger",
    ANNULLATA: "secondary",
    IN_ATTESA: "secondary",
  };

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="end"
      style={{ width: "500px" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Fattura FAT-{fattura.numeroFattura}</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        <Container fluid className="px-0">
          <Row className="mb-3">
            <Col className="text-end">
              {/* PULSANTE MODIFICA: DISABILITATO SE NON E' ADMIN */}
              <Button
                variant="outline-primary"
                size="sm"
                disabled={!isAdmin}
                onClick={() => onEdit(fattura)}
              >
                <i className="bi bi-pencil me-1"></i> Modifica
              </Button>
            </Col>
          </Row>

          <Row className="g-3 mb-4">
            <Col md={6}>
              <div className="text-muted small">Numero Fattura</div>
              <div className="fw-semibold">FAT-{fattura.numeroFattura}</div>
            </Col>

            <Col md={6}>
              <div className="text-muted small">Data Fattura</div>
              <div className="fw-semibold">
                {formatDate(fattura.dataFattura)}
              </div>
            </Col>

            <Col md={6}>
              <div className="text-muted small">Importo</div>
              <div className="fw-semibold">
                {formatCurrency(fattura.importo)}
              </div>
            </Col>

            <Col md={6}>
              <div className="text-muted small">Stato</div>
              <div>
                <Badge
                  bg={statoColor[fattura.statoFattura?.nome] || "secondary"}
                >
                  {fattura.statoFattura?.nome || "N/D"}
                </Badge>
              </div>
            </Col>

            <Col md={12}>
              <div className="text-muted small">Cliente</div>
              <div className="fw-semibold">
                {fattura.cliente?.ragioneSociale || "-"}
                {fattura.cliente && (
                  <span
                    className="text-muted ms-2"
                    style={{ fontSize: "0.85rem" }}
                  >
                    (P.IVA: {fattura.cliente.partitaIva})
                  </span>
                )}
              </div>
            </Col>

            {fattura.cliente && (
              <>
                <Col md={6}>
                  <div className="text-muted small">Email Cliente</div>
                  <div>{fattura.cliente.email || "-"}</div>
                </Col>

                <Col md={6}>
                  <div className="text-muted small">Telefono</div>
                  <div>{fattura.cliente.telefono || "-"}</div>
                </Col>
              </>
            )}
          </Row>
        </Container>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
