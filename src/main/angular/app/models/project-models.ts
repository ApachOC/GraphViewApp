export class ProjectData {
    id: string = '';

    title: string;

    nodes: ProjectData.Node[] = [];

    ready: boolean;

    edges: ProjectData.Edge[] = [];

    showResults: [string, number] | null;

    history: Record<string, number[]> = {};

    get nodeCount(): number {
        return this.nodes.length
    }

    get edgeCount(): number {
        return this.edges.length;
    }

    constructor() {
    }
}

export namespace ProjectData {
    export class Node {
        x = 0;
        y = 0;
        personalization = 1;

        extraValues: Record<string, Record<number, string>> = {};

        constructor(public id: string, public name: string) { }
    }

    export class Edge {
        weight: number

        constructor(public sourceId: string, public targetId: string, weight?: number) {
            this.weight = weight || 1.0;
        }
    }
}

export class ProjectRecord {
    id: string;
    name: string
}
