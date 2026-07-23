import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";

export default function Dashboard() {
  const [totaleClienti, setTotaleClienti] = useState(0);
  const [totaleFatture, setTotaleFatture] = useState(0);
  const [totaleFatturato, setTotaleFatturato] = useState(0);
  const [nuoviClienti, setNuoviClienti] = useState([]);
  const [ultimeFatture, setUltimeFatture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  // Quanti elementi mostrare nelle tabelle parte da 5
  const [sizeClienti, setSizeClienti] = useState(5);
  const [sizeFatture, setSizeFatture] = useState(5);

  useEffect(() => {
    // Estraiamo lo username dal Token JWT salvato nel browser
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUsername(payload.sub || "Utente");
      } catch (error) {
        console.error(
          "Errore durante la lettura dello username dal token",
          error,
        );
      }
    }

    caricaDatiDashboard(sizeClienti, sizeFatture);
  }, [sizeClienti, sizeFatture]);

  const caricaDatiDashboard = async (limitC, limitF) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      // Chiamata Clienti con il limite dinamico limitC
      const resClienti = await fetch(
        `http://localhost:8080/clienti?page=0&size=${limitC}&sortBy=dataInserimento&sortOrder=desc`,
        { headers },
      );

      // Chiamata Fatture con il limite dinamico limitF
      const resFatture = await fetch(
        `http://localhost:8080/fatture?page=0&size=${limitF}&sortBy=dataFattura&sortOrder=desc`,
        { headers },
      );

      if (resClienti.ok && resFatture.ok) {
        const dataClienti = await resClienti.json();
        const dataFatture = await resFatture.json();

        setNuoviClienti(dataClienti.content || []);
        setTotaleClienti(dataClienti.totalElements || 0);

        setUltimeFatture(dataFatture.content || []);
        setTotaleFatture(dataFatture.totalElements || 0);

        const sommaFatturato = (dataClienti.content || []).reduce(
          (acc, c) => acc + (c.fatturatoAnnuale || 0),
          0,
        );
        setTotaleFatturato(sommaFatturato);
      }
    } catch (error) {
      console.error("Errore durante il caricamento della dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-text">Caricamento Dashboard in corso...</div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* 1. Nome utente accanto al Benvenuto */}
      <h2 className="welcome-title">
        Benvenuto{username ? `, ${username}` : ""}! 👋
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
                      {/* Mostra Avatar/Logo se presente, altrimenti setto icona di default */}
                      {cliente.logoAziendale ||
                      cliente.logo ||
                      cliente.avatar ? (
                        <img
                          src={
                            cliente.logoAziendale ||
                            cliente.logo ||
                            cliente.avatar
                          }
                          alt={cliente.ragioneSociale}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            marginRight: "10px",
                          }}
                        />
                      ) : (
                        <span className="building-icon">🏢</span>
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

          {/* Pulsante per mostrare altri clienti */}
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
                ultimeFatture.map((fattura) => (
                  <tr key={fattura.id}>
                    <td>
                      <strong>N° {fattura.numeroFattura}</strong>
                    </td>
                    <td>{fattura.cliente?.ragioneSociale || "Cliente N/D"}</td>
                    <td className="fw-bold">
                      €{" "}
                      {fattura.importo?.toLocaleString("it-IT", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td>
                      <span
                        className={`status-badge status-${
                          fattura.statoFattura?.nome?.toLowerCase() || "default"
                        }`}
                      >
                        {fattura.statoFattura?.nome || "In lavorazione"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">Nessuna fattura trovata.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pulsante per mostrare altre fatture */}
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
  );
}
