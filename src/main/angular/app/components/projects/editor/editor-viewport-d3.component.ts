import {AfterViewInit, Component, Input, Output, EventEmitter} from "@angular/core";
import {forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, Simulation} from 'd3-force';
import * as d3 from 'd3';
import {zoomTransform} from 'd3-zoom';
import {ChartEdge, ChartNode} from "./editor.component";
import {interval} from "rxjs";
import {AlertService} from "../../../services/alert.service";
import {PropertyMapping} from "./property-mapping";

//todo
// Save As
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

    @Input()
    public mapping: PropertyMapping;

    @Output()
    public addNode = new EventEmitter<{x: number, y: number}>();

    @Output()
    public addEdge = new EventEmitter<{source: ChartNode, target: ChartNode}>();

    @Output()
    public removeNode = new EventEmitter<ChartNode>();

    @Output()
    public selectNodes = new EventEmitter<ChartNode[]>();

    public sim: Simulation<ChartNode, undefined>;

    private canvas: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;

    private root: d3.Selection<SVGGElement, unknown, HTMLElement, any>;

    private edgeRoot: d3.Selection<SVGGElement, unknown, HTMLElement, any>;

    private nodeRoot: d3.Selection<SVGGElement, unknown, HTMLElement, any>;

    private transform: d3.ZoomTransform;

    private ready = false;

    private snapDistance = 25;

    private selectPoint: {x: number, y: number}

    private selectRect: d3.Selection<SVGRectElement, unknown, any, any>;

    private selectedNodes: ChartNode[] = [];

    private tmpAdd: ChartEdge | ChartNode;

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
            if (event.ctrlKey) {
                this.selectedNodes.push(node)
            } else {
                this.selectedNodes.forEach((n) => {
                    n.dirty = true;
                });
                this.selectedNodes = [node]
            }
            this.selectNodes.emit(this.selectedNodes);
        }
        if (this.tool == "REMOVE") {
            this.removeNode.emit(node);
        }
        event.stopPropagation();
        node.dirty = true;
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
        } else if (this.tool == "ADD") {
            if (event.active) {
                // drag in progress, update position
                const edge = <ChartEdge> this.tmpAdd;
                const point = edge.target;
                const closest = this.getClosestNode(event.x, event.y, this.snapDistance);
                if (!closest) {
                    point.x = event.x;
                    point.y = event.y;
                } else {
                    point.x = closest.x;
                    point.y = closest.y;
                }
                edge.dirty = true;
            } else if (start) {
                // drag started, create temporary edge
                this.tmpAdd = new ChartEdge(event.subject,
                    {x: event.x, y: event.y});
                this.edges.push(this.tmpAdd);
            } else {
                // drag ended
                const closest = this.getClosestNode(event.x, event.y, this.snapDistance);
                const existing = this.edges.find((edge) => {
                    return edge.source == event.subject && edge.target == closest;
                });

                // if valid node detected, create new edge
                const edge = <ChartEdge> this.tmpAdd;
                if (closest && closest != event.subject && !existing) {
                    this.addEdge.emit({
                        source: <ChartNode> edge.source,
                        target: closest
                    });
                }

                this.tmpAdd = null;
                const index = this.edges.indexOf(edge);
                this.edges.splice(index, 1);
            }
        }
    }

    private onDragCanvas(e: d3.D3DragEvent<SVGSVGElement, any, any>, start: boolean) {
        if (this.tool != "SELECT") {
            return
        }
        if (start) {
            this.selectPoint = {x: e.x, y: e.y}
            this.selectRect = this.canvas.append("rect")
                .attr("x", e.x).attr("y", e.y)
                .attr("width", 0).attr("height", 0)
                .attr("class", "selection-box");
        } else {
            let width = e.x - this.selectPoint.x
            let height = e.y - this.selectPoint.y

            if (width < 0) {
                this.selectRect.attr("width", -width).attr("x", e.x)
            } else {
                this.selectRect.attr("width", width).attr("x", this.selectPoint.x)
            }

            if (height < 0) {
                this.selectRect.attr("height", -height).attr("y", e.y);
            } else {
                this.selectRect.attr("height", height).attr("y", this.selectPoint.y);
            }
        }
        this.getSelectedNodes(e.sourceEvent.ctrlKey);
    }

    private getSelectedNodes(append?: boolean) {
        const startX = this.transform.invertX(
            parseFloat(this.selectRect.attr("x")));
        const startY = this.transform.invertY(
            parseFloat(this.selectRect.attr("y")));

        const endX = this.transform.invertX(this.selectPoint.x +
            parseFloat(this.selectRect.attr("width")));
        const endY = this.transform.invertY(this.selectPoint.y +
            parseFloat(this.selectRect.attr("height")));

        const nodesInBox = this.nodes.filter((node) => {
            return node.x > startX && node.x < endX &&
                node.y > startY && node.y < endY;
        });

        const oldSelection = this.selectedNodes;
        if (!append) {
            this.selectedNodes.forEach((n) => {
                n.dirty = true;
            });
            this.selectedNodes = nodesInBox;
        } else {
            this.selectedNodes = this.selectedNodes.concat(nodesInBox);
        }

        let selectionHasChanged = oldSelection.length != this.selectedNodes.length;
        for (let i = 0; i < oldSelection.length && !selectionHasChanged; i++) {
            selectionHasChanged = !this.selectedNodes.includes(oldSelection[i]);
        }
        if (selectionHasChanged) {
            this.selectNodes.emit(this.selectedNodes);
        }

    }

    private onMouseover(d: ChartNode) {
        this.hoverData.x = this.transform.applyX(d.x);
        this.hoverData.y = this.transform.applyY(d.y);
        this.hoverData.p = d.personalization;
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
        const dragBehavior = d3.drag()
            .filter((e) => !e.button)
            .on("start", (e) => this.onDragCanvas(e, true))
            .on("drag", (e) => this.onDragCanvas(e, false))
            .on("end", () => { this.selectRect.remove() });

        this.canvas = <d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>>
            d3.select("#canvas-" + this.id)
            .call(zoomBehavior)
            .call(dragBehavior)
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
            .on('end', () => {
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
            .on("mouseout", () => this.hoverData.show = 0);


        // refresh mapping info
        // todo find less intensive way to do this
        let dirtyCount = 0;
        nodes.each((n) => {
            if (n.dirty) {
                dirtyCount++;
            }
        })
        if (dirtyCount && this.mapping.refresh()) {
            nodes.each((n) => {
                n.dirty = true;
            })
        }

        // update values
        nodes
            .filter((node) => {
                if (node.dirty) {
                    node.dirty = false;
                    dirtyCount++;
                    return true;
                }
                return false;
            })
            .attr("class", "graph-node")
            .attr("r", 10)
            .style("fill", (n) => this.mapping.getColor(n))
            .attr("cx", (d) => { return d.x; })
            .attr("cy", (d) => { return d.y; })
            .attr("stroke", "#000")
            .attr("stroke-width", "1px")
            .attr("stroke-opacity", "0.5")
            .attr("filter", "none")
            // if the node has changed, its edges may change as well
            .each((d) => {
                this.edges.forEach((edge) => {
                    edge.dirty = edge.dirty || edge.source == d || edge.target == d;
                });
            });

        nodes
            .filter((node) => this.selectedNodes.includes(node))
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
            .each((edge) => { edge.dirty = true });

        // update values
        edges
            .filter((edge) => {
                if (edge.dirty) {
                    edge.dirty = false;
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
