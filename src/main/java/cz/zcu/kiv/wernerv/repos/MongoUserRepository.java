package cz.zcu.kiv.wernerv.repos;

import cz.zcu.kiv.wernerv.models.AppUser;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoUserRepository extends MongoRepository<AppUser, String> {
    AppUser findByUsername(String username);
}
