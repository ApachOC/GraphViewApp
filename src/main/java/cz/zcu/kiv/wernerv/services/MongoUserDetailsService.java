package cz.zcu.kiv.wernerv.services;

import cz.zcu.kiv.wernerv.models.AppUser;
import cz.zcu.kiv.wernerv.repos.MongoUserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class MongoUserDetailsService implements UserDetailsService {

    private final MongoUserRepository repository;
    private final PasswordEncoder encoder = new BCryptPasswordEncoder();

    public MongoUserDetailsService(MongoUserRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = repository.findByUsername(username);
        if(user == null) {
            throw new UsernameNotFoundException("User not found!");
        }
        return user;
    }

}
