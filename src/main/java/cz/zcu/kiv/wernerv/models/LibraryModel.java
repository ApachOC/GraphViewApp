package cz.zcu.kiv.wernerv.models;

import org.springframework.data.annotation.Id;

import java.util.List;

public class LibraryModel {

    @Id
    public String id;

    public String name;

    public String description;

    public List<LibraryParameter> parameters;

}
