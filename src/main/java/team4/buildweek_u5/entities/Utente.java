package team4.buildweek_u5.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "Utenti")
public class Utente {

    @Id
    @Column(unique = true)
    private String username;
    private String nome;
    private String cognome;
    private String email;
    private String password;
    @Column(name = "avatar_pic")
    private String avatar;

    protected Utente() {
    }

    public Utente(String username, String nome, String cognome, String email, String password) {
        this.username = username;
        this.nome = nome;
        this.cognome = cognome;
        this.email = email;
        this.password = password;
        this.avatar = "https://ui-avatars.com/api/?name=John+Doe";
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getAvatar() {
        return avatar;
    }

    @Override
    public String toString() {
        return "Utente{" +
                "username='" + username + '\'' +
                ", nome='" + nome + '\'' +
                ", cognome='" + cognome + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", avatar='" + avatar + '\'' +
                '}';
    }
}
