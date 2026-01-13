export const classicPatterns = {
    pythagoras: {
        name: "Pythagoras Tree",
        category: "Classic Fractals",
        desc: "Squares that branch out based on the Pythagorean theorem.",
        formula: "a² + b = c² (Recursive Squares)",
        minDepth: 0, maxDepth: 20, defaultDepth: 8,
        draw: (ctx, canvas, depth, angle) => {
            const side = Math.min(canvas.width, canvas.height) * 0.15;
            drawSquare(ctx, canvas, canvas.width/2 - side/2, canvas.height - 100, side, 0, depth, angle);
        }
    },
    htree: {
        name: "H-Tree",
        category: "Classic Fractals",
        desc: "Recursive line segments connected to form the letter 'H'.",
        formula: "L = L/√2 per iteration",
        minDepth: 0, maxDepth: 10, defaultDepth: 6,
        draw: (ctx, canvas, depth) => {
            const size = Math.min(canvas.width, canvas.height) * 0.4;
            drawHTree(ctx, canvas.width/2, canvas.height/2, size, true, depth);
        }
    },
    sierpinski: {
        name: "Sierpiński Triangle",
        category: "Classic Fractals",
        desc: "A triangle subdivided into smaller equilateral triangles.",
        formula: "3^n triangles subdivision",
        minDepth: 0, maxDepth: 9, defaultDepth: 7,
        draw: (ctx, canvas, depth) => {
            const size = Math.min(canvas.width, canvas.height) * 0.8;
            const h = size * Math.sqrt(3) / 2;
            drawSierpinski(ctx, canvas.width/2, (canvas.height - h)/2, size, depth);
        }
    },
    koch: {
        name: "Koch Snowflake",
        category: "Classic Fractals",
        desc: "A closed curve formed by infinite inward/outward spikes.",
        formula: "L = (4/3)^n perimeter",
        minDepth: 0, maxDepth: 6, defaultDepth: 4,
        draw: (ctx, canvas, depth) => {
            const size = Math.min(canvas.width, canvas.height) * 0.7;
            const p1 = { x: canvas.width/2 - size/2, y: canvas.height/2 + size/3 };
            const p2 = { x: canvas.width/2 + size/2, y: canvas.height/2 + size/3 };
            const p3 = { x: canvas.width/2, y: canvas.height/2 - size * 0.6 };
            drawKochLine(ctx, p1, p2, depth);
            drawKochLine(ctx, p2, p3, depth);
            drawKochLine(ctx, p3, p1, depth);
        }
    },
    tree: {
        name: "Fractal Tree",
        category: "Classic Fractals",
        desc: "The classic branching structure of organic natural trees.",
        formula: "2^n branching with sin/cos",
        minDepth: 0, maxDepth: 13, defaultDepth: 10,
        draw: (ctx, canvas, depth, angle) => {
            const len = canvas.height * 0.25;
            drawBranch(ctx, canvas.width/2, canvas.height - 80, len, -90, depth, angle);
        }
    },
    binary: {
        name: "Binary Tree",
        category: "Classic Fractals",
        desc: "Perfectly symmetrical binary splits at fixed angles.",
        formula: "θ = ±30°, L = 0.7L",
        minDepth: 0, maxDepth: 20, defaultDepth: 8,
        draw: (ctx, canvas, depth) => {
            drawBinary(ctx, canvas.width/2, canvas.height - 100, canvas.height * 0.2, -90, depth);
        }
    }
};

