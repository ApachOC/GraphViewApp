import {ProjectData} from "../../../models/project-models";
import {ChartNode} from "./editor.component";
import Node = ProjectData.Node;

export type PropertyMappingInfo = [string | null, number]

export class PropertyMapping {

    private _colorProperty: PropertyMappingInfo = [null, 0];

    public get colorProperty() {
        return this._colorProperty;
    }

    public set colorProperty(value: [string | null, number]) {
        this._colorProperty = value;
        this._colorNormal = this.calculateNormalization(this._colorProperty);
    };

    public colorRange: [string, string] = ["#D7E7E7" ,"#5F9EA0"];

    private _colorNormal: [number, number] = [0, 0];

    private _sizeProperty: [string | null, number] = [null, 0];

    public get sizeProperty() {
        return this._sizeProperty;
    }

    public set sizeProperty(value) {
        this._sizeProperty = value;
        this._sizeNormal = this.calculateNormalization(this._sizeProperty);
    };

    public sizeRange: [number, number] = [10, 50];

    private _sizeNormal: [number, number];

    constructor(private project: ProjectData) {}

    public getColor(node: ChartNode | Node) {
        if (node instanceof ChartNode) {
            node = node.data;
        }
        const value = this.getNormalizedValue(node, this.colorProperty, this._colorNormal);
        const lowCols = this.colorRange[0].match(/\w\w/g).map((c) => parseInt(c, 16));
        const hiCols = this.colorRange[1].match(/\w\w/g).map((c) => parseInt(c, 16));
        let output = "#";
        for (let i = 0; i < Math.min(lowCols.length, hiCols.length); i++) {
            output += Math.round(lowCols[i] + (hiCols[i] - lowCols[i]) * value).toString(16).padStart(2, '0');
        }
        return output;
    }

    public getSize(node: ChartNode | Node) {
        if (node instanceof ChartNode) {
            node = node.data;
        }
        const value = this.getNormalizedValue(node, this.colorProperty, this._sizeNormal);
        return this.sizeRange[0] + (this.sizeRange[1] - this.sizeRange[0]) * value;
    }

    public refresh() {
        const old = this._colorNormal;
        this._colorNormal = this.calculateNormalization(this.colorProperty);
        this._sizeNormal = this.calculateNormalization(this.sizeProperty);
        return old[0] != this._colorNormal[0] || old[1] != this._colorNormal[1];
    }

    private calculateNormalization(prop: PropertyMappingInfo): [number, number] {
        let min = Number.MAX_VALUE, max = 0;
        for (let node of this.project.nodes) {
            const value = this.getPropValue(node, prop);
            min = Math.min(value, min);
            max = Math.max(value, max);
        }
        if (min == max) {
            return [0, max]
        } else {
            return [min, 1 / (max - min)]
        }
    }

    private getPropValue(node: Node, prop: PropertyMappingInfo) {
        if (prop[0] != null && prop[0] in node.extraValues && prop[1] in node.extraValues[prop[0]]) {
            return parseFloat(node.extraValues[prop[0]][prop[1]]);
        } else {
            return 0;
        }
    }

    private getNormalizedValue(node: Node, prop: PropertyMappingInfo, normal: [number, number]) {
        const value = this.getPropValue(node, prop);
        const normalized = (value - normal[0]) * normal[1];
        return Math.max(Math.min(normalized, 1), 0);
    }
}
