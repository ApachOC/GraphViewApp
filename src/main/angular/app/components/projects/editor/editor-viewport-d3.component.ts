import {AfterViewInit, Component, DoCheck, Input, Output, EventEmitter, OnChanges} from "@angular/core";
import {forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, Simulation} from 'd3-force';
import * as d3 from 'd3';
import {zoomTransform} from 'd3-zoom';
import {ChartEdge, ChartNode} from "./editor.component";
import {interval} from "rxjs";
import {AlertService} from "../../../services/alert.service";

//todo
// Save As
// Multiselect
// Size by rank

@Component({
    selector: 'editor-viewport-d3',
    template: `
        <div class="spinner-overlay" *ngIf="!initialized">
            <div class="spinner-border"></div>
        </div>
        <div id="graph-editor-tooltip-{{id}}" class="d3-tooltip"
             [style]="{'left': hoverData.x + 'px', 'top': hoverData.y + 'px', 'opacity': hoverData.show}">
            <span>Name: {{ hoverData.name }}<br>
                Personalization: {{ hoverData.p }}</span>
        </div>
        <svg class="graph-editor-canvas" id="canvas-{{id}}">
            <defs>
                <filter id="select-filter-{{id}}" width="125%" height="125%">
                    <feGaussianBlur result="blurOut" in="offOut" stdDeviation="0.8" />
                    <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                </filter>
                <marker id= "arrow-{{id}}" viewBox="0 -5 10 10" refX="20" orient="auto" markerWidth="10" markerHeight="10">
                    <path d="M 0,-5 L 10,0 L 0,5"></path>
                </marker>
            </defs>
        </svg>
    `
})
export class EditorViewportD3Component implements AfterViewInit {

    @Input()
    public id: string;

    @Input()
    public nodes: ChartNode[];

    @Input()
    public edges: ChartEdge[];

    @Input()
    public tool = "SELECT";

    @Output()
    public addNode =new EventEmitter<{x: number, y: number}>();

    @Output()
    public addEdge = new EventEmitter<{source: ChartNode, target: ChartNode}>();

    @Output()
    public removeNode = new EventEmitter<ChartNode>();

    public sim: Simulation<ChartNode, undefined>;

    private canvas: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;

    private root: d3.Selection<SVGGElement, unknown, HTMLElement, any>;

    private edgeRoot: d3.Selection<SVGGElement, unknown, HTMLElement, any>;

    private nodeRoot: d3.Selection<SVGGElement, unknown, HTMLElement, any>;

    private transform: d3.ZoomTransform;

    private ready = false;

    private snapDistance = 25;

    private selection: ChartNode | ChartEdge;

    private dirtyNodes: ChartNode[] = [];

    private dirtyEdges: ChartEdge[] = [];

    public hoverData: any = {}; //{ name: string, x: number, y: number, p: number, show: number }

    public initialized = false;

    constructor(private alerts: AlertService) { }

    ngAfterViewInit(): void {
        this.initializeD3();

        // hacky-ish but for some unknown reason Angular digest triggers before d3 events
        interval(1/60).subscribe(() => {
            this.updateNodes();
            this.updateEdges();
        });
    }

    /**
     * Handle node click event.
     * If the SELECT tool is selected highlight the node and show additional info.
     * If the REMOVE tool is selected remove the node and all connected edges.
     * @param event Mouse click event
     * @param node Target node
     * @private
     */
    private onClickNode(event: MouseEvent, node: ChartNode) {
        if (this.tool == "SELECT") {
            if (this.selection instanceof ChartNode) {
                this.dirtyNodes.push(this.selection);
            }
            this.selection = node;
        }
        if (this.tool == "REMOVE") {
            this.removeNode.emit(node);
        }
        event.stopPropagation();
        this.dirtyNodes.push(node);
    }

    /**
     * Handle SVG canvas click event.
     * If the ADD tool is selected add new node to the click coords.
     * @param event Mouse click event
     * @private
     */
    private onClickCanvas(event: MouseEvent) {
        if (this.tool == "ADD") {
            this.addNode.emit({
                x: this.transform.invertX(event.offsetX),
                y: this.transform.invertY(event.offsetY)
            });
        }
    }

