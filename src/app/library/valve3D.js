import Template from "./template";
import paper from "paper";

export  default class Valve3D extends Template{
    constructor(){
        super();
    }

    __setupDefinitions() {
        this.__unique = {
            "position": "Point"
        };

        this.__heritable = {
            "orientation": "String",
            "valveRadius": "Float",
            "height": "Float",
            "gap": "Float",
            "width": "Float",
            "length": "Float",
            "rotation": "Float"
        };

        this.__defaults = {
            "orientation": "V",
            "valveRadius": 1.2 * 1000,
            "height": .8 * 1000,
            "gap": 0.6 * 1000,
            "width": 2.4 * 1000,
            "length": 2.4 * 1000,
            "rotation": 0
        };


        this.__units = {
            "orientation": "",
            "valveRadius": "&mu;m",
            "height": "&mu;m",
            "gap": "&mu;m",
            "width": "&mu;m",
            "length": "&mu;m",
            "rotation": "&deg;"
        };

        this.__minimum = {
            "valveRadius": .1 * 100,
            "height": .1 * 100,
            "gap": .5 * 10,
            "rotation": 0
        };

        this.__maximum = {
            "valveRadius": .2 * 10000,
            "height": 1.2 * 1000,
            "gap": .1 * 10000,
            "rotation": 180
        };

        this.__featureParams = {
            position: "position",
            rotation: "rotation",
            radius1: "valveRadius",
            radius2: "valveRadius",
            valveRadius: "valveRadius",
            gap: "gap"
        };

        this.__targetParams = {
            position: "position",
            rotation: "rotation",
            radius1: "valveRadius",
            radius2: "valveRadius",
            valveRadius: "valveRadius",
            gap: "gap"
        };

        this.__placementTool = "MultilayerPositionTool";

        this.__toolParams = {
            position: "position"
        };

    }

    __drawFlow(params){
        let position = params["position"];
        let gap = params["gap"];
        let radius = params["valveRadius"];
        let color = params["color"];
        let orientation = params["orientation"];
        let rotation = params["rotation"];

        let center = new paper.Point(position[0], position[1]);
        // let h0p0, h0p1, h0p2, h1p0, h1p1, h1p2;
        let circ = new paper.Path.Circle(center, radius);
        //circ.fillColor = color;
        //   if (String(color) == "3F51B5") {
        let cutout = paper.Path.Rectangle({
            from: new paper.Point(position[0] - radius, position[1] - gap / 2),
            to: new paper.Point(position[0] + radius, position[1] + gap / 2)
        });
        //cutout.fillColor = "white";
        let valve = circ.subtract(cutout);
        valve.rotate(rotation, center);
        valve.fillColor = color;
        return valve;


    }

    __drawControll(params){
        let position = params["position"];
        let gap = params["gap"];
        let radius = params["valveRadius"];
        let color = params["color"];
        let orientation = params["orientation"];
        let center = new paper.Point(position[0], position[1]);
        // let h0p0, h0p1, h0p2, h1p0, h1p1, h1p2;
        let circ = new paper.Path.Circle(center, radius);
        circ.fillColor = color;
        return circ;

    }

    render2D(params, key) {
        if(key == "FLOW"){
            return this.__drawFlow(params);
        }else if(key == "CONTROL"){
            return this.__drawControll(params);
        }
    }

    render2DTarget(key, params){
        let render = this.render2D(params, "FLOW");
        render.fillColor.alpha = 0.5;
        return render;
    }
}