package team4.buildweek_u5.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "fatture")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Fattura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;

    @Column(name = "data_fattura")
    private LocalDate dataFattura;

    @Column(name = "importo")
    private Double importo;

    @Column(name = "numero_fattura")
    private Long numeroFattura;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "stato_fattura_id", nullable = false)
    private StatoFattura statoFattura;
}