package team4.buildweek_u5.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import team4.buildweek_u5.enums.TipoIndirizzo;

@Entity
@Table(name = "indirizzi")
@NoArgsConstructor
@Getter
@Setter
@ToString
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Indirizzo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String via;

    @Column(nullable = false, length = 5)
    private String civico;

    @Column(length = 50)
    private String localita;

    @Column(nullable = false, length = 5)
    private String cap;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_indirizzo", nullable = false)
    private TipoIndirizzo tipoIndirizzo;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    @JsonIgnoreProperties({  "indirizzi",
            "fatture",
            "dataInserimento",
            "dataUltimoContatto",
            "fatturatoAnnuale",
            "pec",
            "telefono",
            "emailContatto",
            "telefonoContatto",})
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "comune_id", nullable = false)
    private Comune comune;

    public Indirizzo(String via, String civico, String localita, String cap,
                     TipoIndirizzo tipoIndirizzo, Cliente cliente, Comune comune) {
        this.via = via;
        this.civico = civico;
        this.localita = localita;
        this.cap = cap;
        this.tipoIndirizzo = tipoIndirizzo;
        this.cliente = cliente;
        this.comune = comune;
    }
}