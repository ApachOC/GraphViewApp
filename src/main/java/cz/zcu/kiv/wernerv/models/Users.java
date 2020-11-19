package cz.zcu.kiv.wernerv.models;

public class Users {
    private String id;
    private String username;
    private String password;

    public Users(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getId() {
        return id;
    }

    public String getPassword() {
        return password;
    }

    public String getUsername() {
        return username;
    }
}
