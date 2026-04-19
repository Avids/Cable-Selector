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

function createStyledPdfBlob(entries, options = {}) {
  const pageWidth = 612;
  const pageHeight = 792;
  const marginX = 48;
  const topPadding = Number(options.topPadding) || 34;
  const topY = pageHeight - topPadding - 22;
  const bottomMargin = 48;
  const lineHeight = 14;

  const sanitize = (value) => String(value || '')
    .replace(/✓/g, 'OK')
    .replace(/[✕✖]/g, 'X')
    .replace(/△/g, '!')
    .replace(/⚠/g, '!')
    .replace(/→/g, '->')
    .replace(/×/g, 'x')
    .replace(/•/g, '-')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const escapeText = (value) => escapePdfText(sanitize(value));
  const maxChars = 92;
  const pages = [];
  let currentPage = [];
  let y = topY;

  const ensurePageSpace = (requiredLines = 1) => {
    if (y - requiredLines * lineHeight < bottomMargin) {
      pages.push(currentPage.join('\n'));
      currentPage = [];
      y = topY;
    }
  };

  for (const entry of entries) {
    const text = sanitize(entry.text);
    const wrappedLines = wrapPdfLine(text, maxChars);
    ensurePageSpace(wrappedLines.length);
    for (const [lineIndex, line] of wrappedLines.entries()) {
      const lineIndent = lineIndex === 0 ? (entry.indent || 0) : Math.max(entry.indent || 0, 1);
      const x = marginX + lineIndent * 16;
      const rgb = entry.color || [0.12, 0.13, 0.20];
      const font = entry.bold ? '/F2 10 Tf' : '/F1 10 Tf';
      currentPage.push('BT');
      currentPage.push(font);
      currentPage.push(`${rgb[0].toFixed(3)} ${rgb[1].toFixed(3)} ${rgb[2].toFixed(3)} rg`);
      currentPage.push(`${x.toFixed(2)} ${y.toFixed(2)} Td`);
      currentPage.push(`(${escapeText(line)}) Tj`);
      currentPage.push('ET');
      y -= lineHeight;
    }
  }
  pages.push(currentPage.join('\n'));

  const objects = [];
  const pageObjectIds = [];
  const contentObjectIds = [];
  const catalogId = 1;
  const pagesId = 2;
  const fontRegularId = 3;
  const fontBoldId = 4;
  let nextObjectId = 5;

  for (const pageContent of pages) {
    const pageIndex = pageObjectIds.length + 1;
    const footerText = `Page ${pageIndex} of ${pages.length}`;
    const footerBlock = [
      'BT',
      '/F1 9 Tf',
      '0.420 0.440 0.520 rg',
      `${(pageWidth - 120).toFixed(2)} 24.00 Td`,
      `(${escapePdfText(footerText)}) Tj`,
      'ET',
    ].join('\n');
    const pageWithFooter = pageContent ? `${pageContent}\n${footerBlock}` : footerBlock;
    const contentId = nextObjectId++;
    const pageId = nextObjectId++;
    contentObjectIds.push(contentId);
    pageObjectIds.push(pageId);
    objects.push(`${contentId} 0 obj\n<< /Length ${pageWithFooter.length} >>\nstream\n${pageWithFooter}\nendstream\nendobj\n`);
    objects.push(`${pageId} 0 obj\n<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents ${contentId} 0 R /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> >>\nendobj\n`);
  }

  const kids = pageObjectIds.map(id => `${id} 0 R`).join(' ');
  const fixedObjects = [
    `${catalogId} 0 obj\n<< /Type /Catalog /Pages ${pagesId} 0 R >>\nendobj\n`,
    `${pagesId} 0 obj\n<< /Type /Pages /Kids [${kids}] /Count ${pageObjectIds.length} >>\nendobj\n`,
    `${fontRegularId} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`,
    `${fontBoldId} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n`,
  ];

  const allObjects = [...fixedObjects, ...objects];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const obj of allObjects) {
    offsets.push(pdf.length);
    pdf += obj;
  }
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${allObjects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i <= allObjects.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${allObjects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
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
  const terminationTemp = Number(p.termination_temp) || CABLE_TERMINATION_TEMP_C;
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
    `Termination Temperature: ${terminationTemp}°C`,
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

function exportReviewReportPDF() {
  const reviewContent = document.getElementById('review-content');
  if (!reviewContent) {
    alert('Review content is unavailable.');
    return;
  }

  const blocks = Array.from(reviewContent.querySelectorAll('.review-block'));
  if (blocks.length === 0) {
    alert('Run Review first to generate report content.');
    return;
  }

  const entries = [
    { text: 'PATH COORDINATION REVIEW REPORT', bold: true, indent: 0 },
    { text: `Generated: ${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC`, indent: 0 },
    { text: '', indent: 0 },
  ];

  const warnColor = [0.82, 0.49, 0.16];
  const errColor = [0.78, 0.24, 0.24];
  const normalColor = [0.12, 0.13, 0.20];

  blocks.forEach((block, blockIndex) => {
    const title = block.querySelector('.review-title')?.textContent?.trim() || `Item ${blockIndex + 1}`;
    entries.push({ text: title, bold: true, indent: 0, color: normalColor });
    const items = Array.from(block.querySelectorAll('li'));
    items.forEach((item) => {
      const text = item.textContent.replace(/\s+/g, ' ').trim();
      if (!text) return;

      const lower = text.toLowerCase();
      const isWarn = item.classList.contains('review-warn');
      const isErr = item.classList.contains('review-err');
      const baseColor = isErr ? errColor : isWarn ? warnColor : normalColor;

      let normalizedText = text;
      if (isWarn && lower.includes('no breaker/fuse')) {
        normalizedText = text.replace(/^[^\w]*/u, '[!] ');
      }
      normalizedText = normalizedText.replace(/×/g, 'x');

      const cablePrefixMatch = normalizedText.match(/^([^\w]*)(CAB-[^:]*):\s*([^#\n]*?)\s*(#\S+)\s+/i);
      if (cablePrefixMatch) {
        const [, prefix, cableName, countText, wireSize] = cablePrefixMatch;
        const count = parseInt(countText, 10);
        if (Number.isFinite(count) && count > 1) {
          normalizedText = normalizedText.replace(cablePrefixMatch[0], `${prefix}${cableName}: ${count} x ${wireSize} `);
        }
      }

      const isCabLine = /^[^\w]*(OK|X|!|\[!\])?\s*CAB-/i.test(normalizedText);
      entries.push({
        text: `- ${normalizedText}`,
        indent: isCabLine ? 2 : 1,
        color: baseColor,
      });
    });
    entries.push({ text: '', indent: 0 });
  });

  const blob = createStyledPdfBlob(entries, { topPadding: 44 });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'path_coordination_review_report.pdf';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function exportFeederSchedulePDF() {
  const cables = nodes.filter(n => n.type === 'cable');
  if (cables.length === 0) {
    alert('No cable components on the diagram yet.');
    return;
  }

  const entries = [
    { text: 'FEEDER / CABLE SCHEDULE REPORT', bold: true, indent: 0 },
    { text: `Generated: ${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC`, indent: 0 },
    { text: '', indent: 0 },
  ];

  cables.forEach((cable) => {
    const p = cable.props || {};
    const { from, to } = getCableEndpoints(cable);
    const V = Number(p.voltage) || 120;
    const I = Number(p.amps) || 0;
    const L = Number(p.length) || 1;
    const mat = (p.material || 'Cu').toLowerCase().startsWith('al') ? 'AL' : 'CU';
    const row = getCableRow(p.size);
    const phases = getSystemPhaseCount(p.system, p.phases || ((p.conductors || 1) >= 3 ? 3 : 1));
    const conductorCount = Math.max(1, parseInt(p.conductors, 10) || 1);
    const rho = mat === 'AL' ? 0.0282 : 0.0172;
    const R = rho / row.area;
    const factor = phases === 3 ? Math.sqrt(3) : 2;
    const vd = (factor * I * R * L) / conductorCount;
    const vdPct = V > 0 ? (vd / V * 100) : 0;
    const ampacityPerRun = mat === 'AL' ? row.al : row.cu;
    const totalAmpacity = ampacityPerRun > 0 ? ampacityPerRun * conductorCount : 0;
    const ampStatus = totalAmpacity <= 0 || I <= totalAmpacity ? 'OK' : 'OVER';
    const vdStatus = vdPct > 5 ? 'FAIL' : vdPct > 3 ? 'CHECK' : 'OK';

    entries.push({ text: p.name || `CAB-${cable.id}`, bold: true, indent: 0 });
    entries.push({ text: `From: ${from}   To: ${to}`, indent: 1 });
    entries.push({ text: `Conductor: ${conductorCount} x ${p.size || 'N/A'} ${mat}   Insulation: ${p.insulation || '—'}`, indent: 1 });
    entries.push({ text: `Termination Temp: ${Number(p.termination_temp) || CABLE_TERMINATION_TEMP_C} C   Length: ${L} m`, indent: 1 });
    entries.push({ text: `System: ${p.system || '—'}   Voltage/Phase: ${V} V / ${phases}PH   Load: ${I} A`, indent: 1 });
    entries.push({ text: `Ampacity: ${totalAmpacity > 0 ? `${totalAmpacity}A` : 'N/A'} (${ampStatus})   Voltage Drop: ${vd.toFixed(2)}V / ${vdPct.toFixed(2)}% (${vdStatus})`, indent: 1 });
    entries.push({ text: '', indent: 0 });
  });

  const blob = createStyledPdfBlob(entries, { topPadding: 36 });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'feeder_schedule_report.pdf';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

window.exportReviewReportPDF = exportReviewReportPDF;
window.exportFeederSchedulePDF = exportFeederSchedulePDF;

window.exportFeederDetailPDF = exportFeederDetailPDF;
