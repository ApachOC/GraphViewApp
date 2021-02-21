package cz.zcu.kiv.wernerv.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("libraries")
public class LibraryModel {

    @Id
    public String id;

    public String name;

    public String description;

    public List<LibraryParameter> parameters;

}
