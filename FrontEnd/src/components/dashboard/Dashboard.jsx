import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "./dashboard.css"
import { getUserRoleInfo } from "../../auth/auth"

export default function Dashboard() {
  const [totaleClienti, setTotaleClienti] = useState(0)
  const [totaleFatture, setTotaleFatture] = useState(0)
  const [totaleFatturato, setTotaleFatturato] = useState(0)
  const [nuoviClienti, setNuoviClienti] = useState([])
  const [ultimeFatture, setUltimeFatture] = useState([])
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState("")
  const [role, setRole] = useState("")
  const [sizeClienti, setSizeClienti] = useState(5)
  const [sizeFatture, setSizeFatture] = useState(5)

  const statoColorMap = {
    PAGATA: "success",
    INSOLUTA: "danger",
    NON_PAGATA: "danger",
    ANNULLATA: "secondary",
    IN_ATTESA: "secondary",
    "IN RITARDO": "secondary",
  }

  const getStatusClass = (statusName) => {
    if (!statusName) return "status-default"

    const color = statoColorMap[statusName] || "secondary"

    // Mappa i colori di Bootstrap alle classi CSS del dashboard
    const colorToClass = {
      success: "status-success",
      danger: "status-danger",
      secondary: "status-secondary",
      warning: "status-warning",
    }

    return colorToClass[color] || "status-default"
  }

  // Funzione per estrarre le iniziali dalla Ragione Sociale o Nome
  const getIniziali = (nome) => {
    if (!nome) return "CL"
    const parole = nome.trim().split(" ").filter(Boolean)
    if (parole.length === 1) {
      return parole[0].substring(0, 2).toUpperCase()
    }
    return (parole[0][0] + parole[1][0]).toUpperCase()
  }

  useEffect(() => {
    const token = localStorage.getItem("token")

    // Usa la funzione helper per leggere le info dell'utente
    const { role } = getUserRoleInfo()
    // Salva il ruolo nello stato
    setRole(role)

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))

        const nomeUtente =
          payload.nome ||
          payload.nomeCompleto ||
          payload.name ||
          payload.given_name ||
          localStorage.getItem("nome") ||
          payload.sub

        setUsername(nomeUtente)
      } catch (error) {
        console.error("Errore durante la lettura del token", error)
      }
    }

    caricaDatiDashboard(sizeClienti, sizeFatture)
  }, [sizeClienti, sizeFatture])

  const caricaDatiDashboard = async (limitC, limitF) => {
    const token = localStorage.getItem("token")

    if (!token) {
      setLoading(false)
      return
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }

    try {
      const resClienti = await fetch(
        `http://localhost:8080/clienti?page=0&size=${limitC}&sortBy=dataInserimento&sortOrder=desc`,
        { headers },
      )

      const resFatture = await fetch(
        `http://localhost:8080/fatture?page=0&size=${limitF}&sortBy=dataFattura&sortOrder=desc`,
        { headers },
      )

      const resTutteLeFatture = await fetch(
        `http://localhost:8080/fatture?page=0&size=1000`,
        { headers },
      )

      if (resClienti.ok && resFatture.ok && resTutteLeFatture.ok) {
        const dataClienti = await resClienti.json()
        const dataFatture = await resFatture.json()
        const dataTutteLeFatture = await resTutteLeFatture.json()

        setNuoviClienti(dataClienti.content || [])
        setTotaleClienti(dataClienti.totalElements || 0)

        setUltimeFatture(dataFatture.content || [])
        setTotaleFatture(dataFatture.totalElements || 0)

        const sommaFatturato = (dataTutteLeFatture.content || []).reduce(
          (acc, f) => acc + (f.importo || 0),
          0,
        )
        setTotaleFatturato(sommaFatturato)
      }
    } catch (error) {
      console.error("Errore durante il caricamento della dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading-text">Caricamento Dashboard in corso...</div>
  }

  return (
    <div className="dashboard-container">
      {/* Nome utente di benvenuto */}
      <h2>
        Benvenuto{username ? `, ${username}` : ""}! 👋
        {role && (
          <span
            className="badge bg-secondary ms-2"
            style={{ fontSize: "0.8rem" }}
          >
            {role}
          </span>
        )}
      </h2>

      {/* 4 Schede KPI */}
      <div className="kpi-grid">
        <div className="kpi-card blue">
          <div className="kpi-icon">👥</div>
          <div className="kpi-info">
            <span className="kpi-label">Clienti Totali</span>
            <span className="kpi-value">{totaleClienti}</span>
          </div>
        </div>

        <div className="kpi-card green">
          <div className="kpi-icon">📄</div>
          <div className="kpi-info">
            <span className="kpi-label">Fatture Totali</span>
            <span className="kpi-value">{totaleFatture}</span>
          </div>
        </div>

        <div className="kpi-card yellow">
          <div className="kpi-icon">📈</div>
          <div className="kpi-info">
            <span className="kpi-label">Fatturato Annua.</span>
            <span className="kpi-value">
              €{" "}
              {totaleFatturato.toLocaleString("it-IT", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        <div className="kpi-card red">
          <div className="kpi-icon">👤</div>
          <div className="kpi-info">
            <span className="kpi-label">Nuovi Inseriti</span>
            <span className="kpi-value">{nuoviClienti.length}</span>
          </div>
        </div>
      </div>

      {/* Sezione Tabelle */}
      <div className="tables-grid">
        {/* Tabella Nuovi Clienti */}
        <div className="table-card">
          <div className="table-header">
            <h3>👥 Nuovi Clienti</h3>
          </div>
          <table className="custom-table">
            <tbody>
              {nuoviClienti.length > 0 ? (
                nuoviClienti.map((cliente) => (
                  <tr key={cliente.id}>
                    <td className="company-cell">
                      {cliente.logoAziendale ? (
                        <img
                          src={cliente.logoAziendale}
                          alt={cliente.ragioneSociale}
                          className="avatar-img"
                        />
                      ) : (
                        <div className="avatar-initials">
                          {getIniziali(cliente.ragioneSociale)}
                        </div>
                      )}
                      <strong>{cliente.ragioneSociale}</strong>
                    </td>
                    <td className="text-end text-muted">
                      {cliente.dataInserimento || "Data N/D"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">Nessun cliente trovato.</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="table-footer">
            {sizeClienti < totaleClienti ? (
              <button
                onClick={() => setSizeClienti((prev) => prev + 5)}
                style={{ background: "none", border: "none" }}
                className="view-all-link"
              >
                Vedi altri clienti ({nuoviClienti.length}/{totaleClienti}) ↓
              </button>
            ) : sizeClienti > 5 ? (
              <button
                onClick={() => setSizeClienti(5)}
                style={{ background: "none", border: "none" }}
                className="view-all-link"
              >
                Riduci lista ↑
              </button>
            ) : (
              <span style={{ fontSize: "0.85rem", color: "#888" }}>
                Tutti i clienti caricati
              </span>
            )}
          </div>
        </div>

        {/* Tabella Ultime Fatture */}
        <div className="table-card">
          <div className="table-header">
            <h3>📄 Ultime Fatture</h3>
          </div>
          <table className="custom-table">
            <tbody>
              {ultimeFatture.length > 0 ? (
                ultimeFatture.map((fattura) => {
                  const statusName = fattura.statoFattura?.nome || ""
                  const statusClass = getStatusClass(statusName)
                  const statusText = statusName || "In lavorazione"

                  return (
                    <tr key={fattura.id}>
                      <td>
                        <strong>FAT- {fattura.numeroFattura}</strong>
                      </td>
                      <td>
                        {fattura.cliente?.ragioneSociale || "Cliente N/D"}
                      </td>
                      <td className="fw-bold">
                        €{" "}
                        {fattura.importo?.toLocaleString("it-IT", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td>
                        <span className={`status-badge ${statusClass}`}>
                          {statusText}
                        </span>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="4">Nessuna fattura trovata.</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="table-footer">
            {sizeFatture < totaleFatture ? (
              <button
                onClick={() => setSizeFatture((prev) => prev + 5)}
                style={{ background: "none", border: "none" }}
                className="view-all-link"
              >
                Vedi altre fatture ({ultimeFatture.length}/{totaleFatture}) ↓
              </button>
            ) : sizeFatture > 5 ? (
              <button
                onClick={() => setSizeFatture(5)}
                style={{ background: "none", border: "none" }}
                className="view-all-link"
              >
                Riduci lista ↑
              </button>
            ) : (
              <span style={{ fontSize: "0.85rem", color: "#888" }}>
                Tutte le fatture caricate
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
