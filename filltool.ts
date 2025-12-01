// FillTool.ts
// Flood fill algorithm implementation
export class FillTool {
    
    
   // all static methods
    public static floodFill(
        ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
        startX: number,
        startY: number,
        fillColor: string
    ): void {
         startX = Math.floor(startX);
        startY = Math.floor(startY);
        
         const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        const width = canvas.width;
        const height = canvas.height;
        
         const fillRGB = this.hexToRgb(fillColor);
        if (!fillRGB) return;
        
         const startPos = (startY * width + startX) * 4;
        const startR = pixels[startPos];
        const startG = pixels[startPos + 1];
        const startB = pixels[startPos + 2];
        const startA = pixels[startPos + 3];
        
         if (startR === fillRGB.r && startG === fillRGB.g && startB === fillRGB.b) {
            return;
        }
        
         const stack: [number, number][] = [[startX, startY]];
        const visited = new Set<string>();
        
         while (stack.length > 0) {
            const point = stack.pop();
            if (!point) continue;
            
            const [x, y] = point;
            const key = `${x},${y}`;
            
            //skip if visted or out of bounds
            if (visited.has(key)) continue;
            if (x < 0 || x >= width || y < 0 || y >= height) continue;
            
            // curr pixel color
            const pos = (y * width + x) * 4;
            const r = pixels[pos];
            const g = pixels[pos + 1];
            const b = pixels[pos + 2];
            const a = pixels[pos + 3];
            
            // does pixel match starting color
            if (r === startR && g === startG && b === startB && a === startA) {
                visited.add(key);
                
                //new color
                pixels[pos] = fillRGB.r;
                pixels[pos + 1] = fillRGB.g;
                pixels[pos + 2] = fillRGB.b;
                pixels[pos + 3] = 255;
                
                 stack.push([x + 1, y]);
                stack.push([x - 1, y]);
                stack.push([x, y + 1]);
                stack.push([x, y - 1]);
            }
        }
        
    
        ctx.putImageData(imageData, 0, 0);
    }

   //hex to rgb convertor
    protected static hexToRgb(hex: string): {r: number, g: number, b: number} | null {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
}