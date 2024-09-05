import { useRef, useEffect } from 'react';
import { useGLTF, useAnimations, OrbitControls, Bounds, useBounds } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import Loader from './Loader';
import * as THREE from 'three';

function Model() {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF('/models/bug/scene.gltf');
  const { actions, mixer } = useAnimations(animations, groupRef);
  const bounds = useBounds();

  useEffect(() => {
    if (actions && actions['SMALL BUGG IDLE']) {
      const idleAction = actions['SMALL BUGG IDLE'];
      idleAction.setEffectiveWeight(1.0);
      idleAction.setEffectiveTimeScale(0.8);
      idleAction.setLoop(THREE.LoopRepeat, Infinity).play();
    } else {
      console.warn('No se encontró la animación SMALL BUGG IDLE');
    }
  }, [actions]);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.scale.set(3, 3, 3);
      bounds.refresh(groupRef.current).clip().fit();
    }
  }, [bounds]);

  useFrame((state, delta) => {
    if (mixer) mixer.update(delta);
  });

  return (
    <group ref={groupRef} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

export default function Bug() {
  return (
    <Canvas
      shadows
      camera={{ fov: 10, near: 0.1, far: 1000 }}
      style={{ width: '100%', height: '100%' }}
      title='Modelo 3D por Captain Capsule en Sketchfab, usado bajo la licencia Creative Commons Attribution 4.0 International (CC BY 4.0).'
    >
      <Bounds fit clip observe margin={1}>
        <ambientLight intensity={1.9} />
        <hemisphereLight groundColor={'#444444'} intensity={2} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={4.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <spotLight position={[15, 20, 5]} angle={0.3} intensity={2.5} castShadow />

        <OrbitControls
          enablePan={true}
          minDistance={0.1}
          maxDistance={200}
          enableZoom={false}
          makeDefault
        />

        <Model />
        <Loader />
      </Bounds>
    </Canvas>
  );
}

useGLTF.preload('/models/bug/scene.gltf');
