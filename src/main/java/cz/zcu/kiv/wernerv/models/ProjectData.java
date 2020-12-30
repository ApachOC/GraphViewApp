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

    public List<Node> nodes;

    public List<Edge> edges;

    public static class Node {

        public String id;

        public String name;

        public float x = 0;

        public float y = 0;

        public float personalization;

        public Map <String, String> extraValues;
    }

    public static class Edge {

        public String sourceId;

        public String targetId;

        public float weight;

    }

}
