// ═══════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════

const CABLE_DATA = [
  {size:'#14', area:2.08,  cu:15,  al:0   },
  {size:'#12', area:3.31,  cu:20,  al:0   },
  {size:'#10', area:5.26,  cu:30,  al:0   },
  {size:'#8',  area:8.37,  cu:50,  al:0   },
  {size:'#6',  area:13.3,  cu:55,  al:40  },
  {size:'#4',  area:21.1,  cu:70,  al:55  },
  {size:'#2',  area:33.6,  cu:95,  al:75  },
  {size:'#1',  area:42.4,  cu:110, al:85  },
  {size:'#1/0', area:53.5,  cu:125, al:100 },
  {size:'#2/0', area:67.4,  cu:145, al:115 },
  {size:'#3/0', area:85.0,  cu:165, al:130 },
  {size:'#4/0', area:107.0, cu:195, al:150 },
  {size:'#250', area:127.0, cu:215, al:170 },
  {size:'#300', area:152.0, cu:240, al:190 },
  {size:'#350', area:177.0, cu:260, al:210 },
  {size:'#400', area:203.0, cu:280, al:225 },
  {size:'#500', area:253.0, cu:320, al:260 },
  {size:'#600', area:304.0, cu:355, al:285 },
];

// CSA C22.1:24 Table 16 — Bonding conductor size lookup ("Not exceeding" column).
// Selection is step-based: choose first row where reference amps <= row.max.
const TABLE16_BONDING_DATA = [
  { max: 20, cu: '14', al: '12' },
  { max: 30, cu: '12', al: '10' },
  { max: 60, cu: '10', al: '8' },
  { max: 100, cu: '8', al: '6' },
  { max: 200, cu: '6', al: '4' },
  { max: 300, cu: '4', al: '2' },
  { max: 400, cu: '3', al: '1' },
  { max: 500, cu: '2', al: '#1/0' },
  { max: 600, cu: '1', al: '#2/0' },
  { max: 800, cu: '#1/0', al: '#3/0' },
  { max: 1000, cu: '#2/0', al: '#4/0' },
  { max: 1200, cu: '#3/0', al: '250' },
  { max: 1600, cu: '#4/0', al: '350' },
  { max: 2000, cu: '250', al: '400' },
  { max: 2500, cu: '350', al: '500' },
  { max: 3000, cu: '400', al: '600' },
  { max: 4000, cu: '500', al: '800' },
  { max: 5000, cu: '700', al: '1000' },
  { max: 6000, cu: '800', al: '1250' },
];

const CONDUCTOR_AREA_MM2 = {
  '14': 2.08,
  '12': 3.31,
  '10': 5.26,
  '8': 8.37,
  '6': 13.3,
  '4': 21.1,
  '3': 26.7,
  '2': 33.6,
  '1': 42.4,
  '0': 53.5,
  '00': 67.4,
  '000': 85.0,
  '0000': 107.0,
  '250': 127.0,
  '300': 152.0,
  '350': 177.0,
  '400': 203.0,
  '500': 253.0,
  '600': 304.0,
  '700': 355.0,
  '800': 405.5,
  '1000': 507.0,
  '1250': 633.5,
};

const BONDING_SCOPE_OPTIONS = ['Feeder/Branch'];
const BONDING_METHOD_OPTIONS = ['Overcurrent Device', 'Largest Ungrounded (VD Increased)'];

const TRANSFORMER_PRIMARY_VOLTAGE_OPTIONS = [600, 480, 208];
const TRANSFORMER_SECONDARY_VOLTAGE_OPTIONS = [480, 208];
const TRANSFORMER_KVA_OPTIONS = [3, 6, 9, 15, 30, 45, 75, 100, 112.5, 150, 225, 300, 450, 500, 600];
const SYSTEM_VOLTAGE_OPTIONS = [600, 480, 347, 240, 208, 120];
const PANEL_VOLTAGE_OPTIONS = [
  { value: 600, label: '600/347V' },
  { value: 208, label: '208/120V' },
  { value: 600, label: '600V' },
  { value: 208, label: '208V' },
  { value: 120, label: '120V' },
];
const PHASE_OPTIONS = [1, 3];
const SYSTEM_TYPE_OPTIONS = ['1ph/2w', '1ph/3w', '3ph/3w', '3ph/4w'];
const SYSTEM_CONFIG = {
  '1ph/2w': { phases: 1, hots: 1, neutrals: 1 },
  '1ph/3w': { phases: 1, hots: 2, neutrals: 1 },
  '3ph/3w': { phases: 3, hots: 3, neutrals: 0 },
  '3ph/4w': { phases: 3, hots: 4, neutrals: 1 },
};

const COMP_DEFS = {
  utility:     { w:80,  h:80,  label:'Utility',      color:'#89b4fa', titleColor:'#89b4fa',
                 defaults:{name:'UTIL-1', voltage:600, phases:3, fault_kA:25} },
  transformer: { w:80,  h:90,  label:'Transformer',  color:'#cba6f7', titleColor:'#cba6f7',
                 defaults:{name:'TX-1', kva:75, primary_v:600, secondary_v:208, phases:3, impedance:4.5, conn:'Delta-Wye'} },
  panel:       { w:90,  h:80,  label:'Panel',        color:'#94e2d5', titleColor:'#94e2d5',
                 defaults:{name:'MDP', voltage:120, system:'3ph/4w', main_amps:200, short_ckt_kA:10, mfr:'Square D'} },
  breaker:     { w:60,  h:80,  label:'Breaker',      color:'#74c7ec', titleColor:'#74c7ec',
                 defaults:{name:'CB-1', amps:20, voltage:120, system:'1ph/2w', kaic:10, mfr:'Square D'} },
  fuse:        { w:60,  h:80,  label:'Fuse Disc.',   color:'#fab387', titleColor:'#fab387',
                 defaults:{name:'FD-1', amps:30, voltage:600, phases:3, fuse_class:'RK5', poles:3} },
  bus:         { w:110, h:50,  label:'Bus Bar',      color:'#f9e2af', titleColor:'#f9e2af',
                 defaults:{name:'BUS-1', voltage:120, amps:400, phases:3} },
  cable:       { w:90,  h:60,  label:'Cable',        color:'#a6e3a1', titleColor:'#a6e3a1',
                 defaults:{name:'CAB-1', conductors:1, size:'#12', insulation:'RW90', length:10, material:'Cu', amps:20, voltage:120, system:'3ph/4w', bonding_scope:'Feeder/Branch', bonding_method:'Overcurrent Device', ocpd_amps:20, bonding_material:'Cu'} },
  load:        { w:60,  h:80,  label:'Load',         color:'#f38ba8', titleColor:'#f38ba8',
                 defaults:{name:'LOAD-1', current:20, voltage:120, phases:1} },
  meter:       { w:70,  h:70,  label:'Meter',        color:'#b4befe', titleColor:'#b4befe',
                 defaults:{name:'MTR-1', type:'kWh', ct_ratio:'200:5', voltage:120} },
};

