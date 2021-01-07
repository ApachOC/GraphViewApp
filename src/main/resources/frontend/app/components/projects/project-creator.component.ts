import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {NgxDropzoneChangeEvent} from "ngx-dropzone";
import '@angular/common';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProjectData} from "../../models/project-models";
import {RestProjectsService} from "../../services/rest-projects.service";
import {SessionService} from "../../services/session.service";

@Component({
    selector: 'project-creator',
    templateUrl: './project-creator.component.html'
})
export class ProjectCreatorComponent implements OnInit {

    @Input() project: ProjectData

    acceptFiles = 'application/csv,text/csv';
    nodeImportOptions = {
        show: false, importPers: true,
        firstLineHeader: true,

        finish: () => {},
        cancel: () => {},

        id: 0, name: 1, personalization: 2,
        values: ['1', '2', '3']
    }
    edgeImportOptions = {
        show: false, importWeights: true,
        firstLineHeader: true, generateLayout: true,

        finish: () => {},
        cancel: () => {},

        from: 0, to: 1, weight: 2,
        values: ['1', '2', '3']
    }
    showNodeAlert: boolean = false;
    showEdgeAlert: boolean = false;

    private existingNames: string[] = [];

    constructor(private modalService: NgbModal,
                private rest: RestProjectsService,
                private user: SessionService) { }

    ngOnInit() {
        if (this.user.authenticated) {
            this.rest.listProjects().then((records) => {
                this.existingNames = records.map((record) => record.name);
            });
        }
    }

    public onAddFile(event: NgxDropzoneChangeEvent) {
        if (event.addedFiles.length) {
            this.loadFile(event.addedFiles[0]).finally(
                () => {
                    while (event.addedFiles.length) {
                        event.addedFiles.pop();
                    }
                });
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

    private async loadFile(file: File) {
        switch (file.type) {
            case 'text/csv':
            case 'application/csv':
                const lines = await this.parseCSV(file);
                if (this.project.state === ProjectData.State.Empty) {
                    await this.loadNodes(lines);
                } else {
                    await this.loadEdges(lines);
                }
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

    private async loadNodes(lines: string[][]) {
        const m = this.nodeImportOptions;
        // wait for user to confirm the mapping
        const result = await new Promise<boolean>((resolve, reject) => {
            m.finish = () => resolve(true);
            m.cancel = () => resolve(false);
            m.show = true; m.values = lines[0]
        }).finally(() => m.show = false);
        if (!result) {
            // cancel
        } else {
            for (let i = m.firstLineHeader ? 1 : 0;
                 i < lines.length; i++) {
                const line = lines[i];
                const node = new ProjectData.Node(line[m.id], line[m.name],
                    m.importPers ? parseInt(line[m.personalization]) : null);
                this.project.nodes.push(node);
                //todo validate id, import other parameters
            }
        }
        this.showNodeAlert = true;
    }

    private async loadEdges(lines: string[][]) {
        const m = this.edgeImportOptions;
        // wait for user to confirm the mapping
        const result = await new Promise<boolean>((resolve, reject) => {
            m.finish = () => resolve(true);
            m.cancel = () => resolve(false);
            m.show = true; m.values = lines[0]
        }).finally(() => m.show = false);
        if (!result) {
            // cancel
        } else {
            for (let i = m.firstLineHeader ? 1 : 0;
                 i < lines.length; i++) {
                const line = lines[i];
                const edge = new ProjectData.Edge(line[m.from], line[m.to],
                    m.importWeights ? parseInt(line[m.weight]) : null);
                this.project.edges.push(edge);
            }
        }
        this.showEdgeAlert = true;
    }

    readyProject() {
        if (this.existingNames.includes(this.project.title)) {
            this.showEdgeAlert = true;
            // todo create alert service
        } else {
            this.project.ready = true;
        }
    }

    showGenerateModal(generateModal: TemplateRef<any>) {
        const resull = this.modalService.open(generateModal,
            {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            this.generateGraph(result.nodeCount, result.edgeCount);
        });
    }
}
