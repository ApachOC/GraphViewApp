package cz.zcu.kiv.wernerv.controllers;

import cz.zcu.kiv.wernerv.models.AppUser;
import cz.zcu.kiv.wernerv.repos.MongoUserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UsersCtrl {

    private final MongoUserRepository repo;

    public UsersCtrl(MongoUserRepository repo) {
        this.repo = repo;
    }

    @PostMapping("/users")
    public void register(@RequestBody AppUser newUser) {
        //todo find if user is duplicate
        PasswordEncoder enc = new BCryptPasswordEncoder();
        newUser.setPassword(enc.encode(newUser.getPassword()));
        repo.insert(newUser);
    }

    @GetMapping("/users")
    public List<AppUser> list() {
        return repo.findAll();
    }

    @GetMapping("/users/{username}")
    public AppUser get(@PathVariable String username) {
        return repo.findByUsername(username);
    }

    @PutMapping("/users")
    public void update(@RequestBody AppUser newUser) {
        repo.save(newUser);
    }

    @GetMapping("/ping")
    public void ping() { }
}
