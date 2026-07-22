package team4.buildweek_u5.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "Ruoli")
public class Ruolo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "nome_ruolo")
    private String ruolo;

    protected Ruolo() {
    }

    public Ruolo(String ruolo) {
        this.ruolo = ruolo;
    }

    public String getRuolo() {
        return ruolo;
    }

    public void setRuolo(String ruolo) {
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
