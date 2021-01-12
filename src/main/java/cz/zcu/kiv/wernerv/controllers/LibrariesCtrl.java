package cz.zcu.kiv.wernerv.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import cz.zcu.kiv.wernerv.models.LibraryModel;
import cz.zcu.kiv.wernerv.models.LibraryPath;
import cz.zcu.kiv.wernerv.models.ProjectData;
import cz.zcu.kiv.wernerv.repos.LibraryRepository;
import cz.zcu.kiv.wernerv.services.LibraryRunService;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Map;

/**
 * Controller which handles library management.
 */
@RestController
@RequestMapping("/api")
public class LibrariesCtrl {


    /**
     * Class which represents the data when calling library
     */
    private static class LibraryCall {
        public ProjectData project;
        public Map<String, String> args;
        public String path;
    }

    private final LibraryRepository libraryStorage;
    private final LibraryRunService runService;

    public LibrariesCtrl(LibraryRepository libraryStorage,
                         LibraryRunService runService) {
        this.libraryStorage = libraryStorage;
        this.runService = runService;
    }

    /**
     * List all libraries
     * @return List of libraries
     */
    @GetMapping("/libs")
    public List<LibraryModel> list() {
        return libraryStorage.listAll();
    }

    /**
     * Create new library
     * @param libString Library object String in the multipart data
     * @param file Library file
     * @throws Exception Thrown when the libString couldn't be converted.
     */
    @PostMapping("/libs")
    public void upload(@RequestParam("metadata") String libString,
                       @RequestParam("file") MultipartFile file) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        LibraryModel lib = mapper.readValue(libString, LibraryModel.class);
        libraryStorage.save(lib, file);
    }

    /**
     * Delete a libary
     * @param id ID of library to delete
     * @throws IOException Thrown when the library file couldn't be found or deleted.
     */
    @DeleteMapping("/libs/{id}")
    public void delete(@PathVariable String id) throws IOException {
        libraryStorage.delete(id);
    }

    /**
     * Run a library
     * @param id ID of a library to run
     * @param callData Run parameters
     * @return Websocket path under which the values will be sent in due time
     * @throws IOException Couldn't create or write to temporary file
     * @throws InterruptedException The library process was interrupted
     */
    @PostMapping("/libs/{id}/run")
    public Path run(@PathVariable String id, @RequestBody LibraryCall callData) throws IOException, InterruptedException {
        String path = "/" + new ObjectId().toString();
        runService.run(id, callData.args, callData.project, path);
        Path p = new Path();
        p.path = path;
        return p;
    }

    private static class Path {
        public String path;
    }
}
