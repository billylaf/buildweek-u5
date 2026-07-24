package team4.buildweek_u5.recordsDTO;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record ModificaRuoliDTO(
        @NotEmpty(message = "Devi specificare almeno un ruolo")
        List<String> ruoli
) {
}
