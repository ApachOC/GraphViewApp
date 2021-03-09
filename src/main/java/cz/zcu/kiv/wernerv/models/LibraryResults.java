package cz.zcu.kiv.wernerv.models;

import java.util.HashMap;
import java.util.Map;

public class LibraryResults {
    public String[] nodeLabels;
    public String[] edgeLabels;

    public Map<String, String[]> nodeResults = new HashMap<>();
    public Map<String, String[]> edgeResults = new HashMap<>();
}
