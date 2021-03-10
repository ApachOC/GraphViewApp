import {ProjectData} from "../../../models/project-models";
import {ChartNode} from "./editor.component";
import Node = ProjectData.Node;

export enum PropertyMapperProp {
    PERSONALIZATION,
    X,
    Y
}

export enum PropertyMapperColorRange {
    HEATMAP ,
    UNIQUE
}

export class PropertyMapping {

    private _colorProp: string | PropertyMapperProp | null;

    public get colorProp() {
        return this._colorProp;
    }

    public set colorProp(value) {
        this._colorProp = value;
        this._colorNormal = this.calculateNormalization();
    };

    private _colorPropIndex: number;

    get colorPropIndex(): number {
        return this._colorPropIndex;
    }

    set colorPropIndex(value: number) {
        this._colorPropIndex = value;
        this._colorNormal = this.calculateNormalization();
    }

    public colorRange: string | PropertyMapperColorRange = "#5f9ea0";

    private _colorNormal: [number, number];

    //todo also implement size mapping

    constructor(private project: ProjectData) {
        this.colorProp = PropertyMapperProp.PERSONALIZATION;
    }

    public getColor(node: ChartNode | Node) {
        if (node instanceof ChartNode) {
            node = node.data;
        }
        const value = this.getNormalizedValue(node, this.colorProp);
        if (typeof this.colorRange == "string") {
            const colors = this.colorRange.match(/\w\w/g).map((c) => parseInt(c, 16));
            let output = "#";
            for (let color of colors) {
                output += Math.round(255 + (color - 255) * value).toString(16).padStart(2, '0');
            }
            return output;
        } else {
            //todo implement individual methods
        }
    }

    public refresh() {
        const old = this._colorNormal;
        this._colorNormal = this.calculateNormalization();
        return old[0] != this._colorNormal[0] || old[1] != this._colorNormal[1];
    }

    private calculateNormalization(): [number, number] {
        let min = Number.MAX_VALUE, max = 0;
        for (let node of this.project.nodes) {
            const value = this.getPropValue(node, this.colorProp);
            min = Math.min(value, min);
            max = Math.max(value, max);
        }
        if (min == max) {
            return [0, 1]
        } else {
            return [min, 1 / (max - min)]
        }
    }

    private getPropValue(node: Node, prop: string | PropertyMapperProp) {
        if (typeof prop == "string") {
            return parseFloat(node.extraValues[prop][this.colorPropIndex]);
        } else if(prop === PropertyMapperProp.PERSONALIZATION) {
            return node.personalization;
        } else {
            return 1;
        }
    }

    private getNormalizedValue(node: Node, prop: string | PropertyMapperProp) {
        const value = this.getPropValue(node, prop);
        const normalized = (value - this._colorNormal[0]) * this._colorNormal[1];
        return Math.max(Math.min(normalized, 1), 0);
    }
}
