export const mandalaPatterns = {
  floralMandala: {
    name: "Floral Mandala",
    category: "Mandala",
    desc: "A blooming floral pattern inspired by traditional mandala art.",
    formula: "Recursive circles and petals",
    minDepth: 1,
    maxDepth: 6,
    defaultDepth: 4,
    draw: (ctx, canvas, depth, angle) => {
      const size = Math.min(canvas.width, canvas.height) * 0.4;
      drawFloral(ctx, canvas.width / 2, canvas.height / 2, size, depth, angle);
    },
  },
  sunburstMandala: {
    name: "Sunburst Mandala",
    category: "Mandala",
    desc: "Radiating geometric shapes resembling a sunburst.",
    formula: "Radial symmetry with spikes",
    minDepth: 1,
    maxDepth: 7,
    defaultDepth: 5,
    draw: (ctx, canvas, depth, angle) => {
      const size = Math.min(canvas.width, canvas.height) * 0.4;
      drawSunburst(
        ctx,
        canvas.width / 2,
        canvas.height / 2,
        size,
        depth,
        angle,
      );
    },
  },
  geometricMandala: {
    name: "Geometric Mandala",
    category: "Mandala",
    desc: "Complex interlocking geometric shapes.",
    formula: "Recursive polygons",
    minDepth: 1,
    maxDepth: 6,
    defaultDepth: 4,
    draw: (ctx, canvas, depth, angle) => {
      const size = Math.min(canvas.width, canvas.height) * 0.4;
      drawGeometric(
        ctx,
        canvas.width / 2,
        canvas.height / 2,
        size,
        depth,
        angle,
      );
    },
  },
};

function drawFloral(ctx, x, y, size, depth, angle) {
  if (depth <= 0) return;

  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = depth % 2 === 0 ? "#ff9900" : "#9900ff"; // Orange and Purple
  ctx.fillStyle = `hsla(${depth * 40}, 80%, 60%, 0.7)`;
  ctx.fill();
  ctx.strokeStyle = "white";
  ctx.stroke();

  const branches = 8;
  const newSize = size * 0.5;

  for (let i = 0; i < branches; i++) {
    const theta =
      ((Math.PI * 2) / branches) * i + ((angle * Math.PI) / 180) * (5 - depth);
    const nx = x + Math.cos(theta) * size * 0.8;
    const ny = y + Math.sin(theta) * size * 0.8;
    drawFloral(ctx, nx, ny, newSize, depth - 1, angle);
  }
}

function drawSunburst(ctx, x, y, size, depth, angle) {
  if (depth <= 0) return;

  const points = 12;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const theta = ((Math.PI * 2) / (points * 2)) * i;
    const r = i % 2 === 0 ? size : size * 0.5;
    const px = x + Math.cos(theta) * r;
    const py = y + Math.sin(theta) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();

  const hue = (depth * 50) % 360;
  ctx.fillStyle = `hsla(${hue}, 90%, 60%, 0.8)`;
  ctx.fill();
  ctx.strokeStyle = "#ffcc00";
  ctx.stroke();

  const newSize = size * 0.6;
  if (newSize > 5) {
    drawSunburst(ctx, x, y, newSize, depth - 1, angle + 15);
  }
}

function drawGeometric(ctx, x, y, size, depth, angle) {
  if (depth <= 0) return;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(((angle * Math.PI) / 180) * depth);

  ctx.beginPath();
  ctx.rect(-size / 2, -size / 2, size, size);
  ctx.fillStyle =
    depth % 2 === 0 ? "rgba(255, 100, 0, 0.6)" : "rgba(100, 0, 255, 0.6)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
  ctx.stroke();

  ctx.restore();

  const newSize = size * 0.7;
  // Recursive calls at corners or sides could create interesting patterns
  // Here we just shrink and rotate for a tunnel effect, or offset
  // Let's do 4 corners
  const offset = size / 2;
  if (depth > 1) {
    drawGeometric(ctx, x - offset, y - offset, newSize, depth - 1, angle);
    drawGeometric(ctx, x + offset, y - offset, newSize, depth - 1, angle);
    drawGeometric(ctx, x - offset, y + offset, newSize, depth - 1, angle);
    drawGeometric(ctx, x + offset, y + offset, newSize, depth - 1, angle);
  }
}
