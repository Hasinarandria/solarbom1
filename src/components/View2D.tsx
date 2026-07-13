import { useProject } from '../context/ProjectContext';
import { Card, SectionTitle } from './ui';
import { LayoutGrid, Boxes, Zap } from 'lucide-react';
import type { PVBlock } from '../lib/types';

export function View2D() {
  const { current, bom } = useProject();
  if (!current || !bom) return null;

  return (
    <Card className="p-5">
      <SectionTitle
        icon={<LayoutGrid className="w-5 h-5" />}
        title="Visualisation 2D"
        subtitle="Disposition des modules, rails et fixations"
      />
      <div className="space-y-6">
        {current.config.blocks.map((block, i) => (
          <BlockDiagram key={block.id} block={block} index={i} />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 text-xs">
        <LegendItem color="#1d5fd8" label="Modules PV" />
        <LegendItem color="#94a3b8" label="Rails" />
        <LegendItem color="#f59e0b" label="Mid Clamp" />
        <LegendItem color="#10b981" label="End Clamp" />
        <LegendItem color="#6b7280" label="Pannes" />
        <LegendItem color="#ef4444" label="Cables" />
      </div>
    </Card>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded-sm" style={{ background: color }} />
      <span className="text-slate-600 dark:text-slate-300">{label}</span>
    </div>
  );
}

function BlockDiagram({ block, index }: { block: PVBlock; index: number }) {
  const { current } = useProject();
  if (!current) return null;
  const { module, spacing, rail } = current.config;

  const isPortrait = block.orientation === 'portrait';
  const panelW = isPortrait ? module.widthMm : module.lengthMm;
  const panelH = isPortrait ? module.lengthMm : module.widthMm;

  // Scale to fit: target width ~ 700px
  const totalW = block.columns * panelW + (block.columns - 1) * spacing.horizontalMm + rail.overhangLeftMm + rail.overhangRightMm;
  const totalH = block.rows * panelH + (block.rows - 1) * spacing.verticalMm;
  const scale = Math.min(700 / totalW, 320 / totalH);
  const w = totalW * scale;
  const h = totalH * scale;

  const panelScaledW = panelW * scale;
  const panelScaledH = panelH * scale;
  const gapX = spacing.horizontalMm * scale;
  const gapY = spacing.verticalMm * scale;
  const overhangL = rail.overhangLeftMm * scale;
  const overhangR = rail.overhangRightMm * scale;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold">{index + 1}</div>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{block.name}</span>
        <span className="text-xs text-slate-400">- {block.columns}x{block.rows} {block.orientation}</span>
        <div className="flex gap-1.5 ml-auto">
          <span className="flex items-center gap-1 text-xs text-slate-500"><Boxes className="w-3 h-3" /> {block.columns * block.rows} modules</span>
          <span className="flex items-center gap-1 text-xs text-slate-500"><Zap className="w-3 h-3" /> {((block.columns * block.rows) * module.powerW / 1000).toFixed(1)} kWp</span>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg bg-slate-50 dark:bg-slate-900/40 p-3 border border-slate-200 dark:border-slate-700">
        <svg width={w + 20} height={h + 40} className="mx-auto">
          {/* Purlins (horizontal dashed lines behind) */}
          {Array.from({ length: current.config.roof.purlinCount }).map((_, pi) => {
            const py = (pi / Math.max(1, current.config.roof.purlinCount - 1)) * h;
            return <line key={`purlin-${pi}`} x1={0} y1={py + 10} x2={w + 20} y2={py + 10} stroke="#6b7280" strokeWidth={1} strokeDasharray="4 3" opacity={0.4} />;
          })}

          {/* Rails (horizontal bars spanning full width including overhang) */}
          {Array.from({ length: block.rows }).flatMap((_, rowIdx) => {
            const rowY = rowIdx * (panelScaledH + gapY) + 10;
            return Array.from({ length: rail.railsPerRow }).map((_, ri) => {
              const railY = rowY + ((ri + 0.5) / rail.railsPerRow) * panelScaledH;
              return (
                <rect
                  key={`rail-${rowIdx}-${ri}`}
                  x={10 + overhangL}
                  y={railY - 2}
                  width={w - overhangL - overhangR + 20}
                  height={3}
                  fill="#94a3b8"
                  rx={1}
                />
              );
            });
          })}

          {/* Panels */}
          {Array.from({ length: block.rows }).map((_, rowIdx) => {
            const rowY = rowIdx * (panelScaledH + gapY) + 10;
            return Array.from({ length: block.columns }).map((_, colIdx) => {
              const colX = 10 + overhangL + colIdx * (panelScaledW + gapX);
              return (
                <g key={`panel-${rowIdx}-${colIdx}`}>
                  <rect
                    x={colX}
                    y={rowY}
                    width={panelScaledW}
                    height={panelScaledH}
                    rx={2}
                    fill="#1d5fd8"
                    stroke="#1e428a"
                    strokeWidth={0.5}
                    opacity={0.85}
                  />
                  {/* Panel cell grid hint */}
                  <line x1={colX + panelScaledW / 2} y1={rowY} x2={colX + panelScaledW / 2} y2={rowY + panelScaledH} stroke="#bfe2fe" strokeWidth={0.3} opacity={0.5} />
                  <line x1={colX} y1={rowY + panelScaledH / 2} x2={colX + panelScaledW} y2={rowY + panelScaledH / 2} stroke="#bfe2fe" strokeWidth={0.3} opacity={0.5} />
                </g>
              );
            });
          })}

          {/* End Clamps (green dots at rail ends) */}
          {Array.from({ length: block.rows }).flatMap((_, rowIdx) => {
            const rowY = rowIdx * (panelScaledH + gapY) + 10;
            return Array.from({ length: rail.railsPerRow }).map((_, ri) => {
              const railY = rowY + ((ri + 0.5) / rail.railsPerRow) * panelScaledH;
              return (
                <g key={`endclamp-${rowIdx}-${ri}`}>
                  <circle cx={10 + overhangL} cy={railY - 1} r={3} fill="#10b981" />
                  <circle cx={10 + overhangL + (w - overhangL - overhangR + 20)} cy={railY - 1} r={3} fill="#10b981" />
                </g>
              );
            });
          })}

          {/* Mid Clamps (amber dots between panels) */}
          {Array.from({ length: block.rows }).flatMap((_, rowIdx) => {
            const rowY = rowIdx * (panelScaledH + gapY) + 10;
            return Array.from({ length: rail.railsPerRow }).flatMap((_, ri) => {
              const railY = rowY + ((ri + 0.5) / rail.railsPerRow) * panelScaledH;
              return Array.from({ length: block.columns - 1 }).map((_, ci) => {
                const cx = 10 + overhangL + (ci + 1) * panelScaledW + ci * gapX + gapX / 2;
                return <circle key={`mid-${rowIdx}-${ri}-${ci}`} cx={cx} cy={railY - 1} r={2.5} fill="#f59e0b" />;
              });
            });
          })}

          {/* Cable path (red dashed line along bottom) */}
          {Array.from({ length: block.rows }).map((_, rowIdx) => {
            const rowY = rowIdx * (panelScaledH + gapY) + 10;
            return (
              <line
                key={`cable-${rowIdx}`}
                x1={10 + overhangL}
                y1={rowY + panelScaledH + 4}
                x2={10 + overhangL + (w - overhangL - overhangR + 20)}
                y2={rowY + panelScaledH + 4}
                stroke="#ef4444"
                strokeWidth={1}
                strokeDasharray="3 2"
                opacity={0.6}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
