package team4.buildweek_u5.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "Ruoli")
public class Ruolo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "nome_ruolo")
    private String nomeRuolo;

    protected Ruolo() {
    }

    public Ruolo(String nomeRuolo) {
        this.nomeRuolo = nomeRuolo;
    }

    @Override
    public String toString() {
        return "Ruolo{" +
                "id=" + id +
                ", nomeRuolo='" + nomeRuolo + '\'' +
                '}';
    }
}