const FIELD_DEFS = {
  utility:     [{k:'name',l:'Tag'},{k:'voltage',l:'Voltage (V)',t:'select',options:SYSTEM_VOLTAGE_OPTIONS},{k:'phases',l:'Phase',t:'select',options:PHASE_OPTIONS},{k:'fault_kA',l:'Fault (kA)',t:'number'}],
  transformer: [{k:'name',l:'Tag'},{k:'kva',l:'KVA',t:'select',options:TRANSFORMER_KVA_OPTIONS},{k:'primary_v',l:'Primary V',t:'select',options:TRANSFORMER_PRIMARY_VOLTAGE_OPTIONS},{k:'secondary_v',l:'Secondary V',t:'select',options:TRANSFORMER_SECONDARY_VOLTAGE_OPTIONS},{k:'phases',l:'Phases',t:'number'},{k:'impedance',l:'%Z',t:'number'},{k:'conn',l:'Connection'}],
  panel:       [{k:'name',l:'Tag'},{k:'voltage',l:'Voltage (V)',t:'select',options:PANEL_VOLTAGE_OPTIONS},{k:'system',l:'System',t:'select',options:SYSTEM_TYPE_OPTIONS},{k:'main_amps',l:'Main Amps',t:'number'},{k:'short_ckt_kA',l:'SCCR (kA)',t:'number'},{k:'mfr',l:'Manufacturer'}],
  breaker:     [{k:'name',l:'Tag'},{k:'amps',l:'Trip (A)',t:'number'},{k:'voltage',l:'Voltage (V)',t:'select',options:SYSTEM_VOLTAGE_OPTIONS},{k:'system',l:'System',t:'select',options:SYSTEM_TYPE_OPTIONS},{k:'kaic',l:'kAIC',t:'number'},{k:'mfr',l:'Manufacturer'}],
  fuse:        [{k:'name',l:'Tag'},{k:'amps',l:'Rating (A)',t:'number'},{k:'voltage',l:'Voltage (V)',t:'select',options:SYSTEM_VOLTAGE_OPTIONS},{k:'phases',l:'Phase',t:'select',options:PHASE_OPTIONS},{k:'fuse_class',l:'Fuse Class'},{k:'poles',l:'Poles',t:'number'}],
  bus:         [{k:'name',l:'Tag'},{k:'voltage',l:'Voltage (V)',t:'select',options:SYSTEM_VOLTAGE_OPTIONS},{k:'amps',l:'Ampacity (A)',t:'number'},{k:'phases',l:'Phase',t:'select',options:PHASE_OPTIONS}],
  cable: [
  {k:'name',l:'Tag'},
  {k:'size',l:'Size', t:'select', options: CABLE_DATA.map(d => d.size)}, // Changed to select
  {k:'material',l:'Material',t:'select',options:['Cu','Al']},
  {k:'conductors',l:'# Cond / Phase',t:'number'},
  {k:'insulation',l:'Insulation'},
  {k:'length',l:'Length (m)',t:'number'},
  {k:'amps',l:'Load Amps (A)',t:'number'},
  {k:'bonding_scope',l:'Bonding Scope',t:'select',options:BONDING_SCOPE_OPTIONS},
  {k:'bonding_method',l:'Feeder/Branch Basis',t:'select',options:BONDING_METHOD_OPTIONS},
  {k:'ocpd_amps',l:'OCPD Rating (A)',t:'number'},
  {k:'bonding_material',l:'Bonding Material',t:'select',options:['Cu','Al']},
  {k:'voltage',l:'Voltage (V)',t:'select',options:SYSTEM_VOLTAGE_OPTIONS},
  {k:'system',l:'System',t:'select',options:SYSTEM_TYPE_OPTIONS}
],
  load:        [{k:'name',l:'Tag'},{k:'current',l:'Current (A)',t:'number'},{k:'voltage',l:'Voltage (V)',t:'select',options:SYSTEM_VOLTAGE_OPTIONS},{k:'phases',l:'Phase',t:'select',options:PHASE_OPTIONS}],
  meter:       [{k:'name',l:'Tag'},{k:'type',l:'Type'},{k:'ct_ratio',l:'CT Ratio'},{k:'voltage',l:'Voltage (V)',t:'number'}],
};

// ═══════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════

let nodes = [];
let wires = [];
let selected = null;
let selectedNodes = new Set();
let mode = 'select';
let idCounter = 1;

let pan = { x: 0, y: 0 };
let zoom = 1.0;
let panStart = null;
let isPanning = false;

let connectStart = null;
let ghostWire = null;
let dragNode = null;
let dragOffset = { x: 0, y: 0 };
let dragType = null;
let dragSelection = null;
let selectionBox = null;

let hoverNode = null;
let hoverPortInfo = null;
let canvasStyle = 'engineering';
let suppressCanvasBackdrop = false;
let wireRouting = 'orthogonal';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const wrap = document.getElementById('canvas-wrap');

// ═══════════════════════════════════════════════════
// CANVAS SIZING
// ═══════════════════════════════════════════════════

function resizeCanvas() {
  canvas.width = wrap.clientWidth;
  canvas.height = wrap.clientHeight;
  draw();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
window.addEventListener('beforeunload', (event) => {
  const hasProjectData = nodes.length > 0 || wires.length > 0;
  if (!hasProjectData) return;

  event.preventDefault();
  event.returnValue = 'ARE YOU SURE you want to close this window? Save the project first.';
});

// ═══════════════════════════════════════════════════
// COORDINATE HELPERS
// ═══════════════════════════════════════════════════

function toWorld(ex, ey) {
  const r = wrap.getBoundingClientRect();
  return {
    x: (ex - r.left - pan.x) / zoom,
    y: (ey - r.top - pan.y) / zoom,
  };
}

function toScreen(wx, wy) {
  return { x: wx * zoom + pan.x, y: wy * zoom + pan.y };
}

// ═══════════════════════════════════════════════════
// PORTS
// ═══════════════════════════════════════════════════

function getPorts(n) {
  const d = COMP_DEFS[n.type];
  const cx = n.x + d.w / 2;
  const cy = n.y + d.h / 2;
  return [
    { id: 'T', x: cx,      y: n.y       },
    { id: 'B', x: cx,      y: n.y + d.h },
    { id: 'L', x: n.x,     y: cy        },
    { id: 'R', x: n.x+d.w, y: cy        },
  ];
}

function nearestPort(wx, wy, excludeNode) {
  let best = null, bestD = 20 / zoom;
  for (const n of nodes) {
    if (n === excludeNode) continue;
    for (const p of getPorts(n)) {
      const d = Math.hypot(p.x - wx, p.y - wy);
      if (d < bestD) { bestD = d; best = { node: n, port: p }; }
    }
  }
  return best;
}

function hitNode(wx, wy) {
  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i];
    const d = COMP_DEFS[n.type];
    if (wx >= n.x && wx <= n.x + d.w && wy >= n.y && wy <= n.y + d.h) return n;
  }
  return null;
}

function makeRect(a, b) {
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    w: Math.abs(a.x - b.x),
    h: Math.abs(a.y - b.y),
  };
}

function nodeIntersectsRect(node, rect) {
  const d = COMP_DEFS[node.type];
  return !(
    node.x + d.w < rect.x ||
    node.x > rect.x + rect.w ||
    node.y + d.h < rect.y ||
    node.y > rect.y + rect.h
  );
}

