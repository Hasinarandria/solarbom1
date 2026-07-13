import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Project, BomResult } from './types';
import { ROOF_TYPES } from './library';

function roofLabel(type: string) {
  return ROOF_TYPES.find((r) => r.value === type)?.label ?? type;
}

/* ----------------------------- Excel ----------------------------- */

export function exportExcel(project: Project, bom: BomResult) {
  const wb = XLSX.utils.book_new();
  const p = project;
  const c = p.config;

  // 1. Résumé projet
  const summary = [
    ['BOM by Hasina - Resume Projet'],
    [],
    ['Nom du projet', p.name],
    ['Client', p.client],
    ['Localisation', p.location],
    ['Reference', p.reference],
    ['Date', p.project_date],
    ['Ingenieur', p.engineer],
    ['Societe', p.company],
    [],
    ['Puissance totale (kWp)', bom.totalPowerKw.toFixed(2)],
    ['Nombre modules', bom.totalModules],
    ['Surface totale (m2)', bom.totalArea.toFixed(2)],
    ['Poids total (kg)', bom.totalWeightKg.toFixed(1)],
    ['Cout total estime (EUR)', bom.grandTotal.toFixed(2)],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summary);
  wsSummary['!cols'] = [{ wch: 28 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Resume projet');

  // 2. Configuration panneaux
  const panel = [
    ['Configuration Panneaux PV'],
    [],
    ['Fabricant', c.module.manufacturer],
    ['Modele', c.module.model],
    ['Puissance (W)', c.module.powerW],
    ['Longueur (mm)', c.module.lengthMm],
    ['Largeur (mm)', c.module.widthMm],
    ['Epaisseur (mm)', c.module.thicknessMm],
    ['Poids (kg)', c.module.weightKg],
    [],
    ['Espacement horizontal (mm)', c.spacing.horizontalMm],
    ['Espacement vertical (mm)', c.spacing.verticalMm],
  ];
  const wsPanel = XLSX.utils.aoa_to_sheet(panel);
  wsPanel['!cols'] = [{ wch: 28 }, { wch: 24 }];
  XLSX.utils.book_append_sheet(wb, wsPanel, 'Configuration panneaux');

  // 3. Calculs par bloc
  const calcHeader = ['Bloc', 'Colonnes', 'Rangees', 'Orientation', 'Modules', 'Longueur rangee (mm)', 'Longueur rail (mm)', 'Rails/rangee', 'Total rails', 'Rail splice', 'End clamp', 'Mid clamp', 'L-Foot', 'Vis toiture', 'Earthing clip', 'Earthing lug', 'Ground kit'];
  const calcRows = c.blocks.map((b, i) => {
    const br = bom.blocks[i];
    return [
      b.name, b.columns, b.rows, b.orientation, br.modules,
      Math.round(br.rowLengthMm), Math.round(br.railLengthMm),
      br.railsPerRow, br.totalRails, br.railSplice, br.endClamp,
      br.midClamp, br.lFoot, br.roofScrew, br.earthingClip,
      br.earthingLug, br.groundKit,
    ];
  });
  const wsCalc = XLSX.utils.aoa_to_sheet([calcHeader, ...calcRows]);
  wsCalc['!cols'] = calcHeader.map(() => ({ wch: 14 }));
  XLSX.utils.book_append_sheet(wb, wsCalc, 'Calculs');

  // 4. BOM complète
  const bomHeader = ['Designation', 'Reference', 'Unite', 'Calcule', 'Marge (%)', 'Quantite finale', 'Prix unitaire (EUR)', 'Prix total (EUR)'];
  const bomRows = bom.lines.map((l) => [
    l.designation, l.reference, l.unit, l.calculated, l.marginPercent,
    l.finalQty, l.unitPrice.toFixed(2), l.totalPrice.toFixed(2),
  ]);
  const wsBom = XLSX.utils.aoa_to_sheet([
    ['BOM Complete'],
    [],
    bomHeader,
    ...bomRows,
    [],
    ['', '', '', '', '', '', 'Total', bom.grandTotal.toFixed(2)],
  ]);
  wsBom['!cols'] = [{ wch: 22 }, { wch: 16 }, { wch: 8 }, { wch: 10 }, { wch: 10 }, { wch: 16 }, { wch: 18 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, wsBom, 'BOM complete');

  // 5. Prix
  const priceHeader = ['Designation', 'Reference', 'Prix unitaire (EUR)', 'Quantite finale', 'Prix total (EUR)'];
  const priceRows = bom.lines.map((l) => [
    l.designation, l.reference, l.unitPrice.toFixed(2), l.finalQty, l.totalPrice.toFixed(2),
  ]);
  const wsPrice = XLSX.utils.aoa_to_sheet([
    ['Analyse des Prix'],
    [],
    priceHeader,
    ...priceRows,
    [],
    ['', '', '', 'Total', bom.grandTotal.toFixed(2)],
  ]);
  wsPrice['!cols'] = [{ wch: 22 }, { wch: 16 }, { wch: 18 }, { wch: 16 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, wsPrice, 'Prix');

  // 6. Notes techniques
  const notes = [
    ['Notes Techniques'],
    [],
    ['Type de toiture', roofLabel(c.roof.type)],
    ['Nombre de pannes', c.roof.purlinCount],
    ['Entraxe pannes (mm)', c.roof.purlinSpacingMm],
    ['Type de fixation', c.roof.fixingType],
    [],
    ['Rails par rangee', c.rail.railsPerRow],
    ['Longueur rail commercial (mm)', c.rail.commercialLengthMm],
    ['Depassement gauche (mm)', c.rail.overhangLeftMm],
    ['Depassement droit (mm)', c.rail.overhangRightMm],
    [],
    ['Marge par defaut (%)', c.margin.defaultPercent],
    ['Marge appliquee sur', 'Rail Splice, End/Mid Clamp, L-Foot, Visserie, Earthing'],
    [],
    ['Note', 'Les quantites sont arrondies au superieur (ARRONDI.SUP).'],
    ['Note', 'La marge ne s applique pas aux modules PV ni aux rails.'],
    ['Note', 'Verifier la compatibilite des composants avec le fabricant de structure.'],
  ];
  const wsNotes = XLSX.utils.aoa_to_sheet(notes);
  wsNotes['!cols'] = [{ wch: 28 }, { wch: 55 }];
  XLSX.utils.book_append_sheet(wb, wsNotes, 'Notes techniques');

  XLSX.writeFile(wb, `BOM_${sanitize(p.name)}.xlsx`);
}

/* ----------------------------- PDF ----------------------------- */

export function exportPdf(project: Project, bom: BomResult) {
  const p = project;
  const c = p.config;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(15, 76, 129);
  doc.rect(0, 0, pageW, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('BOM by Hasina', 14, 14);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Bill of Materials - Installation Photovoltaique', 14, 22);
  if (p.company) {
    doc.setFontSize(9);
    doc.text(p.company, pageW - 14, 14, { align: 'right' });
  }

  let y = 36;
  doc.setTextColor(40, 40, 40);

  // Project info
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Informations du projet', 14, y);
  y += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const info: [string, string][] = [
    ['Projet', p.name],
    ['Client', p.client],
    ['Localisation', p.location],
    ['Reference', p.reference],
    ['Date', p.project_date],
    ['Ingenieur', p.engineer],
  ];
  autoTable(doc, {
    startY: y,
    head: [['Champ', 'Valeur']],
    body: info,
    theme: 'grid',
    headStyles: { fillColor: [15, 76, 129], fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    columnStyles: { 0: { cellWidth: 40 } },
  });

  // Summary metrics
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Resultats cles', 14, y);
  y += 4;
  autoTable(doc, {
    startY: y,
    head: [['Puissance (kWp)', 'Modules', 'Surface (m2)', 'Poids (kg)', 'Cout total (EUR)']],
    body: [[
      bom.totalPowerKw.toFixed(2),
      String(bom.totalModules),
      bom.totalArea.toFixed(2),
      bom.totalWeightKg.toFixed(1),
      bom.grandTotal.toFixed(2),
    ]],
    theme: 'striped',
    headStyles: { fillColor: [15, 76, 129], fontSize: 8 },
    bodyStyles: { fontSize: 9 },
  });

  // Module config
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Configuration panneaux', 14, y);
  y += 4;
  autoTable(doc, {
    startY: y,
    head: [['Fabricant', 'Modele', 'Puissance (W)', 'Dimensions L x l (mm)', 'Poids (kg)']],
    body: [[
      c.module.manufacturer, c.module.model, String(c.module.powerW),
      `${c.module.lengthMm} x ${c.module.widthMm}`, String(c.module.weightKg),
    ]],
    theme: 'grid',
    headStyles: { fillColor: [15, 76, 129], fontSize: 8 },
    bodyStyles: { fontSize: 8 },
  });

  // BOM table
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Nomenclature complete (BOM)', 14, y);
  y += 4;
  autoTable(doc, {
    startY: y,
    head: [['Designation', 'Reference', 'Unite', 'Calcule', 'Marge', 'Qte finale', 'P.U. (EUR)', 'Total (EUR)']],
    body: bom.lines.map((l) => [
      l.designation, l.reference, l.unit, String(l.calculated),
      `${l.marginPercent}%`, String(l.finalQty),
      l.unitPrice.toFixed(2), l.totalPrice.toFixed(2),
    ]),
    foot: [['', '', '', '', '', '', 'Total', bom.grandTotal.toFixed(2)]],
    theme: 'striped',
    headStyles: { fillColor: [15, 76, 129], fontSize: 7 },
    bodyStyles: { fontSize: 7 },
    footStyles: { fillColor: [15, 76, 129], textColor: 255, fontSize: 8, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 34 }, 1: { cellWidth: 22 }, 2: { cellWidth: 12 },
      3: { cellWidth: 16, halign: 'right' }, 4: { cellWidth: 14, halign: 'right' },
      5: { cellWidth: 18, halign: 'right' }, 6: { cellWidth: 22, halign: 'right' },
      7: { cellWidth: 24, halign: 'right' },
    },
  });

  // Footer note
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  const notes = [
    'Toiture: ' + roofLabel(c.roof.type) + ' | Fixation: ' + c.roof.fixingType,
    'Les quantites sont arrondies au superieur. La marge ne s applique pas aux modules et rails.',
    'Document genere par BOM by Hasina - ' + new Date().toLocaleDateString('fr-FR'),
  ];
  notes.forEach((n, i) => doc.text(n, 14, finalY + i * 5));

  doc.save(`BOM_${sanitize(p.name)}.pdf`);
}

/* ----------------------------- CSV ----------------------------- */

export function exportCsv(bom: BomResult) {
  const header = ['Designation', 'Reference', 'Unite', 'Calcule', 'Marge (%)', 'Quantite finale', 'Prix unitaire', 'Prix total'];
  const rows = bom.lines.map((l) => [
    l.designation, l.reference, l.unit, l.calculated, l.marginPercent,
    l.finalQty, l.unitPrice.toFixed(2), l.totalPrice.toFixed(2),
  ]);
  const csv = [header, ...rows]
    .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
    .join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `BOM_complete.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function sanitize(s: string) {
  return s.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40) || 'projet';
}
