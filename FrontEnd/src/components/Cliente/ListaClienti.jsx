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
import { getClienti, deleteCliente } from "./api"
import NuovoCliente from "./NuovoCliente"
import DettaglioCliente from "./DettaglioCliente"
import "./Cliente.css"

const tipoColor = {
  PA: "primary",
  SRL: "success",
  SPA: "warning",
  SAS: "danger",
}

export default function ListaClienti() {
  const [clienti, setClienti] = useState([])
  const [nome, setNome] = useState("")
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [selected, setSelected] = useState(null)

  const fetchClienti = useCallback(() => {
    getClienti({ nome, page, size: 10 }).then((data) => {
      setClienti(data.content || [])
      setTotalPages(data.totalPages ?? 0)
    })
  }, [nome, page])

  useEffect(() => {
    fetchClienti()
  }, [fetchClienti])

  const handleDelete = async (c) => {
    if (!window.confirm(`Eliminare "${c.ragioneSociale}"?`)) return
    await deleteCliente(c.id)
    fetchClienti()
  }

  return (
    <Container fluid className="px-4 py-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h2 className="fw-bold mb-0">Gestione Clienti</h2>
        </Col>
        <Col xs="auto">
          <Button
            className="btn-epic-gold"
            onClick={() => {
              setEditing(null)
              setShowForm(true)
            }}
          >
            <i className="bi bi-plus-lg me-1"></i> Nuovo Cliente
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Cerca cliente..."
              value={nome}
              onChange={(e) => {
                setNome(e.target.value)
                setPage(0)
              }}
            />
          </InputGroup>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="epic-panel p-3">
            <Table hover responsive className="epic-table align-middle mb-3">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Partita IVA</th>
                  <th>Email</th>
                  <th>Fatturato</th>
                  <th>Tipo</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {clienti.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-4">
                      Nessun cliente trovato
                    </td>
                  </tr>
                )}

                {clienti.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <a
                        href="#"
                        className="epic-cliente-link"
                        onClick={(e) => {
                          e.preventDefault()
                          setSelected(c)
                          setShowDetail(true)
                        }}
                      >
                        {c.ragioneSociale}
                      </a>
                    </td>

                    <td>{c.partitaIva}</td>
                    <td>{c.email}</td>
                    <td>€ {c.fatturatoAnnuale?.toLocaleString("it-IT")}</td>

                    <td>
                      <Badge bg={tipoColor[c.tipoCliente] || "secondary"}>
                        {c.tipoCliente}
                      </Badge>
                    </td>

                    <td>
                      <button
                        className="action-icon-btn"
                        onClick={() => {
                          setEditing(c)
                          setShowForm(true)
                        }}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>

                      <button
                        className="action-icon-btn text-danger"
                        onClick={() => handleDelete(c)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>

                      <button
                        className="action-icon-btn"
                        onClick={() => {
                          setSelected(c)
                          setShowDetail(true)
                        }}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Row>
              <Col className="d-flex justify-content-end">
                <Pagination className="mb-0">
                  <Pagination.Prev
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                  />

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Pagination.Item
                      key={i}
                      active={i === page}
                      onClick={() => setPage(i)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}

                  <Pagination.Next
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => p + 1)}
                  />
                </Pagination>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <NuovoCliente
        show={showForm}
        onHide={() => setShowForm(false)}
        cliente={editing}
        onSaved={() => {
          setShowForm(false)
          fetchClienti()
        }}
      />

      <DettaglioCliente
        cliente={selected}
        show={showDetail}
        onHide={() => setShowDetail(false)}
        onEdit={(c) => {
          setEditing(c)
          setShowDetail(false)
          setShowForm(true)
        }}
      />
    </Container>
  )
}
