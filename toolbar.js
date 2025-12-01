// Toolbar.ts
//  toolbar UI and user interactions -> VIEW
export class Toolbar {
    constructor(parent) {
        this._parent = parent;
        this._setupEventHandlers();
    }
    // event handler setup
    // sets up event handlers for toolbar controls.
    _setupEventHandlers() {
        this._setupModeButtons();
        this._setupBrushButtons();
        this._setupColorButtons();
        this._setupBrushSize();
        this._setupActionButtons();
    }
    // event handlers for drawing modes
    _setupModeButtons() {
        const drawBtn = document.getElementById('drawMode');
        const eraseBtn = document.getElementById('eraseMode');
        const fillBtn = document.getElementById('fillMode');
        if (drawBtn)
            drawBtn.onclick = () => this.setMode('draw');
        if (eraseBtn)
            eraseBtn.onclick = () => this.setMode('erase');
        if (fillBtn)
            fillBtn.onclick = () => this.setMode('fill');
    }
    // event handlers for brush styles
    _setupBrushButtons() {
        const roundBtn = document.getElementById('brushRound');
        const squareBtn = document.getElementById('brushSquare');
        const sprayBtn = document.getElementById('brushSpray');
        const calligraphyBtn = document.getElementById('brushCalligraphy');
        if (roundBtn)
            roundBtn.onclick = () => this.setBrushStyle('round');
        if (squareBtn)
            squareBtn.onclick = () => this.setBrushStyle('square');
        if (sprayBtn)
            sprayBtn.onclick = () => this.setBrushStyle('spray');
        if (calligraphyBtn)
            calligraphyBtn.onclick = () => this.setBrushStyle('calligraphy');
    }
    // event handlers for color selection/sustom color picker
    _setupColorButtons() {
        const colorButtons = document.querySelectorAll('.color-btn');
        colorButtons.forEach(btn => {
            if (btn instanceof HTMLButtonElement) {
                const color = btn.getAttribute('data-color');
                if (color) {
                    btn.onclick = () => this.setColor(color);
                }
            }
        });
        const customColor = document.getElementById('customColor');
        if (customColor instanceof HTMLInputElement) {
            customColor.onchange = () => this.setColor(customColor.value);
        }
    }
    // event handler for brush size slider
    _setupBrushSize() {
        const sizeSlider = document.getElementById('brushSize');
        if (sizeSlider instanceof HTMLInputElement) {
            sizeSlider.oninput = () => {
                const size = parseInt(sizeSlider.value);
                this._parent.brushSize = size;
                this._updateSizeDisplay(size);
            };
        }
    }
    // event handlers for action buttons  
    _setupActionButtons() {
        const clearBtn = document.getElementById('clearBtn');
        const undoBtn = document.getElementById('undoBtn');
        const saveBtn = document.getElementById('saveBtn');
        if (clearBtn)
            clearBtn.onclick = () => this._parent.clearCanvas();
        if (undoBtn)
            undoBtn.onclick = () => this._parent.undo();
        if (saveBtn)
            saveBtn.onclick = () => this._parent.downloadDrawing();
    }
    //ui updates
    // drawing mode UI update
    setMode(mode) {
        this._parent.mode = mode;
        this._updateModeButtons(mode);
    }
    //  brush style UI update
    setBrushStyle(style) {
        this._parent.brushType = style;
        this._updateBrushButtons(style);
    }
    //  drawing color UI update
    setColor(color) {
        this._parent.currentColor = color;
        this._updateColorButtons(color);
    }
    // mode buttons update
    _updateModeButtons(activeMode) {
        const buttons = document.querySelectorAll('.mode-btn');
        buttons.forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.getElementById(`${activeMode}Mode`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }
    _updateBrushButtons(activeBrush) {
        const buttons = document.querySelectorAll('[id^="brush"]');
        buttons.forEach(btn => {
            btn.classList.remove('active');
        });
        const capitalizedBrush = activeBrush.charAt(0).toUpperCase() + activeBrush.slice(1);
        const activeBtn = document.getElementById(`brush${capitalizedBrush}`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }
    _updateColorButtons(activeColor) {
        const buttons = document.querySelectorAll('.color-btn');
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn instanceof HTMLButtonElement) {
                const btnColor = btn.getAttribute('data-color');
                if (btnColor === activeColor) {
                    btn.classList.add('active');
                }
            }
        });
    }
    _updateSizeDisplay(size) {
        const display = document.getElementById('sizeDisplay');
        if (display) {
            display.textContent = size.toString();
        }
    }
}
//# sourceMappingURL=toolbar.js.map