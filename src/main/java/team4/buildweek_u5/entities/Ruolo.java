package team4.buildweek_u5.entities;

import jakarta.persistence.*;
import team4.buildweek_u5.enums.RuoloUtenti;

@Entity
@Table(name = "Ruoli")
public class Ruolo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "nome_ruolo")
    @Enumerated(EnumType.STRING)
    private RuoloUtenti ruolo;

    protected Ruolo() {
    }

    public Ruolo(RuoloUtenti ruolo) {
        this.ruolo = ruolo;
    }

    public RuoloUtenti getRuolo() {
        return ruolo;
    }

    public void setRuolo(RuoloUtenti ruolo) {
        this.ruolo = ruolo;
    }

    @Override
    public String toString() {
        return "Ruolo{" +
                "id=" + id +
                ", ruolo=" + ruolo +
                '}';
    }
}
