// drawingmain.ts
// this is the main class for our drawing interface- it combines
// all other classes and components. CONTROLLER
import { DrawingCanvas } from './drawingcanvas.js';
import { Toolbar } from './toolbar.js';
export class DrawingApp {
    constructor(canvasID) {
        // starting state
        this._currentColor = '#6280ebff';
        this._brushSize = 5;
        this._mode = 'draw';
        this._brushType = 'round';
        // get canvas element
        const canvasEl = document.getElementById(canvasID);
        if (!canvasEl || !(canvasEl instanceof HTMLCanvasElement)) {
            throw new Error(`Cannot find canvas with id: ${canvasID}`);
        }
        this._canvasElement = canvasEl;
        this._canvas = new DrawingCanvas(this._canvasElement, this);
        this._toolbar = new Toolbar(this);
        // Set initial state on canvas
        this._updateCanvasState();
    }

    //getters
    get canvas() {
        return this._canvas;
    }
    get toolbar() {
        return this._toolbar;
    }
    get currentColor() {
        return this._currentColor;
    }
    set currentColor(color) {
        if (color !== this._currentColor) {
            this._currentColor = color;
            this._updateCanvasState();
        }
    }
    get brushSize() {
        return this._brushSize;
    }
    set brushSize(size) {
        if (size !== this._brushSize) {
            this._brushSize = size;
            this._updateCanvasState();
        }
    }
    get mode() {
        return this._mode;
    }
    set mode(mode) {
        if (mode !== this._mode) {
            this._mode = mode;
            this._updateCanvasState();
        }
    }
    get brushType() {
        return this._brushType;
    }
    set brushType(type) {
        if (type !== this._brushType) {
            this._brushType = type;
            this._updateCanvasState();
        }
    }
    //methods
    // propogate updates in canvas state
    _updateCanvasState() {
        this._canvas.setColor(this._currentColor);
        this._canvas.setBrushSize(this._brushSize);
        this._canvas.setMode(this._mode);
        this._canvas.setBrushType(this._brushType);
    }
    // clear canvas  w user validation
    clearCanvas() {
        if (confirm('Clear the entire canvas?')) {
            this._canvas.clear();
        }
    }
    // undo with history stack.
    undo() {
        this._canvas.undo();
    }
    // download curr drawing on canvas
    downloadDrawing() {
        const link = document.createElement('a');
        link.download = 'my-drawing.png';
        link.href = this._canvasElement.toDataURL();
        link.click();
    }
}
//# sourceMappingURL=drawingmain.js.map