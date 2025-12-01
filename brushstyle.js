// BrushStyles.ts
// different brush style implementations
export class BrushStyles {
    //static methods
    static apply(ctx, brushType, x1, y1, x2, y2, size, color) {
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
            case 'calligraphy':
                this.drawCalligraphy(ctx, x1, y1, x2, y2, size, color);
                break;
        }
    }
    //same as square, just diff line cap type
    static drawRound(ctx, x, y, size, color) {
        ctx.strokeStyle = color;
        ctx.lineCap = 'round';
        ctx.lineWidth = size;
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    //same as round, just diff line cap type
    static drawSquare(ctx, x, y, size, color) {
        ctx.strokeStyle = color;
        ctx.lineCap = 'square';
        ctx.lineWidth = size;
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    // spray
    static drawSpray(ctx, x, y, radius, color) {
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
    static drawCalligraphy(ctx, x1, y1, x2, y2, width, color) {
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const perpAngle = angle + Math.PI / 2;
        const w = width * 0.3;
        const h = width;
        ctx.save();
        ctx.fillStyle = color;
        ctx.translate(x2, y2);
        ctx.rotate(perpAngle);
        ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.restore();
    }
}
//# sourceMappingURL=brushstyle.js.map