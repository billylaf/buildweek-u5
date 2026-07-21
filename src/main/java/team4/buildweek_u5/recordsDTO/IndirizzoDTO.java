package team4.buildweek_u5.recordsDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import team4.buildweek_u5.enums.TipoIndirizzo;

@Getter
@Setter
@NoArgsConstructor
public class IndirizzoDTO {

    private Long id;

    @NotBlank(message = "La via è obbligatoria")
    @Size(max = 50, message = "La via non può superare 50 caratteri")
    private String via;

    @NotBlank(message = "Il civico è obbligatorio")
    @Size(max = 5, message = "Il civico non può superare 5 caratteri")
    private String civico;

    @Size(max = 50, message = "La località non può superare 50 caratteri")
    private String localita;

    @NotBlank(message = "Il CAP è obbligatorio")
    @Pattern(regexp = "^[0-9]{5}$", message = "Il CAP deve essere di 5 cifre")
    private String cap;

    @NotNull(message = "Il tipo di indirizzo è obbligatorio")
    private TipoIndirizzo tipoIndirizzo;

    @NotNull(message = "L'ID del cliente è obbligatorio")
    private Long clienteId;

    @NotNull(message = "L'ID del comune è obbligatorio")
    private Long comuneId;
}
