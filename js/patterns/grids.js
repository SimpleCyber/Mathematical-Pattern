export const gridPatterns = {
    tsquare: {
        name: "T-Square",
        category: "Grids & Subdivisions",
        desc: "Squares centered at the corners of their parent.",
        formula: "f(n+1) = s/2 at four corners",
        minDepth: 0, maxDepth: 7, defaultDepth: 5,
        draw: (ctx, canvas, depth) => {
            const side = Math.min(canvas.width, canvas.height) * 0.4;
            drawTSquare(ctx, canvas.width/2, canvas.height/2, side, depth);
        }
    },
    box: {
        name: "Box Fractal",
        category: "Grids & Subdivisions",
        desc: "Subdivided squares forming a cross-like grid pattern.",
        formula: "5^n squares subdivision",
        minDepth: 0, maxDepth: 6, defaultDepth: 4,
        draw: (ctx, canvas, depth) => {
            const size = Math.min(canvas.width, canvas.height) * 0.7;
            drawBox(ctx, canvas.width/2 - size/2, canvas.height/2 - size/2, size, depth);
        }
    },
    mondrian: {
        name: "Recursive Mondrian",
        category: "Grids & Subdivisions",
        desc: "Randomized rectangular subdivisions in primary colors.",
        formula: "Random Split P(x,y)",
        minDepth: 0, maxDepth: 7, defaultDepth: 4,
        draw: (ctx, canvas, depth) => {
            const w = canvas.width * 0.6;
            const h = canvas.height * 0.6;
            drawMondrian(ctx, canvas.width/2 - w/2, canvas.height/2 - h/2, w, h, depth);
        }
    },
    vicsek: {
        name: "Vicsek Fractal",
        category: "Grids & Subdivisions",
        desc: "A cross-based subdivision of a square grid.",
        formula: "Cross Replacement r=1/3",
        minDepth: 0, maxDepth: 6, defaultDepth: 4,
        draw: (ctx, canvas, depth) => {
            const size = Math.min(canvas.width, canvas.height) * 0.7;
            drawVicsek(ctx, canvas.width/2 - size/2, canvas.height/2 - size/2, size, depth);
        }
    },
    snowflake: {
        name: "Recursive Hexagon",
        category: "Grids & Subdivisions",
        desc: "Star-like patterns branching from a central hexagon.",
        formula: "6^n satellite hulls",
        minDepth: 0, maxDepth: 6, defaultDepth: 4,
        draw: (ctx, canvas, depth) => {
            const size = Math.min(canvas.width, canvas.height) * 0.15;
            drawHexagon(ctx, canvas.width/2, canvas.height/2, size, depth);
        }
    },
    cantor: {
        name: "Cantor Set",
        category: "Grids & Subdivisions",
        desc: "Middle-third removal from line segments, repeated infinitely.",
        formula: "C = C/3 ∪ (C/3 + 2/3)",
        minDepth: 0, maxDepth: 8, defaultDepth: 5,
        draw: (ctx, canvas, depth) => {
            const w = canvas.width * 0.8;
            const x = canvas.width / 2 - w / 2;
            drawCantor(ctx, x, 150, w, depth);
        }
    },
    carpet: {
        name: "Sierpiński Carpet",
        category: "Grids & Subdivisions",
        desc: "A square based version of the Sierpiński triangle.",
        formula: "8^n squares subdivision",
        minDepth: 0, maxDepth: 5, defaultDepth: 4,
        draw: (ctx, canvas, depth) => {
            const size = Math.min(canvas.width, canvas.height) * 0.7;
            drawCarpet(ctx, canvas.width/2 - size/2, canvas.height/2 - size/2, size, depth);
        }
    },
    pyramid: {
        name: "Sierpinski Pyramid",
        category: "Grids & Subdivisions",
        desc: "A 2D projection of the 3D Sierpinski tetrahedron.",
        formula: "4^n tetrahedron scaling",
        minDepth: 0, maxDepth: 7, defaultDepth: 5,
        draw: (ctx, canvas, depth) => {
            const size = Math.min(canvas.width, canvas.height) * 0.6;
            drawPyramid(ctx, canvas.width/2, canvas.height/2 - size/3, size, depth);
        }
    },
    cross: {
        name: "Cross Fractal",
        category: "Grids & Subdivisions",
        desc: "Recursive cross subdivision shaping a geometric square.",
        formula: "Grid subdivision (Cross r=1/3)",
        minDepth: 0, maxDepth: 6, defaultDepth: 4,
        draw: (ctx, canvas, depth) => {
            const size = Math.min(canvas.width, canvas.height) * 0.7;
            drawCross(ctx, canvas.width/2 - size/2, canvas.height/2 - size/2, size, depth);
        }
    }
};

