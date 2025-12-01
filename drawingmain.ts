
// drawingmain.ts

// this is the main class for our drawing interface- it combines
// all other classes and components. CONTROLLER

import { DrawingCanvas } from './drawingcanvas.js';
import { Toolbar } from './toolbar.js';
import { BrushType } from './brushstyle.js';


export type DrawMode = 'draw' | 'erase' | 'fill';

export class DrawingApp {
    public constructor(canvasID: string) {
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

    
    // all properties

    // handles all drawing operations
    protected _canvas: DrawingCanvas;
    public get canvas(): DrawingCanvas {
        return this._canvas;
    }

 
    //  handles UI controls
    protected _toolbar: Toolbar;
    public get toolbar(): Toolbar {
        return this._toolbar;
    }

 

    protected _canvasElement: HTMLCanvasElement;
    
 
    // curr drawing color  
    protected _currentColor: string;
    public get currentColor(): string {
        return this._currentColor;
    }

    public set currentColor(color: string) {
        if (color !== this._currentColor) {
            this._currentColor = color;
            this._updateCanvasState();
        }
    }

 
    // curr brush size  
    protected _brushSize: number;
    public get brushSize(): number {
        return this._brushSize;
    }

    public set brushSize(size: number) {
        if (size !== this._brushSize) {
            this._brushSize = size;
            this._updateCanvasState();
        }
    }

 
    // curr drawing mode (draw, erase, or fill)
    protected _mode: DrawMode;
    public get mode(): DrawMode {
        return this._mode;
    }

    public set mode(mode: DrawMode) {
        if (mode !== this._mode) {
            this._mode = mode;
            this._updateCanvasState();
        }
    }

 
    // curr brush type  
    protected _brushType: BrushType;
    public get brushType(): BrushType {
        return this._brushType;
    }

    public set brushType(type: BrushType) {
        if (type !== this._brushType) {
            this._brushType = type;
            this._updateCanvasState();
        }
    }

    //methods

    // propogate updates in canvas state
    protected _updateCanvasState(): void {
        this._canvas.setColor(this._currentColor);
        this._canvas.setBrushSize(this._brushSize);
        this._canvas.setMode(this._mode);
        this._canvas.setBrushType(this._brushType);
    }

 
    // clear canvas  w user validation
    public clearCanvas(): void {
        if (confirm('Clear the entire canvas?')) {
            this._canvas.clear();
        }
    }

 
    // undo with history stack.
    public undo(): void {
        this._canvas.undo();
    }

 
    // download curr drawing on canvas
    public downloadDrawing(): void {
        const link = document.createElement('a');
        link.download = 'my-drawing.png';
        link.href = this._canvasElement.toDataURL();
        link.click();
    }


}  