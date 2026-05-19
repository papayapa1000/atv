import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const sourceImagePath = path.join(rootDir, "public", "images", "hero-sunset-boat.webp");
const outputVideoPath = path.join(rootDir, "public", "images", "hero-cinematic-loop-v4.webm");
const previewPath = path.join(rootDir, "artifacts", "hero-cinematic-loop-v4-preview.png");

const width = 1920;
const height = 864;
const fps = 30;
const durationSeconds = 8;
const remoteDebuggingPort = 9333;

function findChrome() {
  const candidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  ];

  const found = candidates.find((candidate) => existsSync(candidate));
  if (!found) {
    throw new Error("Chrome or Edge executable was not found.");
  }
  return found;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForJson(url, attempts = 80) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Chrome may still be booting.
    }
    await delay(250);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function connectToCdp(wsUrl) {
  const socket = new WebSocket(wsUrl);
  const pending = new Map();
  let nextId = 1;

  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) {
      if (message.method === "Runtime.consoleAPICalled") {
        const text = message.params.args.map((arg) => arg.value ?? arg.description ?? "").join(" ");
        if (text) {
          console.log(`[browser] ${text}`);
        }
      }
      return;
    }

    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);

    if (message.error) {
      reject(new Error(`${message.error.message}: ${message.error.data ?? ""}`));
      return;
    }
    resolve(message.result);
  });

  return {
    send(method, params = {}) {
      const id = nextId;
      nextId += 1;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
      });
    },
    close() {
      socket.close();
    },
  };
}

