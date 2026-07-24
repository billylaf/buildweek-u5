package team4.buildweek_u5.recordsDTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record EmailRequestDTO(
        @NotBlank(message = "L'email del destinatario è obbligatoria")
        @Email(message = "Email non valida")
        String emailDestinatario,

        @NotBlank(message = "L'oggetto della mail è obbligatorio")
        String oggetto,

        @NotBlank(message = "Il messaggio non può essere vuoto")
        String messaggio
) {
}
