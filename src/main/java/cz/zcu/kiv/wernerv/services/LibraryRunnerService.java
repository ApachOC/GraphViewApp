package cz.zcu.kiv.wernerv.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import cz.zcu.kiv.wernerv.models.LibraryPath;
import cz.zcu.kiv.wernerv.models.ProjectData;
import cz.zcu.kiv.wernerv.repos.MongoLibraryPathRepository;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LibraryRunnerService {

    private final MongoLibraryPathRepository pathRepo;

    public LibraryRunnerService(MongoLibraryPathRepository pathRepo) {
        this.pathRepo = pathRepo;
    }

    public Map<?, ?> getHelp(String id) throws IOException, InterruptedException {
        Optional<LibraryPath> jarPathOpt = pathRepo.findById(id);
        if (!jarPathOpt.isPresent()) {
            throw new FileNotFoundException();
        }

        String jarPath = jarPathOpt.get().getPath();
        String[] libArgs = new String[] {
                "java", "-jar", jarPath, "-helpJSON"
        };
        Process proc = Runtime.getRuntime().exec(libArgs);
        proc.waitFor();
        return new ObjectMapper().readValue(proc.getInputStream(), HashMap.class);
    }

    public Map<String, Float> run(String id, Map<String, String> args, ProjectData data, String path) throws IOException, InterruptedException {
        // find library file
        Optional<LibraryPath> jarPathOpt = pathRepo.findById(id);
        if (!jarPathOpt.isPresent()) {
            throw new FileNotFoundException();
        }

        // create default argument list
        String jarPath = jarPathOpt.get().getPath();
        List<String> libArgList = new ArrayList<>();
        libArgList.add("java");
        libArgList.add("-jar");
        libArgList.add(jarPath);
        libArgList.add("-useConsoleInOut");

        // add user defined arguments
        for (String arg : args.keySet()) {
            libArgList.add(arg);
            libArgList.add(args.get(arg));
        }

        // run the library
        String[] libArgs = new String[libArgList.size()];
        libArgList.toArray(libArgs);
        Process proc = Runtime.getRuntime().exec(libArgs);

        // send the data
        PrintWriter pw = new PrintWriter(proc.getOutputStream());
        writeNodeData(data, pw);
        writeEdgeData(data, pw);

        // get results
        int exitCode = proc.waitFor();
        if (exitCode != 0) {
            String err = new BufferedReader(new InputStreamReader(proc.getErrorStream()))
                    .lines().collect(Collectors.joining("\n"));
            throw new RuntimeException(err);
        } else {
            Map<String, Float> values = new HashMap<>();
            BufferedReader bfr = new BufferedReader(new InputStreamReader(proc.getInputStream()));
            bfr.lines().forEach((line) -> {
                //todo fix the library
                String[] fields = line.split(";");
                float value;
                try {
                    value = Float.parseFloat(fields[2]);
                    values.put(fields[0], value);
                } catch (Exception e) {
                    // ignore
                }
            });

            if (values.values().size() > 0) {
                return values;
            } else {
                String message = new BufferedReader(new InputStreamReader(proc.getInputStream()))
                        .lines().collect(Collectors.joining("\n"));
                throw new RuntimeException(message);
            }
        }
    }

    private void writeNodeData(ProjectData data, PrintWriter pw) throws IOException {
        for (ProjectData.Node node : data.nodes) {
            pw.println(node.id + ";" + node.name + ";" + node.personalization);
        }
        pw.println("END_DATA");
    }

    private void writeEdgeData(ProjectData data, PrintWriter pw) throws IOException {
        for (ProjectData.Edge edge : data.edges) {
            pw.println(edge.sourceId + ";" + edge.targetId + ";" + edge.weight);
        }
        pw.println("END_DATA");
    }

}
