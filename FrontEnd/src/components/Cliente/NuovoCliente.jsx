import { useEffect, useState, useCallback } from "react"
import {
  Modal,
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
} from "react-bootstrap"
import {
  createCliente,
  updateCliente,
  getComuni,
  getIndirizziByCliente,
  createIndirizzo,
  updateIndirizzo,
  deleteIndirizzo,
} from "./api"

const TIPO_INDIRIZZO_OPTIONS = ["SEDE_LEGALE", "SEDE_OPERATIVA"]

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

const EMPTY_INDIRIZZO = {
  id: null,
  via: "",
  civico: "",
  localita: "",
  cap: "",
  tipoIndirizzo: "SEDE_LEGALE",
  comuneId: "",
  comuneNome: "",
}

export default function NuovoCliente({ show, onHide, cliente, onSaved }) {
  const [form, setForm] = useState(EMPTY)
  const [indirizzi, setIndirizzi] = useState([])
  const [rimossi, setRimossi] = useState([]) // id degli indirizzi esistenti da eliminare al submit
  const [comuni, setComuni] = useState([])
  const [comuniLoaded, setComuniLoaded] = useState(false)
  const [errors, setErrors] = useState({})
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  // Carica dati cliente + eventuali indirizzi esistenti quando si apre in modifica
  useEffect(() => {
    if (!show) return

    setForm(cliente ? { ...EMPTY, ...cliente } : EMPTY)
    setRimossi([])
    setErrors({})
    setError("")

    if (cliente?.id) {
      getIndirizziByCliente(cliente.id)
        .then((data) => {
          const lista = (data || []).map((ind) => ({
            id: ind.id,
            via: ind.via || "",
            civico: ind.civico || "",
            localita: ind.localita || "",
            cap: ind.cap || "",
            tipoIndirizzo: ind.tipoIndirizzo,
            comuneId: ind.comune?.id ?? "",
            comuneNome: ind.comune?.nome ?? "",
          }))
          setIndirizzi(lista)
        })
        .catch(() => setIndirizzi([]))
    } else {
      setIndirizzi([])
    }
  }, [cliente, show])

  // Carica la lista comuni una sola volta (l'endpoint non supporta filtri lato server)
  useEffect(() => {
    if (!show || comuniLoaded) return
    getComuni()
      .then((data) => {
        setComuni(data || [])
        setComuniLoaded(true)
      })
      .catch(() => setComuni([]))
  }, [show, comuniLoaded])

  const updateField = useCallback(
    (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value })),
    [],
  )

  const updateIndirizzoField = (index, field) => (e) => {
    const value = e.target.value
    setIndirizzi((prev) =>
      prev.map((ind, i) => (i === index ? { ...ind, [field]: value } : ind)),
    )
  }

  // Quando l'utente digita/sceglie un comune dal datalist, associamo l'id corrispondente
  const updateComune = (index) => (e) => {
    const nomeInserito = e.target.value
    const trovato = comuni.find(
      (c) => c.nome.toLowerCase() === nomeInserito.toLowerCase(),
    )
    setIndirizzi((prev) =>
      prev.map((ind, i) =>
        i === index
          ? {
              ...ind,
              comuneNome: nomeInserito,
              comuneId: trovato ? trovato.id : "",
            }
          : ind,
      ),
    )
  }

  const addIndirizzo = () => {
    setIndirizzi((prev) => [...prev, { ...EMPTY_INDIRIZZO }])
  }

  const removeIndirizzo = (index) => {
    const ind = indirizzi[index]
    if (ind.id) {
      setRimossi((prev) => [...prev, ind.id])
    }
    setIndirizzi((prev) => prev.filter((_, i) => i !== index))
  }

  const validateIndirizzi = () => {
    const errs = {}
    const tipiVisti = new Set()

    indirizzi.forEach((ind, i) => {
      if (!ind.via?.trim()) errs[`via-${i}`] = "Via obbligatoria"
      if (!ind.civico?.trim()) errs[`civico-${i}`] = "Civico obbligatorio"
      if (!/^\d{5}$/.test(ind.cap || "")) errs[`cap-${i}`] = "CAP di 5 cifre"
      if (!ind.comuneId)
        errs[`comune-${i}`] = "Seleziona un comune valido dall'elenco"

      if (tipiVisti.has(ind.tipoIndirizzo)) {
        errs[`tipo-${i}`] = "Tipo indirizzo duplicato"
      }
      tipiVisti.add(ind.tipoIndirizzo)
    })

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!validateIndirizzi()) return

    setSaving(true)
    try {
      const payload = {
        ...form,
        fatturatoAnnuale: Number(form.fatturatoAnnuale),
      }

      let clienteId = cliente?.id
      if (cliente) {
        await updateCliente(cliente.id, payload)
      } else {
        const nuovoCliente = await createCliente(payload)
        clienteId = nuovoCliente.id
      }

      // elimina gli indirizzi rimossi dall'utente
      for (const id of rimossi) {
        await deleteIndirizzo(id)
      }

      // crea/aggiorna gli indirizzi correnti
      for (const ind of indirizzi) {
        const dto = {
          via: ind.via,
          civico: ind.civico,
          localita: ind.localita,
          cap: ind.cap,
          tipoIndirizzo: ind.tipoIndirizzo,
          clienteId,
          comuneId: Number(ind.comuneId),
        }

        if (ind.id) {
          await updateIndirizzo(ind.id, dto)
        } else {
          await createIndirizzo(dto)
        }
      }

      onSaved()
    } catch (err) {
      setError(err.message || "Errore durante il salvataggio")
    } finally {
      setSaving(false)
    }
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
            {error && <Alert variant="danger">{error}</Alert>}

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

            {/* SEZIONE INDIRIZZI */}
            <Row className="mt-4">
              <Col className="d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0">Indirizzi</h6>
                <Button
                  variant="outline-primary"
                  size="sm"
                  type="button"
                  onClick={addIndirizzo}
                >
                  <i className="bi bi-plus-lg me-1"></i> Aggiungi indirizzo
                </Button>
              </Col>
            </Row>

            {indirizzi.length === 0 && (
              <div className="text-muted small mt-2">
                Nessun indirizzo inserito.
              </div>
            )}

            {indirizzi.map((ind, i) => (
              <Row
                key={ind.id ?? `new-${i}`}
                className="g-3 mt-1 pb-3 mb-2 border-bottom align-items-end"
              >
                <Col md={3}>
                  <Form.Label className="small">Via *</Form.Label>
                  <Form.Control
                    isInvalid={!!errors[`via-${i}`]}
                    maxLength={50}
                    value={ind.via}
                    onChange={updateIndirizzoField(i, "via")}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors[`via-${i}`]}
                  </Form.Control.Feedback>
                </Col>

                <Col md={2}>
                  <Form.Label className="small">Civico *</Form.Label>
                  <Form.Control
                    isInvalid={!!errors[`civico-${i}`]}
                    maxLength={5}
                    value={ind.civico}
                    onChange={updateIndirizzoField(i, "civico")}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors[`civico-${i}`]}
                  </Form.Control.Feedback>
                </Col>

                <Col md={2}>
                  <Form.Label className="small">CAP *</Form.Label>
                  <Form.Control
                    isInvalid={!!errors[`cap-${i}`]}
                    maxLength={5}
                    value={ind.cap}
                    onChange={updateIndirizzoField(i, "cap")}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors[`cap-${i}`]}
                  </Form.Control.Feedback>
                </Col>

                <Col md={3}>
                  <Form.Label className="small">Località</Form.Label>
                  <Form.Control
                    maxLength={50}
                    value={ind.localita}
                    onChange={updateIndirizzoField(i, "localita")}
                  />
                </Col>

                <Col md={2}>
                  <Form.Label className="small">Tipo *</Form.Label>
                  <Form.Select
                    isInvalid={!!errors[`tipo-${i}`]}
                    value={ind.tipoIndirizzo}
                    onChange={updateIndirizzoField(i, "tipoIndirizzo")}
                  >
                    {TIPO_INDIRIZZO_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t.replace("_", " ")}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors[`tipo-${i}`]}
                  </Form.Control.Feedback>
                </Col>

                <Col md={4}>
                  <Form.Label className="small">Comune *</Form.Label>
                  <Form.Control
                    list={`comuni-list-${i}`}
                    isInvalid={!!errors[`comune-${i}`]}
                    placeholder="Digita per cercare..."
                    value={ind.comuneNome}
                    onChange={updateComune(i)}
                    autoComplete="off"
                  />
                  <datalist id={`comuni-list-${i}`}>
                    {comuni.map((c) => (
                      <option key={c.id} value={c.nome} />
                    ))}
                  </datalist>
                  <Form.Control.Feedback type="invalid">
                    {errors[`comune-${i}`]}
                  </Form.Control.Feedback>
                </Col>

                <Col md={2} className="text-end">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    type="button"
                    onClick={() => removeIndirizzo(i)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </Col>
              </Row>
            ))}
          </Container>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={onHide}
            disabled={saving}
          >
            Annulla
          </Button>
          <Button type="submit" className="btn-epic-gold" disabled={saving}>
            {saving ? "Salvataggio..." : cliente ? "Salva" : "Crea"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
