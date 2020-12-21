package cz.zcu.kiv.wernerv.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import cz.zcu.kiv.wernerv.models.GraphData;
import cz.zcu.kiv.wernerv.models.LibraryModel;
import cz.zcu.kiv.wernerv.repos.LibraryRepository;
import cz.zcu.kiv.wernerv.services.LibraryRunService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class LibrariesCtrl {

    private final LibraryRepository libraryStorage;
    private final LibraryRunService runService;

    public LibrariesCtrl(LibraryRepository libraryStorage,
                         LibraryRunService runService) {
        this.libraryStorage = libraryStorage;
        this.runService = runService;
    }

    @GetMapping("/libs")
    public List<LibraryModel> list() {
        return libraryStorage.listAll();
    }

    @PostMapping("/libs")
    public void upload(@RequestParam("metadata") String libString,
                       @RequestParam("file") MultipartFile file) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        LibraryModel lib = mapper.readValue(libString, LibraryModel.class);
        libraryStorage.save(lib, file);
    }

    @DeleteMapping("/libs/{id}")
    public void delete(@PathVariable String id) throws IOException {
        libraryStorage.delete(id);
    }

    @GetMapping("/libs/{id}")
    public void run(@PathVariable String id, List<Map<String, String>> params, GraphData data) throws IOException, InterruptedException {
        runService.run(id, params, data);
    }
}
