package cz.zcu.kiv.wernerv.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Document(collection = "projects")
public class ProjectData {

    @Id
    public String id;

    public String title;

    public Map<String, Node> nodeMap;

    public List<Edge> edges;

    public static class Node {
        public float x = 0;

        public float y = 0;

        public int personalization;

        public Map <String, String> extraValues;
    }

    public static class Edge {

        public Node source;

        public Node target;

        public float weight;

    }

}
