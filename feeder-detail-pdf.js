function calculateCableMetrics(cableNode) {
  const p = cableNode.props || {};
  const V = Number(p.voltage) || 120;
  const I = Number(p.amps) || 0;
  const L = Number(p.length) || 1;
  const mat = (p.material || 'Cu').toLowerCase().startsWith('al') ? 'al' : 'cu';
  const row = getCableRow(p.size);
  const A = row.area;
  const rho = mat === 'al' ? 0.0282 : 0.0172;
  const R = rho / A;
  const phases = getSystemPhaseCount(p.system, p.phases || ((p.conductors || 1) >= 3 ? 3 : 1));
  const factor = phases === 3 ? Math.sqrt(3) : 2;
  const conductorsPerPhase = Math.max(1, parseInt(p.conductors, 10) || 1);
  const vd = (factor * I * R * L) / conductorsPerPhase;
  const vdPct = V > 0 ? (vd / V * 100) : 0;
  const ampacityPerRun = mat === 'al' ? row.al : row.cu;
  const totalAmpacity = ampacityPerRun > 0 ? ampacityPerRun * conductorsPerPhase : 0;
  const maxAllowableVd = V * 0.03;
  return { V, I, L, mat, row, A, rho, R, phases, factor, conductorsPerPhase, vd, vdPct, ampacityPerRun, totalAmpacity, maxAllowableVd };
}

function wrapPdfLine(text, maxChars = 92) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  if (words.length === 0) return [''];
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function escapePdfText(value) {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function createPdfBlobFromLines(lines) {
  const flattenedLines = [];
  for (const line of lines) {
    flattenedLines.push(...wrapPdfLine(line));
  }

  const contentRows = [
    'BT',
    '/F1 10 Tf',
    '48 770 Td',
  ];
  flattenedLines.forEach((line, index) => {
    if (index > 0) contentRows.push('0 -14 Td');
    contentRows.push(`(${escapePdfText(line)}) Tj`);
  });
  contentRows.push('ET');
  const contentStream = contentRows.join('\n');

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n',
    `4 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n'
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
}

function exportFeederDetailPDF(cableId) {
  const cableNode = nodes.find(n => n.id === cableId && n.type === 'cable');
  if (!cableNode) {
    alert('Cable not found.');
    return;
  }

  const p = cableNode.props || {};
  const { from, to } = getCableEndpoints(cableNode);
  const metrics = calculateCableMetrics(cableNode);
  const system = p.system || '—';
  const loadType = 'Continuous';
  const loadFactor = 1.25; // Rule 8-104 continuous load basis.
  const requiredAmpacity = metrics.I * loadFactor;
  const bonding = getBondingSelectionForCable(cableNode, {
    totalAmpacity: metrics.totalAmpacity,
    phaseConductorSize: p.size,
  });
  const resultText = `${metrics.conductorsPerPhase} conductor(s) per phase utilizing ${p.size || 'N/A'} ${metrics.mat.toUpperCase()} conductor, insulation ${p.insulation || '—'}, estimated voltage drop ${metrics.vdPct.toFixed(2)}% for ${metrics.I} A over ${metrics.L} m at ${metrics.V} V (${metrics.phases}Ø).`;
  const disclaimer = 'DISCLAIMER: This CSA-based report is an engineering aid only. Validate assumptions, conductor data, installation conditions, and final compliance with CSA C22.1 and local authority requirements before construction.';

  const reportLines = [
    'FEEDER DETAILED CALCULATION REPORT (CSA C22.1 BASIS)',
    `Generated: ${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC`,
    '',
    `Feeder Tag: ${p.name || `CAB-${cableNode.id}`}`,
    `From: ${from}   To: ${to}`,
    '',
    'Inputs',
    `Current Type: AC`,
    `Phase: ${metrics.phases === 3 ? 'Three' : 'Single'}`,
    `Conductor Material: ${metrics.mat.toUpperCase()}`,
    `Conductor Per Phase: ${metrics.conductorsPerPhase}`,
    `Conductor Size: ${p.size || '—'}`,
    `Insulation: ${p.insulation || '—'}`,
    `Load Type: ${loadType}`,
    `Length of Cable Run: ${metrics.L.toFixed(2)} m`,
    `Voltage: ${metrics.V.toFixed(2)} V`,
    `System: ${system}`,
    `Current at End of Cable Run: ${metrics.I.toFixed(2)} A`,
    '',
    'Results for Minimum Conductor Size Calculation',
    resultText,
    '',
    'Engineering Information',
    `${metrics.totalAmpacity.toFixed(2)} A   Ampacity of selected conductor set (${metrics.ampacityPerRun} A x ${metrics.conductorsPerPhase})`,
    `${requiredAmpacity.toFixed(2)} A   Required ampacity for ${loadType.toLowerCase()} load (Rule 8-104, 125%)`,
    `${metrics.R.toFixed(6)} Ohms/m   Resistance (from rho/area approximation)`,
    `${metrics.vd.toFixed(3)} V   Calculated voltage drop`,
    `${metrics.maxAllowableVd.toFixed(3)} V   Maximum allowable voltage drop at 3%`,
    `${metrics.vdPct.toFixed(2)} %   Actual voltage drop percentage`,
    `${bonding.size}   Bonding conductor size (${bonding.ruleRef})`,
    `Bonding basis: ${bonding.basisDescription}`,
    '',
    'Code Basis',
    'Rule 4-006: Temperature limitations',
    'Rule 8-104: Load calculation (continuous/non-continuous)',
    'Rule 12-108: Parallel conductors',
    'Rule 10-616(3)(a): Bonding conductor sizing',
    'Table 16: Bonding conductor size',
    'Appendix D Table D3: Voltage drop calculation',
    '',
    'Engineering Assumptions',
    'Assumptions:',
    '- 75°C terminations',
    '- No derating factors applied',
    '- Ambient temperature: 30°C',
    '- No harmonic loading',
    '- Conductors installed in raceway',
    '- Load type: continuous',
    '',
    disclaimer
  ];

  const blob = createPdfBlobFromLines(reportLines);
  const a = document.createElement('a');
  const safeTag = (p.name || `cable_${cableNode.id}`).replace(/[^a-z0-9_-]+/gi, '_');
  a.href = URL.createObjectURL(blob);
  a.download = `${safeTag}_CSA_detail_report.pdf`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

window.exportFeederDetailPDF = exportFeederDetailPDF;
