package team4.buildweek_u5.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="provincia")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Provincia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String sigla;
    @Column(nullable = false)
    private String nome;
    @Column(nullable = false)
    private String regione;
}