// ═══════════════════════════════════════════════════
// DRAWING
// ═══════════════════════════════════════════════════

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCanvasBackdrop();
  ctx.save();
  ctx.translate(pan.x, pan.y);
  ctx.scale(zoom, zoom);

  // Draw wires
  for (const w of wires) {
    const a = nodes.find(n => n.id === w.fromNode);
    const b = nodes.find(n => n.id === w.toNode);
    if (!a || !b) continue;
    const pa = getPorts(a).find(p => p.id === w.fromPort);
    const pb = getPorts(b).find(p => p.id === w.toPort);
    if (!pa || !pb) continue;
    drawWire(pa, pb, w === selected);
  }

  // Ghost wire
  if (ghostWire) {
    ctx.save();
    ctx.strokeStyle = '#89b4fa';
    ctx.lineWidth = 1.5 / zoom;
    ctx.setLineDash([5 / zoom, 3 / zoom]);
    ctx.beginPath();
    ctx.moveTo(ghostWire.x1, ghostWire.y1);
    ctx.lineTo(ghostWire.x2, ghostWire.y2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  // Draw nodes
  for (const n of nodes) {
    const isSelectedNode = selectedNodes.has(n);
    drawNode(n, isSelectedNode, n === hoverNode);
  }

  if (selectionBox) {
    const rect = makeRect(selectionBox.start, selectionBox.current);
    ctx.save();
    ctx.fillStyle = 'rgba(137,180,250,0.12)';
    ctx.strokeStyle = '#89b4fa';
    ctx.lineWidth = 1 / zoom;
    ctx.setLineDash([6 / zoom, 4 / zoom]);
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    ctx.setLineDash([]);
    ctx.restore();
  }

  // Draw ports in connect mode
  if (mode === 'connect') {
    for (const n of nodes) {
      for (const p of getPorts(n)) {
        const isHover = hoverPortInfo && hoverPortInfo.node === n && hoverPortInfo.port.id === p.id;
        ctx.beginPath();
        ctx.arc(p.x, p.y, isHover ? 7/zoom : 4/zoom, 0, Math.PI * 2);
        ctx.strokeStyle = canvasStyle === 'engineering' ? '#7f1919' : '#89b4fa';
        ctx.lineWidth = 1.5 / zoom;
        ctx.stroke();
        if (isHover) {
          ctx.fillStyle = canvasStyle === 'engineering' ? 'rgba(127,25,25,0.2)' : 'rgba(137,180,250,0.3)';
          ctx.fill();
        }
      }
    }
  }

  ctx.restore();
}

function drawWire(pa, pb, selected) {
  const points = getWirePolylinePoints(pa, pb);
  ctx.beginPath();
  const defaultWire = canvasStyle === 'engineering' ? '#8a1111' : '#3d4166';
  const selectedWire = canvasStyle === 'engineering' ? '#c22a2a' : '#89b4fa';
  ctx.strokeStyle = selected ? selectedWire : defaultWire;
  ctx.lineWidth = (selected ? 2 : 1.5) / zoom;
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();

  // Junction dots
  ctx.fillStyle = selected ? selectedWire : (canvasStyle === 'engineering' ? '#8a1111' : '#6c7086');
  ctx.beginPath(); ctx.arc(pa.x, pa.y, 3/zoom, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(pb.x, pb.y, 3/zoom, 0, Math.PI*2); ctx.fill();
}

function getWirePolylinePoints(pa, pb) {
  if (wireRouting === 'straight') {
    return [pa, pb];
  }
  const mx = pa.x + (pb.x - pa.x) / 2;
  return [pa, { x: mx, y: pa.y }, { x: mx, y: pb.y }, pb];
}

function drawNode(n, isSel, isHov) {
  const d = COMP_DEFS[n.type];
  const { x, y, w, h } = { x: n.x, y: n.y, w: d.w, h: d.h };
  const lw = 1 / zoom;
  ctx.save();

  if (canvasStyle === 'engineering') {
    if (isSel) {
      ctx.strokeStyle = '#bf2d2d';
      ctx.lineWidth = 1.4 / zoom;
      ctx.setLineDash([5 / zoom, 3 / zoom]);
      ctx.strokeRect(x - 6 / zoom, y - 6 / zoom, w + 12 / zoom, h + 12 / zoom);
      ctx.setLineDash([]);
    }

    ctx.strokeStyle = '#8a1111';
    ctx.fillStyle = '#8a1111';
    ctx.lineWidth = 1.6 / zoom;
    drawSymbol(ctx, n.type, x, y + 8/zoom, w, h - 24/zoom, zoom);

    const textX = x + w + 8;
    const textY = y + 2;
    const name = (n.props.name || d.label).toUpperCase();
    const meta = getEngineeringMeta(n);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#7f1919';
    ctx.textBaseline = 'top';
    ctx.font = `700 11px "IBM Plex Mono", monospace`;
    ctx.fillText(name, textX, textY);
    ctx.font = `500 9px "IBM Plex Mono", monospace`;
    meta.forEach((line, i) => ctx.fillText(line.toUpperCase(), textX, textY + (13 + i * 11)));
    ctx.restore();
    return;
  }

  // Selection glow
  if (isSel) {
    ctx.shadowColor = d.color;
    ctx.shadowBlur = 12;
  }

  // Background
  ctx.fillStyle = isSel ? 'rgba(137,180,250,0.08)' : '#1e2030';
  ctx.strokeStyle = isSel ? d.color : (isHov ? '#6c7086' : '#2e3155');
  ctx.lineWidth = isSel ? 1.5/zoom : lw;
  rrect(x, y, w, h, 6/zoom);
  ctx.fill(); ctx.stroke();
  ctx.shadowBlur = 0;

  // Color bar top
  ctx.fillStyle = d.color + '22';
  rrect(x, y, w, 18/zoom, { tl:6/zoom, tr:6/zoom, bl:0, br:0 });
  ctx.fill();

  // Type label
  ctx.fillStyle = d.color;
  ctx.font = `500 10px "IBM Plex Mono", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(d.label.toUpperCase(), x + w/2, y + 9);

  // Symbol
  ctx.strokeStyle = d.color;
  ctx.fillStyle = d.color;
  ctx.lineWidth = 1.5/zoom;
  drawSymbol(ctx, n.type, x, y + 18/zoom, w, h - 30/zoom, zoom);

  // Name tag
  ctx.fillStyle = '#cdd6f4';
  ctx.font = `500 10px "IBM Plex Sans", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText(n.props.name || d.label, x + w/2, y + h - 3);

  ctx.restore();
}

function getEngineeringMeta(n) {
  switch (n.type) {
    case 'utility': return [`${n.props.voltage || '—'}V`, `${n.props.phases || '—'}PH`];
    case 'transformer': return [`${n.props.kva || '—'}kVA`, `${n.props.primary_v || '—'}/${n.props.secondary_v || '—'}V`];
    case 'panel': return [`MAIN ${n.props.main_amps || '—'}A`, `${n.props.system || '—'} / ${n.props.short_ckt_kA || '—'}kA SCCR`];
    case 'breaker': return [`CB ${n.props.amps || '—'}A`, `${n.props.system || '—'}`];
    case 'fuse': return [`FD ${n.props.amps || '—'}A`, `CLASS ${n.props.fuse_class || '—'}`];
    case 'bus': return [`BUS ${n.props.amps || '—'}A`, `${n.props.voltage || '—'}V`];
    case 'cable': return [`${n.props.conductors || '—'}C ${n.props.size || '—'}`, `${n.props.system || '—'} / ${n.props.length || '—'}m`];
    case 'load': return [`${n.props.current || '—'}A`, `${n.props.voltage || '—'}V`];
    case 'meter': return [`${n.props.type || '—'}`, `${n.props.ct_ratio || '—'}`];
    default: return [];
  }
}

function drawCanvasBackdrop() {
  if (suppressCanvasBackdrop || canvasStyle !== 'engineering') return;
  ctx.save();
  ctx.fillStyle = '#e9e9e9';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function getSystemPhaseCount(system, fallbackPhases = 1) {
  const cfg = SYSTEM_CONFIG[system];
  if (cfg) return cfg.phases;
  return fallbackPhases || 1;
}

function drawSymbol(ctx, type, x, y, w, h, zoom) {
  const cx = x + w/2, cy = y + h/2;
  const lw = 1.5/zoom;
  ctx.lineWidth = lw;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  switch(type) {
    case 'utility':
      ctx.beginPath(); ctx.arc(cx, cy, 12/zoom, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy-8/zoom); ctx.lineTo(cx, cy+8/zoom);
      ctx.moveTo(cx-8/zoom, cy); ctx.lineTo(cx+8/zoom, cy); ctx.stroke();
      break;
    case 'transformer':
      ctx.beginPath(); ctx.arc(cx, cy-8/zoom, 8/zoom, 0, Math.PI*2); ctx.stroke();
      ctx.setLineDash([3/zoom, 2/zoom]);
      ctx.beginPath(); ctx.arc(cx, cy+8/zoom, 8/zoom, 0, Math.PI*2); ctx.stroke();
      ctx.setLineDash([]);
      break;
    case 'panel':
      ctx.strokeRect(cx-16/zoom, cy-10/zoom, 32/zoom, 22/zoom);
      for (let i=0;i<3;i++) {
        ctx.beginPath(); ctx.moveTo(cx-10/zoom, cy-4/zoom+i*8/zoom);
        ctx.lineTo(cx+10/zoom, cy-4/zoom+i*8/zoom); ctx.stroke();
      }
      break;
    case 'breaker':
      ctx.beginPath();
      ctx.moveTo(cx, cy-14/zoom); ctx.lineTo(cx, cy-6/zoom);
      ctx.moveTo(cx-8/zoom, cy-6/zoom); ctx.lineTo(cx+8/zoom, cy-6/zoom);
      ctx.moveTo(cx, cy-6/zoom); ctx.lineTo(cx+8/zoom, cy+4/zoom);
      ctx.moveTo(cx-8/zoom, cy+4/zoom); ctx.lineTo(cx+8/zoom, cy+4/zoom);
      ctx.moveTo(cx, cy+4/zoom); ctx.lineTo(cx, cy+14/zoom);
      ctx.stroke();
      break;
    case 'fuse':
      ctx.beginPath();
      ctx.moveTo(cx, cy-14/zoom); ctx.lineTo(cx, cy-8/zoom);
      ctx.strokeRect(cx-6/zoom, cy-8/zoom, 12/zoom, 16/zoom);
      ctx.setLineDash([2/zoom,2/zoom]);
      ctx.beginPath(); ctx.moveTo(cx, cy-8/zoom); ctx.lineTo(cx, cy+8/zoom); ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(cx, cy+8/zoom); ctx.lineTo(cx, cy+14/zoom); ctx.stroke();
      break;
    case 'bus':
      ctx.lineWidth = 3/zoom;
      ctx.beginPath(); ctx.moveTo(cx-28/zoom, cy); ctx.lineTo(cx+28/zoom, cy); ctx.stroke();
      ctx.lineWidth = lw;
      for (const dx of [-18/zoom, 0, 18/zoom]) {
        ctx.beginPath(); ctx.moveTo(cx+dx, cy); ctx.lineTo(cx+dx, cy+10/zoom); ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(cx, cy-10/zoom); ctx.lineTo(cx, cy); ctx.stroke();
      break;
    case 'cable':
      ctx.lineWidth = 2.5/zoom;
      ctx.beginPath(); ctx.moveTo(cx, cy-22/zoom); ctx.lineTo(cx, cy+22/zoom); ctx.stroke();
      ctx.lineWidth = lw;
      ctx.setLineDash([3/zoom,2/zoom]);
      ctx.beginPath(); ctx.moveTo(cx-5/zoom, cy-22/zoom); ctx.lineTo(cx-5/zoom, cy+22/zoom); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx+5/zoom, cy-22/zoom); ctx.lineTo(cx+5/zoom, cy+22/zoom); ctx.stroke();
      ctx.setLineDash([]);
      break;
    case 'load':
      ctx.beginPath();
      ctx.moveTo(cx, cy-14/zoom); ctx.lineTo(cx, cy-6/zoom);
      ctx.moveTo(cx, cy-6/zoom); ctx.lineTo(cx-12/zoom, cy+10/zoom);
      ctx.lineTo(cx+12/zoom, cy+10/zoom); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx-12/zoom, cy+12/zoom); ctx.lineTo(cx+12/zoom, cy+12/zoom); ctx.stroke();
      break;
    case 'meter':
      ctx.beginPath(); ctx.arc(cx, cy, 12/zoom, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx-8/zoom, cy+4/zoom);
      ctx.quadraticCurveTo(cx, cy-6/zoom, cx+8/zoom, cy+4/zoom);
      ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx+6/zoom, cy-4/zoom); ctx.stroke();
      break;
  }
}

function rrect(x, y, w, h, r) {
  const tl = typeof r === 'object' ? r.tl : r;
  const tr = typeof r === 'object' ? r.tr : r;
  const bl = typeof r === 'object' ? r.bl : r;
  const br = typeof r === 'object' ? r.br : r;
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y); ctx.arcTo(x+w, y, x+w, y+tr, tr||0.1);
  ctx.lineTo(x + w, y + h - br); ctx.arcTo(x+w, y+h, x+w-br, y+h, br||0.1);
  ctx.lineTo(x + bl, y + h); ctx.arcTo(x, y+h, x, y+h-bl, bl||0.1);
  ctx.lineTo(x, y + tl); ctx.arcTo(x, y, x+tl, y, tl||0.1);
  ctx.closePath();
}

