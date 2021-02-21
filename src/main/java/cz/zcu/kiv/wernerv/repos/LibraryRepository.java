package cz.zcu.kiv.wernerv.repos;

import cz.zcu.kiv.wernerv.models.LibraryModel;
import cz.zcu.kiv.wernerv.models.LibraryPath;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${storage.libs:target/libstorage/}")
    private String RESOURCES_DIR;

    public LibraryRepository(MongoLibraryRepository libRepo,
                             MongoLibraryPathRepository pathRepo) {
        this.libRepo = libRepo;
        this.pathRepo = pathRepo;
    }

    public List<LibraryModel> listAll() {
        return libRepo.findAll();
    }

    public String saveFile(MultipartFile file) throws IOException {
        Path newFile = Paths.get(RESOURCES_DIR + new Date().getTime() + "-" + file.getOriginalFilename());
        Files.createDirectories(newFile.getParent());
        Files.write(newFile, file.getBytes());
        String path = newFile.toAbsolutePath().toString();
        String id = new ObjectId().toString();
        pathRepo.insert(new LibraryPath(id, path));
        return id;
    }

    public void insertModel(LibraryModel lib) {
        libRepo.insert(lib);
    }

    public void delete(String id) throws IOException {
        libRepo.deleteById(id);
        Optional<LibraryPath> pathOpt = pathRepo.findById(id);
        if (pathOpt.isPresent()) {
            String path = pathOpt.get().getPath();
            Files.delete(Paths.get(path));
            pathRepo.deleteById(id);
        }
    }

    public LibraryModel get(String id) {
        Optional<LibraryModel> libOpt = libRepo.findById(id);
        if (libOpt.isPresent()) {
            return libOpt.get();
        }
        throw new IllegalArgumentException();
    }
}
