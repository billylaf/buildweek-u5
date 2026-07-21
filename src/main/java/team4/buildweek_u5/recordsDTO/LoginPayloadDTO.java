package team4.buildweek_u5.recordsDTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginPayloadDTO(
        @NotBlank(message = "L'email è obbligatoria")
        @Email(message = "Inserisci un'email valida")
        String email,

        @NotBlank(message = "La password è obbligatoria")
        String password
) {
}