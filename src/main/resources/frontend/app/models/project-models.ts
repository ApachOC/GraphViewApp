export class ProjectData {
    id: string = '';

    title: string;

    nodeMap = new Map<string, ProjectData.Node>();

    get nodes(): ProjectData.Node[] {
        return Array.from(this.nodeMap.values())
    }

    edges: ProjectData.Edge[] = [];

    ready: boolean = false;

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
        return this.nodeMap.size;
    }

    get edgeCount(): number {
        return this.edges.length;
    }

    constructor(title:string) {
        this.title = title;
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

        otherValues: Map<string, any>

        static valueNames: string[];

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
