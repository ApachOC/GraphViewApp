package cz.zcu.kiv.wernerv.services;

import cz.zcu.kiv.wernerv.models.GraphData;
import cz.zcu.kiv.wernerv.repos.MongoLibraryPathRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.jar.JarException;

@Service
public class LibraryRunService {

    private final MongoLibraryPathRepository pathRepo;

    public LibraryRunService(MongoLibraryPathRepository pathRepo) {
        this.pathRepo = pathRepo;
    }

    public GraphData run(String id, List<Map<String, String>> params, GraphData data) throws IOException, InterruptedException {
        Path edgeFilePath = createTmpEdgeFile(data);
        Path nodeFileInPath = createTmpNodeFile(data);
        Path tmpFileOutPath = Files.createTempFile("data", "out");
        String jarFilePath = pathRepo.findById(id).get().getPath();
        List<String> libArgList = new ArrayList<>();
        libArgList.add("java");
        libArgList.add("-jar " + jarFilePath);
        libArgList.add("-fileNodes:'" + nodeFileInPath.toAbsolutePath() + "'");
        libArgList.add("-fileEdges:'" + nodeFileInPath.toAbsolutePath() + "'");
        libArgList.add("-filePageRank:'" + tmpFileOutPath.toAbsolutePath() + "'");
        Process proc = Runtime.getRuntime().exec((String[]) libArgList.toArray());
        int exitCode = proc.waitFor();
        if (exitCode != 0) {
            throw new JarException();
        } else {
            return new GraphData();
        }
    }

    private Path createTmpNodeFile(GraphData data) throws IOException {
        Path path = Files.createTempFile("data", "id");
        return path;
    }

    private Path createTmpEdgeFile(GraphData data) throws IOException {
        Path path = Files.createTempFile("data", "id");
        return path;
    }

}
