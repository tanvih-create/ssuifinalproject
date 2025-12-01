// BrushStyles.ts
// different brush style implementations

export type BrushType = 'round' | 'square' | 'spray' | 'stipple';
export class BrushStyles {
   //static methods
    
    public static apply(
        ctx: CanvasRenderingContext2D,
        brushType: BrushType,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        size: number,
        color: string
    ): void {
        switch (brushType) {
            case 'round':
                this.drawRound(ctx, x2, y2, size, color);
                break;
            case 'square':
                this.drawSquare(ctx, x2, y2, size, color);
                break;
            case 'spray':
                this.drawSpray(ctx, x2, y2, size, color);
                break;
            case 'stipple':
                this.drawStipple(ctx, x1, y1, x2, y2, size, color);
                break;
        }
    }

 
       //same as square, just diff line cap type
    protected static drawRound(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        size: number,
        color: string
    ): void {
        ctx.strokeStyle = color;
        ctx.lineCap = 'round';
        ctx.lineWidth = size;
        ctx.lineTo(x, y);
        ctx.stroke();
    }

 
            //same as round, just diff line cap type
protected static drawSquare(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        size: number,
        color: string
    ): void {
        ctx.strokeStyle = color;
        ctx.lineCap = 'square';
        ctx.lineWidth = size;
        ctx.lineTo(x, y);
        ctx.stroke();
    }

 
    // spray
    protected static drawSpray(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        radius: number,
        color: string
    ): void {
//higher density = more random particles
        const density = 15; 
        //draw randomized particles in a circle
        for (let i = 0; i < density; i++) {
            // random circle pos
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * radius;
            const px = x + Math.cos(angle) * distance;
            const py = y + Math.sin(angle) * distance;
            
            ctx.fillStyle = color;
            ctx.fillRect(px, py, 1, 1);
        }
    }

 
    
    protected static drawStipple(
        ctx: CanvasRenderingContext2D,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        size: number,
        color: string
    ): void {
         const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < size * 0.5) return;
        
        //circle at curr position
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x2, y2, size / 2, 0, Math.PI * 2);
        ctx.fill();
    }

   

}