package cz.zcu.kiv.wernerv.repos;

import cz.zcu.kiv.wernerv.models.Users;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoUserRepository extends MongoRepository<Users, String> {
    Users findByUsername(String username);
}