// ═══════════════════════════════════════════════════
// DRAG FROM TOOLBOX
// ═══════════════════════════════════════════════════

function startDrag(e, type) {
  dragType = type;
  e.dataTransfer.effectAllowed = 'copy';
  e.dataTransfer.setData('text/plain', type);
}

function dropComp(e) {
  e.preventDefault();
  
  // Get the type from dataTransfer if dragType isn't set
  const type = dragType || e.dataTransfer.getData('text/plain');
  if (!type || !COMP_DEFS[type]) return;

  const { x, y } = toWorld(e.clientX, e.clientY);
  const d = COMP_DEFS[type];
  
  const node = {
    id: idCounter++,
    type: type,
    x: Math.round((x - d.w/2) / 10) * 10,
    y: Math.round((y - d.h/2) / 10) * 10,
    props: Object.assign({}, d.defaults),
  };
  if (node.props.system) {
    node.props.phases = getSystemPhaseCount(node.props.system, node.props.phases);
  }
  
  nodes.push(node);
  select(node);
  dragType = null;
  draw();
}

// ═══════════════════════════════════════════════════
// MOUSE EVENTS
// ═══════════════════════════════════════════════════

canvas.addEventListener('mousedown', e => {
  if (e.button !== 0 && e.button !== 1) return;
  const { x, y } = toWorld(e.clientX, e.clientY);

  if (mode === 'pan' || e.button === 1) {
    isPanning = true;
    panStart = { mx: e.clientX, my: e.clientY, px: pan.x, py: pan.y };
    canvas.classList.add('panning');
    return;
  }

  if (mode === 'select') {
    const n = hitNode(x, y);
    if (n) {
      if (!selectedNodes.has(n) || selectedNodes.size <= 1) {
        selectedNodes = new Set([n]);
      }
      const keepMultiSelection = selectedNodes.size > 1 && selectedNodes.has(n);
      select(n, 'node', keepMultiSelection);
      dragNode = n;
      dragOffset = { x: x - n.x, y: y - n.y };
      dragSelection = {
        start: { x, y },
        nodes: Array.from(selectedNodes).map(node => ({ node, x: node.x, y: node.y })),
      };
    } else {
      // Check wire hit
      let hitWire = null;
      for (const w of wires) {
        if (wireHitTest(w, x, y)) { hitWire = w; break; }
      }
      if (hitWire) {
        selectedNodes = new Set();
        select(hitWire, 'wire');
      } else {
        selectionBox = { start: { x, y }, current: { x, y } };
        selected = null;
        selectedNodes = new Set();
        showEmptyProps();
        const displayMode = mode === 'connect' ? 'CONNECTOR' : mode.toUpperCase();
        document.getElementById('status-bar').textContent = 'MODE: ' + displayMode;
      }
    }
    draw();
    return;
  }

  if (mode === 'connect') {
    const near = nearestPort(x, y, null);
    if (near) {
      connectStart = near;
      ghostWire = { x1: near.port.x, y1: near.port.y, x2: near.port.x, y2: near.port.y };
    }
  }
});

canvas.addEventListener('mousemove', e => {
  const { x, y } = toWorld(e.clientX, e.clientY);

  if (isPanning) {
    pan.x = panStart.px + (e.clientX - panStart.mx);
    pan.y = panStart.py + (e.clientY - panStart.my);
    draw(); return;
  }

  if (mode === 'select' && selectionBox) {
    selectionBox.current = { x, y };
    draw();
    return;
  }

  if (mode === 'select' && dragSelection) {
    const dx = x - dragSelection.start.x;
    const dy = y - dragSelection.start.y;
    for (const item of dragSelection.nodes) {
      item.node.x = Math.round((item.x + dx) / 10) * 10;
      item.node.y = Math.round((item.y + dy) / 10) * 10;
    }
    draw(); return;
  }

  if (mode === 'connect') {
    hoverPortInfo = nearestPort(x, y, connectStart?.node || null);
    hoverNode = hitNode(x, y);
    if (ghostWire) { ghostWire.x2 = x; ghostWire.y2 = y; }
    draw(); return;
  }

  hoverNode = hitNode(x, y);
  draw();
});

canvas.addEventListener('mouseup', e => {
  const { x, y } = toWorld(e.clientX, e.clientY);
  isPanning = false;
  canvas.classList.remove('panning');

  if (selectionBox) {
    selectionBox.current = { x, y };
    const rect = makeRect(selectionBox.start, selectionBox.current);
    const matched = nodes.filter(n => nodeIntersectsRect(n, rect));
    selectedNodes = new Set(matched);
    if (matched.length === 1) {
      select(matched[0]);
    } else if (matched.length > 1) {
      selected = null;
      showEmptyProps();
      document.getElementById('status-bar').textContent = `SELECTED: ${matched.length} ITEMS`;
    } else {
      deselect();
    }
    selectionBox = null;
    draw();
    return;
  }

  if (dragSelection) {
    syncCableVoltages();
    dragSelection = null;
    dragNode = null;
    return;
  }

  if (mode === 'connect' && connectStart) {
    const near = nearestPort(x, y, connectStart.node);
    if (near && near.node !== connectStart.node) {
      const exists = wires.some(w =>
        (w.fromNode===connectStart.node.id && w.fromPort===connectStart.port.id &&
         w.toNode===near.node.id && w.toPort===near.port.id) ||
        (w.toNode===connectStart.node.id && w.toPort===connectStart.port.id &&
         w.fromNode===near.node.id && w.fromPort===near.port.id)
      );
      if (!exists) {
        wires.push({
          id: idCounter++,
          fromNode: connectStart.node.id,
          fromPort: connectStart.port.id,
          toNode: near.node.id,
          toPort: near.port.id,
        });
        syncCableVoltages();
      }
    }
    connectStart = null;
    ghostWire = null;
    draw();
  }
});

canvas.addEventListener('wheel', e => {
  e.preventDefault();
  if (e.ctrlKey || e.metaKey) {
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const { x, y } = toWorld(e.clientX, e.clientY);
    adjustZoomAt(delta, e.clientX, e.clientY);
  } else {
    pan.x -= e.deltaX;
    pan.y -= e.deltaY;
    draw();
  }
}, { passive: false });

function wireHitTest(w, wx, wy) {
  const a = nodes.find(n => n.id === w.fromNode);
  const b = nodes.find(n => n.id === w.toNode);
  if (!a || !b) return false;
  const pa = getPorts(a).find(p => p.id === w.fromPort);
  const pb = getPorts(b).find(p => p.id === w.toPort);
  if (!pa || !pb) return false;
  const points = getWirePolylinePoints(pa, pb);
  for (let i = 0; i < points.length - 1; i++) {
    if (distancePointToSegment(wx, wy, points[i], points[i + 1]) < 8 / zoom) {
      return true;
    }
  }
  return false;
}

