package cz.zcu.kiv.wernerv.services;

import cz.zcu.kiv.wernerv.models.LibraryParameter;
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

    public List<LibraryParameter> getHelp(String id) throws IOException, InterruptedException {
        Optional<LibraryPath> jarPathOpt = pathRepo.findById(id);
        if (!jarPathOpt.isPresent()) {
            throw new FileNotFoundException();
        }

        String jarPath = jarPathOpt.get().getPath();
        String[] libArgs = new String[] {
                "java", "-jar", jarPath, "-helpMachine"
        };
        Process proc = Runtime.getRuntime().exec(libArgs);
        proc.waitFor();

        List<LibraryParameter> args = new ArrayList<>();
        boolean loadArgs = false;
        Scanner sc = new Scanner(new InputStreamReader(proc.getInputStream()));

        while (sc.hasNextLine()) {
            String line = sc.nextLine();
            if (!loadArgs) {
                loadArgs = line.equals("ARGS");
            } else {
                if (line.equals("END_ARGS")) {
                    break;
                }
                String[] fields = line.split(";");
                LibraryParameter arg = new LibraryParameter();
                arg.name = fields[0];
                arg.option = fields[1];
                arg.type = fields[2];
                arg.mandatory = Boolean.parseBoolean(fields[3]);
                arg.description = fields[4];
                args.add(arg);
            }
        }

        return args;
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
        libArgList.add("-useStreamIO");

        // add user defined arguments
        for (String arg : args.keySet()) {
            libArgList.add(arg);
            libArgList.add(args.get(arg));
        }

        // run the library
        String[] libArgs = new String[libArgList.size()];
        libArgList.toArray(libArgs);
        ProcessBuilder pb = new ProcessBuilder();
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
            boolean loadResults = false;
            Scanner sc = new Scanner(new InputStreamReader(proc.getInputStream()));

            while (sc.hasNextLine()) {
                String line = sc.nextLine();
                if (!loadResults) {
                    loadResults = line.equals("RESULTS");
                } else {
                    if (line.equals("END_RESULTS")) {
                        break;
                    }
                    String[] fields = line.split(";");
                    try {
                        values.put(fields[0], Float.parseFloat(fields[2]));
                    } catch(Exception e) {
                        // ignore invalid lines
                    }
                }
            }

            return values;
        }
    }

    private void writeNodeData(ProjectData data, PrintWriter pw) {

        for (ProjectData.Node node : data.nodes) {
            pw.println(node.id + ";" + node.name + ";" + node.personalization);
        }
        pw.println("END_DATA");
        pw.flush();
    }

    private void writeEdgeData(ProjectData data, PrintWriter pw) {
        for (ProjectData.Edge edge : data.edges) {
            pw.println(edge.sourceId + ";" + edge.targetId + ";" + edge.weight);
        }
        pw.println("END_DATA");
        pw.flush();
    }
}
