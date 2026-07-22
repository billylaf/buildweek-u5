package team4.buildweek_u5.exceptions;

import java.util.List;

public class ValidationException extends RuntimeException {

    private List<String> errorsList;

    public ValidationException(List<String> errorsList) {
        super("Errori di validazione");
        this.errorsList = errorsList;
    }

    public List<String> getErrorsList() {
        return errorsList;
    }
}
