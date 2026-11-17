'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { useStudio } from '@/lib/store';
import { createLedVisualTexture } from '@/lib/visualTextureGenerator';
import { Camera, Eye, Layers, Maximize2, Move, RotateCcw, Sparkles } from 'lucide-react';

export default function StageCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    project,
    cameraView,
    setCameraView,
    selectedObject,
    setSelectedObject,
    transformMode,
    setTransformMode,
    updateLedScreen,
    updateStage,
  } = useStudio();

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const transformControlsRef = useRef<TransformControls | null>(null);
  const dynamicMeshesGroupRef = useRef<THREE.Group | null>(null);
  const selectableMeshesMapRef = useRef<Map<string, THREE.Object3D>>(new Map());

  const [isExporting, setIsExporting] = useState(false);

  // 1. Khởi tạo Three.js Scene, Camera, Renderer và Controls
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070B14');
    scene.fog = new THREE.FogExp2('#070B14', 0.015);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
    camera.position.set(0, 5, 14);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      preserveDrawingBuffer: true, // Hỗ trợ xuất ảnh độ nét cao
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // Không cho camera chìm dưới sàn
    controls.minDistance = 2;
    controls.maxDistance = 60;
    controls.target.set(0, 1.5, -1);
    controlsRef.current = controls;

    // TransformControls (Gizmo tương tác 3D)
    const transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.size = 0.85;
    transformControls.space = 'local';
    scene.add(transformControls.getHelper());
    transformControlsRef.current = transformControls;

    // Vô hiệu hóa OrbitControls khi đang kéo Gizmo
    transformControls.addEventListener('dragging-changed', (event) => {
      controls.enabled = !event.value;
    });

    // Cập nhật tọa độ khi thả chuột
    transformControls.addEventListener('objectChange', () => {
      const targetObj = transformControls.object;
      if (targetObj && targetObj.userData && targetObj.userData.id) {
        const id = targetObj.userData.id;
        const type = targetObj.userData.type;
        if (type === 'screen') {
          updateLedScreen(id, {
            position: {
              x: Number(targetObj.position.x.toFixed(2)),
              y: Number(targetObj.position.y.toFixed(2)),
              z: Number(targetObj.position.z.toFixed(2)),
            },
            rotation: {
              x: Number(THREE.MathUtils.radToDeg(targetObj.rotation.x).toFixed(1)),
              y: Number(THREE.MathUtils.radToDeg(targetObj.rotation.y).toFixed(1)),
              z: Number(THREE.MathUtils.radToDeg(targetObj.rotation.z).toFixed(1)),
            },
          });
        }
      }
    });

    // Group chứa toàn bộ mô hình sân khấu động
    const dynamicGroup = new THREE.Group();
    scene.add(dynamicGroup);
    dynamicMeshesGroupRef.current = dynamicGroup;

    // Raycaster để chọn đối tượng bằng click chuột
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      if (transformControls.dragging) return;
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const interactables: THREE.Object3D[] = [];
      selectableMeshesMapRef.current.forEach((obj) => interactables.push(obj));

      const intersects = raycaster.intersectObjects(interactables, true);
      if (intersects.length > 0) {
        // Tìm đối tượng cấp cao nhất có userData
        let curr: THREE.Object3D | null = intersects[0].object;
        while (curr && (!curr.userData || !curr.userData.id)) {
          curr = curr.parent;
        }
        if (curr && curr.userData && curr.userData.id) {
          setSelectedObject({
            type: curr.userData.type,
            id: curr.userData.id,
            name: curr.userData.name,
            position: { x: curr.position.x, y: curr.position.y, z: curr.position.z },
            rotation: {
              x: THREE.MathUtils.radToDeg(curr.rotation.x),
              y: THREE.MathUtils.radToDeg(curr.rotation.y),
              z: THREE.MathUtils.radToDeg(curr.rotation.z),
            },
          });
        }
      }
    };

    const canvasElem = canvasRef.current;
    canvasElem.addEventListener('pointerdown', handlePointerDown);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvasElem.removeEventListener('pointerdown', handlePointerDown);
      renderer.dispose();
    };
  }, [updateLedScreen, setSelectedObject]);

  // 2. Chuyển đổi chế độ Gizmo (Translate / Rotate) và gắn vào đối tượng được chọn
  useEffect(() => {
    const tc = transformControlsRef.current;
    if (!tc) return;

    tc.setMode(transformMode);

    if (selectedObject && selectedObject.id) {
      const mesh = selectableMeshesMapRef.current.get(selectedObject.id);
      if (mesh) {
        tc.attach(mesh);
      } else {
        tc.detach();
      }
    } else {
      tc.detach();
    }
  }, [selectedObject, transformMode]);

  // 3. Chuyển đổi góc nhìn Camera (Quick Views)
  useEffect(() => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;

    if (cameraView === 'perspective') {
      cam.position.set(0, 5, 14);
      ctrl.target.set(0, 1.5, -1);
    } else if (cameraView === 'front') {
      cam.position.set(0, 2.8, 16);
      ctrl.target.set(0, 2.5, -2);
    } else if (cameraView === 'top') {
      cam.position.set(0, 22, 0.01);
      ctrl.target.set(0, 0, 0);
    } else if (cameraView === 'audience') {
      cam.position.set(0, 1.4, project.audience.distanceToStage + 4);
      ctrl.target.set(0, project.stage.height + 1.2, -2);
    } else if (cameraView === 'foh') {
      cam.position.set(0, 1.8, 18);
      ctrl.target.set(0, 2.0, -1);
    }
    ctrl.update();
  }, [cameraView, project.audience.distanceToStage, project.stage.height]);

  // 4. Dựng hình các đối tượng 3D trong Scene mỗi khi cấu hình dự án thay đổi
  useEffect(() => {
    const group = dynamicMeshesGroupRef.current;
    const scene = sceneRef.current;
    if (!group || !scene) return;

    // Xóa đối tượng cũ
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
    }
    selectableMeshesMapRef.current.clear();

    const { stage, truss, ledScreens, lighting, audio, audience, layersVisibility } = project;

    // ==========================================
    // A. Hệ thống Lưới & Sàn nhà (Metric Grid & Floor)
    // ==========================================
    if (layersVisibility.grid) {
      const gridHelper = new THREE.GridHelper(40, 40, '#DC2626', '#1E293B');
      gridHelper.position.y = 0;
      group.add(gridHelper);
    }

    // Sàn khán phòng bóng mờ
    const hallFloorGeo = new THREE.PlaneGeometry(50, 40);
    const hallFloorMat = new THREE.MeshStandardMaterial({
      color: '#0B1120',
      roughness: 0.8,
      metalness: 0.2,
    });
    const hallFloorMesh = new THREE.Mesh(hallFloorGeo, hallFloorMat);
    hallFloorMesh.rotation.x = -Math.PI / 2;
    hallFloorMesh.position.y = -0.01;
    hallFloorMesh.receiveShadow = true;
    group.add(hallFloorMesh);

    // ==========================================
    // B. Sàn sân khấu (Stage Platform)
    // ==========================================
    if (layersVisibility.stage) {
      const stageGroup = new THREE.Group();
      stageGroup.userData = { type: 'stage', id: 'stage_main', name: 'Sàn Sân Khấu' };

      // Bục chính
      const stageGeo = new THREE.BoxGeometry(stage.width, stage.height, stage.depth);
      const stageMat = new THREE.MeshStandardMaterial({
        color: stage.carpetColor,
        roughness: 0.65,
        metalness: 0.1,
      });
      const stageMesh = new THREE.Mesh(stageGeo, stageMat);
      stageMesh.position.set(0, stage.height / 2, 0);
      stageMesh.castShadow = true;
      stageMesh.receiveShadow = true;
      stageGroup.add(stageMesh);

      // Viền đèn LED chân sân khấu (Front Skirt / LED Strip)
      if (stage.hasFrontSkirt) {
        const skirtGeo = new THREE.BoxGeometry(stage.width, 0.08, 0.04);
        const skirtMat = new THREE.MeshBasicMaterial({ color: '#DC2626' });
        const skirtMesh = new THREE.Mesh(skirtGeo, skirtMat);
        skirtMesh.position.set(0, 0.04, stage.depth / 2 + 0.02);
        stageGroup.add(skirtMesh);

        // Mặt che chân bục (skirt pleated fabric)
        const frontFaceGeo = new THREE.PlaneGeometry(stage.width, stage.height);
        const frontFaceMat = new THREE.MeshStandardMaterial({ color: stage.skirtColor, roughness: 0.9 });
        const frontFaceMesh = new THREE.Mesh(frontFaceGeo, frontFaceMat);
        frontFaceMesh.position.set(0, stage.height / 2, stage.depth / 2 + 0.01);
        stageGroup.add(frontFaceMesh);
      }

      // Bậc thang lên sân khấu (Stairs)
      if (stage.hasStairs) {
        const stepCount = Math.max(2, Math.round(stage.height / 0.2));
        const stepWidth = 1.6;
        const totalRun = 1.0;
        const stepDepth = totalRun / stepCount;
        const stepHeight = stage.height / stepCount;

        const createStairGroup = (posX: number, rotY: number) => {
          const sGrp = new THREE.Group();
          for (let i = 0; i < stepCount; i++) {
            const currentStepH = (i + 1) * stepHeight;
            const sGeo = new THREE.BoxGeometry(stepWidth, currentStepH, stepDepth);
            const sMesh = new THREE.Mesh(sGeo, stageMat);
            sMesh.position.set(0, currentStepH / 2, i * stepDepth + stepDepth / 2);
            sMesh.castShadow = true;
            sMesh.receiveShadow = true;
            sGrp.add(sMesh);
          }
          sGrp.position.set(posX, 0, stage.depth / 2);
          sGrp.rotation.y = rotY;
          return sGrp;
        };

        if (stage.stairsPosition === 'front' || stage.stairsPosition === 'both') {
          stageGroup.add(createStairGroup(-stage.width / 3, 0));
          stageGroup.add(createStairGroup(stage.width / 3, 0));
        }
      }

      group.add(stageGroup);
      selectableMeshesMapRef.current.set('stage_main', stageGroup);
    }

    // ==========================================
    // C. Hệ giàn khung Truss (Truss Rigging System)
    // ==========================================
    if (layersVisibility.truss && truss.enabled) {
      const trussGroup = new THREE.Group();
      trussGroup.userData = { type: 'truss', id: 'truss_main', name: 'Giàn Khung Truss' };

      const trussMat = new THREE.MeshStandardMaterial({
        color: truss.color === 'silver' ? '#CBD5E1' : '#1E293B',
        metalness: 0.85,
        roughness: 0.35,
      });

      const sectionDim = truss.sectionSize === '400x400' ? 0.4 : 0.3;
      const tw = truss.width;
      const td = truss.depth;
      const th = truss.height;

      // Hàm tạo cột hoặc thanh truss dạng ống hộp kết cấu
      const createTrussBeam = (len: number, isVertical = false) => {
        const beamGrp = new THREE.Group();
        const mainPipeGeo = new THREE.CylinderGeometry(0.025, 0.025, len, 8);
        const halfSec = sectionDim / 2;

        const offsets = [
          [-halfSec, -halfSec],
          [halfSec, -halfSec],
          [halfSec, halfSec],
          [-halfSec, halfSec],
        ];

        offsets.forEach(([ox, oz]) => {
          const pipe = new THREE.Mesh(mainPipeGeo, trussMat);
          pipe.position.set(ox, len / 2, oz);
          pipe.castShadow = true;
          beamGrp.add(pipe);
        });

        if (!isVertical) {
          beamGrp.rotation.z = Math.PI / 2;
        }
        return beamGrp;
      };

      // 4 cột đứng
      const colPositions = [
        [-tw / 2, 0, -td / 2],
        [tw / 2, 0, -td / 2],
        [tw / 2, 0, td / 2],
        [-tw / 2, 0, td / 2],
      ];

      colPositions.forEach(([cx, cy, cz]) => {
        const col = createTrussBeam(th, true);
        col.position.set(cx, cy, cz);
        trussGroup.add(col);
      });

      // 4 dầm ngang trên đỉnh
      const topZ1 = createTrussBeam(tw);
      topZ1.position.set(tw / 2, th - sectionDim, -td / 2);
      trussGroup.add(topZ1);

      const topZ2 = createTrussBeam(tw);
      topZ2.position.set(tw / 2, th - sectionDim, td / 2);
      trussGroup.add(topZ2);

      const topX1 = createTrussBeam(td);
      topX1.rotation.y = Math.PI / 2;
      topX1.position.set(-tw / 2, th - sectionDim, td / 2);
      trussGroup.add(topX1);

      const topX2 = createTrussBeam(td);
      topX2.rotation.y = Math.PI / 2;
      topX2.position.set(tw / 2, th - sectionDim, td / 2);
      trussGroup.add(topX2);

      group.add(trussGroup);
      selectableMeshesMapRef.current.set('truss_main', trussGroup);
    }

    // ==========================================
    // D. Màn hình LED (LED Screens: Main, Wings, Curved)
    // ==========================================
    if (layersVisibility.led) {
      ledScreens.forEach((scr) => {
        if (!scr.enabled) return;

        const screenGroup = new THREE.Group();
        screenGroup.userData = { type: 'screen', id: scr.id, name: scr.name };
        screenGroup.position.set(scr.position.x, stage.height + scr.elevation + scr.height / 2, scr.position.z);
        screenGroup.rotation.set(
          THREE.MathUtils.degToRad(scr.rotation.x),
          THREE.MathUtils.degToRad(scr.rotation.y),
          THREE.MathUtils.degToRad(scr.rotation.z)
        );

        const visualTexture = createLedVisualTexture(scr.visualPreset, scr.width, scr.height);

        // Vật liệu màn hình LED có độ tự phát sáng (Emissive)
        const ledScreenMat = new THREE.MeshStandardMaterial({
          map: visualTexture,
          emissiveMap: visualTexture,
          emissive: new THREE.Color(0xffffff),
          emissiveIntensity: (scr.brightness / 100) * 0.9,
          roughness: 0.2,
          metalness: 0.1,
          side: THREE.DoubleSide,
        });

        let screenMesh: THREE.Mesh;

        if (scr.curved && scr.curveRadius > 0) {
          // Màn LED cong (Cylindrical curved segment)
          const thetaLength = scr.width / scr.curveRadius;
          const thetaStart = Math.PI / 2 - thetaLength / 2;
          const curveGeo = new THREE.CylinderGeometry(
            scr.curveRadius,
            scr.curveRadius,
            scr.height,
            48,
            1,
            true,
            thetaStart,
            thetaLength
          );
          screenMesh = new THREE.Mesh(curveGeo, ledScreenMat);
          screenMesh.position.z = -scr.curveRadius; // Dịch tâm cong
        } else {
          // Màn LED phẳng chuẩn
          const planeGeo = new THREE.PlaneGeometry(scr.width, scr.height);
          screenMesh = new THREE.Mesh(planeGeo, ledScreenMat);
        }
        screenMesh.castShadow = true;
        screenGroup.add(screenMesh);

        // Khung viền mỏng đen xung quanh cabin LED
        const bezelGeo = new THREE.BoxGeometry(scr.width + 0.08, scr.height + 0.08, 0.06);
        const bezelMat = new THREE.MeshStandardMaterial({ color: '#090D16', roughness: 0.7 });
        const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
        bezelMesh.position.z = -0.04;
        screenGroup.add(bezelMesh);

        // Đèn viền hắt LED Neon phía sau màn hình (Backlight Accent)
        const backGlowLight = new THREE.PointLight('#DC2626', 1.5, scr.width * 1.2);
        backGlowLight.position.set(0, 0, -0.4);
        screenGroup.add(backGlowLight);

        group.add(screenGroup);
        selectableMeshesMapRef.current.set(scr.id, screenGroup);
      });
    }

    // ==========================================
    // E. Ánh sáng sân khấu (Stage Lights & Volumetric Beams)
    // ==========================================
    if (layersVisibility.lighting) {
      // Đèn môi trường
      const ambientLight = new THREE.AmbientLight('#E2E8F0', lighting.ambientIntensity);
      group.add(ambientLight);

      // Đèn chính chiếu rọi sân khấu (Key Spot)
      const keySpot = new THREE.SpotLight('#FFFFFF', lighting.spotIntensity * 2.5);
      keySpot.position.set(0, 10, 8);
      keySpot.target.position.set(0, stage.height, 0);
      keySpot.angle = Math.PI / 5;
      keySpot.penumbra = 0.4;
      keySpot.castShadow = true;
      group.add(keySpot);
      group.add(keySpot.target);

      // Chùm tia đèn Moving Head Beam (Volumetric Light Cones)
      const beamCount = Math.min(lighting.fixturesCount.beamMovingHead, 12);
      const beamColor = new THREE.Color(lighting.beamColor);

      for (let i = 0; i < beamCount; i++) {
        const spreadX = ((i - (beamCount - 1) / 2) / (beamCount / 2)) * (truss.width / 2.2);
        const beamY = truss.height - 0.2;
        const beamZ = -truss.depth / 2 + 0.5;

        // Vỏ đèn Moving Head nhỏ
        const headGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.28, 12);
        const headMat = new THREE.MeshStandardMaterial({ color: '#111827', metalness: 0.8 });
        const headMesh = new THREE.Mesh(headGeo, headMat);
        headMesh.position.set(spreadX, beamY, beamZ);
        group.add(headMesh);

        // Nón ánh sáng (Volumetric Cone)
        const coneHeight = beamY - stage.height;
        const coneGeo = new THREE.ConeGeometry(1.2, coneHeight, 16, 1, true);
        const coneMat = new THREE.MeshBasicMaterial({
          color: beamColor,
          transparent: true,
          opacity: 0.35 * lighting.beamIntensity,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        const coneMesh = new THREE.Mesh(coneGeo, coneMat);
        coneMesh.position.set(spreadX, stage.height + coneHeight / 2, beamZ);
        coneMesh.rotation.x = Math.PI; // Chiếu chúc xuống sân khấu
        // Xoay nhẹ tia tạo hiệu ứng quét sân khấu
        coneMesh.rotation.z = Math.sin(i * 1.1) * 0.2;
        group.add(coneMesh);

        // Đèn chiếu điểm tại mặt sàn tương ứng
        const spot = new THREE.SpotLight(beamColor, lighting.beamIntensity * 1.8, 18, Math.PI / 8, 0.5);
        spot.position.set(spreadX, beamY, beamZ);
        spot.target.position.set(spreadX + Math.sin(i) * 2, stage.height, 0);
        group.add(spot);
        group.add(spot.target);
      }
    }

    // ==========================================
    // F. Hệ thống Âm thanh (Audio PA System)
    // ==========================================
    if (layersVisibility.audio && audio.enabled) {
      const audioGroup = new THREE.Group();
      audioGroup.userData = { type: 'audio', id: 'audio_pa', name: 'Hệ Thống Âm Thanh PA' };

      const speakerMat = new THREE.MeshStandardMaterial({ color: '#18181B', roughness: 0.8 });

      // Cụm loa Line Array treo trái & phải
      const createLineArray = (posX: number) => {
        const arrGrp = new THREE.Group();
        const boxCount = audio.boxesPerCluster;
        const boxW = 0.8;
        const boxH = 0.25;
        const boxD = 0.5;

        for (let b = 0; b < boxCount; b++) {
          const bGeo = new THREE.BoxGeometry(boxW, boxH, boxD);
          const bMesh = new THREE.Mesh(bGeo, speakerMat);
          // Uốn cong cung loa J-curve
          const angle = (b / boxCount) * 0.35;
          bMesh.position.set(0, -b * (boxH + 0.04), Math.sin(angle) * 0.2);
          bMesh.rotation.x = angle;
          bMesh.castShadow = true;
          arrGrp.add(bMesh);
        }
        arrGrp.position.set(posX, audio.elevation, -1.0);
        return arrGrp;
      };

      audioGroup.add(createLineArray(-stage.width / 2 - 0.8));
      audioGroup.add(createLineArray(stage.width / 2 + 0.8));

      // Cụm Subwoofer đặt sàn phía trước
      for (let s = 0; s < audio.subwoofersCount; s++) {
        const subGeo = new THREE.BoxGeometry(0.7, 0.6, 0.7);
        const subMesh = new THREE.Mesh(subGeo, speakerMat);
        const sx = ((s - (audio.subwoofersCount - 1) / 2) / audio.subwoofersCount) * (stage.width * 0.8);
        subMesh.position.set(sx, 0.3, stage.depth / 2 + 0.6);
        subMesh.castShadow = true;
        audioGroup.add(subMesh);
      }

      group.add(audioGroup);
      selectableMeshesMapRef.current.set('audio_pa', audioGroup);
    }

    // ==========================================
    // G. Đạo cụ sân khấu (Podium, Decor Props)
    // ==========================================
    if (layersVisibility.props) {
      const podiumGroup = new THREE.Group();
      podiumGroup.userData = { type: 'podium', id: 'prop_podium', name: 'Bục Phát Biểu HACOLED' };

      // Chân bục
      const podBaseGeo = new THREE.BoxGeometry(0.7, 1.15, 0.5);
      const podMat = new THREE.MeshStandardMaterial({ color: '#0F172A', roughness: 0.3, metalness: 0.2 });
      const podMesh = new THREE.Mesh(podBaseGeo, podMat);
      podMesh.position.set(0, stage.height + 1.15 / 2, stage.depth / 3);
      podMesh.castShadow = true;
      podiumGroup.add(podMesh);

      // Logo đỏ mặt trước bục
      const logoPlateGeo = new THREE.PlaneGeometry(0.35, 0.15);
      const logoPlateMat = new THREE.MeshBasicMaterial({ color: '#DC2626' });
      const logoMesh = new THREE.Mesh(logoPlateGeo, logoPlateMat);
      logoMesh.position.set(0, stage.height + 0.75, stage.depth / 3 + 0.26);
      podiumGroup.add(logoMesh);

      group.add(podiumGroup);
      selectableMeshesMapRef.current.set('prop_podium', podiumGroup);
    }

    // ==========================================
    // H. Khán phòng & Bàn ghế (Audience Seating)
    // ==========================================
    if (layersVisibility.audience && audience.mode !== 'none') {
      const audienceGroup = new THREE.Group();
      const chairMat = new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.7 });

      if (audience.mode === 'banquet') {
        // Bàn tiệc tròn có khăn bàn và ghế xung quanh
        const tableCount = Math.min(Math.round(audience.guestCount / 10), 24);
        const rows = 3;
        const cols = Math.ceil(tableCount / rows);

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const tx = (c - (cols - 1) / 2) * 3.5;
            const tz = stage.depth / 2 + audience.distanceToStage + r * 3.5 + 1.5;

            // Mặt bàn
            const tGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.75, 24);
            const tMesh = new THREE.Mesh(tGeo, chairMat);
            tMesh.position.set(tx, 0.75 / 2, tz);
            tMesh.castShadow = true;
            audienceGroup.add(tMesh);
          }
        }
      } else if (audience.mode === 'theater') {
        // Dãy ghế hội trường
        const rowCount = 5;
        const chairsPerRow = 16;
        for (let r = 0; r < rowCount; r++) {
          for (let c = 0; c < chairsPerRow; c++) {
            const cx = (c - (chairsPerRow - 1) / 2) * 0.75;
            const cz = stage.depth / 2 + audience.distanceToStage + r * 1.1 + 1.0;

            const cGeo = new THREE.BoxGeometry(0.5, 0.75, 0.45);
            const cMesh = new THREE.Mesh(cGeo, chairMat);
            cMesh.position.set(cx, 0.75 / 2, cz);
            cMesh.castShadow = true;
            audienceGroup.add(cMesh);
          }
        }
      }

      group.add(audienceGroup);
    }
  }, [project]);

  // 5. Chức năng Xuất ảnh phối cảnh 3D độ nét cao (2K Snapshot Export)
  const handleExportSnapshot = useCallback(() => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (!renderer || !scene || !camera) return;

    setIsExporting(true);

    setTimeout(() => {
      // Ẩn TransformControls tạm thời để ảnh chụp sạch đẹp
      const tc = transformControlsRef.current;
      const wasAttached = tc?.object;
      if (tc && wasAttached) tc.detach();

      renderer.render(scene, camera);

      const rawDataUrl = renderer.domElement.toDataURL('image/png');

      // Tạo canvas đóng dấu watermark HACOLED STAGE STUDIO & Thông số kỹ thuật
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = 1920;
      exportCanvas.height = 1080;
      const ctx = exportCanvas.getContext('2d');

      if (ctx) {
        const baseImg = new Image();
        baseImg.src = rawDataUrl;
        baseImg.onload = () => {
          // Vẽ ảnh 3D
          ctx.drawImage(baseImg, 0, 0, 1920, 1080);

          // Thanh banner thông tin phía dưới
          ctx.fillStyle = 'rgba(7, 11, 20, 0.88)';
          ctx.fillRect(0, 970, 1920, 110);

          // Đường viền đỏ HACOLED
          ctx.fillStyle = '#DC2626';
          ctx.fillRect(0, 966, 1920, 4);

          // Logo & Tên dự án
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 32px Arial, sans-serif';
          ctx.fillText('HACOLED STAGE STUDIO', 45, 1018);

          ctx.fillStyle = '#94A3B8';
          ctx.font = '18px Arial, sans-serif';
          ctx.fillText(`Dự án: ${project.name} | Khách hàng: ${project.clientName || 'N/A'}`, 45, 1054);

          // Thông số bên phải
          ctx.textAlign = 'right';
          ctx.fillStyle = '#FBBF24';
          ctx.font = 'bold 22px Arial, sans-serif';
          const mainScr = project.ledScreens.find((s) => s.role === 'main');
          const scrInfo = mainScr ? `${mainScr.width}m × ${mainScr.height}m (${mainScr.pitch})` : 'N/A';
          ctx.fillText(`Màn LED: ${scrInfo} | Sân khấu: ${project.stage.width}m × ${project.stage.depth}m`, 1875, 1018);

          ctx.fillStyle = '#38BDF8';
          ctx.font = '16px monospace';
          ctx.fillText(`Xuất ngày: ${new Date().toLocaleDateString('vi-VN')} · Thiết kế bởi HACOLED STUDIO`, 1875, 1052);

          // Tải ảnh về máy
          const finalUrl = exportCanvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = finalUrl;
          a.download = `HACOLED_PHOI_CANH_${project.name.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
          document.body.appendChild(a);
          a.click();
          a.remove();

          // Gắn lại transform controls nếu có
          if (tc && wasAttached) tc.attach(wasAttached);
          setIsExporting(false);
        };
      } else {
        setIsExporting(false);
      }
    }, 100);
  }, [project]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden select-none bg-[#070B14]">
      {/* Three.js Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing outline-none" />

      {/* Floating Control: Quick Camera Angles */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 p-1.5 bg-slate-900/85 backdrop-blur-md border border-slate-750/70 rounded-xl shadow-2xl">
        <span className="text-[11px] font-semibold text-slate-400 px-2 uppercase tracking-wider flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-red-500" /> Góc nhìn:
        </span>
        {[
          { key: 'perspective', label: 'Phối cảnh' },
          { key: 'front', label: 'Chính diện' },
          { key: 'top', label: 'Mặt bằng' },
          { key: 'audience', label: 'Khán giả' },
          { key: 'foh', label: 'Bàn FOH' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setCameraView(item.key as any)}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
              cameraView === item.key
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Floating Control: Transform Gizmo Mode (Translate / Rotate) */}
      {selectedObject && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 p-1.5 bg-slate-900/90 backdrop-blur-md border border-red-500/40 rounded-xl shadow-2xl animate-fade-in">
          <span className="text-xs font-bold text-red-400 px-2 border-r border-slate-700">
            {selectedObject.name}
          </span>
          <button
            onClick={() => setTransformMode('translate')}
            title="Di chuyển tọa độ (X/Y/Z)"
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg transition-all ${
              transformMode === 'translate'
                ? 'bg-red-600 text-white font-semibold shadow-md'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Move className="w-3.5 h-3.5" /> Dịch chuyển
          </button>
          <button
            onClick={() => setTransformMode('rotate')}
            title="Xoay góc đối tượng"
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg transition-all ${
              transformMode === 'rotate'
                ? 'bg-red-600 text-white font-semibold shadow-md'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Xoay góc
          </button>
          <button
            onClick={() => setSelectedObject(null)}
            className="text-xs text-slate-400 hover:text-white px-1.5 py-1 rounded hover:bg-slate-800"
          >
            ✕ Bỏ chọn
          </button>
        </div>
      )}

      {/* Bottom Floating Bar: Coordinates Guide & High-Res Snapshot Export */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-lg text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Không gian 3D WebGL thực tế ảo</span>
          <span className="text-slate-600">|</span>
          <span>Chuột trái: Xoay · Chuột phải: Dịch · Lăn chuột: Phóng to</span>
        </div>

        <button
          onClick={handleExportSnapshot}
          disabled={isExporting}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all transform active:scale-95"
        >
          <Camera className="w-4 h-4" />
          {isExporting ? 'Đang xuất phối cảnh 2K...' : 'Xuất ảnh phối cảnh 3D (2K)'}
        </button>
      </div>
    </div>
  );
}