function distancePointToSegment(px, py, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (dx === 0 && dy === 0) return Math.hypot(px - a.x, py - a.y);
  const t = Math.max(0, Math.min(1, ((px - a.x) * dx + (py - a.y) * dy) / (dx * dx + dy * dy)));
  const cx = a.x + t * dx;
  const cy = a.y + t * dy;
  return Math.hypot(px - cx, py - cy);
}

// ═══════════════════════════════════════════════════
// SELECTION & PROPERTIES
// ═══════════════════════════════════════════════════

function select(item, type, keepMultiSelection = false) {
  selected = item;
  if (!type || type === 'node') {
    if (!keepMultiSelection) {
      selectedNodes = new Set([item]);
    }
    showNodeProps(item);
  } else {
    selectedNodes = new Set();
    showWireProps(item);
  }
  document.getElementById('status-bar').textContent =
    `SELECTED: ${item.props?.name || item.type || 'WIRE'}`;
}

function deselect() {
  selected = null;
  selectedNodes = new Set();
  showEmptyProps();
  // Change 'WIRE' to 'CONNECTOR' here
  const displayMode = mode === 'connect' ? 'CONNECTOR' : mode.toUpperCase();
  document.getElementById('status-bar').textContent = 'MODE: ' + displayMode;
}

function showEmptyProps() {
  document.getElementById('props-type-badge').style.display = 'none';
  document.getElementById('prop-content').innerHTML =
    `<div class="props-empty"><strong>No selection</strong>Drag a component from the left panel, then click to select and edit its properties here.</div>`;
  document.getElementById('calc-panel').classList.remove('visible');
}

function showNodeProps(n) {
  const badge = document.getElementById('props-type-badge');
  badge.style.display = 'inline';
  badge.textContent = COMP_DEFS[n.type].label.toUpperCase();

  const fields = FIELD_DEFS[n.type] || [];
  let html = '';
  for (const f of fields) {
    const val = n.props[f.k] !== undefined ? n.props[f.k] : '';
    
    html += `<div class="prop-row"><span class="prop-label">${f.l}</span>`;
    
    if (f.t === 'select') {
      // Generate dropdown
      html += `<select class="prop-input" data-nid="${n.id}" data-key="${f.k}" onchange="updateProp(this)">`;
      f.options.forEach(opt => {
        const optionValue = typeof opt === 'object' && opt !== null ? opt.value : opt;
        const optionLabel = typeof opt === 'object' && opt !== null ? opt.label : opt;
        const selected = String(optionValue) === String(val) ? 'selected' : '';
        html += `<option value="${optionValue}" ${selected}>${optionLabel}</option>`;
      });
      html += `</select>`;
    } else {
      // Generate standard input
      html += `<input class="prop-input" type="${f.t || 'text'}" value="${val}" 
        step="${f.t==='number'?'any':''}" data-nid="${n.id}" data-key="${f.k}" onchange="updateProp(this)">`;
    }
    html += `</div>`;
  }
  document.getElementById('prop-content').innerHTML = html;

  if (n.type === 'cable') {
    document.getElementById('calc-panel').classList.add('visible');
    runCableCalc();
  } else {
    document.getElementById('calc-panel').classList.remove('visible');
  }
}

function showWireProps(w) {
  document.getElementById('props-type-badge').style.display = 'inline';
  document.getElementById('props-type-badge').textContent = 'CONNECTOR'; // Changed from WIRE
  document.getElementById('prop-content').innerHTML =
    `<div class="props-empty" style="color:var(--text2)">Connector connection selected.<br><small style="color:var(--text3)">Press Delete to remove.</small></div>`;
  document.getElementById('calc-panel').classList.remove('visible');
}

function updateProp(input) {
  const nid = parseInt(input.dataset.nid);
  const key = input.dataset.key;
  const n = nodes.find(n => n.id === nid);
  if (!n) return;
  const numKeys = ['voltage','phases','amps','current','kva','primary_v','secondary_v','impedance','main_amps','short_ckt_kA','kaic','fault_kA','kw','hp','pf','length','conductors','ocpd_amps'];
  n.props[key] = numKeys.includes(key) ? parseFloat(input.value) || 0 : input.value;
  if (n.type === 'cable' && (key === 'amps' || key === 'material' || key === 'conductors')) {
    const recommendedSize = getMinimumCableSizeForLoad(n.props.amps, n.props.material, n.props.conductors);
    if (recommendedSize) {
      n.props.size = recommendedSize;
      const sizeInput = document.querySelector(`.prop-input[data-nid="${n.id}"][data-key="size"]`);
      if (sizeInput) sizeInput.value = recommendedSize;
    }
  }
  if (key === 'system' && (n.type === 'panel' || n.type === 'cable' || n.type === 'breaker')) {
    n.props.phases = getSystemPhaseCount(n.props.system, n.props.phases);
  }
  if (n.type === 'transformer') syncCableVoltages();
  draw();
  if (n.type === 'cable') runCableCalc();
}

// ═══════════════════════════════════════════════════
// MODE
// ═══════════════════════════════════════════════════

function toggleCanvasStyle() {
  canvasStyle = canvasStyle === 'engineering' ? 'modern' : 'engineering';
  wrap.classList.toggle('engineering', canvasStyle === 'engineering');
  const btn = document.getElementById('btn-canvas-style');
  btn.classList.toggle('active', canvasStyle === 'engineering');
  btn.textContent = canvasStyle === 'engineering' ? 'Engineering Canvas' : 'Modern Canvas';
  draw();
}

function setMode(m) {
  mode = m;
  ['select','connect','pan'].forEach(id => {
    document.getElementById('btn-'+id).classList.toggle('active', id === m);
  });
  canvas.className = m === 'connect' ? 'mode-connect' : m === 'pan' ? 'mode-pan' : '';
  
  // Update the status bar text logic
  const label = m === 'connect' ? 'CONNECTOR' : m.toUpperCase();
  document.getElementById('status-bar').textContent = 'MODE: ' + label;
  
  connectStart = null;
  ghostWire = null;
  selectionBox = null;
  dragSelection = null;
  draw();
}

function setWireRouting(routing) {
  wireRouting = routing === 'straight' ? 'straight' : 'orthogonal';
  draw();
}

function showRulesHelp() {
  document.getElementById('rules-modal')?.classList.add('open');
}

// ═══════════════════════════════════════════════════
// ZOOM
// ═══════════════════════════════════════════════════

function adjustZoom(delta) {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  adjustZoomAt(delta, cx + wrap.getBoundingClientRect().left, cy + wrap.getBoundingClientRect().top);
}

function adjustZoomAt(delta, screenX, screenY) {
  const r = wrap.getBoundingClientRect();
  const wx = (screenX - r.left - pan.x) / zoom;
  const wy = (screenY - r.top - pan.y) / zoom;
  zoom = Math.max(0.2, Math.min(3, zoom + delta));
  pan.x = screenX - r.left - wx * zoom;
  pan.y = screenY - r.top - wy * zoom;
  document.getElementById('zoom-label').textContent = Math.round(zoom * 100) + '%';
  draw();
}

function resetView() {
  pan = { x: 60, y: 60 };
  zoom = 1;
  document.getElementById('zoom-label').textContent = '100%';
  draw();
}

// ═══════════════════════════════════════════════════
// EDIT ACTIONS
// ═══════════════════════════════════════════════════

function deleteSelected() {
  if (selectedNodes.size > 0) {
    const selectedIds = new Set(Array.from(selectedNodes).map(n => n.id));
    wires = wires.filter(w => !selectedIds.has(w.fromNode) && !selectedIds.has(w.toNode));
    nodes = nodes.filter(n => !selectedIds.has(n.id));
    selectedNodes = new Set();
    selected = null;
    syncCableVoltages();
    showEmptyProps();
    draw();
    return;
  }
  if (!selected) return;
  if (nodes.includes(selected)) {
    wires = wires.filter(w => w.fromNode !== selected.id && w.toNode !== selected.id);
    nodes = nodes.filter(n => n !== selected);
  } else if (wires.includes(selected)) {
    wires = wires.filter(w => w !== selected);
  }
  syncCableVoltages();
  selected = null;
  showEmptyProps();
  draw();
}

function clearAll() {
  if (!confirm('Clear the entire diagram?')) return;
  nodes = []; wires = []; selected = null;
  syncCableVoltages();
  showEmptyProps();
  draw();
}

