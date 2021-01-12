package cz.zcu.kiv.wernerv.controllers;

import cz.zcu.kiv.wernerv.models.UserModel;
import cz.zcu.kiv.wernerv.repos.MongoUserRepository;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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
            throw new ResponseStatusException(HttpStatus.CONFLICT);
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
    public UserModel currentUser(Principal user) throws ChangeSetPersister.NotFoundException {
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        return repo.findByUsername(user.getName());
    }
}
