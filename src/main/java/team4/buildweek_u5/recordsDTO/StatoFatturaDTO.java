package team4.buildweek_u5.recordsDTO;

import jakarta.validation.constraints.NotBlank;

public record StatoFatturaDTO(
        @NotBlank(message = "Il nome dello stato fattura è obbligatorio")
        String nome
) {
}