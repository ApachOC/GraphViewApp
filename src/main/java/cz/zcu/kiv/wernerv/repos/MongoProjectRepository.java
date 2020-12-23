package cz.zcu.kiv.wernerv.repos;

import cz.zcu.kiv.wernerv.models.LibraryModel;
import cz.zcu.kiv.wernerv.models.ProjectData;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoProjectRepository extends MongoRepository<ProjectData, String> {
}
