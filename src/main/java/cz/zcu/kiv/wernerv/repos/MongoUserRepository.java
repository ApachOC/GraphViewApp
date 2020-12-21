package cz.zcu.kiv.wernerv.repos;

import cz.zcu.kiv.wernerv.models.UserModel;
import org.springframework.data.mongodb.repository.MongoRepository;

    public interface MongoUserRepository extends MongoRepository<UserModel, String> {
        UserModel findByUsername(String username);
        void deleteByUsername(String username);
    }

