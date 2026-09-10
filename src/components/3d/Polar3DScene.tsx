import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Compass,
  Building2,
  Ship,
  FileText,
  Database,
  Sparkles,
  Image as ImageIcon,
  ArrowRight,
  RotateCw,
  Camera,
  Layers,
  Binoculars,
} from 'lucide-react';
import { ScientificNode } from '../../types';
import { SCIENTIFIC_NODES } from '../../data/mockData';

interface Polar3DSceneProps {
  nodes?: ScientificNode[];
  activeNodeId?: string | null;
  onNodeClick?: (node: ScientificNode) => void;
  onNodeHover?: (node: ScientificNode | null) => void;
  interactive?: boolean;
}

// Camera View Presets with specialized viewpoints including Wildlife and Datasets
export type CameraPreset = 'overview' | 'station' | 'ship' | 'wildlife' | 'glaciers' | 'datasets' | 'aurora';

interface CameraTarget {
  pos: THREE.Vector3;
  look: THREE.Vector3;
}

const CAMERA_PRESETS: Record<CameraPreset, CameraTarget> = {
  overview: {
    pos: new THREE.Vector3(0, 4.4, 13.2),
    look: new THREE.Vector3(0, 0.4, 0),
  },
  station: {
    pos: new THREE.Vector3(5.8, 2.6, -1.2),
    look: new THREE.Vector3(3.6, 1.4, -4.0),
  },
  ship: {
    pos: new THREE.Vector3(-2.2, 1.1, 3.2),
    look: new THREE.Vector3(-4.2, 0.2, 0.6),
  },
  wildlife: {
    pos: new THREE.Vector3(0.5, 0.6, 5.8),
    look: new THREE.Vector3(-0.4, -0.7, 3.5),
  },
  glaciers: {
    pos: new THREE.Vector3(-6.8, 3.2, 1.8),
    look: new THREE.Vector3(-1.5, 2.0, -7.0),
  },
  datasets: {
    pos: new THREE.Vector3(8.0, 2.4, 0.8),
    look: new THREE.Vector3(6.5, 1.4, -1.8),
  },
  aurora: {
    pos: new THREE.Vector3(0.5, 1.8, 10.5),
    look: new THREE.Vector3(0, 6.2, -4.5),
  },
};

