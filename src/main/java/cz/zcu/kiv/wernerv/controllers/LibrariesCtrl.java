package cz.zcu.kiv.wernerv.controllers;

import cz.zcu.kiv.wernerv.controllers.msg.LibraryCall;
import cz.zcu.kiv.wernerv.controllers.msg.Message;
import cz.zcu.kiv.wernerv.models.LibraryModel;
import cz.zcu.kiv.wernerv.models.LibraryParameter;
import cz.zcu.kiv.wernerv.models.LibraryResults;
import cz.zcu.kiv.wernerv.repos.LibraryRepository;
import cz.zcu.kiv.wernerv.services.LibraryRunnerService;
import org.bson.types.ObjectId;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Controller which handles library management.
 */
@RestController
@RequestMapping("/api")
public class LibrariesCtrl {

    private final LibraryRepository libraryStorage;
    private final LibraryRunnerService runService;

    public LibrariesCtrl(LibraryRepository libraryStorage,
                         LibraryRunnerService runService) {
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

    @GetMapping("/libs/{id}")
    public LibraryModel get(@PathVariable String id) {
        return libraryStorage.get(id);
    }

    @GetMapping("/libs/{id}/help")
    public List<LibraryParameter> help(@PathVariable String id) throws IOException, InterruptedException {
        return this.runService.getHelp(id);
    }

    @PostMapping("/libs")
    public Message upload(@RequestParam("file") MultipartFile file) throws IOException {
        return new Message(libraryStorage.saveFile(file));
    }

    @PostMapping("/libs/{id}")
    public void setup(@PathVariable String id, @RequestBody LibraryModel libraryModel) {
        libraryStorage.insertModel(libraryModel);
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
    public LibraryResults run(@PathVariable String id, @RequestBody LibraryCall callData) throws IOException, InterruptedException {
        String path = "/" + new ObjectId().toString();
        return runService.run(id, callData.args, callData.project, path);
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
}
