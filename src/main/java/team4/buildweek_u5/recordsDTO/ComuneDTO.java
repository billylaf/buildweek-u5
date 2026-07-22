package team4.buildweek_u5.recordsDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ComuneDTO(

        @NotBlank(message = "Il nome del comune è obbligatorio")
        String nome,

        @NotNull(message = "La provincia è obbligatoria")
        Long provinciaId
) {}

