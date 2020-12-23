export class ProjectData {
    id: string = '';

    title: string;

    nodeMap: Record<string, ProjectData.Node> = {};

    extraValueNames: string[];

    ready: boolean;

    get nodes(): ProjectData.Node[] {
        const nodes = [];
        for (let key in this.nodeMap) {
            if (this.nodeMap.hasOwnProperty(key)) {
                nodes.push(this.nodeMap[key]);
            }
        }
        return nodes;
    }

    edges: ProjectData.Edge[] = [];

    get state(): ProjectData.State {
        if (this.nodeCount > 0) {
            if (this.edgeCount > 0) {
                return ProjectData.State.Full
            } else {
                return ProjectData.State.PointCloud
            }
        } else if (this.edgeCount > 0) {
            return ProjectData.State.Invalid
        } else {
            return ProjectData.State.Empty
        }
    }

    get nodeCount(): number {
        return this.nodes.length;
    }

    get edgeCount(): number {
        return this.edges.length;
    }

    constructor() {
    }
}

export namespace ProjectData {
    export enum State
    {
        Empty,
        PointCloud,
        Full,
        Invalid,
        Ready
    }

    export class Node {
        x = 0;
        y = 0;
        personalization: number;

        extraValues: Map<string, any>

        constructor(public id: string, public name: string, pers?: number) {
            this.personalization = pers || 0;
        }
    }

    export class Edge {
        weight: number

        constructor(public source: Node, public target: Node, weight?: number) {
            this.weight = weight || 0;
        }
    }
}

export class ProjectRecord {
    id: string;
    name: string
}
