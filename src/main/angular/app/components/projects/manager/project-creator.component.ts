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
        importPers: true,
        firstLineHeader: true,

        id: 0, name: 1, personalization: 2,
        labels: ['1', '2', '3']
    }
    edgeImportOptions = {
        show: false,
        importWeights: true,
        firstLineHeader: true,
        generateLayout: true,

        from: 0, to: 1, weight: 2,
        labels: ['1', '2', '3']
    }

    private csvLines: string[][];

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
            this.csvLines = await this.loadFile(event.addedFiles.pop());
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

    private async loadFile(file: File): Promise<string[][]> {
        switch (file.type) {
            case 'text/csv':
            case 'application/csv':
                const lines = await this.parseCSV(file);
                if (this.project.state === ProjectData.State.Empty) {
                    this.nodeImportOptions.labels = lines[0];
                    this.nodeImportOptions.show = true;
                } else {
                    this.edgeImportOptions.labels = lines[0];
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

    public loadNodes() {
        const m = this.nodeImportOptions;
        const lines = this.csvLines;
        m.show = false;
        for (let i = m.firstLineHeader ? 1 : 0; i < lines.length; i++) {
                const line = lines[i];
                const node = new ProjectData.Node(line[m.id], line[m.name],
                    m.importPers ? parseInt(line[m.personalization]) : null);
                this.project.nodes.push(node);
        }
        this.alerts.pushAlert("success", "Nodes were imported successfully!");
    }

    public loadEdges() {
        const m = this.edgeImportOptions;
        const lines = this.csvLines;
        m.show = false;
        for (let i = m.firstLineHeader ? 1 : 0; i < lines.length; i++) {
                const line = lines[i];
                const edge = new ProjectData.Edge(line[m.from], line[m.to],
                    m.importWeights ? parseInt(line[m.weight]) : null);
                this.project.edges.push(edge);
        }
        this.alerts.pushAlert("success", "Edges were imported successfully!");
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
