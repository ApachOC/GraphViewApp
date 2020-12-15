package cz.zcu.kiv.wernerv.repos;

import cz.zcu.kiv.wernerv.models.LibraryModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoLibraryRepository extends MongoRepository<LibraryModel, String> {
}
