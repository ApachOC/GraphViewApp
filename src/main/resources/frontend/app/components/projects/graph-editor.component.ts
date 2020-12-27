import {AfterViewInit, Component, ElementRef, Input, ViewChild} from "@angular/core";
//import * as Chart from 'chart.js';
//import 'chartjs-chart-graph';
//import 'chartjs-plugin-datalabels';
//import 'chartjs-plugin-dragdata';
import {ProjectData} from "../../models/project-models";
import {forceCenter, forceLink, forceManyBody, forceSimulation, Simulation} from 'd3-force';
import * as d3 from 'd3';
/*
declare module 'chart.js' {

    interface ChartOptions {
        dragData: boolean,
        dragX: boolean
    }

    interface ChartDataSets {
        edges: ChartEdge[]
    }
}
*/
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

    public sim: Simulation<ProjectData.Node, undefined>;

    private svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;

    private transform;

    @Input() public project: ProjectData;

    @ViewChild('chartEditorCanvas') canvas: ElementRef;

    ngAfterViewInit(): void {
        this.initializeNodes();
        this.initializeEdges();
        this.initializeLabels();
        this.initializeD3();
    }

    public brekMe() {
        this.sim.tick(100);
    }

    private initializeD3() {
        this.svg = d3.select("#graph-editor-canvas")
            .append("svg")
            .attr("width", 1200)
            .attr("height", 600)
            .call(d3.zoom().on("zoom", e => {
                this.svg.attr("transform", (this.transform = e.transform));
                this.svg.style("stroke-width", 3 / Math.sqrt(this.transform.k));
            }))
            .on("contextmenu", (d, i) => {
                d.preventDefault();
            })
            .append("g");
        const link = this.svg.selectAll("line")
            .data(this.edges).enter()
            .append("line")
            .style("stroke", "#aaa");
        const node = this.svg.selectAll("circle")
            .data(this.nodes).enter()
            .append("circle")
            .attr("r", 10)
            .style("fill", "#69b3a2");
        forceSimulation(this.nodes)
            .force('link', forceLink(this.edges))
            .force('center', forceCenter(600, 300))
            .force('charge', forceManyBody())
            .on('end', ticked);

        function ticked() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        }

    }

    private initializeChart() {
        // const ctx = this.canvas.nativeElement.getContext('2d');
        // this.chart = new Chart(ctx, {
        //     type: 'graph',
        //     data: {
        //         labels: this.labels,
        //         datasets: [
        //             {
        //                 pointBackgroundColor: 'yellow',
        //                 pointRadius: 5,
        //                 data: this.nodes,
        //                 edges: this.edges,
        //             },
        //         ],
        //     },
        //     options: {
        //         responsive: true,
        //         maintainAspectRatio: false,
        //         dragData: true,
        //         dragX: true,
        //
        //         legend: {
        //             display: false,
        //         },
        //         plugins: {
        //             datalabels: {
        //                 formatter: (node) => node.name
        //             }
        //         },
        //     }
        // });
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
