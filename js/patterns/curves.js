export const curvePatterns = {
    hilbert: {
        name: "Hilbert Curve",
        category: "Curves & L-Systems",
        desc: "A space-filling continuous fractal line.",
        formula: "L-System: A, B substitutions",
        minDepth: 0, maxDepth: 7, defaultDepth: 5,
        draw: (ctx, canvas, depth) => {
            if (depth === 0) return;
            const size = Math.min(canvas.width, canvas.height) * 0.8;
            let hilbertState = {
                x: canvas.width/2 - size/2,
                y: canvas.height/2 - size/2
            };
            const step = size / (Math.pow(2, depth) - 1);
            ctx.beginPath();
            ctx.moveTo(hilbertState.x, hilbertState.y);
            drawHilbert(ctx, hilbertState, step, depth, 0);
            ctx.strokeStyle = '#00f2ff';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    },
    dragon: {
        name: "Dragon Curve",
        category: "Curves & L-Systems",
        desc: "A paper-folding fractal that creates a complex dragon-like path.",
        formula: "(1+i)^n (Iterative folding)",
        minDepth: 0, maxDepth: 14, defaultDepth: 10,
        draw: (ctx, canvas, depth) => {
            if (depth === 0) return;
            const size = Math.min(canvas.width, canvas.height) * 0.6;
            ctx.beginPath();
            let state = { x: canvas.width/2 - size/3, y: canvas.height/2 + size/4 };
            ctx.moveTo(state.x, state.y);
            drawDragon(ctx, state, size, 0, depth, 1);
            ctx.strokeStyle = '#ff0055'; ctx.stroke();
        }
    },
    levy: {
        name: "Lévy C Curve",
        category: "Curves & L-Systems",
        desc: "A self-similar fractal curve formed by 45-degree rotations.",
        formula: "L(n) = f1(L(n-1)) + f2(L(n-1))",
        minDepth: 0, maxDepth: 14, defaultDepth: 10,
        draw: (ctx, canvas, depth) => {
            if (depth === 0) return;
            const size = Math.min(canvas.width, canvas.height) * 0.4;
            ctx.beginPath();
            let state = { x: canvas.width/2 - size/2, y: canvas.height/2 + size/2 };
            ctx.moveTo(state.x, state.y);
            drawLevy(ctx, state, size, 0, depth);
            ctx.strokeStyle = '#00ff88'; ctx.stroke();
        }
    },
    peano: {
        name: "Peano Curve",
        category: "Curves & L-Systems",
        desc: "A classic space-filling curve that tiles a plane.",
        formula: "f1...f9 recursive tiling",
        minDepth: 1, maxDepth: 5, defaultDepth: 3,
        draw: (ctx, canvas, depth) => {
            const size = Math.min(canvas.width, canvas.height) * 0.8;
            ctx.beginPath();
            ctx.moveTo(canvas.width/2 - size/2, canvas.height/2 - size/2);
            drawPeano(ctx, canvas.width/2 - size/2, canvas.height/2 - size/2, size, 0, depth);
            ctx.strokeStyle = '#00f2ff'; ctx.stroke();
        }
    }
};

function drawHilbert(ctx, state, step, d, type) {
    if(d === 0) return;
    if(type === 0) {
        drawHilbert(ctx, state, step, d-1, 1);
        hLine(ctx, state, 0, 1, step);
        drawHilbert(ctx, state, step, d-1, 0);
        hLine(ctx, state, 1, 0, step);
        drawHilbert(ctx, state, step, d-1, 0);
        hLine(ctx, state, 0, -1, step);
        drawHilbert(ctx, state, step, d-1, 3);
    } else if(type === 1) {
        drawHilbert(ctx, state, step, d-1, 0);
        hLine(ctx, state, 1, 0, step);
        drawHilbert(ctx, state, step, d-1, 1);
        hLine(ctx, state, 0, 1, step);
        drawHilbert(ctx, state, step, d-1, 1);
        hLine(ctx, state, -1, 0, step);
        drawHilbert(ctx, state, step, d-1, 2);
    } else if(type === 2) {
        drawHilbert(ctx, state, step, d-1, 3);
        hLine(ctx, state, 0, -1, step);
        drawHilbert(ctx, state, step, d-1, 2);
        hLine(ctx, state, -1, 0, step);
        drawHilbert(ctx, state, step, d-1, 2);
        hLine(ctx, state, 0, 1, step);
        drawHilbert(ctx, state, step, d-1, 1);
    } else {
        drawHilbert(ctx, state, step, d-1, 2);
        hLine(ctx, state, -1, 0, step);
        drawHilbert(ctx, state, step, d-1, 3);
        hLine(ctx, state, 0, -1, step);
        drawHilbert(ctx, state, step, d-1, 3);
        hLine(ctx, state, 1, 0, step);
        drawHilbert(ctx, state, step, d-1, 0);
    }
}
function hLine(ctx, state, dx, dy, s) {
    state.x += dx * s; state.y += dy * s; ctx.lineTo(state.x, state.y);
}

function drawDragon(ctx, state, l, a, d, sign) {
    if(d === 0) {
        const nx = state.x + Math.cos(a * Math.PI / 180) * l;
        const ny = state.y + Math.sin(a * Math.PI / 180) * l;
        ctx.lineTo(nx, ny);
        state.x = nx; state.y = ny;
        return;
    }
    const nl = l / Math.sqrt(2);
    drawDragon(ctx, state, nl, a + 45 * sign, d - 1, 1);
    drawDragon(ctx, state, nl, a - 45 * sign, d - 1, -1);
}

function drawLevy(ctx, state, l, a, d) {
    if(d === 0) {
        const nx = state.x + Math.cos(a * Math.PI / 180) * l;
        const ny = state.y + Math.sin(a * Math.PI / 180) * l;
        ctx.lineTo(nx, ny);
        state.x = nx; state.y = ny;
        return;
    }
    const nl = l / Math.sqrt(2);
    drawLevy(ctx, state, nl, a + 45, d - 1);
    drawLevy(ctx, state, nl, a - 45, d - 1);
}

function drawPeano(ctx, x, y, s, a, d) {
    if(d === 0) return;
    const ns = s / 3;
    drawPeano(ctx, x, y, ns, a, d-1);
    drawPeano(ctx, x + ns, y, ns, a, d-1);
    drawPeano(ctx, x + 2*ns, y, ns, a, d-1);
    drawPeano(ctx, x + 2*ns, y + ns, ns, a, d-1);
    drawPeano(ctx, x + ns, y + ns, ns, a, d-1);
    drawPeano(ctx, x, y + ns, ns, a, d-1);
    drawPeano(ctx, x, y + 2*ns, ns, a, d-1);
    drawPeano(ctx, x + ns, y + 2*ns, ns, a, d-1);
    drawPeano(ctx, x + 2*ns, y + 2*ns, ns, a, d-1);
}
