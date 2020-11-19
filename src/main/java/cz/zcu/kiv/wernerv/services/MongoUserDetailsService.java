package cz.zcu.kiv.wernerv.services;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoClients;
import com.mongodb.client.internal.MongoClientImpl;
import cz.zcu.kiv.wernerv.models.Users;
import cz.zcu.kiv.wernerv.repos.MongoUserRepository;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDbFactory;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class MongoUserDetailsService implements UserDetailsService {

    private MongoUserRepository repository;

    public MongoUserDetailsService(MongoUserRepository repository, MongoTemplate tpt) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        MongoOperations mongoOps = new MongoTemplate(new SimpleMongoClientDbFactory(MongoClients.create(), "test"));
        mongoOps.insert(new Users("pes", "$2a$10$AjHGc4x3Nez/p4ZpvFDWeO6FGxee/cVqj5KHHnHfuLnIOzC5ag4fm"));
        Users user = repository.findByUsername(username);
        if(user == null) {
            throw new UsernameNotFoundException("User not found!");
        }
        List<SimpleGrantedAuthority> authorities = Arrays.asList(new SimpleGrantedAuthority("user"));
        return new User(user.getUsername(), user.getPassword(), authorities);
    }
}