    /**
     * Node drag event handler.
     * If the SELECT tool is selected move the node to the drag coords.
     * If the ADD tool is selected attempt to create new edge between this and node under cursor.
     * @see tool
     * @param event The event
     * @param start Whether the drag just started
     * @private
     */
    private onDragNode(event: d3.D3DragEvent<SVGCircleElement, any, ChartNode>, start: boolean) {
        if (this.tool == "SELECT") {
            event.subject.x = event.x;
            event.subject.y = event.y;
            this.dirtyNodes.push(event.subject);
        } else if (this.tool == "ADD") {
            if (event.active) {
                // drag in progress, update position
                const edge = <ChartEdge> this.selection;
                const point = edge.target;
                const closest = this.getClosestNode(event.x, event.y, this.snapDistance);
                if (!closest) {
                    point.x = event.x;
                    point.y = event.y;
                } else {
                    point.x = closest.x;
                    point.y = closest.y;
                }
                this.dirtyEdges.push(edge);
            } else if (start) {
                // drag started, create temporary edge
                this.selection = new ChartEdge(event.subject,
                    {x: event.x, y: event.y});
                this.edges.push(this.selection);
            } else {
                // drag ended
                const closest = this.getClosestNode(event.x, event.y, this.snapDistance);
                const existing = this.edges.find((edge) => {
                    return edge.source == event.subject && edge.target == closest;
                });

                // if valid node detected, create new edge
                const edge = <ChartEdge>this.selection;
                if (closest && closest != event.subject && !existing) {
                    this.addEdge.emit({
                        source: <ChartNode> edge.source,
                        target: closest
                    });
                }

                this.selection = null;
                const index = this.edges.indexOf(edge);
                this.edges.splice(index, 1);
            }
        }
    }

    private onMouseover(d: ChartNode) {
        this.hoverData.x = this.transform.applyX(d.x);
        this.hoverData.y = this.transform.applyY(d.y);
        this.hoverData.p = d.data.personalization;
        this.hoverData.name = d.data.name;
        this.hoverData.show = 0.8;
    }

    /**
     * Initialize primary D3 elements.
     * Setup canvas event handlers and any utility elements.
     * @private
     */
    private initializeD3() {
        const zoomBehavior = d3.zoom()
            .filter((e) => {
                switch (e.type) {
                    case "mousedown":
                        return !e.ctrlKey && (e.button === 2 || e.button === 1)
                    case "wheel":
                        return e.button === 0
                    default:
                        return false
                }
            })
            .on("zoom", e => this.root.attr("transform", (this.transform = e.transform)));

        this.canvas = <d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>>
            d3.select("#canvas-" + this.id)
            .call(zoomBehavior)
            .on("contextmenu", (d) => { if (!d.ctrlKey) d.preventDefault()})
            .on("click", (e) => this.onClickCanvas(e));

        // insert container elements
        this.root = this.canvas.append("g");
        this.edgeRoot = this.root.append("g");
        this.nodeRoot = this.root.append("g");

        // calculate canvas dimensions
        const offset = document.getElementById("project-body").getBoundingClientRect().y;
        this.canvas.style("height", `calc(100vh - ${offset}px)`);
        const dimensions = this.canvas.node().getBoundingClientRect();
        this.canvas.call(zoomBehavior.transform,
            d3.zoomIdentity.translate(dimensions.width / 2, dimensions.height / 2));

        // get default transform
        this.transform = zoomTransform(this.canvas.node());

        // setup layout simulation
        this.sim = forceSimulation(this.nodes)
            .force('link', forceLink(this.edges).distance(80))
            .force('center', forceCenter(0, 0))
            .force('charge', forceManyBody().strength(-20).distanceMax(100))
            .force('collide', forceCollide().radius(50))
            .alphaMin(0.1)
            .on('tick', () => {
                if (!this.initialized) {
                    this.dirtyNodes = this.dirtyNodes.concat(this.nodes)
                }
            })
            .on('end', () => {
                this.dirtyNodes = this.dirtyNodes.concat(this.nodes)
                if (this.initialized) {
                    this.alerts.pushAlert("info", "Graph layout was recalculated.")
                } else {
                    this.initialized = true;
                }
            });

        this.ready = true;
    }

