//package team4.buildweek_u5.tools;
//
//import kong.unirest.core.HttpResponse;
//import kong.unirest.core.JsonNode;
//import kong.unirest.core.Unirest;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Component;
//import team4.buildweek_u5.entities.Utente;
//
//@Component
//public class EmailSender {
//
//    private final String domainName;
//    private final String apiKey;
//
//    public EmailSender(@Value("${mailgun.domainName}") String domainName, @Value("${mailgun.apiKey}") String apiKey) {
//        this.domainName = domainName;
//        this.apiKey = apiKey;
//    }
//
//    public void sendEmail(String to, String subject, String text) {
//        HttpResponse<JsonNode> response = Unirest.post("https://api.mailgun.net/v3/" + this.domainName + "/messages")
//                .basicAuth("api", this.apiKey)
//                .queryString("from", "No-Reply <mailgun@" + this.domainName + ">")
//                .queryString("to", to)
//                .queryString("subject", subject)
//                .queryString("text", text)
//                .asJson();
//
//    }
//
//}
