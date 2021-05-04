package cz.zcu.kiv.wernerv.repos;

import cz.zcu.kiv.wernerv.models.LibraryModel;
import cz.zcu.kiv.wernerv.models.ProjectData;
import cz.zcu.kiv.wernerv.models.ProjectMapping;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface MongoProjectMappingRepository extends MongoRepository<ProjectMapping, String> {
    List<ProjectMapping> findByOwner(String owner);
    List<ProjectMapping> findByOwnerAndCurrent(String owner, boolean current);
    Optional<ProjectMapping> findByOwnerAndId(String owner, String id);
    Optional<ProjectMapping> findByOwnerAndName(String userName, String title);
    void deleteByOwnerAndId(String owner, String id);
}
