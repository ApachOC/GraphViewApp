import {AfterViewInit, Component, DoCheck, Input, Output, EventEmitter} from "@angular/core";
import {forceCenter, forceLink, forceManyBody, forceSimulation, Simulation} from 'd3-force';
import * as d3 from 'd3';
import {zoomTransform} from 'd3-zoom';
import {ChartEdge, ChartNode} from "./editor.component";

@Component({
    selector: 'editor-viewport-d3',
    template: `<div class="graph-editor-viewer-canvas">
        <svg id="canvas-{{id}}">
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
    </div>`
})
export class EditorViewportD3Component implements AfterViewInit, DoCheck {

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

    private width = 1200;

    private height = 600;

    private snapDistance = 25;

    private selection: ChartNode | ChartEdge;

    ngAfterViewInit(): void {
        this.initializeLabels();
        this.initializeD3();
    }

    ngDoCheck() {
        if (!this.ready) {
            return;
        }
        this.updateEdges();
        this.updateNodes();
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
            this.selection = node;
        }
        if (this.tool == "REMOVE") {
            this.removeNode.emit(node);
        }
        event.stopPropagation();
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
            this.updateNodes();
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
        } else if (this.tool == "ADD") {
            if (event.active) {
                const point = (<ChartEdge>this.selection).target;
                const closest = this.getClosestNode(event.x, event.y, this.snapDistance);
                if (!closest) {
                    point.x = event.x;
                    point.y = event.y;
                } else {
                    point.x = closest.x;
                    point.y = closest.y;
                }
            } else if (start) {
                this.selection = new ChartEdge(event.subject,
                    {x: event.x, y: event.y});
                this.edges.push(this.selection);
            } else {
                const closest = this.getClosestNode(event.x, event.y, this.snapDistance);
                const existing = this.edges.find((edge) => {
                    return edge.source == event.subject && edge.target == closest;
                });
                const edge = <ChartEdge>this.selection;
                if (closest && closest != event.subject && !existing) {
                    this.addEdge.emit({
                        source: <ChartNode> edge.source,
                        target: closest
                    });
                } else {
                    this.selection = null;
                }
                this.edges.splice(this.edges.indexOf(edge), 1);
                this.updateEdges();
            }
        }
    }

    /**
     * Initialize primary D3 elements.
     * Setup canvas event handlers and any utility elements.
     * @private
     */
    private initializeD3() {
        this.canvas = <d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>>
            d3.select("#canvas-" + this.id)
            .attr("width", this.width)
            .attr("height", this.height)
            .call(d3.zoom()
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
                .on("zoom", e => this.root.attr("transform", (this.transform = e.transform)))
            )
            .on("contextmenu", (d) => { if (!d.ctrlKey) d.preventDefault()})
            .on("click", (e) => this.onClickCanvas(e));

        // get default transform
        this.transform = zoomTransform(this.canvas.node());

        this.root = this.canvas.append("g");
        this.edgeRoot = this.root.append("g");
        this.nodeRoot = this.root.append("g");

        this.sim = forceSimulation(this.nodes)
            .force('link', forceLink(this.edges))
            .force('center', forceCenter(this.width/2, this.height/2))
            .force('charge', forceManyBody())
            .alphaMin(0.1);

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
            .data(this.nodes);

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
            .on("click", (e, d) => this.onClickNode(e, d));

        // update values
        nodes
            .attr("class", "graph-node")
            .attr("r", 10)
            .style("fill", "cadetblue")
            .attr("cx", (d) => { return d.x; })
            .attr("cy", (d) => { return d.y; })
            .attr("stroke", "#000")
            .attr("stroke-width", "1px")
            .attr("stroke-opacity", "0.5")
            .attr("filter", "none");

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
            .data(this.edges)


        // clear edges
        edges.exit().remove();

        // append new edges
        edges
            .enter()
            .append("line")
            .attr('marker-end',`url(#arrow-${this.id})`)
            .attr("class", "graph-edge");

        // update values
        edges
            .style("stroke", "#aaa")
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

    private initializeLabels() {
        // this.labels = this.nodes.map((node) => {
        //     return `Name: ${node.name}`;
        // });
    }
}
