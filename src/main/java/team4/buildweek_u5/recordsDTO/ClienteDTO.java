package team4.buildweek_u5.recordsDTO;

import jakarta.validation.constraints.*;
import team4.buildweek_u5.enums.TipoCliente;

import java.time.LocalDate;

public record ClienteDTO(
        @NotBlank(message = "La ragione sociale è obbligatoria")
        String ragioneSociale,

        @NotBlank(message = "La partita IVA è obbligatoria")
        @Size(min = 11, max = 11, message = "La partita IVA deve essere di 11 cifre")
        String partitaIva,

        @NotBlank(message = "L'email è obbligatoria")
        @Email(message = "Inserisci un indirizzo email valido")
        String email,

        LocalDate dataInserimento,
        LocalDate dataUltimoContatto,

        @NotNull(message = "Il fatturato annuale è obbligatorio")
        @PositiveOrZero(message = "Il fatturato deve essere positivo o zero")
        Double fatturatoAnnuale,

        @NotBlank(message = "La PEC è obbligatoria")
        @Email(message = "Inserisci una PEC valida")
        String pec,

        String telefono,
        String emailContatto,

        @NotBlank(message = "Il nome del contatto è obbligatorio")
        String nomeContatto,

        @NotBlank(message = "Il cognome del contatto è obbligatorio")
        String cognomeContatto,

        String telefonoContatto,
        String logoAziendale,

        @NotNull(message = "Il tipo di cliente è obbligatorio")
        TipoCliente tipoCliente,

        Long sedeLegaleId,
        Long sedeOperativaId
) {
}