function browserRenderHeroVideo(imageDataUrl, options) {
  const { width: W, height: H, fps: FPS, durationSeconds: DURATION } = options;
  const TAU = Math.PI * 2;

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }

  function seeded(seed) {
    return Math.abs(Math.sin(seed * 12.9898) * 43758.5453) % 1;
  }

  function easeLoop(t) {
    return 0.5 - Math.cos(t * TAU) * 0.5;
  }

  function drawImageTransformed(ctx, image, dx, dy, scale = 1, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(W / 2 + dx, H / 2 + dy);
    ctx.scale(scale, scale);
    ctx.drawImage(image, -W / 2, -H / 2, W, H);
    ctx.restore();
  }

  function skyPath(ctx) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(W, 0);
    ctx.lineTo(W, 150);
    ctx.bezierCurveTo(1815, 128, 1685, 108, 1558, 125);
    ctx.bezierCurveTo(1440, 140, 1360, 238, 1270, 338);
    ctx.bezierCurveTo(1170, 455, 1038, 492, 858, 506);
    ctx.bezierCurveTo(744, 515, 663, 490, 560, 466);
    ctx.bezierCurveTo(435, 432, 340, 392, 252, 388);
    ctx.bezierCurveTo(135, 382, 70, 430, 0, 416);
    ctx.closePath();
  }

  function mountainPath(ctx) {
    ctx.beginPath();
    ctx.moveTo(0, 409);
    ctx.bezierCurveTo(80, 423, 140, 383, 256, 388);
    ctx.bezierCurveTo(345, 392, 439, 432, 560, 466);
    ctx.bezierCurveTo(665, 492, 742, 517, 860, 506);
    ctx.bezierCurveTo(1035, 492, 1170, 456, 1270, 338);
    ctx.bezierCurveTo(1360, 238, 1440, 140, 1558, 125);
    ctx.bezierCurveTo(1685, 108, 1815, 128, W, 150);
    ctx.lineTo(W, 540);
    ctx.lineTo(0, 540);
    ctx.closePath();
  }

  function waterPath(ctx) {
    ctx.beginPath();
    ctx.moveTo(0, 502);
    ctx.bezierCurveTo(290, 501, 530, 514, 820, 522);
    ctx.bezierCurveTo(1060, 528, 1355, 527, W, 528);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
  }

  function boatPath(ctx) {
    ctx.beginPath();
    ctx.moveTo(510, 562);
    ctx.bezierCurveTo(586, 535, 668, 528, 724, 535);
    ctx.lineTo(780, 498);
    ctx.lineTo(1017, 499);
    ctx.lineTo(1158, 548);
    ctx.lineTo(1102, 618);
    ctx.bezierCurveTo(954, 640, 738, 642, 584, 629);
    ctx.bezierCurveTo(534, 624, 504, 600, 510, 562);
    ctx.closePath();
  }

  function drawLayeredBackdrop(ctx, base, t) {
    const loop = easeLoop(t);

    ctx.drawImage(base, 0, 0, W, H);

    ctx.save();
    skyPath(ctx);
    ctx.clip();
    drawImageTransformed(ctx, base, Math.sin(t * TAU) * 7, Math.cos(t * TAU) * 1.5, 1.014 + loop * 0.004, 0.42);
    ctx.restore();

    ctx.save();
    mountainPath(ctx);
    ctx.clip();
    drawImageTransformed(
      ctx,
      base,
      Math.sin(t * TAU + 1.1) * -2,
      Math.cos(t * TAU + 0.3) * 0.8,
      1.006 + loop * 0.002,
      0.34,
    );
    ctx.restore();
  }

  function drawWater(ctx, base, t) {
    ctx.save();
    waterPath(ctx);
    ctx.clip();

    for (let y = 500; y < H; y += 2) {
      const depth = Math.max(0, (y - 500) / (H - 500));
      const drift = 8 * Math.sin(t * TAU * 0.7);
      const dx =
        drift * depth +
        Math.sin(y * 0.034 + t * TAU * 1.25) * (0.8 + depth * 5.2) +
        Math.sin(y * 0.091 - t * TAU * 2.15) * (0.3 + depth * 2.8);
      const dy = Math.sin(y * 0.026 - t * TAU * 1.05) * (0.45 + depth * 1.7);

      ctx.globalAlpha = 0.82;
      ctx.drawImage(base, 0, y, W, 4, dx - 12, y + dy, W + 24, 5);
    }

    ctx.globalAlpha = 1;
    drawMovingRipples(ctx, t);
    restoreOriginalWakeArea(ctx, base);
    drawSunGlints(ctx, t);
    ctx.restore();
  }

  function drawMovingRipples(ctx, t) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.lineCap = "round";

    for (let i = 0; i < 120; i += 1) {
      const seed = seeded(i + 3.4);
      const depthBand = seeded(i + 19.2);
      const y = 520 + depthBand * 330 + Math.sin(t * TAU + i * 0.34) * (1.5 + depthBand * 5);
      const depth = Math.max(0, (y - 520) / (H - 520));
      const x = ((i * 131 + seed * 580 + t * (34 + depth * 92)) % (W + 360)) - 180;
      const length = 48 + seed * 140 + depth * 95;

      if ((y > 560 && y < 666 && x < 720) || (y < 640 && x > 520 && x < 1170)) {
        continue;
      }

      ctx.strokeStyle = `rgba(226, 250, 246, ${0.018 + depth * 0.07})`;
      ctx.lineWidth = 0.8 + depth * 1.4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(
        x + length * 0.34,
        y + Math.sin(t * TAU * 1.8 + i) * 5,
        x + length * 0.72,
        y - Math.cos(t * TAU * 1.3 + i) * 4,
        x + length,
        y + Math.sin(t * TAU + i) * 2,
      );
      ctx.stroke();
    }

    ctx.restore();
  }

  function restoreOriginalWakeArea(ctx, base) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 574);
    ctx.bezierCurveTo(166, 568, 350, 575, 528, 590);
    ctx.bezierCurveTo(652, 600, 676, 624, 592, 645);
    ctx.bezierCurveTo(375, 672, 178, 658, 0, 648);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(base, 0, 558, 710, 128, 0, 558, 710, 128);
    ctx.restore();
  }

  function drawSunBloom(ctx, t) {
    const pulse = 0.5 + Math.sin(t * TAU * 2) * 0.5;
    const x = 855 + Math.sin(t * TAU) * 10;
    const y = 498 + Math.cos(t * TAU * 1.35) * 3;

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.filter = "blur(8px)";

    const halo = ctx.createRadialGradient(x, y, 18, x, y, 330 + pulse * 54);
    halo.addColorStop(0, `rgba(255, 230, 130, ${0.26 + pulse * 0.1})`);
    halo.addColorStop(0.2, `rgba(255, 156, 55, ${0.18 + pulse * 0.06})`);
    halo.addColorStop(0.62, `rgba(255, 104, 53, ${0.06 + pulse * 0.03})`);
    halo.addColorStop(1, "rgba(255, 104, 53, 0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.ellipse(x, y + 8, 420 + pulse * 46, 128 + pulse * 20, -0.06, 0, TAU);
    ctx.fill();

    ctx.filter = "blur(3px)";
    ctx.strokeStyle = `rgba(255, 136, 56, ${0.18 + pulse * 0.07})`;
    ctx.lineWidth = 9 + pulse * 4;
    ctx.beginPath();
    ctx.moveTo(x - 12, y + 8);
    ctx.lineTo(x - 122 + Math.sin(t * TAU * 1.4) * 8, y + 150);
    ctx.stroke();

    ctx.restore();
  }

  function drawSunGlints(ctx, t) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.filter = "blur(0.35px)";

    const glow = ctx.createRadialGradient(872, 676, 18, 872, 676, 260);
    glow.addColorStop(0, `rgba(255, 196, 80, ${0.14 + Math.sin(t * TAU * 2) * 0.035})`);
    glow.addColorStop(0.42, `rgba(239, 109, 46, ${0.06 + Math.cos(t * TAU) * 0.018})`);
    glow.addColorStop(1, "rgba(239, 109, 46, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.ellipse(872 + Math.sin(t * TAU * 1.1) * 18, 676, 104, 238, 0.02, 0, TAU);
    ctx.fill();

    for (let i = 0; i < 42; i += 1) {
      const y = 524 + i * 8.5 + Math.sin(t * TAU * 1.8 + i * 0.9) * (2.5 + i * 0.035);
      const width = 20 + i * 2.1 + Math.sin(t * TAU * 1.35 + i) * 14;
      const x = 860 + Math.sin(t * TAU * 1.2 + i * 0.7) * (9 + i * 0.65);
      const gradient = ctx.createLinearGradient(x - width, y, x + width, y);
      gradient.addColorStop(0, "rgba(255, 188, 65, 0)");
      gradient.addColorStop(0.5, `rgba(255, 194, 72, ${0.075 + i * 0.0022})`);
      gradient.addColorStop(1, "rgba(255, 188, 65, 0)");

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1 + i * 0.032;
      ctx.beginPath();
      ctx.moveTo(x - width, y);
      ctx.quadraticCurveTo(x, y + Math.sin(t * TAU * 2.2 + i) * 4, x + width, y + 1);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawBoat(ctx, base) {
    ctx.save();
    boatPath(ctx);
    ctx.clip();
    ctx.drawImage(base, 492, 486, 690, 168, 492, 486, 690, 168);
    ctx.restore();
  }

  function drawScene(ctx, base, t) {
    const camera = 1.008 + easeLoop(t) * 0.044 + Math.sin(t * TAU * 2 + 0.35) * 0.004;

    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.scale(camera, camera);
    ctx.translate(-W / 2 + Math.sin(t * TAU * 1.2) * 4, -H / 2 + Math.cos(t * TAU) * 2.2);

    drawLayeredBackdrop(ctx, base, t);
    drawSunBloom(ctx, t);
    drawWater(ctx, base, t);
    drawBoat(ctx, base);

    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.035;
    ctx.fillStyle = "#eaf8f6";
    for (let i = 0; i < 180; i += 1) {
      const x = (i * 137.7) % W;
      const y = (i * 61.3) % H;
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.restore();
  }

  return (async () => {
    const image = await loadImage(imageDataUrl);
    const base = document.createElement("canvas");
    base.width = W;
    base.height = H;
    const baseCtx = base.getContext("2d", { alpha: false });
    baseCtx.imageSmoothingQuality = "high";
    baseCtx.drawImage(image, 0, 0, image.width, image.height, 0, 0, W, H);

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d", { alpha: false });
    ctx.imageSmoothingQuality = "high";
    document.body.style.margin = "0";
    document.body.style.background = "#123f3a";
    document.body.appendChild(canvas);

    drawScene(ctx, base, 0.32);
    const previewDataUrl = canvas.toDataURL("image/png");

    const stream = canvas.captureStream(FPS);
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm;codecs=vp8";
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 7_000_000,
    });
    const chunks = [];
    recorder.ondataavailable = (event) => {
      if (event.data?.size) {
        chunks.push(event.data);
      }
    };

    const startedAt = performance.now();
    const stopped = new Promise((resolve) => {
      recorder.onstop = resolve;
    });

    recorder.start(500);

    await new Promise((resolve) => {
      function tick(now) {
        const elapsed = (now - startedAt) / 1000;
        const t = (elapsed % DURATION) / DURATION;
        drawScene(ctx, base, t);

        if (elapsed >= DURATION) {
          drawScene(ctx, base, 0);
          recorder.stop();
          resolve();
          return;
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });

    await stopped;
    stream.getTracks().forEach((track) => track.stop());

    const blob = new Blob(chunks, { type: mimeType });
    const base64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(blob);
    });

    return {
      base64,
      mimeType,
      width: W,
      height: H,
      fps: FPS,
      durationSeconds: DURATION,
      previewBase64: previewDataUrl.split(",")[1],
    };
  })();
}

async function main() {
  if (!existsSync(sourceImagePath)) {
    throw new Error(`Source image not found: ${sourceImagePath}`);
  }

  mkdirSync(path.dirname(outputVideoPath), { recursive: true });
  mkdirSync(path.dirname(previewPath), { recursive: true });

  const chromePath = findChrome();
  const userDataDir = path.join(tmpdir(), `hero-video-chrome-${Date.now()}`);
  const imageDataUrl = `data:image/jpeg;base64,${readFileSync(sourceImagePath).toString("base64")}`;
  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-background-networking",
    "--disable-default-apps",
    "--disable-extensions",
    "--disable-sync",
    "--mute-audio",
    "--no-first-run",
    `--remote-debugging-port=${remoteDebuggingPort}`,
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ]);

  chrome.stderr.on("data", (chunk) => {
    const text = chunk.toString().trim();
    if (text && !text.includes("DevTools listening")) {
      console.error(`[chrome] ${text}`);
    }
  });

  let cdp;
  try {
    const targets = await waitForJson(`http://127.0.0.1:${remoteDebuggingPort}/json`);
    const page = targets.find((target) => target.type === "page") ?? targets[0];
    cdp = await connectToCdp(page.webSocketDebuggerUrl);
    await cdp.send("Runtime.enable");

    const expression = `(${browserRenderHeroVideo.toString()})(${JSON.stringify(imageDataUrl)}, ${JSON.stringify({
      width,
      height,
      fps,
      durationSeconds,
    })})`;

    console.log(`Rendering ${durationSeconds}s ${width}x${height} layered hero loop...`);
    const evaluation = await cdp.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });

    if (evaluation.exceptionDetails) {
      throw new Error(evaluation.exceptionDetails.text ?? "Browser rendering failed.");
    }

    const result = evaluation.result.value;
    writeFileSync(outputVideoPath, Buffer.from(result.base64, "base64"));
    writeFileSync(previewPath, Buffer.from(result.previewBase64, "base64"));

    console.log(`Wrote ${outputVideoPath}`);
    console.log(`Wrote ${previewPath}`);
    console.log(`${result.mimeType}, ${result.width}x${result.height}, ${result.durationSeconds}s @ ${result.fps}fps`);
  } finally {
    cdp?.close();
    chrome.kill();
    await delay(300);
    rmSync(userDataDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
