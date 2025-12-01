export class FlowerTool {
    
    
    // in this class, the function drawFlower draws a six petal flower
    
    public static drawFlower(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        size: number,
        color: string
    ): void {
        //even when user selected size is small flowers are still big
        const petalLength = size * 1.5;
        const petalWidth = size * 0.6;
        
        ctx.save();
        ctx.fillStyle = color;
        ctx.translate(x, y);
        
        //six petals- 60deg a part
        for (let i = 0; i < 6; i++) {
            ctx.save();
            ctx.rotate((i * Math.PI) / 3);  
            
            // draws petal (ellipse)
            ctx.beginPath();
            ctx.ellipse(0, -petalLength / 2, petalWidth / 2, petalLength / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
        
        //center of circle drawing
        ctx.fillStyle = '#FFD700';  // Gold center
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}