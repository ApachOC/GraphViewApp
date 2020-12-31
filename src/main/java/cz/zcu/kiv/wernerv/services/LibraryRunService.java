package cz.zcu.kiv.wernerv.services;

import cz.zcu.kiv.wernerv.models.ProjectData;
import cz.zcu.kiv.wernerv.repos.MongoLibraryPathRepository;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.jar.JarException;
import java.util.stream.Collectors;

@Service
public class LibraryRunService {

    private final MongoLibraryPathRepository pathRepo;

    public LibraryRunService(MongoLibraryPathRepository pathRepo) {
        this.pathRepo = pathRepo;
    }

    /*
    TODO this is stupid and works for example library only, some better library API option must be discussed.
     */
    public Map<String, Float> run(String id, Map<String, String> args, ProjectData data) throws IOException, InterruptedException {
        // create temporary files
        Path edgeFileInPath = createTmpEdgeFile(data);
        Path nodeFileInPath = createTmpNodeFile(data);
        Path tmpFileOutPath = Files.createTempFile("out-data-", ".nodes");
        String jarFilePath = pathRepo.findById(id).get().getPath();

        // create default argument list
        List<String> libArgList = new ArrayList<>();
        libArgList.add("java");
        libArgList.add("-jar");
        libArgList.add(jarFilePath);
        libArgList.add("-inputDir:'" + nodeFileInPath.getParent().toAbsolutePath() + "/'");
        libArgList.add("-outputDir:'" + nodeFileInPath.getParent().toAbsolutePath() + "/'");
        libArgList.add("-fileNodes:'" + nodeFileInPath.getFileName() + "'");
        libArgList.add("-fileEdges:'" + edgeFileInPath.getFileName() + "'");
        libArgList.add("-filePageRank:'" + tmpFileOutPath.getFileName() + "'");

        // add user defined arguments
        for (String arg : args.keySet()) {
            libArgList.add(arg);
            libArgList.add(args.get(arg));
        }

        // run the library
        String[] libArgs = new String[libArgList.size()];
        libArgList.toArray(libArgs);
        Process proc = Runtime.getRuntime().exec(libArgs);
        int exitCode = proc.waitFor();
        if (exitCode != 0) {
            String err = new BufferedReader(new InputStreamReader(proc.getErrorStream()))
                    .lines().collect(Collectors.joining("\n"));
            String std = new BufferedReader(new InputStreamReader(proc.getInputStream()))
                    .lines().collect(Collectors.joining("\n"));

            // clean up
            Files.deleteIfExists(edgeFileInPath);
            Files.deleteIfExists(tmpFileOutPath);
            Files.deleteIfExists(nodeFileInPath);

            throw new JarException(err);
        } else {
            Map<String, Float> values = new HashMap<>();
            BufferedReader bfr = new BufferedReader(new FileReader(tmpFileOutPath.toFile()));
            bfr.lines().forEach((line) -> {
                String[] fields = line.split(";");
                float value;
                try {
                    value = Float.parseFloat(fields[2]);
                    values.put(fields[0], value);
                } catch (Exception e) {
                    // ignore
                }
            });

            // clean up
            Files.deleteIfExists(edgeFileInPath);
            Files.deleteIfExists(tmpFileOutPath);
            Files.deleteIfExists(nodeFileInPath);

            if (values.values().size() > 0) {
                return values;
            } else {
                String message = new BufferedReader(new InputStreamReader(proc.getInputStream()))
                        .lines().collect(Collectors.joining("\n"));
                throw new JarException(message);
            }
        }
    }

    private Path createTmpNodeFile(ProjectData data) throws IOException {
        Path path = Files.createTempFile("in-data-", ".nodes");

        int i = 0;
        String[] lines = new String[data.nodes.size() + 1];
        lines[i++] = "sId;Jmeno;Personalizace";
        for (ProjectData.Node node : data.nodes) {
            lines[i++] = node.id + ";" + node.name + ";" + node.personalization;
        }

        PrintWriter pw = new PrintWriter(new FileOutputStream(path.toFile()));
        for (String line : lines) {
            pw.println(line);
        }
        pw.close();

        return path;
    }

    private Path createTmpEdgeFile(ProjectData data) throws IOException {
        Path path = Files.createTempFile("in-data-", ".edges");

        int i = 0;
        String[] lines = new String[data.edges.size() + 1];
        lines[i++] = "sIdZ;sIdDo;Vaha";
        for (ProjectData.Edge edge : data.edges) {
            lines[i++] = edge.sourceId + ";" + edge.targetId + ";" + edge.weight;
        }

        PrintWriter pw = new PrintWriter(new FileOutputStream(path.toFile()));
        for (String line : lines) {
            pw.println(line);
        }
        pw.close();

        return path;
    }

}
