export const coolPatterns = {
    lorenz: {
        name: "Lorenz Attractor",
        category: "Cool Stuffs",
        desc: "A chaotic system of differential equations.",
        formula: "σ(y-x), x(ρ-z)-y, xy-βz",
        minDepth: 500, maxDepth: 10000, defaultDepth: 5000,
        isPixel: true,
        draw: (ctx, canvas, depth, angle, camera) => {
            drawLorenz(ctx, canvas, depth, camera);
        }
    },
    menger: {
        name: "Menger Sponge (2D)",
        category: "Cool Stuffs",
        desc: "A square based fractal with recursive square removal.",
        formula: "f(n+1) = s/3 (8 sub-squares)",
        minDepth: 0, maxDepth: 5, defaultDepth: 3,
        draw: (ctx, canvas, depth) => {
            const size = Math.min(canvas.width, canvas.height) * 0.7;
            drawMenger(ctx, canvas.width/2 - size/2, canvas.height/2 - size/2, size, depth);
        }
    },
    piviz: {
        name: "Structure of Pi",
        category: "Cool Stuffs",
        desc: "A structural map of Pi's digits (3.1415...) visualized as connections around a circle.",
        formula: "π = 4 Σ (-1)ⁿ / (2n+1)",
        minDepth: 10, maxDepth: 1000, defaultDepth: 500,
        draw: (ctx, canvas, depth) => {
            drawPi(ctx, canvas, depth);
        }
    }
};

function drawLorenz(ctx, canvas, iterations, camera) {
    let x = 0.1, y = 0, z = 0;
    const sigma = 10, rho = 28, beta = 8/3;
    const dt = 0.01;
    const w = canvas.width, h = canvas.height;
    ctx.beginPath();
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 0.5 * camera.zoom;
    for(let i=0; i<iterations; i++) {
        let dx = sigma * (y - x) * dt;
        let dy = (x * (rho - z) - y) * dt;
        let dz = (x * y - beta * z) * dt;
        x += dx; y += dy; z += dz;
        const px = w/2 + camera.x + x * 15 * camera.zoom;
        const py = h/2 + camera.y + (y - z) * 10 * camera.zoom;
        if(i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
}

function drawMenger(ctx, x, y, s, d) {
    if(d === 0) {
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(x, y, s, s);
        return;
    }
    const ns = s / 3;
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            if(i === 1 && j === 1) continue;
            drawMenger(ctx, x + i*ns, y + j*ns, ns, d-1);
        }
    }
}

function drawPi(ctx, canvas, digits) {
    const w = canvas.width, h = canvas.height;
    const cx = w/2, cy = h/2;
    const radius = Math.min(w, h) * 0.4;
    
    const piStr = "3141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273724587006606315588174881520920962829254091715364367892590360011330530548820466521384146951941511609433057270365759591953092186117381932611793105118548074462379962749567351885752724891227938183011949129833673362440656643086021394946395224737190702179860943702770539217176293176752384674818467669405132000568127145263560827785771342757789609173637178721468440901224953430146549585371050792279689258923542019956112129021960864034418159813629774771309960518707211349999998372978049951059731732816096318595024459455346908302642522308253344685035261931188171010003137838752886587533208381420617177669147303598253490428755468731159562863882353787593751957781857780532171226806613001927876611195909216420198";
    
    const points = [];
    for(let i=0; i<10; i++) {
        const angle = (i / 10) * Math.PI * 2 - Math.PI/2;
        points.push({
            x: cx + Math.cos(angle) * radius,
            y: cy + Math.sin(angle) * radius
        });
    }

    ctx.fillStyle = 'white';
    ctx.font = '16px Outfit';
    points.forEach((p, i) => {
        const angle = (i / 10) * Math.PI * 2 - Math.PI/2;
        const tx = cx + Math.cos(angle) * (radius + 30);
        const ty = cy + Math.sin(angle) * (radius + 30);
        ctx.fillText(i, tx - 5, ty + 5);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.lineWidth = 0.5;
    const max = Math.min(digits, piStr.length - 1);
    for(let i=0; i<max; i++) {
        const d1 = parseInt(piStr[i]);
        const d2 = parseInt(piStr[i+1]);
        ctx.strokeStyle = `hsla(${(i/max) * 360}, 80%, 60%, 0.15)`;
        ctx.beginPath();
        ctx.moveTo(points[d1].x, points[d1].y);
        ctx.lineTo(points[d2].x, points[d2].y);
        ctx.stroke();
    }
}
