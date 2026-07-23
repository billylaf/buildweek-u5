import { useEffect, useState, useCallback } from "react"
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  Table,
  Pagination,
  Badge,
} from "react-bootstrap"
import { getFatture, deleteFattura } from "./api"
import NuovaFattura from "./NuovaFattura"
import DettaglioFattura from "./DettaglioFattura"
import "./Fattura.css"

const statoColor = {
  PAGATO: "success",
  SCADUTO: "danger",
  IN_ATTESA: "warning",
  ANNULLATO: "secondary",
}

export default function ListaFatture() {
  const [fatture, setFatture] = useState([])
  const [filters, setFilters] = useState({
    clienteId: "",
    statoId: "",
    data: "",
    anno: "",
    minImporto: "",
    maxImporto: "",
  })
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [selected, setSelected] = useState(null)

  const fetchFatture = useCallback(() => {
    setLoading(true)
    setError(null)

    const params = new URLSearchParams()

    if (filters.clienteId) params.append("clienteId", filters.clienteId)
    if (filters.statoId) params.append("statoId", filters.statoId)
    if (filters.data) params.append("data", filters.data)
    if (filters.anno) params.append("anno", filters.anno)
    if (filters.minImporto) params.append("minImporto", filters.minImporto)
    if (filters.maxImporto) params.append("maxImporto", filters.maxImporto)

    params.append("page", page)
    params.append("size", 10)
    params.append("sortBy", "dataFattura")
    params.append("sortOrder", "desc")

    getFatture(params)
      .then((data) => {
        setFatture(data.content || [])
        setTotalPages(data.totalPages ?? 0)
      })
      .catch((err) => {
        console.error("Errore nel caricamento fatture:", err)
        setError("Errore nel caricamento delle fatture")
        setFatture([])
        setTotalPages(0)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [filters, page])

  useEffect(() => {
    fetchFatture()
  }, [fetchFatture])

  const handleFilterChange = (field) => (e) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }))
    setPage(0)
  }

  const handleDelete = async (f) => {
    if (!window.confirm(`Eliminare la fattura "FAT-${f.numeroFattura}"?`)) {
      return
    }
    try {
      await deleteFattura(f.id)
      fetchFatture()
    } catch (err) {
      console.error("Errore durante l'eliminazione:", err)
      alert("Errore durante l'eliminazione della fattura")
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "-"
    const d = new Date(dateStr)
    return d.toLocaleDateString("it-IT")
  }

  const formatCurrency = (amount) => {
    return `€ ${amount?.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0,00"}`
  }

  const resetFilters = () => {
    setFilters({
      clienteId: "",
      statoId: "",
      data: "",
      anno: "",
      minImporto: "",
      maxImporto: "",
    })
    setPage(0)
  }

  return (
    <Container fluid className="px-4 py-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h2 className="fw-bold mb-0">Gestione Fatture</h2>
        </Col>
        <Col xs="auto">
          <Button
            className="btn-epic-gold"
            onClick={() => {
              setEditing(null)
              setShowForm(true)
            }}
          >
            <i className="bi bi-plus-lg me-1"></i> Nuova Fattura
          </Button>
        </Col>
      </Row>

      {/* Filtri */}
      <Row className="mb-3 g-2">
        <Col md={2}>
          <Form.Control
            placeholder="ID Cliente"
            value={filters.clienteId}
            onChange={handleFilterChange("clienteId")}
          />
        </Col>
        <Col md={2}>
          <Form.Control
            placeholder="ID Stato"
            value={filters.statoId}
            onChange={handleFilterChange("statoId")}
          />
        </Col>
        <Col md={2}>
          <Form.Control
            type="date"
            value={filters.data}
            onChange={handleFilterChange("data")}
          />
        </Col>
        <Col md={1}>
          <Form.Control
            placeholder="Anno"
            value={filters.anno}
            onChange={handleFilterChange("anno")}
          />
        </Col>
        <Col md={2}>
          <InputGroup>
            <Form.Control
              placeholder="Min €"
              value={filters.minImporto}
              onChange={handleFilterChange("minImporto")}
            />
            <InputGroup.Text>–</InputGroup.Text>
            <Form.Control
              placeholder="Max €"
              value={filters.maxImporto}
              onChange={handleFilterChange("maxImporto")}
            />
          </InputGroup>
        </Col>
        <Col md={1}>
          <Button variant="outline-secondary" onClick={resetFilters}>
            <i className="bi bi-x-circle"></i> Reset
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="epic-panel p-3">
            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            <Table hover responsive className="epic-table align-middle mb-3">
              <thead>
                <tr>
                  <th>Numero</th>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Importo</th>
                  <th>Stato</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-4">
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Caricamento in corso...
                    </td>
                  </tr>
                ) : fatture.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-4">
                      Nessuna fattura trovata
                    </td>
                  </tr>
                ) : (
                  fatture.map((f) => (
                    <tr key={f.id}>
                      <td>
                        <a
                          href="#"
                          className="epic-fattura-link"
                          onClick={(e) => {
                            e.preventDefault()
                            setSelected(f)
                            setShowDetail(true)
                          }}
                        >
                          FAT-{f.numeroFattura}
                        </a>
                      </td>
                      <td>{f.cliente?.ragioneSociale || "-"}</td>
                      <td>{formatDate(f.dataFattura)}</td>
                      <td>{formatCurrency(f.importo)}</td>
                      <td>
                        <Badge
                          bg={statoColor[f.statoFattura?.nome] || "secondary"}
                        >
                          {f.statoFattura?.nome || "N/D"}
                        </Badge>
                      </td>
                      <td>
                        <button
                          className="action-icon-btn"
                          onClick={() => {
                            setEditing(f)
                            setShowForm(true)
                          }}
                          title="Modifica"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        <button
                          className="action-icon-btn text-danger"
                          onClick={() => handleDelete(f)}
                          title="Elimina"
                        >
                          <i className="bi bi-trash"></i>
                        </button>

                        <button
                          className="action-icon-btn"
                          onClick={() => {
                            setSelected(f)
                            setShowDetail(true)
                          }}
                          title="Dettaglio"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            {totalPages > 0 && (
              <Row>
                <Col className="d-flex justify-content-end">
                  <Pagination className="mb-0">
                    <Pagination.Prev
                      disabled={page === 0 || loading}
                      onClick={() => setPage((p) => p - 1)}
                    />

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <Pagination.Item
                        key={i}
                        active={i === page}
                        onClick={() => setPage(i)}
                        disabled={loading}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}

                    <Pagination.Next
                      disabled={page >= totalPages - 1 || loading}
                      onClick={() => setPage((p) => p + 1)}
                    />
                  </Pagination>
                </Col>
              </Row>
            )}
          </div>
        </Col>
      </Row>

      <NuovaFattura
        show={showForm}
        onHide={() => setShowForm(false)}
        fattura={editing}
        onSaved={() => {
          setShowForm(false)
          fetchFatture()
        }}
      />

      <DettaglioFattura
        fattura={selected}
        show={showDetail}
        onHide={() => setShowDetail(false)}
        onEdit={(f) => {
          setEditing(f)
          setShowDetail(false)
          setShowForm(true)
        }}
      />
    </Container>
  )
}
