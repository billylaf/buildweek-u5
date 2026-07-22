package team4.buildweek_u5.specifications;

import org.springframework.data.jpa.domain.Specification;
import team4.buildweek_u5.entities.Fattura;

import java.time.LocalDate;

// Questa classe crea i "mattoncini" di filtro per le Fatture.
public class FatturaSpecification {

    // Filtro per ID Cliente
    // Va a cercare dentro la relazione dell'entità: root.get("cliente").get("id")
    public static Specification<Fattura> hasClienteId(Long clienteId) {
        return (root, query, cb) ->
                clienteId == null
                        ? null
                        : cb.equal(root.get("cliente").get("id"), clienteId); // SQL JOIN implicita: WHERE cliente_id = clienteId
    }

    // Filtro per ID Stato Fattura
    public static Specification<Fattura> hasStatoId(Long statoId) {
        return (root, query, cb) ->
                statoId == null
                        ? null
                        : cb.equal(root.get("statoFattura").get("id"), statoId); // SQL JOIN implicita: WHERE stato_fattura_id = statoId
    }

    // Filtro per Data Fattura esatta
    public static Specification<Fattura> hasDataFattura(LocalDate data) {
        return (root, query, cb) ->
                data == null
                        ? null
                        : cb.equal(root.get("dataFattura"), data); // SQL: WHERE data_fattura = data
    }

    // Filtro per Anno della Fattura
    // Estrae solo l'anno dalla data completa (da 2026-05-10 estrae 2026)
    // Filtro per Anno della Fattura (funziona con PostgreSQL)
    public static Specification<Fattura> hasAnno(Integer anno) {
        return (root, query, cb) -> {
            // Se non inserisci un anno nella ricerca, ignora questo filtro
            if (anno == null) {
                return null;
            }

            // Creiamo il primo e l'ultimo giorno dell'anno scelto (es. 01/01/2026 e 31/12/2026)
            LocalDate inizioAnno = LocalDate.of(anno, 1, 1);
            LocalDate fineAnno = LocalDate.of(anno, 12, 31);

            // Chiediamo al database di prendere tutte le fatture con data compresa in quel range
            return cb.between(root.get("dataFattura"), inizioAnno, fineAnno);
        };
    }

    // Filtro per Intervallo di Importo (minimo e massimo)
    // Gestisce 3 casi: range completo, solo minimo, solo massimo.
    public static Specification<Fattura> importoBetween(Double min, Double max) {
        return (root, query, cb) -> {
            if (min != null && max != null) {
                return cb.between(root.get("importo"), min, max); // SQL: WHERE importo BETWEEN min AND max
            } else if (min != null) {
                return cb.greaterThanOrEqualTo(root.get("importo"), min); // SQL: WHERE importo >= min
            } else if (max != null) {
                return cb.lessThanOrEqualTo(root.get("importo"), max); // SQL: WHERE importo <= max
            }
            return null; // Se non viene passato né min né max, ignora il filtro
        };
    }
}