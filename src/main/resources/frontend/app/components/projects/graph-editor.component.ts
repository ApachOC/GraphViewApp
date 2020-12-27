import {AfterViewInit, Component, Input, ViewChild} from "@angular/core";
import * as Chart from 'chart.js';
import 'chartjs-chart-graph';
import 'chartjs-plugin-datalabels';
import 'chartjs-plugin-dragdata';
import {ProjectData} from "../../models/project-models";

declare module 'chart.js' {

    interface ChartOptions {
        dragData: boolean,
        dragX: boolean
        simulation: any
    }

    interface ChartDataSets {
        edges: ChartEdge[]
    }
}

class ChartEdge {
    constructor(
        public source: ProjectData.Node,
        public target: ProjectData.Node
    ) {}
}

@Component({
    selector: 'graph-editor',
    templateUrl: './graph-editor.component.html'
})
export class GraphEditorComponent implements AfterViewInit {
    private chart;

    private nodes: ProjectData.Node[];

    private edges: ChartEdge[];

    private labels: string[];

    @Input() public project: ProjectData;

    @ViewChild('chartEditorCanvas') canvas;

    ngAfterViewInit(): void {
        this.initializeNodes();
        this.initializeEdges();
        this.initializeLabels();
        const ctx = this.canvas.nativeElement.getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'forceDirectedGraph',
            data: {
                labels: this.labels,
                datasets: [
                    {
                        pointBackgroundColor: 'yellow',
                        pointRadius: 5,
                        data: this.nodes,
                        edges: this.edges,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                dragData: true,
                dragX: true,
                simulation: {
                    forces: {
                        link: {
                            id: (d) => d.id,
                        },
                    },
                },

                legend: {
                    display: false,
                },
                plugins: {
                    datalabels: {
                        formatter: (node) => node.index
                    }
                },
            }
        });
    }

    private initializeNodes() {
        this.nodes = [];
        for (let key in this.project.nodeMap) {
            if (this.project.nodeMap.hasOwnProperty(key)) {
                this.nodes.push(this.project.nodeMap[key]);
            }
        }
    }

    private initializeEdges() {
        this.edges = [];
        this.project.edges.forEach((edge) =>  {
            const edgeObj = new ChartEdge(
                this.project.nodeMap[edge.sourceId],
                this.project.nodeMap[edge.targetId]
            );
            this.edges.push(edgeObj);
        });
    }

    private initializeLabels() {
        this.labels = this.nodes.map((node) => {
            return `Name: ${node.name}`;
        });
    }
}
