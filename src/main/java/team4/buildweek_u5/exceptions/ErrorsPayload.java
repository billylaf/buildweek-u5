package team4.buildweek_u5.exceptions;

import java.time.LocalDateTime;
import java.util.List;

public record ErrorsPayload(
        String message,
        List<String> errorsList, // xcontiene la lista degli errori quando mancano più campi
        LocalDateTime timestamp
) {
    // costruttore secondario per gli errori singoli senza lista
    public ErrorsPayload(String message, LocalDateTime timestamp) {
        this(message, null, timestamp);
    }
}