    /**
     * Clear, reinitialize and redraw nodes
     * Setup event handlers
     * @private
     */
    private updateNodes() {
        // get selection
        const nodes = this.nodeRoot
            .selectAll(".graph-node")
            .data(this.nodes, (d: ChartNode) => d.data.id);

        // clear nodes
        nodes.exit().remove();

        // append new nodes
        nodes
            .enter()
            .append("circle")
            .attr("class", "graph-node")
            .call(d3.drag()
                .on('start', (e) => this.onDragNode(e, true))
                .on('drag', (e) => this.onDragNode(e, false))
                .on('end', (e) => this.onDragNode(e, false))
            )
            .on("click", (e, d) => this.onClickNode(e, d))
            .on("mouseover", (e: MouseEvent, d) => this.onMouseover(d))
            .on("mouseout", (e, d) => this.hoverData.show = 0)
            .each((d) => this.dirtyNodes.push(d));

        // update values
        nodes
            .filter((node) => {
                const index = this.dirtyNodes.indexOf(node);
                if (index >= 0) {
                    this.dirtyNodes.splice(index, 1);
                    return true;
                }
                return false;
            })
            .attr("class", "graph-node")
            .attr("r", 10)
            .style("fill", "cadetblue")
            .attr("cx", (d) => { return d.x; })
            .attr("cy", (d) => { return d.y; })
            .attr("stroke", "#000")
            .attr("stroke-width", "1px")
            .attr("stroke-opacity", "0.5")
            .attr("filter", "none")
            // if the node has changed, its edges may change as well
            .each((d) => {
                this.dirtyEdges = this.dirtyEdges.concat(
                    this.edges.filter((edge) => edge.source == d || edge.target == d)
                );
            });

        nodes
            .filter((node) => node == this.selection)
            .attr("class", "graph-node selected")
            .attr("filter", `url(#select-filter-${this.id})`);
    }


    /**
     * Clear, reinitialize and redraw edges
     * @private
     */
    private updateEdges() {
        // get selection
        const edges = this.edgeRoot
            .selectAll(".graph-edge")
            .data(this.edges, (e: ChartEdge) => e.id);

        // clear edges
        edges.exit().remove();

        // append new edges
        edges
            .enter()
            .append("line")
            .attr('marker-end',`url(#arrow-${this.id})`)
            .attr("class", "graph-edge")
            .style("stroke", "#aaa")
            .each((edge) => {
                const index = this.dirtyEdges.indexOf(edge);
                if (index < 0) {
                    this.dirtyEdges.push(edge);
                }
            });

        // update values
        edges
            .filter((edge) => {
                const index = this.dirtyEdges.indexOf(edge);
                if (index >= 0) {
                    this.dirtyEdges.splice(index, 1);
                    return true;
                }
                return false;
            })
            .attr("x1", (d) => { return d.source.x; })
            .attr("y1", (d) => { return d.source.y; })
            .attr("x2", (d) => { return d.target.x; })
            .attr("y2", (d) => { return d.target.y; });
    }

    /**
     * Get node closest to the given coords
     * @param x X Coordinate
     * @param y Y Coordinate
     * @param maxDistance If the closest element is further than this distance return null.
     * @private
     */
    private getClosestNode(x: number, y: number, maxDistance?: number) {
        let closest = this.nodes[0];
        let dist = Number.MAX_VALUE;
        this.nodes.forEach((node) => {
            const thisDist = Math.sqrt(
                Math.pow(node.x - x, 2) +
                Math.pow(node.y - y, 2)
            );
            if (thisDist < dist) {
                closest = node;
                dist = thisDist;
            }
        });

        if (!maxDistance || dist < maxDistance) {
            return closest;
        } else {
            return null;
        }
    }
}
