import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./Fatture.css"

export default function Fatture() {
  const navigate = useNavigate()
  const [fatture, setFatture] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [error, setError] = useState(null)

  // Filtri
  const [filters, setFilters] = useState({
    cliente: "",
    stato: "",
    data: "",
    anno: "",
    importoMin: "",
    importoMax: "",
  })

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Funzione per ottenere il token
  const getToken = () => localStorage.getItem("token")

  // Funzione per caricare le fatture dal backend
  const fetchFatture = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = getToken()
      if (!token) {
        navigate("/")
        return
      }

      // Costruisci i parametri di query per i filtri
      const params = new URLSearchParams()
      if (filters.cliente) params.append("cliente", filters.cliente)
      if (filters.stato) params.append("stato", filters.stato)
      if (filters.data) params.append("data", filters.data)
      if (filters.anno) params.append("anno", filters.anno)
      if (filters.importoMin) params.append("importoMin", filters.importoMin)
      if (filters.importoMax) params.append("importoMax", filters.importoMax)
      params.append("page", currentPage)
      params.append("size", itemsPerPage)

      const url = `http://localhost:8080/fatture${params.toString() ? `?${params.toString()}` : ""}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token")
        localStorage.removeItem("username")
        navigate("/")
        return
      }

      if (!response.ok) {
        throw new Error(`Errore ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      // Gestisci sia risposta con contenuto che array diretto
      const fattureData = data.content || data || []
      const total = data.totalElements || data.length || fattureData.length

      setFatture(fattureData)
      setTotalResults(total)
    } catch (err) {
      console.error("Errore nel caricamento delle fatture:", err)
      setError(err.message || "Errore nel caricamento delle fatture")
      setFatture([])
      setTotalResults(0)
    } finally {
      setLoading(false)
    }
  }

  // Carica le fatture all'avvio e quando cambiano filtri/pagina/itemsPerPage
  useEffect(() => {
    fetchFatture()
  }, [currentPage, itemsPerPage])

  // Funzione per applicare i filtri
  const applicaFiltri = () => {
    setCurrentPage(1)
    fetchFatture()
  }

  // Funzione per resettare i filtri
  const pulisciFiltri = () => {
    setFilters({
      cliente: "",
      stato: "",
      data: "",
      anno: "",
      importoMin: "",
      importoMax: "",
    })
    setShowAdvancedFilters(false)
    setCurrentPage(1)
    setTimeout(() => fetchFatture(), 100)
  }

  // Gestione cambio filtro
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Elimina fattura
  const eliminaFattura = async (fattura) => {
    if (
      !window.confirm(`Eliminare la fattura ${fattura.numero || fattura.id}?`)
    )
      return

    try {
      const token = getToken()
      const response = await fetch(
        `http://localhost:8080/fatture/${fattura.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok)
        throw new Error("Errore nell'eliminazione della fattura")

      alert(`Fattura eliminata con successo!`)
      fetchFatture()
    } catch (error) {
      console.error("Errore eliminazione fattura:", error)
      alert("Errore nell'eliminazione della fattura")
    }
  }

  // Calcola paginazione
  const totalPages = Math.ceil(totalResults / itemsPerPage)

  // Render badge stato
  const renderStatoBadge = (stato) => {
    const statoUpper = stato?.toUpperCase() || ""
    const classMap = {
      IN_ATTESA: "badge-in-attesa",
      PAGATA: "badge-pagata",
      SCADUTA: "badge-scaduta",
    }
    return (
      <span className={`badge-stato ${classMap[statoUpper] || ""}`}>
        {stato}
      </span>
    )
  }

  // Formatta importo
  const formatImporto = (importo) => {
    return `€ ${Number(importo).toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // Formatta data
  const formatData = (data) => {
    if (!data) return "-"
    if (data.includes("/")) return data
    if (data.includes("-")) {
      const parts = data.split("-")
      return `${parts[2]}/${parts[1]}/${parts[0]}`
    }
    return data
  }

  // Render paginazione
  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisible = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return (
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {startPage > 1 && <span>...</span>}
        {pages.map((page) => (
          <button
            key={page}
            className={currentPage === page ? "active" : ""}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
        {endPage < totalPages && <span>...</span>}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    )
  }

  // Verifica autenticazione all'avvio
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/")
    }
  }, [])

  return (
    <div className="fatture-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <h1>EPIC ENERGY SERVICES</h1>
        </div>
        <nav className="nav">
          <a href="#" className="active">
            Dashboard
          </a>
          <a href="#">Fatture</a>
          <a href="#">Clienti</a>
          <a href="#">Amministrazione Utenti</a>
        </nav>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token")
            localStorage.removeItem("username")
            navigate("/")
          }}
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="page-header">
          <h2>Gestione Fatture</h2>
          <button
            className="btn-primary"
            onClick={() => navigate("/fatture/nuova")}
          >
            + Nuova Fattura
          </button>
        </div>

        {/* Filtri */}
        <div className="filtri-section">
          <button
            className="btn-toggle-filtri"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            {showAdvancedFilters ? "▼ Nascondi" : "▶ Filtri Avanzati"}
          </button>

          {showAdvancedFilters && (
            <div className="filtri-avanzati">
              <div className="filter-row">
                <div className="filter-group">
                  <label>Cliente</label>
                  <input
                    type="text"
                    name="cliente"
                    placeholder="Cerca cliente..."
                    value={filters.cliente}
                    onChange={handleFilterChange}
                  />
                </div>

                <div className="filter-group">
                  <label>Stato</label>
                  <select
                    name="stato"
                    value={filters.stato}
                    onChange={handleFilterChange}
                  >
                    <option value="">Tutti</option>
                    <option value="IN_ATTESA">IN_ATTESA</option>
                    <option value="PAGATA">PAGATA</option>
                    <option value="SCADUTA">SCADUTA</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Data</label>
                  <input
                    type="date"
                    name="data"
                    value={filters.data}
                    onChange={handleFilterChange}
                  />
                </div>

                <div className="filter-group">
                  <label>Anno</label>
                  <input
                    type="number"
                    name="anno"
                    placeholder="Inserisci anno"
                    value={filters.anno}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>

              <div className="filter-row">
                <div className="filter-group">
                  <label>Range Importo</label>
                  <div className="importo-range">
                    <input
                      type="number"
                      name="importoMin"
                      placeholder="Min €"
                      value={filters.importoMin}
                      onChange={handleFilterChange}
                    />
                    <span>-</span>
                    <input
                      type="number"
                      name="importoMax"
                      placeholder="Max €"
                      value={filters.importoMax}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>

                <div className="filter-actions">
                  <button className="btn-secondary" onClick={pulisciFiltri}>
                    Pulisci filtri
                  </button>
                  <button className="btn-primary" onClick={applicaFiltri}>
                    Cerca
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabella */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Numero</th>
                <th>Data</th>
                <th>Cliente</th>
                <th>Importo</th>
                <th>Stato</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="loading-text">
                    Caricamento...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="error-text">
                    ⚠️ {error}
                    <br />
                    <button className="btn-retry" onClick={fetchFatture}>
                      Riprova
                    </button>
                  </td>
                </tr>
              ) : fatture.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-results">
                    Nessuna fattura trovata
                  </td>
                </tr>
              ) : (
                fatture.map((fattura) => (
                  <tr key={fattura.id}>
                    <td>
                      <strong>{fattura.numero || fattura.id}</strong>
                    </td>
                    <td>{formatData(fattura.data || fattura.dataFattura)}</td>
                    <td>{fattura.cliente || fattura.clienteNome || "-"}</td>
                    <td>
                      {formatImporto(fattura.importo || fattura.totale || 0)}
                    </td>
                    <td>{renderStatoBadge(fattura.stato || fattura.status)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn"
                          onClick={() => navigate(`/fatture/${fattura.id}`)}
                          title="Visualizza"
                        >
                          👁️
                        </button>
                        <button
                          className="action-btn"
                          onClick={() =>
                            navigate(`/fatture/${fattura.id}/modifica`)
                          }
                          title="Modifica"
                        >
                          ✏️
                        </button>
                        <button
                          className="action-btn"
                          onClick={() => eliminaFattura(fattura)}
                          title="Elimina"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer tabella */}
        <div className="table-footer">
          <div className="showing-info">
            Mostra <strong>{fatture.length}</strong> di{" "}
            <strong>{totalResults}</strong> risultati
          </div>
          <div className="items-per-page">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Paginazione */}
        {renderPagination()}
      </main>
    </div>
  )
}
