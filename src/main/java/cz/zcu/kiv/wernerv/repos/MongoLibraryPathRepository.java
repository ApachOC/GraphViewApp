package cz.zcu.kiv.wernerv.repos;

import cz.zcu.kiv.wernerv.models.LibraryPath;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoLibraryPathRepository extends MongoRepository<LibraryPath, String> {
}