function drawTSquare(ctx, x, y, s, d) {
    if(d === 0) return;
    ctx.strokeStyle = '#00ff88';
    ctx.strokeRect(x - s/2, y - s/2, s, s);
    const ns = s/2;
    drawTSquare(ctx, x-ns, y-ns, ns, d-1);
    drawTSquare(ctx, x+ns, y-ns, ns, d-1);
    drawTSquare(ctx, x-ns, y+ns, ns, d-1);
    drawTSquare(ctx, x+ns, y+ns, ns, d-1);
}

function drawBox(ctx, x, y, s, d) {
    if(d === 1) {
        ctx.strokeStyle = '#00f2ff';
        ctx.strokeRect(x, y, s, s);
        return;
    }
    const ns = s / 3;
    drawBox(ctx, x, y, ns, d-1);
    drawBox(ctx, x + 2*ns, y, ns, d-1);
    drawBox(ctx, x + ns, y + ns, ns, d-1);
    drawBox(ctx, x, y + 2*ns, ns, d-1);
    drawBox(ctx, x + 2*ns, y + 2*ns, ns, d-1);
}

function drawMondrian(ctx, x, y, w, h, d) {
    if(d === 0) {
        const colors = ['#f00', '#ff0', '#00f', '#fff', '#000'];
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = '#000'; ctx.lineWidth = 4; ctx.strokeRect(x, y, w, h);
        return;
    }
    if(w > h) {
        const split = 0.3 + Math.random() * 0.4;
        drawMondrian(ctx, x, y, w * split, h, d-1);
        drawMondrian(ctx, x + w * split, y, w * (1-split), h, d-1);
    } else {
        const split = 0.3 + Math.random() * 0.4;
        drawMondrian(ctx, x, y, w, h * split, d-1);
        drawMondrian(ctx, x, y + h * split, w, h * (1-split), d-1);
    }
}

function drawVicsek(ctx, x, y, s, d) {
    if(d === 1) {
        ctx.strokeStyle = '#00ff88'; ctx.strokeRect(x, y, s, s);
        return;
    }
    const ns = s/3;
    drawVicsek(ctx, x + ns, y, ns, d-1);
    drawVicsek(ctx, x, y + ns, ns, d-1);
    drawVicsek(ctx, x + ns, y + ns, ns, d-1);
    drawVicsek(ctx, x + 2*ns, y + ns, ns, d-1);
    drawVicsek(ctx, x + ns, y + 2*ns, ns, d-1);
}

function drawHexagon(ctx, x, y, s, d) {
    if(d === 0) return;
    ctx.strokeStyle = '#00f2ff';
    ctx.beginPath();
    for(let i=0; i<6; i++) {
        const a = i * Math.PI / 3;
        const px = x + Math.cos(a) * s;
        const py = y + Math.sin(a) * s;
        if(i===0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath(); ctx.stroke();
    const ns = s * 0.45;
    for(let i=0; i<6; i++) {
        const a = i * Math.PI / 3;
        drawHexagon(ctx, x + Math.cos(a) * s, y + Math.sin(a) * s, ns, d-1);
    }
}

function drawCantor(ctx, x, y, w, d) {
    if(d === 0) return;
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.stroke();
    if(d > 1) {
        drawCantor(ctx, x, y + 40, w / 3, d-1);
        drawCantor(ctx, x + 2*w/3, y + 40, w / 3, d-1);
    }
}

function drawCarpet(ctx, x, y, s, d) {
    if(d === 0) { ctx.fillStyle = '#00f2ff'; ctx.fillRect(x, y, s, s); return; }
    const ns = s / 3;
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            if(i===1 && j===1) continue;
            drawCarpet(ctx, x + i*ns, y + j*ns, ns, d-1);
        }
    }
}

function drawPyramid(ctx, x, y, s, d) {
    if(d === 0) {
        ctx.strokeStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(x, y); ctx.lineTo(x + s/2, y + s); ctx.lineTo(x - s/2, y + s); ctx.closePath(); ctx.stroke();
        return;
    }
    const ns = s / 2;
    drawPyramid(ctx, x, y, ns, d-1);
    drawPyramid(ctx, x - ns/2, y + ns, ns, d-1);
    drawPyramid(ctx, x + ns/2, y + ns, ns, d-1);
    drawPyramid(ctx, x, y + ns/2, ns, d-1);
}

function drawCross(ctx, x, y, s, d) {
    if (d === 1) { ctx.strokeStyle = '#fff'; ctx.strokeRect(x, y, s, s); return; }
    const ns = s / 3;
    drawCross(ctx, x + ns, y, ns, d-1);
    drawCross(ctx, x, y + ns, ns, d-1);
    drawCross(ctx, x + ns, y + ns, ns, d-1);
    drawCross(ctx, x + 2*ns, y + ns, ns, d-1);
    drawCross(ctx, x + ns, y + 2*ns, ns, d-1);
}
