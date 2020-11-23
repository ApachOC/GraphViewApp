package cz.zcu.kiv.wernerv.controllers;

import cz.zcu.kiv.wernerv.models.AppUser;
import cz.zcu.kiv.wernerv.repos.MongoUserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class SessionCtrl {

    private final MongoUserRepository repo;

    public SessionCtrl(MongoUserRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/user")
    public AppUser get() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();
        if (authentication != null) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserDetails) {
                UserDetails details = (UserDetails) principal;
                return repo.findByUsername(details.getUsername());
            }
        }
        return null;
    }

    @PutMapping("/user")
    public void update(@RequestBody AppUser newUser) { }

    @PostMapping("/user")
    public void register(@RequestBody AppUser newUser) {
        PasswordEncoder enc = new BCryptPasswordEncoder();
        newUser.password = enc.encode(newUser.password);
        repo.insert(newUser);
    }

    @GetMapping("/ping")
    public void ping() { }
}
