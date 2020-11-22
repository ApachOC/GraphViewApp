package cz.zcu.kiv.wernerv.repos;

import cz.zcu.kiv.wernerv.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoUserRepository extends MongoRepository<User, String> {
    User findByUsername(String username);
}
