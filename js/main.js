import { patterns } from "./patterns/index.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const pList = document.getElementById("pattern-list");
const depthSlider = document.getElementById("depth-slider");
const depthVal = document.getElementById("depth-val");
const angleSlider = document.getElementById("angle-slider");
const angleVal = document.getElementById("angle-val");
const pName = document.getElementById("p-name");
const pDesc = document.getElementById("p-desc");
const pFormula = document.getElementById("p-formula");
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebar-toggle");
const btnAutoRun = document.getElementById("btn-auto-run");
const btnToggleWebcam = document.getElementById("btn-toggle-webcam");
const speedSlider = document.getElementById("auto-run-speed");

let autoRunActive = false;
let autoRunDirection = 1;
let autoRunTimer = null;

const bgMusic = new Audio("bgmusic.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.5;

let currentPattern = "pythagoras";
let depth = 8;
let angle = 45;

// Camera State
let camZoom = 1.0;
let camX = 0;
let camY = 0;
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

function init() {
  resize();
  const groups = {};
  const catIcons = {
    "Classic Fractals": "polyline",
    "Grids & Subdivisions": "grid_view",
    "Curves & L-Systems": "gesture",
    "Space & Nature": "flare",
    "Complex & Sets": "psychology",
    "Cool Stuffs": "auto_awesome",
  };

  Object.keys(patterns).forEach((key) => {
    const cat = patterns[key].category || "Uncategorized";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push({ key, ...patterns[key] });
  });

  pList.innerHTML = "";
  Object.keys(groups).forEach((cat) => {
    const catDiv = document.createElement("div");
    catDiv.className =
      "category" + (cat === patterns[currentPattern].category ? " open" : "");

    const header = document.createElement("div");
    header.className = "category-header";

    const icon = document.createElement("span");
    icon.className = "material-symbols-outlined";
    icon.textContent = catIcons[cat] || "category";

    const label = document.createElement("span");
    label.textContent = cat;

    header.appendChild(icon);
    header.appendChild(label);

    header.onclick = () => {
      const isOpen = catDiv.classList.contains("open");
      document
        .querySelectorAll(".category")
        .forEach((c) => c.classList.remove("open"));
      if (!isOpen) catDiv.classList.add("open");
    };

    const content = document.createElement("div");
    content.className = "category-content";

    groups[cat].forEach((p) => {
      const li = document.createElement("div");
      li.className =
        "pattern-item" + (p.key === currentPattern ? " active" : "");
      li.textContent = p.name;
      li.onclick = (e) => {
        e.stopPropagation();
        selectPattern(p.key);
      };
      content.appendChild(li);
    });

    catDiv.appendChild(header);
    catDiv.appendChild(content);
    pList.appendChild(catDiv);
  });
  render();
}

function selectPattern(key) {
  currentPattern = key;
  const p = patterns[key];
  pName.textContent = p.name;
  pDesc.textContent = p.desc;
  pFormula.textContent = p.formula || "N/A";

  const min = p.minDepth !== undefined ? p.minDepth : 1;
  depthSlider.min = min;
  depthSlider.max = p.maxDepth || 10;

  depth = p.defaultDepth || Math.max(min, Math.min(depth, p.maxDepth));
  depthSlider.value = depth;

  document.querySelectorAll(".pattern-item").forEach((el) => {
    el.classList.toggle("active", el.textContent === p.name);
  });

  const hasAngle = ["pythagoras", "tree"].includes(key);
  document.getElementById("param-group").style.display = hasAngle
    ? "flex"
    : "none";

  render();
}

function resize() {
  canvas.width = window.innerWidth - sidebar.offsetWidth;
  canvas.height = window.innerHeight;
  render();
}

let renderPending = false;
function render() {
  if (renderPending) return;
  renderPending = true;

  requestAnimationFrame(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    const p = patterns[currentPattern];
    if (!p.isPixel) {
      ctx.translate(camX, camY);
      ctx.scale(camZoom, camZoom);
    }

    depthVal.textContent = depth;
    angleVal.textContent = angle + "°";

    const camera = { x: camX, y: camY, zoom: camZoom };
    p.draw(ctx, canvas, depth, angle, camera);

    ctx.restore();
    renderPending = false;
  });
}