function drawSquare(ctx, canvas, x, y, s, a, d, ang) {
    if(d === 0 || s < 2) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a * Math.PI / 180);
    const hue = 200 + (d * 10);
    ctx.strokeStyle = `hsla(${hue}, 100%, 60%, 0.8)`;
    ctx.shadowBlur = 5; ctx.shadowColor = `hsla(${hue}, 100%, 60%, 0.5)`;
    ctx.strokeRect(0, 0, s, -s);
    ctx.restore();

    const s1 = s * Math.cos(ang * Math.PI / 180);
    const s2 = s * Math.sin(ang * Math.PI / 180);
    const x1 = x + Math.cos((a - 90) * Math.PI / 180) * s;
    const y1 = y + Math.sin((a - 90) * Math.PI / 180) * s;
    const x2 = x1 + Math.cos((a - 90 + ang) * Math.PI / 180) * s1;
    const y2 = y1 + Math.sin((a - 90 + ang) * Math.PI / 180) * s1;

    drawSquare(ctx, canvas, x1, y1, s1, a - ang, d-1, ang);
    drawSquare(ctx, canvas, x2, y2, s2, a + (90 - ang), d-1, ang);
}

function drawSierpinski(ctx, x, y, s, d) {
    if(d === 0) return;
    const h = s * Math.sqrt(3) / 2;
    ctx.strokeStyle = '#ffcc00';
    ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(x + s/2, y + h); ctx.lineTo(x-s/2, y+h); ctx.closePath(); ctx.stroke();
    if(d > 1) {
        drawSierpinski(ctx, x, y, s/2, d-1);
        drawSierpinski(ctx, x - s/4, y + h/2, s/2, d-1);
        drawSierpinski(ctx, x + s/4, y + h/2, s/2, d-1);
    }
}

function drawHTree(ctx, x, y, s, h, d) {
    if(d === 0) return;
    ctx.strokeStyle = '#f200ff';
    ctx.beginPath();
    if(h) {
        ctx.moveTo(x - s/2, y); ctx.lineTo(x + s/2, y);
        ctx.stroke();
        drawHTree(ctx, x - s/2, y, s/Math.sqrt(2), false, d-1);
        drawHTree(ctx, x + s/2, y, s/Math.sqrt(2), false, d-1);
    } else {
        ctx.moveTo(x, y - s/2); ctx.lineTo(x, y + s/2);
        ctx.stroke();
        drawHTree(ctx, x, y - s/2, s/Math.sqrt(2), true, d-1);
        drawHTree(ctx, x, y + s/2, s/Math.sqrt(2), true, d-1);
    }
}

function drawKochLine(ctx, p1, p2, d) {
    if(d === 0) {
        ctx.strokeStyle = '#00ffcc';
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
        return;
    }
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const a = { x: p1.x + dx/3, y: p1.y + dy/3 };
    const c = { x: p1.x + 2*dx/3, y: p1.y + 2*dy/3 };
    const angle = -Math.PI / 3;
    const b = {
        x: a.x + (c.x - a.x) * Math.cos(angle) - (c.y - a.y) * Math.sin(angle),
        y: a.y + (c.x - a.x) * Math.sin(angle) + (c.y - a.y) * Math.cos(angle)
    };
    drawKochLine(ctx, p1, a, d-1);
    drawKochLine(ctx, a, b, d-1);
    drawKochLine(ctx, b, c, d-1);
    drawKochLine(ctx, c, p2, d-1);
}

function drawBranch(ctx, x, y, l, a, d, ang) {
    if(d === 0) return;
    const x2 = x + Math.cos(a * Math.PI / 180) * l;
    const y2 = y + Math.sin(a * Math.PI / 180) * l;
    ctx.strokeStyle = `hsla(${200 + d * 10}, 80%, 60%, ${d/8})`;
    ctx.lineWidth = d * 0.5;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
    drawBranch(ctx, x2, y2, l * 0.75, a - ang, d-1, ang);
    drawBranch(ctx, x2, y2, l * 0.75, a + ang, d-1, ang);
}

function drawBinary(ctx, x, y, l, a, d) {
    if(d === 0) return;
    const x2 = x + Math.cos(a * Math.PI / 180) * l;
    const y2 = y + Math.sin(a * Math.PI / 180) * l;
    ctx.strokeStyle = '#fff'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
    drawBinary(ctx, x2, y2, l * 0.7, a - 30, d-1);
    drawBinary(ctx, x2, y2, l * 0.7, a + 30, d-1);
}
