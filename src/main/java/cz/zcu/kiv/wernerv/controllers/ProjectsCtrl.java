package cz.zcu.kiv.wernerv.controllers;

import cz.zcu.kiv.wernerv.models.ProjectData;
import cz.zcu.kiv.wernerv.models.ProjectMapping;
import cz.zcu.kiv.wernerv.repos.MongoProjectMappingRepository;
import cz.zcu.kiv.wernerv.repos.MongoProjectRepository;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class ProjectsCtrl {

    private final MongoProjectRepository projectRepo;
    private final MongoProjectMappingRepository mappingRepo;

    public ProjectsCtrl(MongoProjectRepository projectRepo,
                        MongoProjectMappingRepository mappingRepo) {
        this.projectRepo = projectRepo;
        this.mappingRepo = mappingRepo;
    }

    @GetMapping("/projects")
    public List<ProjectMapping> list(Principal user) {
        String name = user.getName();
        return mappingRepo.findByOwner(name);
    }

    @GetMapping("/projects/current")
    public List<ProjectMapping> getCurrent(Principal user)
    {
        String name = user.getName();
        return mappingRepo.findByOwnerAndCurrent(name, true);
    }

    @PostMapping("/projects")
    public ProjectMapping saveProject(@RequestBody ProjectData projectData, Principal user) {
        String userName = user.getName();
        Optional<ProjectMapping> conflict = mappingRepo.findByOwnerAndName(userName, projectData.title);
        if (conflict.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }

        Optional<ProjectMapping> existing = mappingRepo.findByOwnerAndId(userName, projectData.id);
        ProjectMapping record;
        if (existing.isPresent()) {
            projectRepo.save(projectData);
            return existing.get();
        } else {
            String newId = new ObjectId().toString();
            String newTitle = projectData.title.trim();
            projectData.id = newId;
            projectData.title = newTitle;
            record = new ProjectMapping();
            record.id = newId;
            record.name = newTitle;
            record.owner = userName;
            record.current = false;
            mappingRepo.insert(record);
            projectRepo.insert(projectData);
            return record;
        }
    }

    @GetMapping("/projects/{id}")
    public Optional<ProjectData> getProject(@PathVariable String id, Principal user) throws Exception {
        String name = user.getName();
        Optional<ProjectMapping> mapping = mappingRepo.findByOwnerAndId(name, id);
        if (mapping.isPresent()) {
            return projectRepo.findById(id);
        } else {
            throw new Exception(); //todo
        }
    }
}
