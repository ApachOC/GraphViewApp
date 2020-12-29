import {DoCheck, Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";
import {ProjectData} from "../../models/project-models";

export class ChartEdge {
    constructor(
        public source: {x: number, y: number},
        public target: {x: number, y: number}
    ) {}
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
export class EditorComponent implements OnInit, DoCheck {

    private nodeMap: Record<string, ChartNode> = {};

    public nodes: ChartNode[] = [];

    public edges: ChartEdge[] = [];

    public labels: string[];

    public currentTool: string = "SELECT";

    @Input() public project: ProjectData;

    @ViewChild('chartEditorCanvas') canvas: ElementRef;

    ngOnInit(): void {
        this.initializeNodes();
        this.initializeEdges();
    }

    ngDoCheck() {
        //todo keep projectData and chart data synced
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
}
