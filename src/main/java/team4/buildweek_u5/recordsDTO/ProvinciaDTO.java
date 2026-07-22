package team4.buildweek_u5.recordsDTO;

import jakarta.validation.constraints.NotBlank;

public record ProvinciaDTO(

        @NotBlank(message = "La sigla è obbligatoria")
        String sigla,

        @NotBlank(message = "Il nome è obbligatorio")
        String nome,

        @NotBlank(message = "La regione è obbligatoria")
        String regione
) {}