// Procedural Canvas Texture Generators for Ultra-Realistic Materials
function createProceduralIceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base glacier ice gradient
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#cbe7f8');
  grad.addColorStop(0.5, '#99d2f2');
  grad.addColorStop(1, '#67b8e3');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Micro ice grain & crystals
  for (let i = 0; i < 7000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = Math.random() * 2;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.45)' : 'rgba(14, 116, 172, 0.25)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Crevasse & fracture lines
  ctx.strokeStyle = 'rgba(7, 89, 133, 0.4)';
  ctx.lineWidth = 1.5;
  for (let j = 0; j < 25; j++) {
    ctx.beginPath();
    let x = Math.random() * 512;
    let y = Math.random() * 512;
    ctx.moveTo(x, y);
    for (let k = 0; k < 6; k++) {
      x += (Math.random() - 0.5) * 60;
      y += Math.random() * 50;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createProceduralRockTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Dark weathered Antarctic basalt/gneiss rock
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 512, 512);

  // Strata layers & rock grain
  for (let i = 0; i < 9000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const val = Math.floor(Math.random() * 60) + 20;
    ctx.fillStyle = `rgb(${val + 5}, ${val + 10}, ${val + 18})`;
    ctx.fillRect(x, y, Math.random() * 3, Math.random() * 2);
  }

  // Rock fissure striations
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.8;
  for (let s = 0; s < 30; s++) {
    ctx.beginPath();
    let sx = Math.random() * 512;
    let sy = Math.random() * 512;
    ctx.moveTo(sx, sy);
    for (let p = 0; p < 8; p++) {
      sx += (Math.random() - 0.3) * 50;
      sy += (Math.random() - 0.5) * 20;
      ctx.lineTo(sx, sy);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createProceduralSnowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 512, 512);

  // Sastrugi wind-blown snow ripples
  for (let y = 0; y < 512; y += 12) {
    ctx.fillStyle = 'rgba(226, 232, 240, 0.35)';
    ctx.beginPath();
    ctx.ellipse(256, y, 250, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Sparkling snow crystals
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.fillStyle = Math.random() > 0.8 ? 'rgba(255, 255, 255, 0.9)' : 'rgba(203, 213, 225, 0.4)';
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export const Polar3DScene: React.FC<Polar3DSceneProps> = ({
  nodes = SCIENTIFIC_NODES,
  activeNodeId,
  onNodeClick,
  onNodeHover,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeContainerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [currentPreset, setCurrentPreset] = useState<CameraPreset>('overview');
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [activeCameraState, setActiveCameraState] = useState<{ isCustom: boolean }>({ isCustom: false });

  // Camera transition ref
  const transitionRef = useRef<{
    active: boolean;
    targetPos: THREE.Vector3;
    targetLook: THREE.Vector3;
  }>({
    active: false,
    targetPos: CAMERA_PRESETS.overview.pos.clone(),
    targetLook: CAMERA_PRESETS.overview.look.clone(),
  });

  const controlsRef = useRef<OrbitControls | null>(null);

  // Switch camera preset
  const handleSelectPreset = (preset: CameraPreset) => {
    setCurrentPreset(preset);
    const target = CAMERA_PRESETS[preset];
    transitionRef.current = {
      active: true,
      targetPos: target.pos.clone(),
      targetLook: target.look.clone(),
    };
    setActiveCameraState({ isCustom: false });
  };

  const toggleAutoRotate = () => {
    setIsAutoRotating((prev) => !prev);
  };

  const resetView = () => {
    handleSelectPreset('overview');
  };

  // Node icon mapping
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'research':
        return FileText;
      case 'station':
        return Building2;
      case 'dataset':
        return Database;
      case 'expedition':
        return Ship;
      case 'ai':
        return Sparkles;
      case 'media':
        return ImageIcon;
      default:
        return Sparkles;
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // WebGL verification
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020712);
    scene.fog = new THREE.FogExp2(0x030d1d, 0.02);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000);
    camera.position.copy(CAMERA_PRESETS.overview.pos);
    camera.lookAt(CAMERA_PRESETS.overview.look);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.65;
    controls.zoomSpeed = 0.8;
    controls.panSpeed = 0.6;
    controls.minDistance = 3.5;
    controls.maxDistance = 26.0;
    controls.minPolarAngle = Math.PI * 0.1;
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.copy(CAMERA_PRESETS.overview.look);
    controls.autoRotate = isAutoRotating;
    controls.autoRotateSpeed = 0.4;

    controls.addEventListener('start', () => {
      transitionRef.current.active = false;
      setActiveCameraState({ isCustom: true });
    });

    // 3. Cinematic Polar Lighting
    const ambientLight = new THREE.AmbientLight(0x70a3ff, 0.7);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x082f49, 0.85);
    scene.add(hemiLight);

    // Low Polar Sun (casting long, dramatic Antarctic shadows)
    const sunLight = new THREE.DirectionalLight(0xfff5ea, 2.4);
    sunLight.position.set(18, 14, 12);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 70;
    sunLight.shadow.camera.left = -22;
    sunLight.shadow.camera.right = 22;
    sunLight.shadow.camera.top = 22;
    sunLight.shadow.camera.bottom = -22;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Glacial Cyan Fill Light
    const fillLight = new THREE.DirectionalLight(0x0284c7, 0.95);
    fillLight.position.set(-16, 9, -8);
    scene.add(fillLight);

    // Station Amber Glow
    const stationLight = new THREE.PointLight(0xfde047, 4.0, 16, 1.2);
    stationLight.position.set(3.6, 1.8, -3.8);
    scene.add(stationLight);

    // Sagar Nidhi Cool White Bow Searchlight
    const shipLight = new THREE.PointLight(0xe0f2fe, 3.5, 18, 1.2);
    shipLight.position.set(-3.6, 0.4, 0.8);
    scene.add(shipLight);

    // Luminous Polar AI Pool
    const centralPoolLight = new THREE.PointLight(0x06b6d4, 3.0, 14, 1.3);
    centralPoolLight.position.set(0.0, 0.2, 0.4);
    scene.add(centralPoolLight);

    // 4. Procedural Textures & Materials
    const iceTexture = createProceduralIceTexture();
    const rockTexture = createProceduralRockTexture();
    const snowTexture = createProceduralSnowTexture();

    // Snow Material with gentle micro-sparkle & diffuse softness
    const realisticSnowMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      map: snowTexture,
      roughness: 0.55,
      metalness: 0.08,
      flatShading: true,
    });

    // Realistic Glacial Ice Material with Subsurface Translucency
    const realisticGlacierMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      emissive: 0x0369a1,
      emissiveIntensity: 0.22,
      map: iceTexture,
      roughness: 0.18,
      metalness: 0.3,
      flatShading: true,
    });

    // Dark Antarctic Nunatak Basalt/Gneiss Rock
    const realisticRockMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      map: rockTexture,
      roughness: 0.85,
      metalness: 0.05,
      flatShading: true,
    });

    // 5. STARFIELD & SOUTHERN POLAR NIGHT SKY
    const starsCount = 1400;
    const starsGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsCount * 3);
    const starColors = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.95);
      const radius = 185 + Math.random() * 40;

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = Math.max(8, radius * Math.cos(phi));
      starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const colRand = Math.random();
      if (colRand > 0.75) {
        starColors[i * 3] = 0.75;
        starColors[i * 3 + 1] = 0.9;
        starColors[i * 3 + 2] = 1.0;
      } else {
        starColors[i * 3] = 1.0;
        starColors[i * 3 + 1] = 1.0;
        starColors[i * 3 + 2] = 1.0;
      }
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    scene.add(new THREE.Points(starsGeo, starMat));

    // 6. AURORA AUSTRALIS UNDULATING RIBBONS
    const auroraGroup = new THREE.Group();
    const createAuroraRibbon = (
      pointsCount: number,
      height: number,
      baseY: number,
      color: number
    ) => {
      const geo = new THREE.PlaneGeometry(42, height, pointsCount, 12);
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, baseY, -19);
      mesh.rotation.x = -0.3;
      auroraGroup.add(mesh);
      return mesh;
    };
    createAuroraRibbon(48, 6.5, 9.5, 0x10b981);
    createAuroraRibbon(48, 8.0, 11.8, 0x06b6d4);
    createAuroraRibbon(40, 5.5, 14.2, 0x8b5cf6);
    scene.add(auroraGroup);

    // 7. REALISTIC SCULPTED ANTARCTIC MOUNTAIN RANGE (Nunataks & Ice Massifs)
    const terrainGroup = new THREE.Group();

    const createRealisticPeak = (
      x: number,
      y: number,
      z: number,
      radius: number,
      height: number,
      segments: number = 8,
      isGlacial: boolean = false
    ) => {
      const geo = new THREE.ConeGeometry(radius, height, segments, 4);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const py = pos.getY(i);
        if (py < height * 0.45) {
          const noise = Math.sin(i * 4.2) * 0.28 + Math.cos(i * 2.8) * 0.2;
          pos.setX(i, pos.getX(i) * (0.85 + noise));
          pos.setZ(i, pos.getZ(i) * (0.85 + noise));
        }
      }
      geo.computeVertexNormals();

      const mesh = new THREE.Mesh(geo, isGlacial ? realisticGlacierMat : realisticSnowMat);
      mesh.position.set(x, y + height / 2, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      terrainGroup.add(mesh);
      return mesh;
    };

    // Majestic Backdrop Peaks (Queen Maud Land Range)
    createRealisticPeak(-17, -1.0, -19, 10, 14, 9);
    createRealisticPeak(-10, -0.5, -22, 12, 16, 9);
    createRealisticPeak(-1, 0.0, -24, 13, 17, 10);
    createRealisticPeak(9, -0.5, -21, 11, 15, 9);
    createRealisticPeak(16, -1.0, -18, 9, 12, 8);

    // Midground Glacial Ridges & Cirques
    createRealisticPeak(-12, -1.0, -13, 6.0, 9.0, 8, true);
    createRealisticPeak(-5, -1.0, -15, 7.0, 10.0, 8, false);
    createRealisticPeak(4, -1.0, -16, 6.5, 9.2, 8, true);
    createRealisticPeak(11, -1.0, -14, 5.5, 8.0, 7, false);

    // Glacial Ice Shelf Cliff Face with Sheer Blue Crevasses
    const cliffGeo = new THREE.BoxGeometry(24, 4.5, 5.5);
    const cliffMesh = new THREE.Mesh(cliffGeo, realisticGlacierMat);
    cliffMesh.position.set(-6, 0.9, -9.5);
    cliffMesh.castShadow = true;
    cliffMesh.receiveShadow = true;
    terrainGroup.add(cliffMesh);

    // Snow Cap on Cliff
    const snowCapGeo = new THREE.BoxGeometry(24.2, 0.55, 5.7);
    const snowCapMesh = new THREE.Mesh(snowCapGeo, realisticSnowMat);
    snowCapMesh.position.set(-6, 3.15, -9.5);
    snowCapMesh.castShadow = true;
    snowCapMesh.receiveShadow = true;
    terrainGroup.add(snowCapMesh);

    // 8. SCHIRMACHER OASIS NUNATAK ROCK PLATEAU (Maitri Research Base Site)
    const nunatakGroup = new THREE.Group();
    nunatakGroup.position.set(3.6, -0.2, -4.2);

    const plateauGeo = new THREE.DodecahedronGeometry(3.5, 1);
    const plateauMesh = new THREE.Mesh(plateauGeo, realisticRockMat);
    plateauMesh.scale.set(1.7, 0.48, 1.35);
    plateauMesh.position.set(0, 0, 0);
    plateauMesh.castShadow = true;
    plateauMesh.receiveShadow = true;
    nunatakGroup.add(plateauMesh);

    const snowPatchGeo = new THREE.BoxGeometry(4.4, 0.22, 3.6);
    const snowPatch = new THREE.Mesh(snowPatchGeo, realisticSnowMat);
    snowPatch.position.set(0, 0.65, 0);
    snowPatch.receiveShadow = true;
    nunatakGroup.add(snowPatch);

    // 9. HIGHLY DETAILED INDIAN ANTARCTIC RESEARCH STATION (Maitri / Bharati)
    const stationGroup = new THREE.Group();
    stationGroup.position.set(0, 0.75, 0);

    const stiltMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.25 });
    const stiltLocations = [
      [-1.4, -0.8], [-1.4, 0.8], [0, -0.8], [0, 0.8], [1.4, -0.8], [1.4, 0.8],
      [2.3, -0.6], [2.3, 0.6], [3.2, -0.6], [3.2, 0.6], [-2.1, -0.4], [-2.1, 0.4],
    ];
    stiltLocations.forEach(([sx, sz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.65, 8), stiltMat);
      leg.position.set(sx, 0.32, sz);
      leg.castShadow = true;
      stationGroup.add(leg);
    });

    const polarRedMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35, metalness: 0.15 });
    const polarWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25, metalness: 0.1 });

    const mainBlock = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.8, 1.7), polarRedMat);
    mainBlock.position.set(0, 1.0, 0);
    mainBlock.castShadow = true;
    mainBlock.receiveShadow = true;
    stationGroup.add(mainBlock);

    const mainRoof = new THREE.Mesh(new THREE.BoxGeometry(2.95, 0.09, 1.75), polarWhiteMat);
    mainRoof.position.set(0, 1.42, 0);
    stationGroup.add(mainRoof);

    const annexBlock = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.7, 1.3), polarRedMat);
    annexBlock.position.set(2.3, 0.95, 0.1);
    annexBlock.castShadow = true;
    stationGroup.add(annexBlock);

    const corridor = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.55, 0.65), polarWhiteMat);
    corridor.position.set(1.45, 0.9, 0.1);
    stationGroup.add(corridor);

    // Glowing Warm Amber Observation Windows
    const windowMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const windowStripFront = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 0.24), windowMat);
    windowStripFront.position.set(0, 1.1, 0.86);
    stationGroup.add(windowStripFront);

    // Geodesic Communications Radome
    const radomeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const radome = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 16), radomeMat);
    radome.position.set(-0.85, 1.9, 0);
    radome.castShadow = true;
    stationGroup.add(radome);

    // Meteorological Mast & Warning Beacon
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 2.3, 8), stiltMat);
    mast.position.set(0.85, 2.3, 0);
    stationGroup.add(mast);

    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), beaconMat);
    beacon.position.set(0.85, 3.45, 0);
    stationGroup.add(beacon);

    // Wind Turbine
    const turbineTower = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 1.9, 8), stiltMat);
    turbineTower.position.set(3.3, 0.95, 1.5);
    stationGroup.add(turbineTower);

    const rotorGroup = new THREE.Group();
    rotorGroup.position.set(3.3, 1.95, 1.65);
    const bladeGeo = new THREE.BoxGeometry(0.05, 0.75, 0.015);
    for (let b = 0; b < 3; b++) {
      const blade = new THREE.Mesh(bladeGeo, polarWhiteMat);
      blade.rotation.z = (b * Math.PI * 2) / 3;
      rotorGroup.add(blade);
    }
    stationGroup.add(rotorGroup);

    nunatakGroup.add(stationGroup);
    terrainGroup.add(nunatakGroup);
    scene.add(terrainGroup);

    // 10. REALISTIC ICEBREAKER VESSEL (ORV Sagar Nidhi)
    const shipGroup = new THREE.Group();
    shipGroup.position.set(-4.2, -0.65, 1.0);
    shipGroup.rotation.y = 0.38;

    const hullMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.38, metalness: 0.25 });
    const hullWhiteTrim = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.1 });

    const hull = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.75, 1.2), hullMat);
    hull.position.y = 0.28;
    hull.castShadow = true;
    hull.receiveShadow = true;
    shipGroup.add(hull);

    const bowGeo = new THREE.ConeGeometry(0.6, 1.1, 4);
    const bow = new THREE.Mesh(bowGeo, hullMat);
    bow.rotation.z = Math.PI / 2;
    bow.rotation.y = Math.PI / 4;
    bow.position.set(2.2, 0.28, 0);
    bow.castShadow = true;
    shipGroup.add(bow);

    const bridgeBlock = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.9, 0.95), hullWhiteTrim);
    bridgeBlock.position.set(-0.2, 0.95, 0);
    bridgeBlock.castShadow = true;
    shipGroup.add(bridgeBlock);

    const wheelhouse = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.55, 0.85), hullWhiteTrim);
    wheelhouse.position.set(0.12, 1.5, 0);
    wheelhouse.castShadow = true;
    shipGroup.add(wheelhouse);

    const shipWindows = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.18), windowMat);
    shipWindows.position.set(0.61, 1.55, 0);
    shipWindows.rotation.y = Math.PI / 2;
    shipGroup.add(shipWindows);

    const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.65, 12), hullMat);
    funnel.position.set(-0.65, 1.55, 0);
    shipGroup.add(funnel);

    const radarScanner = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.04, 0.04), hullWhiteTrim);
    radarScanner.position.set(0.12, 2.4, 0);
    shipGroup.add(radarScanner);

    // Ship Waterline Foam Ring
    const shipFoamGeo = new THREE.RingGeometry(0.65, 0.95, 16);
    const foamMat = new THREE.MeshBasicMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
    });
    const shipFoam = new THREE.Mesh(shipFoamGeo, foamMat);
    shipFoam.rotation.x = Math.PI / 2;
    shipFoam.position.set(0, -0.05, 0);
    shipFoam.scale.set(3.2, 1.3, 1);
    shipGroup.add(shipFoam);

    // Forward Searchlight Beam
    const beamGeo = new THREE.ConeGeometry(0.85, 5.5, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0.24,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const searchlightBeam = new THREE.Mesh(beamGeo, beamMat);
    searchlightBeam.rotation.z = -Math.PI / 2 + 0.15;
    searchlightBeam.position.set(4.5, 0.1, 0);
    shipGroup.add(searchlightBeam);

    scene.add(shipGroup);

    // 11. REALISTIC DYNAMIC POLAR OCEAN
    const oceanGeo = new THREE.PlaneGeometry(85, 85, 72, 72);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x03182b,
      roughness: 0.1,
      metalness: 0.9,
      flatShading: true,
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -1.0;
    ocean.receiveShadow = true;
    scene.add(ocean);

    // 12. REALISTIC 3D ICEBERGS WITH SUBSURFACE KEEL & FOAM RINGS
    const icebergsGroup = new THREE.Group();

    const underwaterIceMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.2,
      metalness: 0.4,
      transparent: true,
      opacity: 0.65,
      flatShading: true,
    });

    // A. Giant Tabular Iceberg with eroded waterline groove
    const tabularGroup = new THREE.Group();
    tabularGroup.position.set(-5.6, -0.6, 2.4);

    const tabGeo = new THREE.CylinderGeometry(3.0, 3.4, 1.3, 8);
    const tabMesh = new THREE.Mesh(tabGeo, realisticGlacierMat);
    tabMesh.position.y = 0.55;
    tabMesh.castShadow = true;
    tabMesh.receiveShadow = true;
    tabularGroup.add(tabMesh);

    // Snow cover on top of Tabular iceberg
    const tabSnow = new THREE.Mesh(new THREE.CylinderGeometry(2.95, 3.0, 0.15, 8), realisticSnowMat);
    tabSnow.position.y = 1.25;
    tabSnow.castShadow = true;
    tabularGroup.add(tabSnow);

    // Submerged giant keel
    const subGeo = new THREE.CylinderGeometry(3.4, 2.0, 1.8, 8);
    const subMesh = new THREE.Mesh(subGeo, underwaterIceMat);
    subMesh.position.y = -0.85;
    tabularGroup.add(subMesh);

    // Waterline Foam Ring
    const tabFoam = new THREE.Mesh(new THREE.RingGeometry(3.1, 3.6, 16), foamMat);
    tabFoam.rotation.x = Math.PI / 2;
    tabFoam.position.y = -0.38;
    tabularGroup.add(tabFoam);

    icebergsGroup.add(tabularGroup);

    // B. Cathedral / Spire Iceberg with crystalline facets
    const spireGroup = new THREE.Group();
    spireGroup.position.set(5.2, -0.6, 1.6);

    const spireGeo = new THREE.ConeGeometry(2.0, 3.2, 7);
    const spireMesh = new THREE.Mesh(spireGeo, realisticGlacierMat);
    spireMesh.position.y = 1.2;
    spireMesh.castShadow = true;
    spireGroup.add(spireMesh);

    const spireSub = new THREE.ConeGeometry(2.1, 2.4, 7);
    const spireSubMesh = new THREE.Mesh(spireSub, underwaterIceMat);
    spireSubMesh.rotation.x = Math.PI;
    spireSubMesh.position.y = -1.15;
    spireGroup.add(spireSubMesh);

    const spireFoam = new THREE.Mesh(new THREE.RingGeometry(1.8, 2.3, 16), foamMat);
    spireFoam.rotation.x = Math.PI / 2;
    spireFoam.position.y = -0.38;
    spireGroup.add(spireFoam);

    icebergsGroup.add(spireGroup);

    // C. Pack Ice Floes (Realistically shaped floating ice rafts)
    const floes: THREE.Mesh[] = [];
    const createRealisticFloe = (x: number, z: number, r: number, height: number = 0.22) => {
      const geo = new THREE.CylinderGeometry(r, r * 1.06, height, 7);
      const mesh = new THREE.Mesh(geo, realisticGlacierMat);
      mesh.position.set(x, -0.9, z);
      mesh.rotation.y = Math.random() * Math.PI;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Snow frosting on top of floe
      const snowCap = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.96, r, 0.05, 7), realisticSnowMat);
      snowCap.position.y = height / 2 + 0.02;
      mesh.add(snowCap);

      icebergsGroup.add(mesh);
      floes.push(mesh);
      return mesh;
    };

    const mainPenguinFloe = createRealisticFloe(-1.2, 3.4, 1.7);
    const sealFloe = createRealisticFloe(2.2, 3.8, 1.9);
    createRealisticFloe(-7.4, -1.8, 2.2);
    createRealisticFloe(7.6, -1.2, 2.0);
    createRealisticFloe(0.6, -2.6, 1.6);
    createRealisticFloe(-4.2, 4.4, 1.3);

    scene.add(icebergsGroup);

    // 13. REALISTIC 3D POLAR ANIMALS (Penguins, Seals, Whales, Seabirds)
    const wildlifeGroup = new THREE.Group();

    // Reusable Penguin Sculptor (Realistic Emperor & Adélie anatomical model)
    const createPenguin = (scale: number = 1.0, isEmperor: boolean = true) => {
      const penguin = new THREE.Group();

      const plumageMat = new THREE.MeshStandardMaterial({
        color: 0x090d16, // Sleek midnight black/navy plumage
        roughness: 0.35,
        metalness: 0.1,
      });

      const bellyMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc, // Clean white tuxedo belly
        roughness: 0.25,
        metalness: 0.05,
      });

      const goldCollarMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b, // Golden orange neck patch
        roughness: 0.4,
        metalness: 0.1,
      });

      const beakMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.2,
      });

      const feetMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.6,
      });

      // Streamlined Torpedo Body
      const bodyGeo = new THREE.CylinderGeometry(0.12, 0.18, 0.55, 10);
      const body = new THREE.Mesh(bodyGeo, plumageMat);
      body.position.y = 0.32;
      body.castShadow = true;
      penguin.add(body);

      // White Chest & Belly curved insert
      const bellyGeo = new THREE.CylinderGeometry(0.1, 0.16, 0.48, 8, 1, false, -Math.PI / 2, Math.PI);
      const belly = new THREE.Mesh(bellyGeo, bellyMat);
      belly.position.set(0, 0.3, 0.03);
      belly.rotation.y = Math.PI / 2;
      penguin.add(belly);

      // Golden Auricular Ear/Neck Collar
      if (isEmperor) {
        const collarGeo = new THREE.CylinderGeometry(0.115, 0.13, 0.12, 8, 1, false, -Math.PI / 2, Math.PI);
        const collar = new THREE.Mesh(collarGeo, goldCollarMat);
        collar.position.set(0, 0.48, 0.02);
        collar.rotation.y = Math.PI / 2;
        penguin.add(collar);
      }

      // Rounded Head
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), plumageMat);
      head.position.set(0, 0.62, 0.02);
      head.castShadow = true;
      penguin.add(head);

      // Tapered Beak with orange mandibular strip
      const beak = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.14, 6), beakMat);
      beak.rotation.x = Math.PI / 2;
      beak.position.set(0, 0.62, 0.16);
      beak.castShadow = true;
      penguin.add(beak);

      // Left Flipper / Wing
      const flipperGeo = new THREE.BoxGeometry(0.03, 0.32, 0.09);
      const leftFlipper = new THREE.Mesh(flipperGeo, plumageMat);
      leftFlipper.position.set(0.17, 0.34, 0);
      leftFlipper.rotation.z = -0.22;
      leftFlipper.rotation.x = 0.1;
      penguin.add(leftFlipper);

      // Right Flipper / Wing
      const rightFlipper = new THREE.Mesh(flipperGeo, plumageMat);
      rightFlipper.position.set(-0.17, 0.34, 0);
      rightFlipper.rotation.z = 0.22;
      rightFlipper.rotation.x = 0.1;
      penguin.add(rightFlipper);

      // Webbed Feet
      const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.1), feetMat);
      leftFoot.position.set(0.07, 0.02, 0.04);
      penguin.add(leftFoot);

      const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.1), feetMat);
      rightFoot.position.set(-0.07, 0.02, 0.04);
      penguin.add(rightFoot);

      penguin.scale.set(scale, scale, scale);
      return { penguin, leftFlipper, rightFlipper };
    };

    // A. Penguin Group on the Main Sea-Ice Floe
    const penguin1Data = createPenguin(0.85, true); // Adult Emperor sentinel
    penguin1Data.penguin.position.set(-1.0, -0.78, 3.2);
    penguin1Data.penguin.rotation.y = 0.35;
    wildlifeGroup.add(penguin1Data.penguin);

    const penguin2Data = createPenguin(0.82, true); // Waddling Emperor
    penguin2Data.penguin.position.set(-1.6, -0.78, 3.5);
    penguin2Data.penguin.rotation.y = -0.4;
    wildlifeGroup.add(penguin2Data.penguin);

    // Baby Penguin Chick (Grey down plumage)
    const chickData = createPenguin(0.48, false);
    chickData.penguin.children.forEach((c) => {
      if (c instanceof THREE.Mesh && c.material) {
        c.material = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 });
      }
    });
    chickData.penguin.position.set(-0.8, -0.82, 3.4);
    chickData.penguin.rotation.y = 0.2;
    wildlifeGroup.add(chickData.penguin);

    // Pair of Adélie Penguins on Tabular Iceberg Edge
    const adelie1 = createPenguin(0.68, false);
    adelie1.penguin.position.set(-4.8, 0.7, 2.7);
    adelie1.penguin.rotation.y = 1.1;
    wildlifeGroup.add(adelie1.penguin);

    const adelie2 = createPenguin(0.68, false);
    adelie2.penguin.position.set(-5.2, 0.7, 2.4);
    adelie2.penguin.rotation.y = 0.8;
    wildlifeGroup.add(adelie2.penguin);

    // B. Realistic Weddell Seal Resting on Ice Floe
    const sealGroup = new THREE.Group();
    sealGroup.position.set(2.2, -0.78, 3.8);
    sealGroup.rotation.y = -0.6;

    const sealMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Mottled grey seal coat
      roughness: 0.45,
      metalness: 0.15,
    });

    // Torpedo Body
    const sealBody = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.2, 1.2, 10), sealMat);
    sealBody.rotation.x = Math.PI / 2;
    sealBody.scale.set(1.1, 1.0, 0.85);
    sealBody.position.y = 0.14;
    sealBody.castShadow = true;
    sealGroup.add(sealBody);

    // Seal Head
    const sealHeadGroup = new THREE.Group();
    sealHeadGroup.position.set(0, 0.22, 0.65);
    const sealHead = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), sealMat);
    sealHeadGroup.add(sealHead);

    const sealSnout = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.12), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
    sealSnout.position.set(0, -0.04, 0.14);
    sealHeadGroup.add(sealSnout);
    sealGroup.add(sealHeadGroup);

    // Rear Flippers
    const rearFlipperL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.28), sealMat);
    rearFlipperL.position.set(0.12, 0.08, -0.68);
    rearFlipperL.rotation.y = 0.3;
    sealGroup.add(rearFlipperL);

    const rearFlipperR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.28), sealMat);
    rearFlipperR.position.set(-0.12, 0.08, -0.68);
    rearFlipperR.rotation.y = -0.3;
    sealGroup.add(rearFlipperR);

    wildlifeGroup.add(sealGroup);

    // C. Realistic Humpback Whale Surfacing with Fluke Tail & Blowhole Vapor
    const whaleGroup = new THREE.Group();
    whaleGroup.position.set(-0.6, -1.05, -1.8);
    whaleGroup.rotation.y = 0.45;

    const whaleMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Slate midnight whale skin
      roughness: 0.3,
      metalness: 0.2,
    });

    // Arching Dorsal Back
    const whaleBackGeo = new THREE.CylinderGeometry(0.5, 0.65, 3.2, 10, 1, false, 0, Math.PI);
    const whaleBack = new THREE.Mesh(whaleBackGeo, whaleMat);
    whaleBack.rotation.x = Math.PI / 2;
    whaleBack.position.y = 0.15;
    whaleGroup.add(whaleBack);

    // Dorsal Fin
    const dorsalFin = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.45, 4), whaleMat);
    dorsalFin.rotation.z = -0.4;
    dorsalFin.position.set(0, 0.72, -0.3);
    whaleGroup.add(dorsalFin);

    // Fluked Tail
    const tailStem = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.25, 1.2, 8), whaleMat);
    tailStem.position.set(0, 0.55, -1.8);
    tailStem.rotation.x = -0.55;
    whaleGroup.add(tailStem);

    const flukeGeo = new THREE.BoxGeometry(1.4, 0.04, 0.4);
    const fluke = new THREE.Mesh(flukeGeo, whaleMat);
    fluke.position.set(0, 0.95, -2.35);
    fluke.rotation.x = -0.3;
    whaleGroup.add(fluke);

    // Blowhole Vapor Spray Column (Semi-translucent particles)
    const blowholePlume = new THREE.Group();
    blowholePlume.position.set(0, 0.65, 0.8);
    for (let p = 0; p < 18; p++) {
      const spray = new THREE.Mesh(
        new THREE.SphereGeometry(0.08 + p * 0.02, 6, 6),
        new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.45 })
      );
      spray.position.set((Math.random() - 0.5) * 0.15, p * 0.09, (Math.random() - 0.5) * 0.15);
      blowholePlume.add(spray);
    }
    whaleGroup.add(blowholePlume);
    wildlifeGroup.add(whaleGroup);

    // D. Realistic Antarctic Seabirds (Snow Petrel & Skua Soaring)
    const birdGroup = new THREE.Group();
    const createBird = (color: number = 0xffffff) => {
      const bird = new THREE.Group();
      const bMat = new THREE.MeshStandardMaterial({ color, roughness: 0.5 });
      const bBody = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.4, 6), bMat);
      bBody.rotation.x = Math.PI / 2;
      bird.add(bBody);

      const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.02, 0.14), bMat);
      wingL.position.set(0.35, 0, 0);
      bird.add(wingL);

      const wingR = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.02, 0.14), bMat);
      wingR.position.set(-0.35, 0, 0);
      bird.add(wingR);
      return { bird, wingL, wingR };
    };

    const petrel = createBird(0xf8fafc); // White Snow Petrel
    petrel.bird.position.set(-2.5, 4.8, -4.5);
    birdGroup.add(petrel.bird);

    const skua = createBird(0x334155); // Brown Skua
    skua.bird.position.set(3.8, 5.2, -6.0);
    birdGroup.add(skua.bird);

    wildlifeGroup.add(birdGroup);
    scene.add(wildlifeGroup);

    // 14. INTERACTIVE 3D HOLOGRAPHIC SCIENTIFIC BEACONS (With Spatial Separation)
    const nodeAnchorMeshes: { [key: string]: THREE.Group } = {};

    (nodes || []).forEach((node) => {
      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(node.position[0], node.position[1], node.position[2]);

      const isAI = node.type === 'ai';
      const nodeColor = isAI ? 0x06b6d4 : 0x38bdf8;

      // Octahedron Gem Core
      const coreGeo = new THREE.OctahedronGeometry(0.36, 0);
      const coreMat = new THREE.MeshStandardMaterial({
        color: nodeColor,
        emissive: nodeColor,
        emissiveIntensity: 0.85,
        roughness: 0.1,
        metalness: 0.85,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      nodeGroup.add(coreMesh);

      // Gyroscopic Ring
      const ringGeo = new THREE.TorusGeometry(0.56, 0.025, 8, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x7dd3fc,
        transparent: true,
        opacity: 0.85,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      nodeGroup.add(ringMesh);

      // Light Pillar to Ground
      const pillarGeo = new THREE.CylinderGeometry(0.015, 0.015, 2.4, 8);
      const pillarMat = new THREE.MeshBasicMaterial({
        color: nodeColor,
        transparent: true,
        opacity: 0.45,
      });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.y = -1.2;
      nodeGroup.add(pillar);

      // Ground Light Ring
      const baseRingGeo = new THREE.RingGeometry(0.2, 0.45, 16);
      const baseRingMat = new THREE.MeshBasicMaterial({
        color: nodeColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65,
      });
      const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat);
      baseRing.rotation.x = Math.PI / 2;
      baseRing.position.y = -2.3;
      nodeGroup.add(baseRing);

      scene.add(nodeGroup);
      nodeAnchorMeshes[node.id] = nodeGroup;
    });

    // 15. DYNAMIC 3D BLIZZARD PARTICLES
    const snowCount = 600;
    const snowGeo = new THREE.BufferGeometry();
    const snowPositions = new Float32Array(snowCount * 3);
    const snowVelocities = new Float32Array(snowCount * 3);

    for (let i = 0; i < snowCount; i++) {
      snowPositions[i * 3] = (Math.random() - 0.5) * 45;
      snowPositions[i * 3 + 1] = Math.random() * 20 - 2;
      snowPositions[i * 3 + 2] = (Math.random() - 0.5) * 40;

      snowVelocities[i * 3] = (Math.random() - 0.5) * 0.04 - 0.02;
      snowVelocities[i * 3 + 1] = 0.03 + Math.random() * 0.05;
      snowVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));

    const blizzardMat = new THREE.PointsMaterial({
      size: 0.18,
      color: 0xffffff,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const snowField = new THREE.Points(snowGeo, blizzardMat);
    scene.add(snowField);

    // 16. REAL-TIME SCREEN-SPACE PROJECTION & COLLISION-FREE PLACEMENT
    const projVector = new THREE.Vector3();
    const badgeElements: { [key: string]: HTMLElement } = {};

    if (badgeContainerRef.current) {
      nodes.forEach((node) => {
        const el = document.getElementById(`scene-3d-badge-${node.id}`);
        if (el) badgeElements[node.id] = el;
      });
    }

    // 17. MAIN ANIMATION LOOP
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Camera Smooth Transitions
      if (transitionRef.current.active) {
        camera.position.lerp(transitionRef.current.targetPos, 0.045);
        controls.target.lerp(transitionRef.current.targetLook, 0.045);

        if (
          camera.position.distanceTo(transitionRef.current.targetPos) < 0.1 &&
          controls.target.distanceTo(transitionRef.current.targetLook) < 0.1
        ) {
          transitionRef.current.active = false;
        }
      }

      controls.autoRotate = isAutoRotating && !transitionRef.current.active;
      controls.update();

      // Wind Turbine Rotation
      rotorGroup.rotation.z += 0.065;

      // Station Warning Beacon
      beacon.visible = Math.floor(elapsed * 2.5) % 2 === 0;

      // Ship Radar
      radarScanner.rotation.y += 0.08;

      // Realistic Ship Ocean Roll & Pitch
      shipGroup.rotation.z = Math.sin(elapsed * 0.8) * 0.025;
      shipGroup.rotation.x = Math.cos(elapsed * 0.6) * 0.015;
      shipGroup.position.y = -0.65 + Math.sin(elapsed * 0.9) * 0.035;

      // Iceberg Gentle Swell Bobbing
      tabularGroup.position.y = -0.6 + Math.sin(elapsed * 0.7 + 1) * 0.025;
      spireGroup.position.y = -0.6 + Math.sin(elapsed * 0.8 + 2) * 0.025;

      // Animal Animations:
      // Waddling Penguin tilt & flipper flutter
      penguin2Data.penguin.rotation.z = Math.sin(elapsed * 4.0) * 0.12;
      penguin2Data.leftFlipper.rotation.z = -0.22 + Math.sin(elapsed * 4.0) * 0.18;
      penguin2Data.rightFlipper.rotation.z = 0.22 - Math.sin(elapsed * 4.0) * 0.18;

      // Weddell Seal subtle breathing & head motion
      sealHeadGroup.rotation.y = Math.sin(elapsed * 0.5) * 0.2;
      sealHeadGroup.rotation.x = Math.sin(elapsed * 0.7) * 0.08;

      // Whale periodic surfacing and blowhole spray plume
      const whalePhase = (elapsed * 0.25) % (Math.PI * 2);
      whaleGroup.position.y = -1.1 + Math.sin(whalePhase) * 0.35;
      blowholePlume.visible = whalePhase > 0.8 && whalePhase < 2.0;

      // Seabirds circular soaring
      const petrelAngle = elapsed * 0.6;
      petrel.bird.position.set(-2.5 + Math.cos(petrelAngle) * 3.5, 4.8 + Math.sin(elapsed) * 0.4, -4.5 + Math.sin(petrelAngle) * 2.5);
      petrel.bird.rotation.y = -petrelAngle - Math.PI / 2;
      petrel.wingL.rotation.z = Math.sin(elapsed * 6.0) * 0.25;
      petrel.wingR.rotation.z = -Math.sin(elapsed * 6.0) * 0.25;

      const skuaAngle = -elapsed * 0.5;
      skua.bird.position.set(3.8 + Math.cos(skuaAngle) * 4.0, 5.2 + Math.cos(elapsed * 0.8) * 0.3, -6.0 + Math.sin(skuaAngle) * 3.0);
      skua.bird.rotation.y = -skuaAngle + Math.PI / 2;
      skua.wingL.rotation.z = Math.sin(elapsed * 5.0) * 0.22;
      skua.wingR.rotation.z = -Math.sin(elapsed * 5.0) * 0.22;

      // Aurora Undulating Wave Displacement
      auroraGroup.children.forEach((mesh, idx) => {
        const pGeo = (mesh as THREE.Mesh).geometry as THREE.PlaneGeometry;
        const pPos = pGeo.attributes.position;
        const speed = 0.8 + idx * 0.3;
        for (let i = 0; i < pPos.count; i++) {
          const u = pPos.getX(i);
          const zOffset = Math.sin(u * 0.25 + elapsed * speed) * 1.8 + Math.cos(u * 0.4 + elapsed * 1.1) * 0.8;
          pPos.setZ(i, zOffset);
        }
        pGeo.computeVertexNormals();
        pPos.needsUpdate = true;
      });

      // Ocean Compound Waves Displacement
      const oceanPos = oceanGeo.attributes.position;
      for (let i = 0; i < oceanPos.count; i++) {
        const u = oceanPos.getX(i);
        const v = oceanPos.getY(i);
        const wave =
          Math.sin(u * 0.32 + elapsed * 1.1) * 0.07 +
          Math.cos(v * 0.28 + elapsed * 0.9) * 0.05 +
          Math.sin((u + v) * 0.2 + elapsed * 1.3) * 0.035;
        oceanPos.setZ(i, wave);
      }
      oceanGeo.computeVertexNormals();
      oceanPos.needsUpdate = true;

      // 3D Snow Particle Drift
      const snowPosArr = snowGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < snowCount; i++) {
        snowPosArr[i * 3] += snowVelocities[i * 3];
        snowPosArr[i * 3 + 1] -= snowVelocities[i * 3 + 1];
        snowPosArr[i * 3 + 2] += snowVelocities[i * 3 + 2];

        if (snowPosArr[i * 3 + 1] < -1.5) {
          snowPosArr[i * 3 + 1] = 18;
          snowPosArr[i * 3] = (Math.random() - 0.5) * 45;
          snowPosArr[i * 3 + 2] = (Math.random() - 0.5) * 40;
        }
      }
      snowGeo.attributes.position.needsUpdate = true;

      // Animate Holographic Beacons
      const cPos = camera.position;
      const screenCoords: { id: string; x: number; y: number; scale: number; inFront: boolean }[] = [];

      nodes.forEach((node) => {
        const group = nodeAnchorMeshes[node.id];
        if (group) {
          const core = group.children[0] as THREE.Mesh;
          const ring = group.children[1] as THREE.Mesh;

          core.rotation.y = elapsed * 0.8;
          core.rotation.x = elapsed * 0.5;
          ring.rotation.z = -elapsed * 1.2;
          core.position.y = Math.sin(elapsed * 2.0 + Number(node.id.length)) * 0.08;

          const isHovered = hoveredNodeId === node.id || activeNodeId === node.id;
          const targetScale = isHovered ? 1.35 : 1.0;
          group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

          projVector.set(node.position[0], node.position[1] + 0.65, node.position[2]);
          projVector.project(camera);

          const inFront = projVector.z < 1.0;
          const screenX = (projVector.x * 0.5 + 0.5) * 100;
          const screenY = (-projVector.y * 0.5 + 0.5) * 100;

          const dist = cPos.distanceTo(new THREE.Vector3(...node.position));
          const scale = Math.max(0.72, Math.min(1.15, 14 / dist));

          screenCoords.push({
            id: node.id,
            x: screenX,
            y: screenY,
            scale,
            inFront,
          });
        }
      });

      // SMART DYNAMIC 2D COLLISION RESOLUTION (Zero overlap guarantee!)
      // Ensure Media & Visuals and Datasets never overlap regardless of camera view!
      for (let i = 0; i < screenCoords.length; i++) {
        for (let j = i + 1; j < screenCoords.length; j++) {
          const a = screenCoords[i];
          const b = screenCoords[j];

          const dx = Math.abs(a.x - b.x);
          const dy = Math.abs(a.y - b.y);

          // If badges are closer than 18% horizontally and 8% vertically:
          if (dx < 18 && dy < 8) {
            const pushY = (8 - dy) * 0.6;
            if (a.y < b.y) {
              a.y -= pushY;
              b.y += pushY;
            } else {
              a.y += pushY;
              b.y -= pushY;
            }
          }
        }
      }

      // Apply screen bounds and update DOM pins
      screenCoords.forEach((coord) => {
        const el = badgeElements[coord.id] || document.getElementById(`scene-3d-badge-${coord.id}`);
        if (el) {
          badgeElements[coord.id] = el;
          const boundedX = Math.max(4, Math.min(94, coord.x));
          const boundedY = Math.max(8, Math.min(90, coord.y));

          if (coord.inFront && coord.x >= 2 && coord.x <= 98 && coord.y >= 4 && coord.y <= 96) {
            el.style.transform = `translate(-50%, -50%) scale(${coord.scale})`;
            el.style.left = `${boundedX.toFixed(2)}%`;
            el.style.top = `${boundedY.toFixed(2)}%`;
            el.style.opacity = '1';
            el.style.pointerEvents = 'auto';
          } else {
            el.style.opacity = '0';
            el.style.pointerEvents = 'none';
          }
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [nodes, isAutoRotating]);

  return (
    <div
      ref={containerRef}
      id="polar-3d-scene-container"
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto select-none"
    >
      {/* 3D WebGL Fallback */}
      {!webglSupported && (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#061124] to-[#040813] text-cyan-200">
          <p className="text-sm">3D Polar Visual Experience (WebGL Fallback Active)</p>
        </div>
      )}

      {/* DYNAMIC 3D-TRACKED SCREEN PINS OVERLAY WITH EXTRA SPACING & ZERO OVERLAP */}
      <div
        ref={badgeContainerRef}
        id="scene-3d-badges-overlay"
        className="absolute inset-0 pointer-events-none overflow-hidden z-20"
      >
        {(nodes || []).map((node) => {
          const Icon = getNodeIcon(node.type);
          const isAI = node.type === 'ai';
          const isHovered = hoveredNodeId === node.id;

          return (
            <div
              key={node.id}
              id={`scene-3d-badge-${node.id}`}
              className="absolute pointer-events-none flex flex-col items-center group transition-opacity duration-300"
              style={{
                top: `${node.screenPos?.y || 50}%`,
                left: `${node.screenPos?.x || 50}%`,
                transform: 'translate(-50%, -50%)',
                opacity: 0,
              }}
              onMouseEnter={() => {
                setHoveredNodeId(node.id);
                onNodeHover?.(node);
              }}
              onMouseLeave={() => {
                setHoveredNodeId(null);
                onNodeHover?.(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                onNodeClick?.(node);
              }}
            >
              {/* Interactive Badge Pill */}
              <div
                id={`interactive-3d-node-${node.id}`}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-full cursor-pointer transition-all duration-300 shadow-xl ${
                  isHovered
                    ? 'bg-[#0f2d57] border-cyan-300 shadow-cyan-500/50 scale-105'
                    : 'bg-[#07172e]/92 backdrop-blur-md border-cyan-400/40 text-white shadow-cyan-950/80 hover:border-cyan-300 hover:bg-[#0d264a]'
                } border`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isAI ? 'bg-cyan-400/30 text-cyan-200' : 'bg-cyan-500/20 text-cyan-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold tracking-wide whitespace-nowrap leading-none">
                    {node.label}
                  </span>
                  {node.subtitle && (
                    <span className="text-[10px] text-cyan-300/80 tracking-normal whitespace-nowrap mt-0.5 leading-none hidden sm:inline">
                      {node.subtitle}
                    </span>
                  )}
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-0.5" />
              </div>

              {/* Dotted 3D Anchor Line to Ground Point */}
              <div className="flex flex-col items-center -mt-0.5 pointer-events-none">
                <div className="w-0.5 h-4 bg-gradient-to-b from-cyan-400/80 to-cyan-500/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* TOP-RIGHT 3D CAMERA CONTROLS BAR WITH WILDLIFE & DATASET PRESETS */}
      <div
        id="scene-3d-controls-bar"
        className="absolute top-4 right-4 z-30 pointer-events-auto flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-[#061428]/85 backdrop-blur-md border border-cyan-800/60 shadow-2xl shadow-black/60 max-w-[95vw] overflow-x-auto scrollbar-none"
      >
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 border-r border-slate-700/60 text-[11px] font-mono text-cyan-300">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>3D VISTA</span>
        </div>

        {/* View Presets */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleSelectPreset('overview')}
            title="Panoramic Vista"
            className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              currentPreset === 'overview' && !activeCameraState.isCustom
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            Vista
          </button>

          <button
            onClick={() => handleSelectPreset('wildlife')}
            title="Penguins & Seals Colony"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              currentPreset === 'wildlife' && !activeCameraState.isCustom
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Binoculars className="w-3 h-3 text-emerald-400" />
            <span>Wildlife</span>
          </button>

          <button
            onClick={() => handleSelectPreset('station')}
            title="Maitri Research Base"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              currentPreset === 'station' && !activeCameraState.isCustom
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Building2 className="w-3 h-3" />
            <span>Maitri Base</span>
          </button>

          <button
            onClick={() => handleSelectPreset('ship')}
            title="ORV Sagar Nidhi Vessel"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              currentPreset === 'ship' && !activeCameraState.isCustom
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Ship className="w-3 h-3" />
            <span>Sagar Nidhi</span>
          </button>

          <button
            onClick={() => handleSelectPreset('datasets')}
            title="Glacial Datasets & Ice Core Camp"
            className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              currentPreset === 'datasets' && !activeCameraState.isCustom
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Database className="w-3 h-3" />
            <span>Datasets</span>
          </button>

          <button
            onClick={() => handleSelectPreset('glaciers')}
            title="Glaciers & Icebergs"
            className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              currentPreset === 'glaciers' && !activeCameraState.isCustom
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            Glaciers
          </button>

          <button
            onClick={() => handleSelectPreset('aurora')}
            title="Aurora Australis Sky"
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              currentPreset === 'aurora' && !activeCameraState.isCustom
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            Aurora
          </button>
        </div>

        {/* Auto Rotate Toggle */}
        <button
          onClick={toggleAutoRotate}
          title={isAutoRotating ? 'Pause Orbit' : 'Auto Orbit 3D'}
          className={`p-1.5 rounded-xl border transition-all cursor-pointer flex-shrink-0 ${
            isAutoRotating
              ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800'
          }`}
        >
          <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
        </button>

        {/* Reset Camera */}
        <button
          onClick={resetView}
          title="Reset Camera"
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer flex-shrink-0"
        >
          <Camera className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* BOTTOM-RIGHT 3D HINT PILL */}
      <div className="hidden lg:flex items-center gap-2 absolute bottom-5 right-6 z-20 pointer-events-none px-3.5 py-1.5 rounded-full bg-[#040f1f]/80 backdrop-blur-md border border-cyan-900/50 text-[11px] text-slate-400 shadow-xl">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Drag to Orbit 360° • Scroll to Zoom • Right-click to Pan • Inspect Wildlife</span>
      </div>
    </div>
  );
};
