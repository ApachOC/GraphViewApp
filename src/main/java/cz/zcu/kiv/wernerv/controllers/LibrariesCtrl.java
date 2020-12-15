package cz.zcu.kiv.wernerv.controllers;

import cz.zcu.kiv.wernerv.models.LibraryModel;
import cz.zcu.kiv.wernerv.repos.LibraryRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class LibrariesCtrl {


    private final LibraryRepository libraryStorage;

    public LibrariesCtrl(LibraryRepository libraryStorage) {
        this.libraryStorage = libraryStorage;
    }

    @GetMapping("/libs")
    public List<LibraryModel> list() {
        return libraryStorage.listAll();
    }

    @PostMapping("/libs")
    public void upload(@RequestBody LibraryModel newLibrary,
                       @RequestParam("file") MultipartFile file) throws Exception {
        libraryStorage.save(newLibrary, file);
    }

    @DeleteMapping("/libs/{id}")
    public void delete(@PathVariable String id) throws IOException {
        libraryStorage.delete(id);
    }
}
