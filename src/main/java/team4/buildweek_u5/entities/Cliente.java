package team4.buildweek_u5.entities;

import jakarta.persistence.*;
import lombok.*;
import team4.buildweek_u5.enums.TipoCliente;

import java.time.LocalDate;

@Entity
@Table(name = "clienti")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;

    @Column(name = "ragione_sociale", nullable = false)
    private String ragioneSociale;

    @Column(name = "partita_iva", nullable = false)
    private String partitaIva;

    @Column(name = "email")
    private String email;

    @Column(name = "data_inserimento")
    private LocalDate dataInserimento;

    @Column(name = "data_ultimo_contatto")
    private LocalDate dataUltimoContatto;

    @Column(name = "fatturato_annuale")
    private Double fatturatoAnnuale;

    @Column(name = "pec")
    private String pec;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "email_contatto")
    private String emailContatto;

    @Column(name = "nome_contatto")
    private String nomeContatto;

    @Column(name = "cognome_contatto")
    private String cognomeContatto;

    @Column(name = "telefono_contatto")
    private String telefonoContatto;

    @Column(name = "logo_aziendale")
    private String logoAziendale;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_cliente")
    private TipoCliente tipoCliente;

    @OneToOne
    @JoinColumn(name = "sede_legale_id")
    private Indirizzo sedeLegale;

    @OneToOne
    @JoinColumn(name = "sede_operativa_id")
    private Indirizzo sedeOperativa;
}