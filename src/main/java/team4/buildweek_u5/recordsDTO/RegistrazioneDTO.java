package team4.buildweek_u5.recordsDTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegistrazioneDTO(
        @NotBlank(message = "L'username è obbligatorio")
        @Size(min = 3, max = 20, message = "L'username deve essere tra 3 e 20 caratteri")
        @Pattern(
                regexp = "^[a-zA-Z0-9][a-zA-Z0-9._]{1,18}[a-zA-Z0-9]$",
                message = "L'username può contenere solo lettere, numeri, punti e underscore"
        )
        String username,

        @NotBlank(message = "Il campo non può essere vuoto")
        @Size(min = 2, max = 30, message = "Il nome deve avere tra 2 e 30 caratteri")
        @Pattern(regexp = "^[a-zA-Z\\s'-]+$", message = "Il nome non può contenere numeri")
        String nome,

        @NotBlank(message = "Il campo non può essere vuoto")
        @Size(min = 2, max = 30, message = "Il cognome deve avere tra 2 e 30 caratteri")
        @Pattern(regexp = "^[a-zA-Z\\sàèìòùòóÁÉÍÓÚçÇñÑ'-]+$", message = "Il cognome non può contenere numeri")
        String cognome,

        @NotBlank(message = "Il campo non può essere vuoto")
        @Size(min = 2, max = 50, message = "La mail deve avere tra 2 e 50 caratteri")
        @Email(message = "Formato per la email non valido")
        String email,

        @NotBlank
        @Size(min = 8, message = "La password deve essere almeno di 8 caratteri")
        @Pattern(
                regexp = "^(?=.*[0-9])(?=.*[^a-zA-Z0-9\\s])[a-zA-Z0-9[^a-zA-Z0-9\\s]]+$",
                message = "Deve contenere almeno un numero e un carattere speciale"
        )
        String password,
        String ruolo
) {
}