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

  useEffect(() => {
    caricaDatiDashboard();
  }, []);

  const caricaDatiDashboard = async () => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    // Se non c'è il token, non facciamo neanche la chiamata e resettiamo il caricamento
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Chiamata per recuperare i primi 5 clienti ordinati per data inserimento
      const resClienti = await fetch(
        "http://localhost:8080/clienti?page=0&size=5&sortBy=dataInserimento&sortOrder=desc",
        { headers },
      );

      // Chiamata per recuperare le prime 5 fatture ordinate per data fattura
      const resFatture = await fetch(
        "http://localhost:8080/fatture?page=0&size=5&sortBy=dataFattura&sortOrder=desc",
        { headers },
      );

      if (resClienti.ok && resFatture.ok) {
        const dataClienti = await resClienti.json();
        const dataFatture = await resFatture.json();

        // Salviamo la lista dei 5 nuovi clienti e il totale clienti
        setNuoviClienti(dataClienti.content || []);
        setTotaleClienti(dataClienti.totalElements || 0);

        // Salviamo la lista delle 5 ultime fatture e il totale fatture
        setUltimeFatture(dataFatture.content || []);
        setTotaleFatture(dataFatture.totalElements || 0);

        // Calcoliamo la somma del fatturato dei clienti recuperati
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
      {/* Intestazione di benvenuto */}
      <h2 className="welcome-title">Benvenuto! 👋</h2>

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

      {/* Sezione Tabelle in Basso */}
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
                      <span className="building-icon">🏢</span>
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
            <Link to="/clienti" className="view-all-link">
              Vedi tutti i nuovi clienti →
            </Link>
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
                        className={`status-badge status-${fattura.statoFattura?.nome?.toLowerCase() || "default"}`}
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
          <div className="table-footer">
            <Link to="/fatture" className="view-all-link">
              Vedi tutte le fatture →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
