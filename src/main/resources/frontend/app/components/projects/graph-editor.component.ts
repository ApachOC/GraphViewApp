import {AfterViewInit, Component, Input, OnInit, ViewChild} from "@angular/core";
import * as Chart from 'chart.js';
import 'chartjs-chart-graph';
import 'chartjs-plugin-datalabels';
import 'chartjs-plugin-dragdata';
import {ProjectData} from "../../services/project-manager.service";

declare module 'chart.js' {
    interface ChartOptions {
        dragData: boolean,
        dragX: boolean
        simulation: any
    }
    interface ChartDataSets {
        edges: any
    }
}

@Component({
    selector: 'graph-editor',
    templateUrl: './graph-editor.component.html'
})
export class GraphEditorComponent implements AfterViewInit {
    private chart;

    @Input() public project: ProjectData;

    @ViewChild('chartEditorCanvas') canvas;

    private get labels(): string[] {
        return this.project.nodes.map((node) => {
           return `Name: ${node.name}`;
        });
    }

    ngAfterViewInit(): void {
        const ctx = this.canvas.nativeElement.getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'forceDirectedGraph',
            data: {
                labels: this.labels,
                datasets: [
                    {
                        pointBackgroundColor: 'yellow',
                        pointRadius: 5,
                        data: this.project.nodes,
                        edges: this.project.edges,
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
                        formatter: (node) => node.id
                    }
                },
            }
        });
    }
}
