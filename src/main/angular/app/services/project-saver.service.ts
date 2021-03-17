import {Injectable} from "@angular/core";
import {ProjectData} from "../models/project-models";
import {saveAs} from "file-saver"
import * as JSZip from "jszip";

@Injectable({
    providedIn: 'root',
})
export class ProjectSaverService {

    public saveProjectCSV(project: ProjectData) {
        const nodeCSV = this.nodesToCSV(project.nodes)
        const edgeCSV = this.edgesToCSV(project.edges)

        const archive = new JSZip();
        archive.file(`${project.title}-nodes.csv`, nodeCSV);
        archive.file(`${project.title}-edges.csv`, edgeCSV);

        archive.generateAsync({type : "blob"}).then((file) => {
            saveAs(file)
        });
    }

    private nodesToCSV(nodes: ProjectData.Node[]) {
        return "nodes"
    }

    private edgesToCSV(edges: ProjectData.Edge[]) {
        return "edges"
    }
}
