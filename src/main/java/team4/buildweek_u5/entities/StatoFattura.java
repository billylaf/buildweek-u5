package team4.buildweek_u5.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "stati_fattura")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class StatoFattura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    public StatoFattura(String nome) {
        this.nome = nome;
    }
}
