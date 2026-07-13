import { useProject } from '../context/ProjectContext';
import { Card, SectionTitle } from './ui';
import { Boxes } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Suspense } from 'react';
import type { PVBlock, PVModule, SpacingConfig, RailConfig } from '../lib/types';

export function View3D() {
  const { current } = useProject();
  if (!current) return null;

  return (
    <Card className="p-5">
      <SectionTitle
        icon={<Boxes className="w-5 h-5" />}
        title="Visualisation 3D"
        subtitle="Structure, rails, modules et fixations - cliquez pour orbit"
      />
      <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-gradient-to-b from-sky-100 to-slate-100 dark:from-slate-800 dark:to-slate-900" style={{ height: 420 }}>
        <Canvas camera={{ position: [8, 6, 10], fov: 45 }} shadows>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[10, 15, 8]}
              intensity={1.2}
              castShadow
              shadow-mapSize={[2048, 2048]}
            />
            <directionalLight position={[-8, 10, -5]} intensity={0.4} />

            {/* Roof/ground plane */}
            <RoofPlane type={current.config.roof.type} />

            <Grid
              args={[30, 30]}
              cellSize={0.5}
              cellColor="#94a3b8"
              sectionSize={2}
              sectionColor="#64748b"
              fadeDistance={25}
              fadeStrength={1}
              position={[0, 0, 0]}
            />

            {/* Array of blocks side by side */}
            {current.config.blocks.map((block, i) => (
              <Block3D
                key={block.id}
                block={block}
                module={current.config.module}
                spacing={current.config.spacing}
                rail={current.config.rail}
                offsetX={i * 4}
              />
            ))}

            <OrbitControls
              enablePan
              minDistance={4}
              maxDistance={25}
              maxPolarAngle={Math.PI / 2.1}
            />
          </Suspense>
        </Canvas>
      </div>
    </Card>
  );
}

function RoofPlane({ type }: { type: string }) {
  const color = type === 'beton' ? '#9ca3af' : type === 'tuile' ? '#b45309' : type === 'sol' ? '#6b7280' : '#d1d5db';
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color={color} opacity={0.6} transparent />
    </mesh>
  );
}

function Block3D({
  block, module: mod, spacing, rail, offsetX,
}: {
  block: PVBlock;
  module: PVModule;
  spacing: SpacingConfig;
  rail: RailConfig;
  offsetX: number;
}) {
  // Convert mm to scene units (1 unit = 1 meter)
  const isPortrait = block.orientation === 'portrait';
  const pW = (isPortrait ? mod.widthMm : mod.lengthMm) / 1000;
  const pH = (isPortrait ? mod.lengthMm : mod.widthMm) / 1000;
  const pT = mod.thicknessMm / 1000;
  const gapX = spacing.horizontalMm / 1000;
  const gapY = spacing.verticalMm / 1000;
  const overhangL = rail.overhangLeftMm / 1000;
  const overhangR = rail.overhangRightMm / 1000;

  const blockW = block.columns * pW + (block.columns - 1) * gapX;
  const blockD = block.rows * pH + (block.rows - 1) * gapY;
  const railW = blockW + overhangL + overhangR;

  const panelZ = 0.05; // panel height above rails

  return (
    <group position={[-offsetX, 0, 0]}>
      {/* Purlins (L-feet supports under rails) */}
      {Array.from({ length: block.rows }).map((_, rowIdx) => {
        const rowZ = rowIdx * (pH + gapY);
        return Array.from({ length: rail.railsPerRow }).map((_, ri) => {
          const railY = rowZ + ((ri + 0.5) / rail.railsPerRow) * pH;
          return (
            <group key={`purlin-${rowIdx}-${ri}`}>
              {/* L-foot brackets */}
              {[-railW / 2 + 0.2, railW / 2 - 0.2].map((x, fi) => (
                <mesh key={fi} position={[x, 0.08, railY]} castShadow>
                  <boxGeometry args={[0.04, 0.16, 0.04]} />
                  <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
                </mesh>
              ))}
            </group>
          );
        });
      })}

      {/* Rails */}
      {Array.from({ length: block.rows }).map((_, rowIdx) => {
        const rowZ = rowIdx * (pH + gapY);
        return Array.from({ length: rail.railsPerRow }).map((_, ri) => {
          const railY = rowZ + ((ri + 0.5) / rail.railsPerRow) * pH;
          return (
            <mesh
              key={`rail-${rowIdx}-${ri}`}
              position={[0, 0.04, railY]}
              castShadow
            >
              <boxGeometry args={[railW, 0.04, 0.04]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
            </mesh>
          );
        });
      })}

      {/* Panels */}
      {Array.from({ length: block.rows }).map((_, rowIdx) => {
        const rowZ = rowIdx * (pH + gapY) - blockD / 2 + pH / 2;
        return Array.from({ length: block.columns }).map((_, colIdx) => {
          const colX = colIdx * (pW + gapX) - blockW / 2 + pW / 2;
          return (
            <group key={`panel-${rowIdx}-${colIdx}`} position={[colX, panelZ + pT / 2, rowZ]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[pW, pT, pH]} />
                <meshStandardMaterial
                  color="#1e428a"
                  metalness={0.3}
                  roughness={0.4}
                />
              </mesh>
              {/* Glass surface overlay */}
              <mesh position={[0, pT / 2 + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[pW * 0.95, pH * 0.95]} />
                <meshStandardMaterial color="#3b95f6" metalness={0.5} roughness={0.1} />
              </mesh>
            </group>
          );
        });
      })}
    </group>
  );
}
