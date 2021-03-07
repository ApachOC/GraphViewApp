import {Component, Input, OnInit} from "@angular/core";
import {ProjectData} from "../../../models/project-models";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {LibrarySelectionModalComponent} from "./library-selection-modal.component";
import {AlertService} from "../../../services/alert.service";

export class ChartEdge {

    private static _id = 0

    public readonly id: number;

    constructor(
        public source: {x: number, y: number},
        public target: {x: number, y: number}
    ) {
        this.id = ChartEdge._id++;
    }
}

export class ChartNode {

    public get x() { return this.data.x; }

    public set x(value) { this.data.x = value; }

    public get y() { return this.data.y; }

    public set y(value) { this.data.y = value; }

    public visible: boolean;

    constructor(public readonly data: ProjectData.Node) { }
}

@Component({
    selector: 'graph-editor',
    templateUrl: './editor.component.html'
})
export class EditorComponent implements OnInit {

    private static count = 0;

    private nodeMap: Record<string, ChartNode> = {};

    public nodes: ChartNode[] = [];

    public edges: ChartEdge[] = [];

    public labels: string[];

    public editorId = EditorComponent.count++;

    @Input() public project: ProjectData;

    public selectedNodes: ChartNode[] = [];

    constructor(private modalService: NgbModal, private alerts: AlertService) {  }

    ngOnInit(): void {
        this.initializeNodes();
        this.initializeEdges();
    }

    public removeNode(node: ChartNode) {
        // delete from chart data
        this.nodes.splice(this.nodes.indexOf(node), 1);
        let found: number;
        while ((found = this.edges.findIndex((edge) => edge.source == node || edge.target == node)) >= 0) {
            this.edges.splice(found, 1);
        }
        const id = node.data.id;
        delete this.nodeMap[id];

        // delete from project data
        found = this.project.nodes.findIndex((node) => node.id == id );
        this.project.nodes.splice(found, 1);
        while ((found = this.project.edges.findIndex((edge) => edge.sourceId == id || edge.targetId == id)) >= 0) {
            this.project.edges.splice(found, 1);
        }
    }

    public addNode(pos: {x: number, y: number}) {
        // add to project data
        const id = '' + this.nodes.length;
        const data = new ProjectData.Node(id, "Node: " + id);
        data.x = pos.x;
        data.y = pos.y;
        this.project.nodes.push(data);

        // add to chart data
        const chartNode = new ChartNode(data);
        this.nodeMap[id] = chartNode;
        this.nodes.push(chartNode);
    }

    public addEdge(val: {source: ChartNode, target: ChartNode}) {
        const projectEdge = new ProjectData.Edge(val.source.data.id, val.target.data.id);
        this.project.edges.push(projectEdge);
        this.edges.push(new ChartEdge(val.source, val.target));
    }

    public runLibrary() {
        const modalRef = this.modalService.open(LibrarySelectionModalComponent);
        modalRef.componentInstance.project = this.project;
        modalRef.result.then((result) => {
            for (let id in result) {
                if (result.hasOwnProperty(id)) {
                    this.nodeMap[id].data.personalization = result[id];
                }
            }
            this.alerts.pushAlert("success", "Library work finished, check node personalization.");
        });
    }

    /**
     * Convert nodes loaded from project data into format used by chart component.
     * @private
     */
    private initializeNodes() {
        this.project.nodes.forEach((node) => {
            const chartNode = new ChartNode(node);
            this.nodeMap[node.id] = chartNode;
            this.nodes.push(chartNode);
        });
    }

    /**
     * Convert edges loaded from project data into format used by chart component.
     * @private
     */
    private initializeEdges() {
        this.project.edges.forEach((edge) =>  {
            const edgeObj = new ChartEdge(
                this.nodeMap[edge.sourceId],
                this.nodeMap[edge.targetId]
            );
            this.edges.push(edgeObj);
        });
        return;
    }

    onSelection(nodes: ChartNode[]) {
        this.selectedNodes = nodes;
    }
}
