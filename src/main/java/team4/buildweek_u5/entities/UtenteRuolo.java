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
    private Utente usernameUtente;
    @ManyToOne
    @JoinColumn(name = "id_ruolo")
    private Ruolo ruolo;

    protected UtenteRuolo() {
    }

    public UtenteRuolo(Utente usernameUtente, Ruolo ruolo) {
        this.usernameUtente = usernameUtente;
        this.ruolo = ruolo;
    }

    @Override
    public String toString() {
        return "UtenteRuolo{" +
                "id=" + id +
                ", usernameUtente=" + usernameUtente +
                ", ruolo=" + ruolo +
                '}';
    }
}
