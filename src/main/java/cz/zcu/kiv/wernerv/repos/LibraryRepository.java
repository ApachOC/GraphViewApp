package cz.zcu.kiv.wernerv.repos;

import cz.zcu.kiv.wernerv.models.LibraryModel;
import cz.zcu.kiv.wernerv.models.LibraryPath;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public class LibraryRepository {

    private final MongoLibraryRepository libRepo;
    private final MongoLibraryPathRepository pathRepo;

    private final String RESOURCES_DIR = LibraryRepository.class.getResource("/").getPath();

    public LibraryRepository(MongoLibraryRepository libRepo,
                             MongoLibraryPathRepository pathRepo) {
        this.libRepo = libRepo;
        this.pathRepo = pathRepo;
    }

    public List<LibraryModel> listAll() {
        return libRepo.findAll();
    }

    public void save(LibraryModel lib, MultipartFile file) throws Exception {
        Path newFile = Paths.get(RESOURCES_DIR + new Date().getTime() + "-" + file.getName());
        Files.createDirectories(newFile.getParent());
        Files.write(newFile, file.getBytes());
        String path = newFile.toAbsolutePath().toString();
        String id = new ObjectId().toString();
        lib.id = id;
        libRepo.insert(lib);
        pathRepo.insert(new LibraryPath(id, path));
    }

    public void delete(String id) throws IOException {
        libRepo.deleteById(id);
        Optional<LibraryPath> pathOpt = pathRepo.findById(id);
        if (pathOpt.isPresent()) {
            String path = pathOpt.get().path;
            Files.delete(Paths.get(path));
            pathRepo.deleteById(id);
        }
    }
}
