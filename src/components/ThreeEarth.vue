<template>
  <div ref="container" class="earth-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import * as THREE from "three";

const container = ref(null);
let scene, camera, renderer, earth, atmosphere, stars, glowSprite;
let animationId = null;

// 本地纹理图片路径
const EARTH_TEXTURE_URL = new URL(
  "@/assets/images/tech_earth_night_texture_dark.png",
  import.meta.url,
).href;

const init = () => {
  if (!container.value) return;

  const width = container.value.offsetWidth;
  const height = container.value.offsetHeight;

  scene = new THREE.Scene();
  scene.background = null;

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 3.5;

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    premultipliedAlpha: false,
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.autoClear = true;

  // 强制 canvas 背景透明
  const canvas = renderer.domElement;
  canvas.style.background = "transparent";
  canvas.style.display = "block";

  container.value.appendChild(canvas);

  // 增强光照 - 让纹理更亮
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
  sunLight.position.set(5, 3, 5);
  scene.add(sunLight);

  const fillLight = new THREE.DirectionalLight(0x88ccff, 0.8);
  fillLight.position.set(-5, 0, -3);
  scene.add(fillLight);

  const backLight = new THREE.DirectionalLight(0x4488cc, 0.5);
  backLight.position.set(0, 0, -5);
  scene.add(backLight);

  // 添加点光源增强整体亮度
  const pointLight = new THREE.PointLight(0x00aaff, 1.0, 10);
  pointLight.position.set(2, 2, 3);
  scene.add(pointLight);

  loadTextures();
  createStars();
  createGlowEffect();

  animate();
};

const loadTextures = () => {
  const textureLoader = new THREE.TextureLoader();

  // 加载地球纹理
  textureLoader.load(
    EARTH_TEXTURE_URL,
    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      createEarth(texture);
    },
    undefined,
    (error) => {
      console.warn("无法加载在线纹理，使用程序生成纹理:", error);
      createEarthWithProceduralTexture();
    },
  );
};

const createEarth = (texture) => {
  const geometry = new THREE.SphereGeometry(1, 128, 128);

  // 使用 StandardMaterial 更好地支持 PBR 效果
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    emissive: new THREE.Color(0x112244),
    emissiveIntensity: 0.3,
    roughness: 0.4,
    metalness: 0.1,
  });

  earth = new THREE.Mesh(geometry, material);
  earth.rotation.y = Math.PI;
  scene.add(earth);

  createAtmosphere();
};

