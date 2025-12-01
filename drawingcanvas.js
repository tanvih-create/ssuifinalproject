// DrawingCanvas.ts
// handles all canvas drawing operations -> MODEL
import { BrushStyles } from './brushstyle.js';
import { FillTool } from './filltool.js';
export class DrawingCanvas {
    constructor(canvas, parent) {
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
    get canvas() {
        return this._canvas;
    }
    get ctx() {
        return this._ctx;
    }
    //event handlers
    _setupEventHandlers() {
        this._canvas.addEventListener('mousedown', (e) => this._handleMouseDown(e));
        this._canvas.addEventListener('mousemove', (e) => this._handleMouseMove(e));
        this._canvas.addEventListener('mouseup', (e) => this._handleMouseUp(e));
        this._canvas.addEventListener('mouseout', (e) => this._handleMouseUp(e));
    }
    //   mouse down event - start drawing or perform fill
    _handleMouseDown(e) {
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
    _handleMouseMove(e) {
        if (!this._isDrawing)
            return;
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
    _handleMouseUp(e) {
        if (this._isDrawing) {
            this._isDrawing = false;
            this._ctx.beginPath();
            this._saveState();
        }
    }
    //drawing methods 
    //how to draw
    _drawAtPoint(x, y) {
        if (this._mode === 'erase') {
            //destination out removes pixels bc we are in erase
            this._ctx.globalCompositeOperation = 'destination-out';
            this._ctx.strokeStyle = 'rgba(0,0,0,1)';
            this._ctx.lineCap = 'round';
            this._ctx.lineWidth = this._brushSize;
            this._ctx.lineTo(x, y);
            this._ctx.stroke();
        }
        else if (this._mode === 'draw') {
            //source overs adds pixels overs bc we are in draw
            this._ctx.globalCompositeOperation = 'source-over';
            BrushStyles.apply(this._ctx, this._brushType, this._lastX, this._lastY, x, y, this._brushSize, this._currentColor);
        }
    }
    // state managment
    // update current drawing color
    setColor(color) {
        this._currentColor = color;
    }
    //  update curr brush size
    setBrushSize(size) {
        this._brushSize = size;
    }
    //  update curr drawing mode
    setMode(mode) {
        this._mode = mode;
    }
    //  update curr brush type
    setBrushType(type) {
        this._brushType = type;
    }
    // all canvas operations

    // clear entire canvas to blank state  
    clear() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._saveState();
    }
    _saveState() {
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
    undo() {
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
//# sourceMappingURL=drawingcanvas.js.map