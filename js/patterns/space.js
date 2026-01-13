import { getSeededRandom } from '../utils.js';

export const spacePatterns = {
    barnsley: {
        name: "Barnsley Fern",
        category: "Space & Nature",
        desc: "A stochastic fractal resembling a natural spleenwort leaf.",
        formula: "f(x,y) = Affine Transforms",
        minDepth: 100, maxDepth: 20000, defaultDepth: 10000,
        isPixel: true,
        draw: (ctx, canvas, depth, angle, camera) => {
            drawBarnsley(ctx, canvas, depth, camera);
        }
    },
    nebula: {
        name: "Nebula Cloud",
        category: "Space & Nature",
        desc: "Recursive misty circles simulating deep space gas clouds.",
        formula: "Gaussian Radius Jitter",
        minDepth: 0, maxDepth: 8, defaultDepth: 5,
        draw: (ctx, canvas, depth) => {
            drawNebula(ctx, canvas.width/2, canvas.height/2, canvas.width*0.3, depth);
        }
    },
    web: {
        name: "Cosmic Web",
        category: "Space & Nature",
        desc: "Large-scale node connections forming a universal filament structure.",
        formula: "Iterative Node Linking",
        minDepth: 0, maxDepth: 6, defaultDepth: 4,
        draw: (ctx, canvas, depth) => {
            drawWeb(ctx, canvas.width/2, canvas.height/2, canvas.width*0.4, depth);
        }
    },
    cluster: {
        name: "Star Cluster",
        category: "Space & Nature",
        desc: "Dense grouping of recursive glowing stars in the void.",
        formula: "Stochastic Node Jitter",
        minDepth: 0, maxDepth: 7, defaultDepth: 5,
        draw: (ctx, canvas, depth) => {
            drawCluster(ctx, canvas.width/2, canvas.height/2, canvas.width*0.35, depth);
        }
    },
    horizon: {
        name: "Event Horizon",
        category: "Space & Nature",
        desc: "A warped recursive grid spiraling into a central singularity.",
        formula: "Perspective Warp 1/r",
        minDepth: 0, maxDepth: 100, defaultDepth: 40,
        draw: (ctx, canvas, depth) => {
            drawHorizon(ctx, canvas.width/2, canvas.height/2, canvas.width*0.4, depth);
        }
    },
    constellation: {
        name: "Celestial Constellation",
        category: "Space & Nature",
        desc: "Randomized star clusters connected by proximity graphs.",
        formula: "P(n) = λⁿ e⁻λ / n!",
        minDepth: 5, maxDepth: 50, defaultDepth: 20,
        draw: (ctx, canvas, depth) => {
            drawConstellation(ctx, canvas, depth);
        }
    }
};

function drawBarnsley(ctx, canvas, depth, camera) {
    let x = 0, y = 0;
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = '#00ff88';
    const centerX = w / 2 + camera.x;
    const centerY = h - 20 + camera.y;
    for(let i=0; i<depth; i++) {
        const r = Math.random();
        let nx, ny;
        if(r < 0.01) { nx = 0; ny = 0.16 * y; }
        else if(r < 0.86) { nx = 0.85 * x + 0.04 * y; ny = -0.04 * x + 0.85 * y + 1.6; }
        else if(r < 0.93) { nx = 0.2 * x - 0.26 * y; ny = 0.23 * x + 0.22 * y + 1.6; }
        else { nx = -0.15 * x + 0.28 * y; ny = 0.26 * x + 0.24 * y + 0.44; }
        x = nx; y = ny;
        ctx.fillRect(centerX + x * 60 * camera.zoom, centerY - y * 60 * camera.zoom, 1, 1);
    }
}

function drawNebula(ctx, x, y, r, d) {
    if (d === 0) return;
    const hue = 260 + (Math.random() * 60);
    ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.05)`;
    ctx.shadowBlur = 40; ctx.shadowColor = `hsla(${hue}, 100%, 50%, 0.2)`;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    for(let i=0; i<3; i++) {
        const nr = r * 0.6;
        const na = Math.random() * Math.PI * 2;
        drawNebula(ctx, x + Math.cos(na) * r * 0.5, y + Math.sin(na) * r * 0.5, nr, d-1);
    }
}

function drawWeb(ctx, x, y, s, d) {
    if(d === 0) return;
    const nodes = [];
    for(let i=0; i<5; i++) {
        nodes.push({
            x: x + (Math.random() - 0.5) * s,
            y: y + (Math.random() - 0.5) * s
        });
    }
    ctx.strokeStyle = 'rgba(100, 200, 255, 0.2)';
    ctx.lineWidth = d * 0.2;
    ctx.beginPath();
    nodes.forEach((p, i) => {
        nodes.forEach((p2, j) => {
            if(i !== j) { ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); }
        });
    });
    ctx.stroke();
    nodes.forEach(p => drawWeb(ctx, p.x, p.y, s * 0.4, d-1));
}

function drawCluster(ctx, x, y, s, d) {
    if(d === 0) return;
    for(let i=0; i<8; i++) {
        const px = x + (Math.random() - 0.5) * s;
        const py = y + (Math.random() - 0.5) * s;
        const size = Math.random() * 2;
        const hue = 180 + Math.random() * 100;
        ctx.fillStyle = `hsla(${hue}, 100%, 80%, ${d/7})`;
        ctx.shadowBlur = 10; ctx.shadowColor = ctx.fillStyle;
        ctx.fillRect(px, py, size, size);
        if(d > 1) drawCluster(ctx, px, py, s * 0.3, d-1);
    }
}

function drawHorizon(ctx, cx, cy, r, d) {
    if(d === 0) return;
    ctx.strokeStyle = `rgba(255, 100, 255, ${d/10})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for(let i=0; i<12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const x1 = cx + Math.cos(a) * r;
        const y1 = cy + Math.sin(a) * r;
        const x2 = cx + Math.cos(a + 0.5) * r * 0.8;
        const y2 = cy + Math.sin(a + 0.5) * r * 0.8;
        ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    }
    ctx.stroke();
    drawHorizon(ctx, cx, cy, r * 0.8, d-1);
}

function drawConstellation(ctx, canvas, numStars) {
    const w = canvas.width, h = canvas.height;
    const seededRandom = getSeededRandom(42);

    const points = [];
    for(let i=0; i<numStars; i++) {
        points.push({
            x: seededRandom() * w,
            y: seededRandom() * h,
            size: 0.5 + seededRandom() * 2,
            opacity: 0.3 + seededRandom() * 0.7
        });
    }

    ctx.strokeStyle = 'rgba(0, 242, 255, 0.15)';
    ctx.lineWidth = 1;
    const maxDist = Math.min(w, h) * 0.2;
    for(let i=0; i<points.length; i++) {
        let connections = 0;
        for(let j=i+1; j<points.length; j++) {
            const d = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
            if(d < maxDist && connections < 3) {
                ctx.beginPath();
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(points[j].x, points[j].y);
                ctx.stroke();
                connections++;
            }
        }
    }

    points.forEach(p => {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.shadowBlur = p.size * 5;
        ctx.shadowColor = '#fff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.shadowBlur = 0;
}
