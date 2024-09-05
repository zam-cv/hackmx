import { useProgress, Html } from '@react-three/drei';

export default function Loader() {
  const { progress } = useProgress();

  if (progress === 100) return null;

  return <Html center>{Math.round(progress)} % cargando...</Html>;
}