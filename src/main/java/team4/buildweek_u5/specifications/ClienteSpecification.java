package team4.buildweek_u5.specifications;

import org.springframework.data.jpa.domain.Specification;
import team4.buildweek_u5.entities.Cliente;

import java.time.LocalDate;

// Questa classe serve a creare i "mattoncini" di filtro per i Clienti.
// Ogni metodo crea una singola regola di ricerca condizione SQL.
public class ClienteSpecification {

    // Filtro per Fatturato Minimo
    // Se l'utente inserisce un valore, cerca tutti i clienti con fatturato >= a quel valore.
    public static Specification<Cliente> hasMinFatturato(Double minFatturato) {
        return (root, query, cb) ->
                minFatturato == null
                        ? null // Se il parametro è vuoto, non applicare questo filtro
                        : cb.greaterThanOrEqualTo(root.get("fatturatoAnnuale"), minFatturato); // SQL: WHERE fatturato_annuale >= minFatturato
    }

    // Filtro per Data di Inserimento esatta
    public static Specification<Cliente> hasDataInserimento(LocalDate data) {
        return (root, query, cb) ->
                data == null
                        ? null
                        : cb.equal(root.get("dataInserimento"), data); // SQL: WHERE data_inserimento = data
    }

    // Filtro per Data di Ultimo Contatto esatta
    public static Specification<Cliente> hasDataUltimoContatto(LocalDate data) {
        return (root, query, cb) ->
                data == null
                        ? null
                        : cb.equal(root.get("dataUltimoContatto"), data); // SQL: WHERE data_ultimo_contatto = data
    }

    // Filtro per cercare una parte del Nome (Ragione Sociale)
    // Non fa differenza tra maiuscole e minuscole (case-insensitive).
    public static Specification<Cliente> nomeContains(String nome) {
        return (root, query, cb) ->
                (nome == null || nome.isBlank())
                        ? null
                        // cb.lower trasforma il testo in minuscolo.
                        // %nome% significa: trova qualsiasi ragione sociale che contenga questo testo dentro.
                        : cb.like(cb.lower(root.get("ragioneSociale")), "%" + nome.toLowerCase() + "%"); // SQL: WHERE LOWER(ragione_sociale) LIKE %nome%
    }
}