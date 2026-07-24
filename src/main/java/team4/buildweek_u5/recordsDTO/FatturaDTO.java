package team4.buildweek_u5.recordsDTO;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public record FatturaDTO(
        @NotNull(message = "La data della fattura è obbligatoria")
        LocalDate dataFattura,

        @NotNull(message = "L'importo è obbligatorio")
        @Positive(message = "L'importo deve essere maggiore di zero")
        Double importo,

        @NotNull(message = "Il numero fattura è obbligatorio")
        @Positive(message = "Il numero fattura deve essere positivo")
        Long numeroFattura,

        @NotNull(message = "L'ID del cliente è obbligatorio")
        Long clienteId,

        @NotNull(message = "L'ID dello stato fattura è obbligatorio")
        Long statoFatturaId
) {
}