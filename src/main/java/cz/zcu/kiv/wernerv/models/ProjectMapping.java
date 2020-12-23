package cz.zcu.kiv.wernerv.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "projectMapping")
public class ProjectMapping {

    @Id
    public String id;

    public String name;

    public String owner;

    public boolean current;

    public List<String> extraValueNames;
}