const createEarthWithProceduralTexture = () => {
  const geometry = new THREE.SphereGeometry(1, 64, 64);

  // 创建更真实的程序纹理
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  // 海洋背景 - 深蓝色渐变
  const oceanGradient = ctx.createLinearGradient(0, 0, 0, 1024);
  oceanGradient.addColorStop(0, "#1a3a5c");
  oceanGradient.addColorStop(0.3, "#0d2847");
  oceanGradient.addColorStop(0.5, "#1e4d6b");
  oceanGradient.addColorStop(0.7, "#0d2847");
  oceanGradient.addColorStop(1, "#1a3a5c");
  ctx.fillStyle = oceanGradient;
  ctx.fillRect(0, 0, 2048, 1024);

  // 添加海洋波纹效果
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 1024;
    const w = Math.random() * 100 + 50;
    const h = Math.random() * 30 + 10;
    const alpha = Math.random() * 0.1 + 0.05;
    ctx.fillStyle = `rgba(100, 180, 255, ${alpha})`;
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 绘制大陆 - 使用不规则形状模拟真实大陆
  const continents = [
    // 亚洲/欧洲
    { x: 1400, y: 300, scale: 2.5 },
    // 非洲
    { x: 1100, y: 500, scale: 1.8 },
    // 北美
    { x: 400, y: 250, scale: 2.0 },
    // 南美
    { x: 550, y: 650, scale: 1.5 },
    // 澳洲
    { x: 1700, y: 700, scale: 0.8 },
    // 南极洲
    { x: 1024, y: 950, scale: 3.0 },
  ];

  continents.forEach((continent) => {
    drawContinent(ctx, continent.x, continent.y, continent.scale);
  });

  // 添加云层
  ctx.globalCompositeOperation = "source-over";
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 1024;
    const w = Math.random() * 200 + 100;
    const h = Math.random() * 60 + 20;
    const alpha = Math.random() * 0.15 + 0.08;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, Math.random() * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 添加城市灯光点
  for (let i = 0; i < 300; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 1024;
    const size = Math.random() * 2 + 0.5;
    const alpha = Math.random() * 0.8 + 0.2;
    // 偏黄白色的灯光
    const hue = Math.random() > 0.7 ? 50 : 30;
    ctx.fillStyle = `hsla(${hue}, 80%, 70%, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.MeshPhongMaterial({
    map: texture,
    specular: new THREE.Color(0x222222),
    shininess: 10,
  });

  earth = new THREE.Mesh(geometry, material);
  earth.rotation.y = Math.PI;
  scene.add(earth);

  createAtmosphere();
};

const drawContinent = (ctx, centerX, centerY, scale) => {
  const numBlobs = 15 + Math.random() * 10;

  // 大陆基础色
  ctx.fillStyle = `rgba(60, 100, 60, 0.8)`;

  for (let i = 0; i < numBlobs; i++) {
    const angle = (i / numBlobs) * Math.PI * 2 + Math.random() * 0.5;
    const distance = Math.random() * 100 * scale;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance * 0.5; // 压缩Y轴以适应球面投影
    const size = (Math.random() * 60 + 30) * scale;

    // 绿色到棕色的渐变
    const greenValue = 80 + Math.random() * 40;
    const brownValue = Math.random() * 30;
    ctx.fillStyle = `rgba(${60 + brownValue}, ${greenValue}, ${40}, ${0.7 + Math.random() * 0.2})`;

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    // 添加海岸线高光
    ctx.strokeStyle = `rgba(100, 140, 100, 0.3)`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // 添加山脉（深色斑点）
  for (let i = 0; i < 8; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 80 * scale;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance * 0.5;
    const size = (Math.random() * 40 + 20) * scale;

    ctx.fillStyle = `rgba(80, 70, 50, 0.6)`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
};

const createAtmosphere = () => {
  const geometry = new THREE.SphereGeometry(1.08, 64, 64);

  const material = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
        vec3 atmosphere = vec3(0.2, 0.6, 1.0) * intensity * 1.5;
        gl_FragColor = vec4(atmosphere, intensity * 0.9);
      }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
  });

  atmosphere = new THREE.Mesh(geometry, material);
  scene.add(atmosphere);
};
const createGlowSphere = () => {
  const geo = new THREE.SphereGeometry(1.18, 64, 64);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x22d3ee,
    transparent: true,
    opacity: 0.08,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false,
  });
  const glow = new THREE.Mesh(geo, mat);
  scene.add(glow);
};

const createGlowEffect = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, 512, 512);

  const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  g.addColorStop(0.0, "rgba(80, 220, 255, 0.55)");
  g.addColorStop(0.25, "rgba(80, 220, 255, 0.22)");
  g.addColorStop(0.55, "rgba(80, 220, 255, 0.06)");
  g.addColorStop(0.78, "rgba(80, 220, 255, 0.00)");
  g.addColorStop(1.0, "rgba(0, 0, 0, 0.00)"); // 彻底透明边缘

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);

  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  // 关键：避免边缘采样到“非透明像素”
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;

  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false, // 关键：避免深度导致的奇怪边
  });

  glowSprite = new THREE.Sprite(mat);
  glowSprite.scale.set(3.4, 3.4, 1); // 别太大，越大越容易看到方形
  scene.add(glowSprite);
};

const createStars = () => {
  const geometry = new THREE.BufferGeometry();
  const count = 1000;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    const radius = 15 + Math.random() * 20;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i + 2] = radius * Math.cos(phi);
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.05,
    transparent: true,
    opacity: 0.8,
  });

  stars = new THREE.Points(geometry, material);
  scene.add(stars);
};

const animate = () => {
  animationId = requestAnimationFrame(animate);
  const time = Date.now() * 0.001;

  // 清除画布，确保透明背景
  renderer.clear();

  if (earth) {
    earth.rotation.y += 0.001;
  }

  if (stars) {
    stars.rotation.y += 0.0005;
  }

  // 脉动光晕效果
  if (glowSprite) {
    const scale = 4 + Math.sin(time * 1.5) * 0.1;
    glowSprite.scale.set(scale, scale, 1);
    glowSprite.material.opacity = 0.6 + Math.sin(time * 2) * 0.2;
  }

  renderer.render(scene, camera);
};

const handleResize = () => {
  if (!container.value) return;

  const width = container.value.offsetWidth;
  const height = container.value.offsetHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

onMounted(() => {
  init();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  if (animationId) cancelAnimationFrame(animationId);
  if (renderer) {
    renderer.dispose();
    container.value?.removeChild(renderer.domElement);
  }
});
</script>

<style scoped>
.earth-container {
  width: 100%;
  height: 100%;
  background: transparent;
}
</style>
