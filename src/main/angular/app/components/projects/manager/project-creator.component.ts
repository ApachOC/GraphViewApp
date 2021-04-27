import {Component, Input, TemplateRef} from '@angular/core';
import {NgxDropzoneChangeEvent} from "ngx-dropzone";
import '@angular/common';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProjectData} from "../../../models/project-models";
import {RestProjectsService} from "../../../services/rest-projects.service";
import {SessionService} from "../../../services/session.service";
import {AlertService} from "../../../services/alert.service";

@Component({
    selector: 'project-creator',
    templateUrl: './project-creator.component.html'
})
export class ProjectCreatorComponent {

    @Input() project: ProjectData

    acceptFiles = 'application/csv,text/csv';

    nodeImportOptions = {
        show: false,
        firstLineHeader: true,
        importPersonalization: false,
        importPosition: false,
        importExtras: false,

        mapping: {
            id: 0,
            name: 1,
            personalization: 2
        },

        fields: [],
        data: [[]],
        extra: []
    }

    edgeImportOptions = {
        show: false,
        importWeights: true,
        firstLineHeader: true,

        from: 0, to: 1, weight: 2,
        data: [[]]
    }

    private nodesImported = false;

    get density(): number {
        if (this.project.nodeCount) {
            return this.project.edgeCount / (this.project.nodeCount * (this.project.nodeCount - 1))
        } else {
            return 0
        }
    }

    constructor(private modalService: NgbModal,
                private rest: RestProjectsService,
                private user: SessionService,
                private alerts: AlertService) { }

    public async onAddFile(event: NgxDropzoneChangeEvent) {
        if (event.addedFiles.length) {
            await this.loadFile(event.addedFiles.pop());
        }
    }

    public generateGraph(count: number, maxEdges: number): void {
        for (let i = 0; i < count; i++) {
            const node = new ProjectData.Node('' + i, 'Node ' + i);
            this.project.nodes.push(node);
        }

        for (let i = 0; i < count; i++) {
            const randMax = Math.floor(Math.random() * Math.random() * Math.floor(maxEdges)) + 1;
            const prevTargets = [];
            for (let j = 0; j < randMax; j++) {
                const from = this.project.nodes[i];
                let to = this.project.nodes[Math.floor(Math.random() * Math.floor(count))];

                while (from === to || prevTargets.includes(to)) {
                    to = this.project.nodes[Math.floor(Math.random() * Math.floor(count))];
                }
                const edge = new ProjectData.Edge(from.id, to.id);
                this.project.edges.push(edge);
                prevTargets.push(to.id);
            }
        }

        this.project.ready = true;
    }

    private detectNodeOptions(line: string[]) {
        // get all fields
        const fields = []
        for (let i = 0; i < line.length; i++) {
            const split = line[i].split("@");
            let fIndex = -1;
            if ((fIndex = fields.indexOf((el) => el.name == split[0])) >= 0) {
                fields[fIndex].columns.push(i);
            } else {
                fields.push({ name: split[0], columns: [i], variants: [] });
            }
            if (split.length > 1) {
                fields[fields.length - 1].variants.push(split[1]);
            }
        }

        const perField = fields.find((el) => el.name.toLowerCase() == "personalization")
        const posFieldX = fields.find((el) => el.name.toLowerCase() == "x");
        const posFieldY = fields.find((el) => el.name.toLowerCase() == "y");

        const extFields = fields.filter((el) => el.variants.length > 0)

        this.nodeImportOptions.fields = fields
        if (perField) {
            this.nodeImportOptions.importPersonalization = true
            this.nodeImportOptions.mapping.personalization = perField.columns[0];
        }
        if (posFieldX && posFieldY) {
            this.nodeImportOptions.importPosition = true;
            this.nodeImportOptions.mapping["x"] = posFieldX.columns[0];
            this.nodeImportOptions.mapping["y"] = posFieldY.columns[0];
        }
        if (extFields.length) {
            this.nodeImportOptions.importExtras = true
            this.nodeImportOptions.extra = extFields
        }
    }

    private async loadFile(file: File): Promise<string[][]> {
        switch (file.type) {
            case 'text/csv':
            case 'application/csv':
                const lines = await this.parseCSV(file);
                if (!this.nodesImported) {
                    this.loadNodeCSV(lines);
                } else {
                    this.edgeImportOptions.data = lines;
                    this.edgeImportOptions.show = true;
                }
                return lines;
            default:
                return [[]];
        }
    }

    private async parseCSV(file: File): Promise<string[][]> {
        const output = [];
        // this should be done on BE
        const text = await file.text();
        const lines = text.split('\n');
        lines.forEach(line => {
            const words = line.trim().split(';');
            if (words.length > 2) {
                output.push(words);
            }
        });

        return output;
    }

    private loadNodeCSV(lines: string[][]) {
        this.detectNodeOptions(lines[0]);
        this.nodeImportOptions.data = lines;
        this.nodeImportOptions.show = true;
    }

    public loadNodes() {
        const m = this.nodeImportOptions;
        for (let i = m.firstLineHeader ? 1 : 0; i < m.data.length; i++) {
                const line = m.data[i];
                const node = new ProjectData.Node(line[m.mapping.id], line[m.mapping.name]);
                if (m.importPersonalization) {
                    node.personalization = line[m.mapping["personalization"]];
                }
                if (m.importPosition) {
                    node.x = parseFloat(line[m.mapping["x"]]);
                    node.y = parseFloat(line[m.mapping["y"]]);
                }
                if (m.importExtras) {
                    for (const field of m.extra) {
                        const records = {}
                        for (let i = 0; i < field.variants.length; i++) {
                            records[field.variants[i]] = line[field.columns[i]]
                        }
                        node.extraValues[field.name] = records
                    }
                }
                this.project.nodes.push(node);
        }

        // save project history
        if (this.nodeImportOptions.importExtras) {
            for (const field of m.extra) {
                this.project.history[field.name] = field.variants;
            }
        }

        this.alerts.pushAlert("success", "Nodes were imported successfully!");
        this.nodeImportOptions.show = false;
        this.nodesImported = true
    }

    public loadEdges() {
        const m = this.edgeImportOptions;
        for (let i = m.firstLineHeader ? 1 : 0; i < m.data.length; i++) {
                const line = m.data[i];
                const edge = new ProjectData.Edge(line[m.from], line[m.to],
                    m.importWeights ? parseInt(line[m.weight]) : null);
                this.project.edges.push(edge);
        }
        this.alerts.pushAlert("success", "Edges were imported successfully!");
        m.show = false;
    }

    readyProject(projectName: HTMLInputElement) {
        if (projectName.reportValidity()) {
            this.project.ready = true;
        }
    }

    showGenerateModal(generateModal: TemplateRef<any>) {
        this.modalService.open(generateModal,
            {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            this.generateGraph(result.nodeCount, result.edgeCount);
        });
    }
}