depthSlider.oninput = (e) => {
  depth = parseInt(e.target.value);
  render();
};
angleSlider.oninput = (e) => {
  angle = parseInt(e.target.value);
  render();
};
window.onresize = resize;

canvas.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    const factor = Math.pow(1.1, -e.deltaY / 100);
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const oldZoom = camZoom;
    camZoom *= factor;
    camX = mouseX - (mouseX - camX) * (camZoom / oldZoom);
    camY = mouseY - (mouseY - camY) * (camZoom / oldZoom);
    render();
  },
  { passive: false },
);

canvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
});

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  camX += e.clientX - lastMouseX;
  camY += e.clientY - lastMouseY;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  render();
});

window.addEventListener("mouseup", () => {
  isDragging = false;
});

function resetView() {
  camZoom = 1.0;
  camX = 0;
  camY = 0;
  render();
}

canvas.addEventListener("dblclick", resetView);

sidebarToggle.onclick = () => {
  sidebar.classList.toggle("collapsed");
  const icon = sidebarToggle.querySelector(".material-symbols-outlined");
  icon.textContent = sidebar.classList.contains("collapsed")
    ? "chevron_right"
    : "chevron_left";
  setTimeout(resize, 300);
};

// Ensure icon is correct on load
if (sidebar.classList.contains("collapsed")) {
  const icon = sidebarToggle.querySelector(".material-symbols-outlined");
  icon.textContent = "chevron_right";
}

function startAutoRunLoop() {
  if (autoRunTimer) clearInterval(autoRunTimer);

  const update = () => {
    const p = patterns[currentPattern];
    const min = p.minDepth !== undefined ? p.minDepth : 1;
    const max = p.maxDepth || 20;

    depth += autoRunDirection;
    if (depth >= max) {
      depth = max;
      autoRunDirection = -1;
    } else if (depth <= min) {
      depth = min;
      autoRunDirection = 1;
    }

    depthSlider.value = depth;
    depthVal.textContent = depth;
    render();
  };

  const speed = parseInt(speedSlider.value);
  autoRunTimer = setInterval(update, 500 - (speed - 1) * (480 / 99));
}

function toggleAutoRun() {
  autoRunActive = !autoRunActive;
  btnAutoRun.classList.toggle("active", autoRunActive);
  const icon = btnAutoRun.querySelector(".material-symbols-outlined");
  icon.textContent = autoRunActive ? "pause" : "play_arrow";

  if (autoRunActive) {
    startAutoRunLoop();
    bgMusic.play().catch((e) => console.warn("Audio playback failed:", e));
  } else {
    clearInterval(autoRunTimer);
    bgMusic.pause();
  }
}

btnAutoRun.onclick = toggleAutoRun;
speedSlider.oninput = () => {
  if (autoRunActive) startAutoRunLoop();
};

let webcamStream = null;

async function toggleWebcam() {
  const container = document.getElementById("webcam-container");
  const videoElement = document.getElementById("webcam-feed");
  const icon = btnToggleWebcam.querySelector(".material-symbols-outlined");
  const text = btnToggleWebcam.querySelector(
    "span:not(.material-symbols-outlined)",
  );

  if (webcamStream) {
    // Stop webcam
    webcamStream.getTracks().forEach((track) => track.stop());
    webcamStream = null;
    videoElement.srcObject = null;
    container.style.display = "none";
    icon.textContent = "videocam_off";
    btnToggleWebcam.classList.remove("active");
  } else {
    // Start webcam
    try {
      webcamStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoElement.srcObject = webcamStream;
      container.style.display = "block";
      icon.textContent = "videocam";
      btnToggleWebcam.classList.add("active");

      // Re-bind close button
      const closeBtn = document.getElementById("close-webcam");
      closeBtn.onclick = () => {
        toggleWebcam(); // Reuse toggle logic to close
      };
    } catch (err) {
      console.warn("Webcam access denied or error:", err);
      alert("Could not access webcam. Please check permissions.");
    }
  }
}

btnToggleWebcam.onclick = toggleWebcam;

init();
// Enable Auto Run by default
toggleAutoRun();
