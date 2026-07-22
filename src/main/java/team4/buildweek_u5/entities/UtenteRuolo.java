package team4.buildweek_u5.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "UtentiRuoli")
public class UtenteRuolo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "utente_ruolo_id")
    private long id;
    @ManyToOne
    @JoinColumn(name = "username_utente")
    private Utente utente;
    @ManyToOne
    @JoinColumn(name = "nome_ruolo")
    private Ruolo ruolo;

    protected UtenteRuolo() {
    }

    public UtenteRuolo(Utente utente, Ruolo ruolo) {
        this.utente = utente;
        this.ruolo = ruolo;
    }

    public void setRuolo(Ruolo ruolo) {
        this.ruolo = ruolo;
    }

    public Ruolo getRuolo() {
        return ruolo;
    }

    @Override
    public String toString() {
        return "UtenteRuolo{" +
                "id=" + id +
                ", usernameUtente=" + utente +
                ", ruolo=" + ruolo +
                '}';
    }
}
