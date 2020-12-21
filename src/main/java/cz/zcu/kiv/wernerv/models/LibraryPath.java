package cz.zcu.kiv.wernerv.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("lib_paths")
public class LibraryPath {
    @Id
    private String id;

    private String path;

    public LibraryPath(String id, String path) {
        this.id = id;
        this.path = path;
    }

    public String getPath() {
        return path;
    }

    public String getId() {
        return id;
    }
}
