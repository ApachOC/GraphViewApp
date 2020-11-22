package cz.zcu.kiv.wernerv.services;

import cz.zcu.kiv.wernerv.models.User;
import cz.zcu.kiv.wernerv.repos.MongoUserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class MongoUserDetailsService implements UserDetailsService {

    private final MongoUserRepository repository;
    private final PasswordEncoder encoder = new BCryptPasswordEncoder();

    public MongoUserDetailsService(MongoUserRepository repository) {
        this.repository = repository;

        //todo
        User user = repository.findByUsername("user");
        if (user == null) {
            user = new User("user", encoder.encode("pass"));
            user.getRoles().add("user");
            user.getRoles().add("admin");
            repository.insert(user);
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = repository.findByUsername(username);
        if(user == null) {
            throw new UsernameNotFoundException("User not found!");
        }
        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .map(SimpleGrantedAuthority::new).collect(Collectors.toList());
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), authorities);
    }

}
