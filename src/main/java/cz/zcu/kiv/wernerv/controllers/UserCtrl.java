package cz.zcu.kiv.wernerv.controllers;

import cz.zcu.kiv.wernerv.models.User;
import cz.zcu.kiv.wernerv.repos.MongoUserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.Console;
import java.security.Principal;

@RestController
@RequestMapping("/api")
public class UserCtrl {

    private final MongoUserRepository repo;

    private static class TempUser {
        public String username;
        public String password;
    }

    public UserCtrl(MongoUserRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/login")
    public Principal login(Principal user) {
        return user;
    }

    @PostMapping("/register")
    public void register(@RequestBody TempUser newUser) {
        PasswordEncoder enc = new BCryptPasswordEncoder();
        String encodedPass = enc.encode(newUser.password);
        repo.insert(new User(newUser.username, encodedPass));
    }
}
