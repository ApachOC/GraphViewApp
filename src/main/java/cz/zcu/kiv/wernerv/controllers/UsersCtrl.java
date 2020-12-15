package cz.zcu.kiv.wernerv.controllers;

import cz.zcu.kiv.wernerv.models.UserModel;
import cz.zcu.kiv.wernerv.repos.MongoUserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UsersCtrl {

    private final MongoUserRepository repo;

    public UsersCtrl(MongoUserRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/users")
    public List<UserModel> list() {
        return repo.findAll();
    }

    @GetMapping("/users/{username}")
    public UserModel get(@PathVariable String username) {
        return repo.findByUsername(username);
    }

    @PostMapping("/users")
    public void register(@RequestBody UserModel newUser) throws Exception {
        if (repo.findByUsername(newUser.getUsername()) != null) {
            throw new Exception("User already exists!");
        }
        PasswordEncoder enc = new BCryptPasswordEncoder();
        newUser.setPassword(enc.encode(newUser.getPassword()));
        repo.insert(newUser);
    }

    @PutMapping("/users")
    public void update(@RequestBody UserModel newUser) {
        repo.save(newUser);
    }

    @DeleteMapping("/users/{username}")
    public void delete(@PathVariable String username) {
        repo.deleteByUsername(username);
    }

    @GetMapping("/user")
    public UserModel currentUser(Principal user) {
        return repo.findByUsername(user.getName());
    }
}
