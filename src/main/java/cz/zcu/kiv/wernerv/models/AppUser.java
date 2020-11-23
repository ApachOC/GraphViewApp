package cz.zcu.kiv.wernerv.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "users")
public class AppUser {
    @Id
    public String id;

    public String username;

    public String password;

    public String email;

    public String displayName;

    public List<String> roles;

    public List<String> projects;

    public AppUser(String username, String password) {
        this.username = username;
        this.password = password;
    }
}
