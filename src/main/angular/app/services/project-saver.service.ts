import {Injectable} from "@angular/core";
import {ProjectData} from "../models/project-models";
import {saveAs} from "file-saver"
import * as JSZip from "jszip";

@Injectable({
    providedIn: 'root',
})
export class ProjectSaverService {

    public saveProjectCSV(project: ProjectData) {
        const nodeCSV = this.nodesToCSV(project.nodes, project.history)
        const edgeCSV = this.edgesToCSV(project.edges)

        const archive = new JSZip();
        archive.file(`${project.title}-nodes.csv`, nodeCSV);
        archive.file(`${project.title}-edges.csv`, edgeCSV);

        archive.generateAsync({type : "blob"}).then((file) => {
            saveAs(file, project.title + "_project.zip")
        });
    }

    private nodesToCSV(nodes: ProjectData.Node[], extra: Record<string, number[]>) {
        const lines = []
        let header = "id;name;personalization;x;y";
        for (let value in extra) {
            if (!extra.hasOwnProperty(value)) {
                continue;
            }
            for (let idx = 0; idx < extra[value].length; idx++) {
                header += `;${value}@${extra[idx]}`;
            }
        }
        lines.push(header)
        for (let node of nodes) {
            let line = `${node.id};${node.name};${node.personalization};${node.x};${node.y}`;
            for (let value in extra) {
                if (!extra.hasOwnProperty(value)) {
                    continue;
                }
                for (let timestamp of extra[value]) {
                    if (value in node.extraValues && timestamp in node.extraValues[value]) {
                        line += `;${node.extraValues[value][timestamp]}`;
                    } else {
                        line += '; '
                    }
                }
            }
            lines.push(line);
        }
        return lines.join("\n")
    }

    private edgesToCSV(edges: ProjectData.Edge[]) {
        const lines = []
        lines.push("fromId;toId;weight")
        for (let edge of edges) {
            lines.push(`${edge.sourceId};${edge.targetId};${edge.weight}`);
        }
        return lines.join("\n")
    }
}