function alignAllComponents() {
  if (nodes.length === 0) return;
  const sorted = [...nodes].sort((a, b) => (a.y - b.y) || (a.x - b.x));
  const rowThreshold = 80;
  const spacingX = 170;
  const spacingY = 140;
  const minX = Math.min(...sorted.map(n => n.x));
  const minY = Math.min(...sorted.map(n => n.y));
  const rows = [];

  for (const node of sorted) {
    let row = rows.find(r => Math.abs(node.y - r.baseY) <= rowThreshold);
    if (!row) {
      row = { baseY: node.y, nodes: [] };
      rows.push(row);
    }
    row.nodes.push(node);
  }

  rows.forEach((row, rowIndex) => {
    row.nodes.sort((a, b) => a.x - b.x);
    const alignedY = Math.round((minY + rowIndex * spacingY) / 10) * 10;
    row.nodes.forEach((node, colIndex) => {
      node.x = Math.round((minX + colIndex * spacingX) / 10) * 10;
      node.y = alignedY;
    });
  });

  syncCableVoltages();
  draw();
}

// ═══════════════════════════════════════════════════
// CABLE CALCULATIONS (CSA C22.1)
// ═══════════════════════════════════════════════════

function getCableRow(size) {
  const normalizedSize = String(size || '').trim();
  const byExactMatch = CABLE_DATA.find(r => r.size === normalizedSize);
  if (byExactMatch) return byExactMatch;

  const strippedInput = normalizedSize.replace(/^#/, '');
  return CABLE_DATA.find(r => r.size.replace(/^#/, '') === strippedInput) || CABLE_DATA[1];
}

function getMinimumCableSizeForLoad(loadAmps, material, conductorsPerPhase = 1) {
  const load = Number(loadAmps);
  if (!Number.isFinite(load) || load <= 0) return null;

  const requiredAmpacity = load * 1.25; // CSA load-conductor sizing basis.
  const mat = String(material || 'Cu').toLowerCase().startsWith('al') ? 'al' : 'cu';
  const conductors = Math.max(1, parseInt(conductorsPerPhase, 10) || 1);

  for (const row of CABLE_DATA) {
    const ampacity = mat === 'al' ? row.al : row.cu;
    if (!ampacity || ampacity <= 0) continue;
    if (ampacity * conductors >= requiredAmpacity) return row.size;
  }

  return null;
}

function getConnectedNodeIds(startId) {
  const visited = new Set([startId]);
  const queue = [startId];

  while (queue.length) {
    const current = queue.shift();
    for (const w of wires) {
      const neighbor =
        w.fromNode === current ? w.toNode :
        w.toNode === current ? w.fromNode : null;
      if (neighbor === null || visited.has(neighbor)) continue;
      visited.add(neighbor);
      queue.push(neighbor);
    }
  }

  return visited;
}

function syncCableVoltages() {
  const cables = nodes.filter(n => n.type === 'cable');

  for (const cable of cables) {
    const connectedIds = getConnectedNodeIds(cable.id);
    let bestSource = null;

    for (const nodeId of connectedIds) {
      if (nodeId === cable.id) continue;
      const n = nodes.find(node => node.id === nodeId);
      if (!n) continue;
      if (n.type !== 'transformer') continue;
      if (n.y >= cable.y) continue;

      const sourceVoltage = n.props.secondary_v ?? n.props.voltage;
      const voltage = Number(sourceVoltage);
      if (!Number.isFinite(voltage) || voltage <= 0) continue;

      const verticalDistance = cable.y - n.y;
      if (!bestSource || verticalDistance < bestSource.verticalDistance) {
        bestSource = { voltage, verticalDistance };
      }
    }

    if (bestSource) {
      cable.props.voltage = bestSource.voltage;
    }
  }
}

function runCableCalc() {
  if (!selected || selected.type !== 'cable') return;
  const p = selected.props;
  const V = p.voltage || 120;
  const I = p.amps || 0;
  const sizingCurrent = I * 1.25;
  const L = p.length || 1;
  const mat = (p.material || 'Cu').toLowerCase().startsWith('al') ? 'al' : 'cu';
  const row = getCableRow(p.size);
  const A = row.area;
  const rho = mat === 'al' ? 0.0282 : 0.0172; // Ω·mm²/m
  const R = rho / A; // Ω/m
  const phases = getSystemPhaseCount(p.system, p.phases || ((p.conductors || 1) >= 3 ? 3 : 1));
  const conductorsPerPhase = Math.max(1, parseInt(p.conductors, 10) || 1);
  const factor = phases === 3 ? Math.sqrt(3) : 2;
  const vd = (factor * I * R * L) / conductorsPerPhase;
  const vd_pct = V > 0 ? (vd / V * 100) : 0;

  const ampacity = mat === 'al' ? row.al : row.cu;
  const totalAmpacity = ampacity > 0 ? ampacity * conductorsPerPhase : 0;
  const ampOk = totalAmpacity > 0 && sizingCurrent <= totalAmpacity;
  const parallelRuns = conductorsPerPhase;
  const bonding = getBondingSelectionForCable(selected, {
    totalAmpacity,
    phaseConductorSize: row.size,
    phaseConductorArea: row.area
  });

  document.getElementById('cv-vd').textContent = vd.toFixed(2) + ' V';
  const vdEl = document.getElementById('cv-vdpct');
  vdEl.textContent = vd_pct.toFixed(2) + '%';
  vdEl.className = 'calc-value ' + (vd_pct > 5 ? 'calc-err' : vd_pct > 3 ? 'calc-warn' : 'calc-ok');

  const ampacityEl = document.getElementById('cv-ampacity');
  ampacityEl.textContent =
    ampacity > 0 ? `${totalAmpacity} A (${ampacity} × ${conductorsPerPhase})` : 'N/A (Al <#6)';
  ampacityEl.className = 'calc-value ' + (ampOk ? 'calc-ok' : 'calc-err');
  const requiredEl = document.getElementById('cv-required-ampacity');
  requiredEl.textContent = `${sizingCurrent.toFixed(2)} A`;
  requiredEl.className = 'calc-value ' + (ampOk ? 'calc-ok' : 'calc-err');
  document.getElementById('cv-parallel').textContent =
    parallelRuns > 0 ? `${parallelRuns}(${phases}${row.size})` : '—';
  document.getElementById('cv-bonding-size').textContent = bonding.size;

  const statEl = document.getElementById('cv-status');
  if (!ampOk && ampacity > 0) {
    statEl.textContent = '⚠ OVERLOAD';
    statEl.className = 'calc-value calc-err';
  } else if (vd_pct > 5) {
    statEl.textContent = '✕ VD FAIL';
    statEl.className = 'calc-value calc-err';
  } else if (vd_pct > 3) {
    statEl.textContent = '△ VD CHECK';
    statEl.className = 'calc-value calc-warn';
  } else {
    statEl.textContent = '✓ PASS';
    statEl.className = 'calc-value calc-ok';
  }
}

function getCableAreaBySize(size) {
  const normalized = normalizeConductorSizeToken(size);
  if (normalized && CONDUCTOR_AREA_MM2[normalized]) return CONDUCTOR_AREA_MM2[normalized];
  const row = getCableRow(size);
  return row?.area || 0;
}

function normalizeConductorSizeToken(size) {
  let token = String(size || '').trim().toUpperCase();
  if (!token) return '';
  token = token.replace(/^#/, '');
  if (token === '1/0') return '0';
  if (token === '2/0') return '00';
  if (token === '3/0') return '000';
  if (token === '4/0') return '0000';
  return token;
}

function formatConductorSizeToken(size) {
  const token = normalizeConductorSizeToken(size);
  if (!token) return 'N/A';
  if (token === '0') return '#1/0';
  if (token === '00') return '#2/0';
  if (token === '000') return '#3/0';
  if (token === '0000') return '#4/0';
  if (/^\d+$/.test(token) && Number(token) < 250) return `#${token}`;
  return token;
}

function getTable16BondingSize(referenceAmps, bondingMaterial) {
  if (!Number.isFinite(referenceAmps) || referenceAmps <= 0) return null;
  const tableRow = TABLE16_BONDING_DATA.find(entry => referenceAmps <= entry.max);
  if (!tableRow) return null;
  const rawSize = String(bondingMaterial || 'Cu').toLowerCase().startsWith('al') ? tableRow.al : tableRow.cu;
  return normalizeConductorSizeToken(rawSize);
}

function enforceRule106165MaxBondingSize(calculatedSize, phaseConductorSize) {
  if (!calculatedSize || !phaseConductorSize) return calculatedSize || null;
  const bondingArea = getCableAreaBySize(calculatedSize);
  const phaseArea = getCableAreaBySize(phaseConductorSize);
  if (bondingArea <= 0 || phaseArea <= 0) return calculatedSize;
  return bondingArea > phaseArea ? normalizeConductorSizeToken(phaseConductorSize) : calculatedSize;
}

function getBondingSelectionForCable(cableNode, context) {
  const p = cableNode?.props || {};
  const bondingMaterial = p.bonding_material || p.material || 'Cu';
  const method = p.bonding_method || 'Overcurrent Device';
  const ocpdAmps = parseFloat(p.ocpd_amps) || 0;
  const largestUngroundedAmpacity = context.totalAmpacity || 0;

  // Rule 10-616(3): feeder/branch uses OCPD, or largest ungrounded conductor ampacity when upsized for VD.
  let referenceAmps = 0;
  let basisDescription = '—';
  let ruleRef = 'Rule 10-616(3) + Table 16';

  if (method === 'Largest Ungrounded (VD Increased)') {
    referenceAmps = largestUngroundedAmpacity;
    basisDescription = `Feeder/Branch (VD increase): largest ungrounded conductor ampacity (${largestUngroundedAmpacity || 0} A)`;
    ruleRef = 'Rule 10-616(3)(b) + Table 16';
  } else {
    referenceAmps = ocpdAmps;
    basisDescription = `Feeder/Branch: OCPD rating (${ocpdAmps || 0} A)`;
    ruleRef = 'Rule 10-616(3)(a) + Table 16';
  }

  const table16Size = getTable16BondingSize(referenceAmps, bondingMaterial);
  const cappedSize = enforceRule106165MaxBondingSize(table16Size, context.phaseConductorSize);
  const size = cappedSize ? formatConductorSizeToken(cappedSize) : 'N/A (outside Table 16 range)';

  // Rule 10-616(4) intentionally disregarded per project requirement:
  // no splitting/dividing by parallel raceways; sizing is performed as a full standalone conductor.
  return { size, basisDescription, ruleRef };
}

function calculateLoadCurrent(loadNode) {
  const p = loadNode.props || {};
  const current = parseFloat(p.current) || 0;
  if (current > 0) return current;

  // Backward compatibility with older saved projects.
  const legacyAmps = parseFloat(p.amps) || 0;
  if (legacyAmps > 0) return legacyAmps;

  return 0;
}

function buildAdjacency() {
  const graph = new Map();
  for (const n of nodes) graph.set(n.id, []);
  for (const w of wires) {
    if (!graph.has(w.fromNode) || !graph.has(w.toNode)) continue;
    graph.get(w.fromNode).push(w.toNode);
    graph.get(w.toNode).push(w.fromNode);
  }
  return graph;
}

function findPath(startId, targetTypes, graph) {
  const queue = [[startId]];
  const seen = new Set([startId]);
  while (queue.length) {
    const path = queue.shift();
    const id = path[path.length - 1];
    const n = nodes.find(node => node.id === id);
    if (n && targetTypes.includes(n.type) && id !== startId) return path;
    for (const nextId of graph.get(id) || []) {
      if (seen.has(nextId)) continue;
      seen.add(nextId);
      queue.push([...path, nextId]);
    }
  }
  return null;
}

function reviewCoordination() {
  const loads = nodes.filter(n => n.type === 'load');
  if (loads.length === 0) {
    document.getElementById('review-content').innerHTML =
      '<div class="props-empty" style="text-align:center;padding:32px">No loads found.<br>Add load components and connections to review path coordination.</div>';
    document.getElementById('review-modal').classList.add('open');
    return;
  }

  const graph = buildAdjacency();
  let html = '';
  for (const load of loads) {
    const loadName = load.props?.name || `LOAD-${load.id}`;
    const loadAmps = calculateLoadCurrent(load);
    const path = findPath(load.id, ['utility', 'transformer', 'panel', 'bus'], graph);
    const messages = [];

    if (!path) {
      messages.push('<li class="review-err">✕ Load is not connected to any source/panel path.</li>');
    } else {
      const pathNodes = path.map(id => nodes.find(n => n.id === id)).filter(Boolean);
      const pathText = pathNodes.map(n => n.props?.name || COMP_DEFS[n.type].label).join(' → ');
      messages.push(`<li class="review-ok">Path found: ${pathText}</li>`);

      const cablesOnPath = pathNodes.filter(n => n.type === 'cable');
      if (cablesOnPath.length === 0) {
        messages.push('<li class="review-warn">△ No cable component on this path to verify conductor sizing.</li>');
      } else {
        for (const cable of cablesOnPath) {
          const cp = cable.props || {};
          const row = getCableRow(cp.size);
          const mat = (cp.material || 'Cu').toLowerCase().startsWith('al') ? 'al' : 'cu';
          const ampacity = mat === 'al' ? row.al : row.cu;
          const cableLoad = Math.max(parseFloat(cp.amps) || 0, loadAmps);
          if (ampacity <= 0) {
            messages.push(`<li class="review-err">✕ ${cp.name || 'Cable'}: size ${cp.size} ${mat.toUpperCase()} has no valid ampacity in table.</li>`);
          } else if (cableLoad > ampacity) {
            messages.push(`<li class="review-err">✕ ${cp.name || 'Cable'}: ${cableLoad.toFixed(1)}A load exceeds ${ampacity}A ampacity.</li>`);
          } else {
            messages.push(`<li class="review-ok">✓ ${cp.name || 'Cable'}: ${cp.size} ${mat.toUpperCase()} supports ${cableLoad.toFixed(1)}A (ampacity ${ampacity}A).</li>`);
          }
        }
      }

      const protectionOnPath = pathNodes.filter(n => n.type === 'breaker' || n.type === 'fuse');
      if (protectionOnPath.length === 0) {
        messages.push('<li class="review-warn">△ No breaker/fuse found on path for protection coordination.</li>');
      } else {
        for (const device of protectionOnPath) {
          const rating = parseFloat(device.props?.amps) || 0;
          const name = device.props?.name || COMP_DEFS[device.type].label;
          if (rating <= 0) {
            messages.push(`<li class="review-err">✕ ${name}: missing amp rating.</li>`);
            continue;
          }
          if (loadAmps > 0 && rating < loadAmps) {
            messages.push(`<li class="review-err">✕ ${name}: ${rating}A is undersized for ${loadAmps.toFixed(1)}A load.</li>`);
          } else if (loadAmps > 0 && rating > loadAmps * 2.5) {
            messages.push(`<li class="review-warn">△ ${name}: ${rating}A appears oversized for ${loadAmps.toFixed(1)}A load.</li>`);
          } else {
            messages.push(`<li class="review-ok">✓ ${name}: ${rating}A rating is coordinated with ${loadAmps.toFixed(1)}A load.</li>`);
          }
        }
      }
    }

    if (loadAmps <= 0) {
      messages.push('<li class="review-warn">△ Load current is 0A. Enter FLA or valid kW/voltage/PF for stronger checks.</li>');
    } else {
      messages.push(`<li class="review-ok">Calculated load current: ${loadAmps.toFixed(1)}A.</li>`);
    }

    html += `
      <div class="review-block">
        <div class="review-title">${loadName}</div>
        <ul class="review-list">${messages.join('')}</ul>
      </div>
    `;
  }

  document.getElementById('review-content').innerHTML = html;
  document.getElementById('review-modal').classList.add('open');
}

// ═══════════════════════════════════════════════════
// FEEDER SCHEDULE
// ═══════════════════════════════════════════════════

function showFeederList() {
  const cables = nodes.filter(n => n.type === 'cable');
  if (cables.length === 0) {
    document.getElementById('feeder-content').innerHTML =
      '<div class="props-empty" style="text-align:center;padding:32px">No cable components on the diagram yet.<br>Add cable components to generate the feeder schedule.</div>';
    document.getElementById('feeder-modal').classList.add('open');
    return;
  }

  let rows = '';
  for (const c of cables) {
    const p = c.props;
    const { from, to } = getCableEndpoints(c);
    const V = p.voltage || 120;
    const I = p.amps || 0;
    const L = p.length || 1;
    const mat = (p.material || 'Cu').toLowerCase().startsWith('al') ? 'al' : 'cu';
    const row = getCableRow(p.size);
    const A = row.area;
    const rho = mat === 'al' ? 0.0282 : 0.0172;
    const R = rho / A;
    const phases = getSystemPhaseCount(p.system, p.phases || ((p.conductors || 1) >= 3 ? 3 : 1));
    const system = p.system || '—';
    const factor = phases === 3 ? Math.sqrt(3) : 2;
    const conductorsPerPhase = Math.max(1, parseInt(p.conductors, 10) || 1);
    const vd = (factor * I * R * L) / conductorsPerPhase;
    const vd_pct = V > 0 ? (vd / V * 100) : 0;
    const ampacity = mat === 'al' ? row.al : row.cu;
    const totalAmpacity = ampacity > 0 ? ampacity * conductorsPerPhase : 0;
    const bonding = getBondingSelectionForCable(c, {
      totalAmpacity,
      phaseConductorSize: p.size,
    });
    const ampOk = totalAmpacity <= 0 || I <= totalAmpacity;
    const vdClass = vd_pct > 5 ? 'badge-err' : vd_pct > 3 ? 'badge-warn' : 'badge-ok';
    const vdText = vd_pct > 5 ? 'FAIL' : vd_pct > 3 ? 'CHECK' : 'OK';
    const ampClass = ampOk ? 'badge-ok' : 'badge-err';
    const ampText = ampOk ? 'OK' : 'OVER';
    rows += `<tr>
      <td style="color:#cdd6f4;font-weight:500">${p.name||'—'}</td>
      <td>${from}</td>
      <td>${to}</td>
      <td>${p.conductors||1}C-${p.size} ${mat.toUpperCase()}</td>
      <td>${bonding.size}</td>
      <td>${p.insulation||'—'}</td>
      <td>${L} m</td>
      <td>${system}</td>
      <td>${V} V / ${phases}Ø</td>
      <td>${I} A</td>
      <td>${totalAmpacity>0?totalAmpacity+'A':'N/A'} <span class="badge ${ampClass}">${ampText}</span></td>
      <td>${vd.toFixed(2)}V / ${vd_pct.toFixed(2)}% <span class="badge ${vdClass}">${vdText}</span></td>
    </tr>`;
  }

  document.getElementById('feeder-content').innerHTML = `
    <table class="feeder-table">
      <thead><tr>
        <th>Tag</th><th>From</th><th>To</th><th>CONDUCTOR PER PH</th><th>BONDING WIRE</th><th>Insulation</th>
        <th>Length</th><th>System</th><th>Voltage / Phase</th><th>Load</th>
        <th>Ampacity</th><th>Voltage Drop</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  document.getElementById('feeder-modal').classList.add('open');
}

function exportCSV() {
  const cables = nodes.filter(n => n.type === 'cable');
  let csv = 'Tag,From,To,Conductors,Size,Material,Insulation,Length(m),System,Voltage(V),Phases,Load(A),Ampacity(A),VD(V),VD(%),Status\n';
  for (const c of cables) {
    const p = c.props;
    const { from, to } = getCableEndpoints(c);
    const V = p.voltage || 120;
    const I = p.amps || 0;
    const L = p.length || 1;
    const mat = (p.material || 'Cu').toLowerCase().startsWith('al') ? 'al' : 'cu';
    const row = getCableRow(p.size);
    const A = row.area;
    const rho = mat === 'al' ? 0.0282 : 0.0172;
    const R = rho / A;
    const phases = getSystemPhaseCount(p.system, p.phases || ((p.conductors || 1) >= 3 ? 3 : 1));
    const system = p.system || '';
    const factor = phases === 3 ? Math.sqrt(3) : 2;
    const conductorsPerPhase = Math.max(1, parseInt(p.conductors, 10) || 1);
    const vd = (factor * I * R * L) / conductorsPerPhase;
    const vd_pct = V > 0 ? (vd / V * 100) : 0;
    const ampacity = mat === 'al' ? row.al : row.cu;
    const totalAmpacity = ampacity > 0 ? ampacity * conductorsPerPhase : 0;
    const ampOk = totalAmpacity <= 0 || I <= totalAmpacity;
    const status = !ampOk ? 'OVERLOAD' : vd_pct > 5 ? 'VD_FAIL' : vd_pct > 3 ? 'VD_CHECK' : 'PASS';
    csv += `${p.name||''},${from},${to},${p.conductors||1},${p.size},${mat.toUpperCase()},${p.insulation||''},${L},${system},${V},${phases},${I},${totalAmpacity>0?totalAmpacity:'N/A'},${vd.toFixed(3)},${vd_pct.toFixed(2)},${status}\n`;
  }
  const a = document.createElement('a');
  a.href = 'data:text/csv,' + encodeURIComponent(csv);
  a.download = 'feeder_schedule_CSA.csv';
  a.click();
}

function getCableEndpoints(cableNode) {
  const connectedNodes = [];
  for (const wire of wires) {
    if (wire.fromNode === cableNode.id) {
      const target = nodes.find(n => n.id === wire.toNode);
      if (target) connectedNodes.push(target);
    } else if (wire.toNode === cableNode.id) {
      const source = nodes.find(n => n.id === wire.fromNode);
      if (source) connectedNodes.push(source);
    }
  }

  const uniqueNames = [...new Set(connectedNodes.map(n => (n.props?.name || COMP_DEFS[n.type].label || '—')))];
  return {
    from: uniqueNames[0] || '—',
    to: uniqueNames[1] || '—',
  };
}

// ═══════════════════════════════════════════════════
// SAVE / LOAD
// ═══════════════════════════════════════════════════

function saveProject() {
  const data = JSON.stringify({ version:1, nodes, wires, pan, zoom, idCounter }, null, 2);
  const a = document.createElement('a');
  a.href = 'data:application/json,' + encodeURIComponent(data);
  a.download = 'sld_project.json';
  a.click();
}

function printCanvas() {
  suppressCanvasBackdrop = true;
  draw();
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = canvas.width;
  exportCanvas.height = canvas.height;
  const exportCtx = exportCanvas.getContext('2d');
  exportCtx.fillStyle = '#ffffff';
  exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
  exportCtx.drawImage(canvas, 0, 0);
  suppressCanvasBackdrop = false;
  draw();

  const imageDataUrl = exportCanvas.toDataURL('image/png');
  const printFrame = document.createElement('iframe');
  printFrame.style.position = 'fixed';
  printFrame.style.right = '0';
  printFrame.style.bottom = '0';
  printFrame.style.width = '0';
  printFrame.style.height = '0';
  printFrame.style.border = '0';
  printFrame.setAttribute('aria-hidden', 'true');
  document.body.appendChild(printFrame);

  const printDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
  if (!printDoc) {
    document.body.removeChild(printFrame);
    alert('Unable to initialize print preview in this browser.');
    return;
  }

  printDoc.open();
  printDoc.write(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>ElectraDraw Canvas Print</title>
        <style>
          @page { size: auto; margin: 0.5in; }
          html, body {
            margin: 0;
            padding: 0;
            background: #fff;
            height: 100%;
          }
          body {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border: 0;
          }
        </style>
      </head>
      <body>
        <img id="print-image" src="${imageDataUrl}" alt="Canvas export for printing">
      </body>
    </html>
  `);
  printDoc.close();

  const printImage = printDoc.getElementById('print-image');
  const triggerPrint = () => {
    const w = printFrame.contentWindow;
    if (!w) return;
    w.focus();
    w.print();
    setTimeout(() => {
      if (printFrame.parentNode) printFrame.parentNode.removeChild(printFrame);
    }, 500);
  };

  if (printImage && !printImage.complete) {
    printImage.onload = triggerPrint;
    printImage.onerror = () => {
      if (printFrame.parentNode) printFrame.parentNode.removeChild(printFrame);
      alert('Failed to render canvas image for printing.');
    };
  } else {
    triggerPrint();
  }
}

function loadProject(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const d = JSON.parse(ev.target.result);
      nodes = d.nodes || [];
      wires = d.wires || [];
      pan = d.pan || { x: 0, y: 0 };
      zoom = d.zoom || 1;
      idCounter = d.idCounter || 100;
      syncCableVoltages();
      document.getElementById('zoom-label').textContent = Math.round(zoom * 100) + '%';
      selected = null;
      showEmptyProps();
      draw();
    } catch(err) { alert('Could not load file — invalid format.'); }
  };
  reader.readAsText(file);
  e.target.value = '';
}

// ═══════════════════════════════════════════════════
// KEYBOARD
// ═══════════════════════════════════════════════════

document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
    e.preventDefault();
    printCanvas();
    return;
  }
  if (e.key === 'Delete' || e.key === 'Backspace') deleteSelected();
  if (e.key === 'Escape') deselect();
  if (e.key === 's' || e.key === 'S') setMode('select');
  if (e.key === 'w' || e.key === 'W') setMode('connect');
  if (e.key === 'p' || e.key === 'P') setMode('pan');
  if ((e.key === '=' || e.key === '+') && !e.ctrlKey) adjustZoom(0.1);
  if (e.key === '-' && !e.ctrlKey) adjustZoom(-0.1);
  if (e.key === '0' && !e.ctrlKey) resetView();
});

// ═══════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════

resetView();
wrap.classList.toggle('engineering', canvasStyle === 'engineering');
document.getElementById('btn-canvas-style').classList.toggle('active', canvasStyle === 'engineering');
