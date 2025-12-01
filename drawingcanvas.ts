// DrawingCanvas.ts
// handles all canvas drawing operations -> MODEL

import { DrawMode } from './drawingmain.js';
import { BrushType, BrushStyles } from './brushstyle.js';
import { FillTool } from './filltool.js';

export class DrawingCanvas {
    public constructor(canvas: HTMLCanvasElement, parent: any) {

//initila drawing state
        this._isDrawing = false;
        this._currentColor = '#667eea';
        this._brushSize = 5;
        this._mode = 'draw';
        this._brushType = 'round';
        this._lastX = 0;
        this._lastY = 0;
        
//initialize tracking history
        this._history = [];
        this._historyStep = -1;
        this._maxHistorySize = 20; //not too much otherwise mem problems
        
        this._canvas = canvas;
        this._parent = parent;
        
       
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get 2D context from canvas');
        }
        this._ctx = ctx;
        
//initial drawing properties
        this._ctx.lineCap = 'round';
        this._ctx.lineJoin = 'round';
        
         this._setupEventHandlers();
        
        // Save initial (blank) state
        this._saveState();
    }

//properties

    //  our canvas element  
    protected _canvas: HTMLCanvasElement;
    public get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

 
    // drawing context
    protected _ctx: CanvasRenderingContext2D;
    public get ctx(): CanvasRenderingContext2D {
        return this._ctx;
    }

 
    protected _parent: any;
    
 
    // are we drawing flag
    protected _isDrawing: boolean;
    
 
    protected _currentColor: string;
    
 
    protected _brushSize: number;
    
 
    protected _mode: DrawMode;
    
 
    protected _brushType: BrushType;
    
 
    // last mouseX position
    protected _lastX: number;
    
 
    // last mouseY position
    protected _lastY: number;
    
 
    // string array of dataURLS for history stack
    protected _history: string[];
    
 
    // current step in history stack
    protected _historyStep: number;
    
 
    protected _maxHistorySize: number;

  //event handlers

    
  
    protected _setupEventHandlers(): void {
        this._canvas.addEventListener('mousedown', (e) => this._handleMouseDown(e));
        this._canvas.addEventListener('mousemove', (e) => this._handleMouseMove(e));
        this._canvas.addEventListener('mouseup', (e) => this._handleMouseUp(e));
        this._canvas.addEventListener('mouseout', (e) => this._handleMouseUp(e));
    }

 
    //   mouse down event - start drawing or perform fill
    protected _handleMouseDown(e: MouseEvent): void {
        const rect = this._canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // perform flood fill and return early
        if (this._mode === 'fill') {
            FillTool.floodFill(this._ctx, this._canvas, x, y, this._currentColor);
            this._saveState();
            return;
        }
        
         this._isDrawing = true;
        this._lastX = x;
        this._lastY = y;
        
        this._ctx.beginPath();
        this._ctx.moveTo(x, y);
    }

 
    //  mouse move event - continue drawing if mouse is down
    protected _handleMouseMove(e: MouseEvent): void {
        if (!this._isDrawing) return;
        
        const rect = this._canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this._drawAtPoint(x, y);
        
        this._ctx.beginPath();
        this._ctx.moveTo(x, y);
        this._lastX = x;
        this._lastY = y;
    }

 
    //   mouse up event - stop drawing and save state
    protected _handleMouseUp(e: MouseEvent): void {
        if (this._isDrawing) {
            this._isDrawing = false;
            this._ctx.beginPath();
            this._saveState();
        }
    }

//drawing methods 

    //how to draw
    protected _drawAtPoint(x: number, y: number): void {
        if (this._mode === 'erase') {
            //destination out removes pixels bc we are in erase
            this._ctx.globalCompositeOperation = 'destination-out';
            this._ctx.strokeStyle = 'rgba(0,0,0,1)';
            this._ctx.lineCap = 'round';
            this._ctx.lineWidth = this._brushSize;
            this._ctx.lineTo(x, y);
            this._ctx.stroke();
        } else if (this._mode === 'draw') {
            //source overs adds pixels overs bc we are in draw
            this._ctx.globalCompositeOperation = 'source-over';
            
            BrushStyles.apply(
                this._ctx,
                this._brushType,
                this._lastX,
                this._lastY,
                x,
                y,
                this._brushSize,
                this._currentColor
            );
        }
    }

    // state managment

    // update current drawing color
    public setColor(color: string): void {
        this._currentColor = color;
    }

 
    //  update curr brush size
    public setBrushSize(size: number): void {
        this._brushSize = size;
    }

 
    //  update curr drawing mode
    public setMode(mode: DrawMode): void {
        this._mode = mode;
    }

 
    //  update curr brush type
    public setBrushType(type: BrushType): void {
        this._brushType = type;
    }

   
    // all canvas operations
    // Clear the entire canvas to blank state and save to history
    public clear(): void {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._saveState();
    }

 


    protected _saveState(): void {
        this._historyStep++;
        

        if (this._historyStep < this._history.length) {
            this._history.length = this._historyStep;
        }
        
        // add current state to history
        this._history.push(this._canvas.toDataURL());
        
        //  remove oldest entries
        if (this._history.length > this._maxHistorySize) {
            this._history.shift();
            this._historyStep--;
        }
    }

 
    // restoring prev canvas state from stack
    public undo(): void {
        if (this._historyStep > 0) {
            this._historyStep--;
            const img = new Image();
            img.src = this._history[this._historyStep];
            img.onload = () => {
                this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
                this._ctx.drawImage(img, 0, 0);
            };
        }
    }

    

}  
