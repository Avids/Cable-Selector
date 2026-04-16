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
  {size:'1/0', area:53.5,  cu:125, al:100 },
  {size:'2/0', area:67.4,  cu:145, al:115 },
  {size:'3/0', area:85.0,  cu:165, al:130 },
  {size:'4/0', area:107.0, cu:195, al:150 },
  {size:'250', area:127.0, cu:215, al:170 },
  {size:'300', area:152.0, cu:240, al:190 },
  {size:'350', area:177.0, cu:260, al:210 },
  {size:'400', area:203.0, cu:280, al:225 },
  {size:'500', area:253.0, cu:320, al:260 },
];

const TRANSFORMER_PRIMARY_VOLTAGE_OPTIONS = [600, 480, 208];
const TRANSFORMER_SECONDARY_VOLTAGE_OPTIONS = [480, 208];
const TRANSFORMER_KVA_OPTIONS = [3, 6, 9, 15, 30, 45, 75, 100, 112.5, 150, 225, 300, 450, 500, 600];

const COMP_DEFS = {
  utility:     { w:80,  h:80,  label:'Utility',      color:'#89b4fa', titleColor:'#89b4fa',
                 defaults:{name:'UTIL-1', voltage:600, phases:3, fault_kA:25} },
  transformer: { w:80,  h:90,  label:'Transformer',  color:'#cba6f7', titleColor:'#cba6f7',
                 defaults:{name:'TX-1', kva:75, primary_v:600, secondary_v:208, phases:3, impedance:4.5, conn:'Delta-Wye'} },
  panel:       { w:90,  h:80,  label:'Panel',        color:'#94e2d5', titleColor:'#94e2d5',
                 defaults:{name:'MDP', voltage:120, phases:3, main_amps:200, short_ckt_kA:10, mfr:'Square D'} },
  breaker:     { w:60,  h:80,  label:'Breaker',      color:'#74c7ec', titleColor:'#74c7ec',
                 defaults:{name:'CB-1', amps:20, poles:1, voltage:120, kaic:10, type:'Thermal-Mag', mfr:'Square D'} },
  fuse:        { w:60,  h:80,  label:'Fuse Disc.',   color:'#fab387', titleColor:'#fab387',
                 defaults:{name:'FD-1', amps:30, voltage:600, fuse_class:'RK5', poles:3} },
  bus:         { w:110, h:50,  label:'Bus Bar',      color:'#f9e2af', titleColor:'#f9e2af',
                 defaults:{name:'BUS-1', voltage:120, amps:400, phases:3} },
  cable:       { w:90,  h:60,  label:'Cable',        color:'#a6e3a1', titleColor:'#a6e3a1',
                 defaults:{name:'CAB-1', conductors:3, size:'#12', insulation:'RW90', length:10, material:'Cu', amps:20, voltage:120} },
  load:        { w:60,  h:80,  label:'Load',         color:'#f38ba8', titleColor:'#f38ba8',
                 defaults:{name:'LOAD-1', current:20, voltage:120, phases:1} },
  meter:       { w:70,  h:70,  label:'Meter',        color:'#b4befe', titleColor:'#b4befe',
                 defaults:{name:'MTR-1', type:'kWh', ct_ratio:'200:5', voltage:120} },
};

const FIELD_DEFS = {
  utility:     [{k:'name',l:'Tag'},{k:'voltage',l:'Voltage (V)',t:'number'},{k:'phases',l:'Phases',t:'number'},{k:'fault_kA',l:'Fault (kA)',t:'number'}],
  transformer: [{k:'name',l:'Tag'},{k:'kva',l:'KVA',t:'select',options:TRANSFORMER_KVA_OPTIONS},{k:'primary_v',l:'Primary V',t:'select',options:TRANSFORMER_PRIMARY_VOLTAGE_OPTIONS},{k:'secondary_v',l:'Secondary V',t:'select',options:TRANSFORMER_SECONDARY_VOLTAGE_OPTIONS},{k:'phases',l:'Phases',t:'number'},{k:'impedance',l:'%Z',t:'number'},{k:'conn',l:'Connection'}],
  panel:       [{k:'name',l:'Tag'},{k:'voltage',l:'Voltage (V)',t:'number'},{k:'phases',l:'Phases',t:'number'},{k:'main_amps',l:'Main Amps',t:'number'},{k:'short_ckt_kA',l:'SCCR (kA)',t:'number'},{k:'mfr',l:'Manufacturer'}],
  breaker:     [{k:'name',l:'Tag'},{k:'amps',l:'Trip (A)',t:'number'},{k:'poles',l:'Poles',t:'number'},{k:'voltage',l:'Voltage (V)',t:'number'},{k:'kaic',l:'kAIC',t:'number'},{k:'type',l:'Trip Type'},{k:'mfr',l:'Manufacturer'}],
  fuse:        [{k:'name',l:'Tag'},{k:'amps',l:'Rating (A)',t:'number'},{k:'voltage',l:'Voltage (V)',t:'number'},{k:'fuse_class',l:'Fuse Class'},{k:'poles',l:'Poles',t:'number'}],
  bus:         [{k:'name',l:'Tag'},{k:'voltage',l:'Voltage (V)',t:'number'},{k:'amps',l:'Ampacity (A)',t:'number'},{k:'phases',l:'Phases',t:'number'}],
  cable: [
  {k:'name',l:'Tag'},
  {k:'size',l:'Size', t:'select', options: CABLE_DATA.map(d => d.size)}, // Changed to select
  {k:'material',l:'Material (Cu/Al)'},
  {k:'conductors',l:'# Conductors',t:'number'},
  {k:'insulation',l:'Insulation'},
  {k:'length',l:'Length (m)',t:'number'},
  {k:'amps',l:'Load Amps (A)',t:'number'},
  {k:'voltage',l:'Voltage (V)',t:'number'}
],
  load:        [{k:'name',l:'Tag'},{k:'current',l:'Current (A)',t:'number'},{k:'voltage',l:'Voltage (V)',t:'number'},{k:'phases',l:'Phases',t:'select',options:[1,3]}],
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
  const dx = pb.x - pa.x;
  const dy = pb.y - pa.y;
  const mx = pa.x + dx / 2;

  ctx.beginPath();
  const defaultWire = canvasStyle === 'engineering' ? '#8a1111' : '#3d4166';
  const selectedWire = canvasStyle === 'engineering' ? '#c22a2a' : '#89b4fa';
  ctx.strokeStyle = selected ? selectedWire : defaultWire;
  ctx.lineWidth = (selected ? 2 : 1.5) / zoom;
  ctx.moveTo(pa.x, pa.y);

  if (canvasStyle === 'engineering') {
    ctx.lineTo(mx, pa.y);
    ctx.lineTo(mx, pb.y);
    ctx.lineTo(pb.x, pb.y);
  } else {
    if (Math.abs(dx) > Math.abs(dy)) {
      ctx.bezierCurveTo(mx, pa.y, mx, pb.y, pb.x, pb.y);
    } else {
      ctx.bezierCurveTo(pa.x, pa.y + dy/2, pb.x, pb.y - dy/2, pb.x, pb.y);
    }
  }
  ctx.stroke();

  // Junction dots
  ctx.fillStyle = selected ? selectedWire : (canvasStyle === 'engineering' ? '#8a1111' : '#6c7086');
  ctx.beginPath(); ctx.arc(pa.x, pa.y, 3/zoom, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(pb.x, pb.y, 3/zoom, 0, Math.PI*2); ctx.fill();
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

    ctx.textAlign = 'center';
    ctx.fillStyle = '#7f1919';
    ctx.textBaseline = 'bottom';
    ctx.font = `600 ${11/zoom}px "IBM Plex Mono", monospace`;
    ctx.fillText((n.props.name || d.label).toUpperCase(), x + w/2, y - 2/zoom);

    const meta = getEngineeringMeta(n);
    ctx.textBaseline = 'top';
    ctx.font = `500 ${9/zoom}px "IBM Plex Mono", monospace`;
    meta.forEach((line, i) => ctx.fillText(line.toUpperCase(), x + w/2, y + h + (i * 11)/zoom));
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
  ctx.font = `500 ${10/zoom}px "IBM Plex Mono", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(d.label.toUpperCase(), x + w/2, y + 9/zoom);

  // Symbol
  ctx.strokeStyle = d.color;
  ctx.fillStyle = d.color;
  ctx.lineWidth = 1.5/zoom;
  drawSymbol(ctx, n.type, x, y + 18/zoom, w, h - 30/zoom, zoom);

  // Name tag
  ctx.fillStyle = '#cdd6f4';
  ctx.font = `500 ${10/zoom}px "IBM Plex Sans", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText(n.props.name || d.label, x + w/2, y + h - 3/zoom);

  ctx.restore();
}

function getEngineeringMeta(n) {
  switch (n.type) {
    case 'utility': return [`${n.props.voltage || '—'}V`, `${n.props.phases || '—'}PH`];
    case 'transformer': return [`${n.props.kva || '—'}kVA`, `${n.props.primary_v || '—'}/${n.props.secondary_v || '—'}V`];
    case 'panel': return [`MAIN ${n.props.main_amps || '—'}A`, `${n.props.short_ckt_kA || '—'}kA SCCR`];
    case 'breaker': return [`CB ${n.props.amps || '—'}A`, `${n.props.poles || '—'}P`];
    case 'fuse': return [`FD ${n.props.amps || '—'}A`, `CLASS ${n.props.fuse_class || '—'}`];
    case 'bus': return [`BUS ${n.props.amps || '—'}A`, `${n.props.voltage || '—'}V`];
    case 'cable': return [`${n.props.conductors || '—'}C ${n.props.size || '—'}`, `${n.props.length || '—'}m`];
    case 'load': return [`${n.props.current || '—'}A`, `${n.props.voltage || '—'}V`];
    case 'meter': return [`${n.props.type || '—'}`, `${n.props.ct_ratio || '—'}`];
    default: return [];
  }
}

function drawCanvasBackdrop() {
  if (canvasStyle !== 'engineering') return;
  ctx.save();
  ctx.fillStyle = '#e9e9e9';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
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
        ctx.beginPath(); ctx.moveTo(cx+dx, cy-10/zoom); ctx.lineTo(cx+dx, cy); ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy+10/zoom); ctx.stroke();
      break;
    case 'cable':
      ctx.lineWidth = 2.5/zoom;
      ctx.beginPath(); ctx.moveTo(cx-22/zoom, cy); ctx.lineTo(cx+22/zoom, cy); ctx.stroke();
      ctx.lineWidth = lw;
      ctx.setLineDash([3/zoom,2/zoom]);
      ctx.beginPath(); ctx.moveTo(cx-22/zoom, cy-5/zoom); ctx.lineTo(cx+22/zoom, cy-5/zoom); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx-22/zoom, cy+5/zoom); ctx.lineTo(cx+22/zoom, cy+5/zoom); ctx.stroke();
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
  // sample bezier
  for (let t = 0; t <= 1; t += 0.05) {
    const mt = 1 - t;
    const mx = (pa.x + pb.x) / 2;
    const bx = mt*mt*mt*pa.x + 3*mt*mt*t*mx + 3*mt*t*t*mx + t*t*t*pb.x;
    const by = mt*mt*mt*pa.y + 3*mt*mt*t*pa.y + 3*mt*t*t*pb.y + t*t*t*pb.y;
    if (Math.hypot(wx-bx, wy-by) < 8/zoom) return true;
  }
  return false;
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
        const selected = opt === val ? 'selected' : '';
        html += `<option value="${opt}" ${selected}>${opt}</option>`;
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
  const numKeys = ['voltage','phases','amps','current','kva','primary_v','secondary_v','impedance','main_amps','short_ckt_kA','kaic','poles','fault_kA','kw','hp','pf','length','conductors'];
  n.props[key] = numKeys.includes(key) ? parseFloat(input.value) || 0 : input.value;
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

// ═══════════════════════════════════════════════════
// CABLE CALCULATIONS (CSA C22.1)
// ═══════════════════════════════════════════════════

function getCableRow(size) {
  return CABLE_DATA.find(r => r.size === size) || CABLE_DATA[1];
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
  const L = p.length || 1;
  const mat = (p.material || 'Cu').toLowerCase().startsWith('al') ? 'al' : 'cu';
  const row = getCableRow(p.size);
  const A = row.area;
  const rho = mat === 'al' ? 0.0282 : 0.0172; // Ω·mm²/m
  const R = rho / A; // Ω/m
  const phases = (p.conductors || 1) >= 3 ? 3 : 1;
  const factor = phases === 3 ? Math.sqrt(3) : 2;
  const vd = factor * I * R * L;
  const vd_pct = V > 0 ? (vd / V * 100) : 0;

  // Min size must satisfy both 3% VD and ampacity.
  const vd_limit = V * 0.03;
  const needAreaVD = vd_limit > 0 ? (factor * I * rho * L) / vd_limit : 0;
  const minRowVD = CABLE_DATA.find(r => r.area >= needAreaVD) || CABLE_DATA[CABLE_DATA.length-1];

  const ampacity = mat === 'al' ? row.al : row.cu;
  const ampOk = ampacity > 0 && I <= ampacity;
  const minRowAmp = CABLE_DATA.find(r => {
    const cap = mat === 'al' ? r.al : r.cu;
    return cap > 0 && cap >= I;
  }) || CABLE_DATA[CABLE_DATA.length-1];

  const minRow = minRowVD.area >= minRowAmp.area ? minRowVD : minRowAmp;

  document.getElementById('cv-vd').textContent = vd.toFixed(2) + ' V';
  const vdEl = document.getElementById('cv-vdpct');
  vdEl.textContent = vd_pct.toFixed(2) + '%';
  vdEl.className = 'calc-value ' + (vd_pct > 5 ? 'calc-err' : vd_pct > 3 ? 'calc-warn' : 'calc-ok');

  document.getElementById('cv-minsize').textContent = I > 0 ? minRow.size + ' AWG' : '—';
  document.getElementById('cv-ampacity').textContent = ampacity > 0 ? ampacity + ' A' : 'N/A (Al <#6)';

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
    const phases = (p.conductors || 1) >= 3 ? 3 : 1;
    const factor = phases === 3 ? Math.sqrt(3) : 2;
    const vd = factor * I * R * L;
    const vd_pct = V > 0 ? (vd / V * 100) : 0;
    const ampacity = mat === 'al' ? row.al : row.cu;
    const ampOk = ampacity <= 0 || I <= ampacity;
    const vdClass = vd_pct > 5 ? 'badge-err' : vd_pct > 3 ? 'badge-warn' : 'badge-ok';
    const vdText = vd_pct > 5 ? 'FAIL' : vd_pct > 3 ? 'CHECK' : 'OK';
    const ampClass = ampOk ? 'badge-ok' : 'badge-err';
    const ampText = ampOk ? 'OK' : 'OVER';
    rows += `<tr>
      <td style="color:#cdd6f4;font-weight:500">${p.name||'—'}</td>
      <td>${from}</td>
      <td>${to}</td>
      <td>${p.conductors||1}C-${p.size} ${mat.toUpperCase()}</td>
      <td>${p.insulation||'—'}</td>
      <td>${L} m</td>
      <td>${V} V / ${phases}Ø</td>
      <td>${I} A</td>
      <td>${ampacity>0?ampacity+'A':'N/A'} <span class="badge ${ampClass}">${ampText}</span></td>
      <td>${vd.toFixed(2)}V / ${vd_pct.toFixed(2)}% <span class="badge ${vdClass}">${vdText}</span></td>
    </tr>`;
  }

  document.getElementById('feeder-content').innerHTML = `
    <table class="feeder-table">
      <thead><tr>
        <th>Tag</th><th>From</th><th>To</th><th>Conductor</th><th>Insulation</th>
        <th>Length</th><th>Voltage / Phase</th><th>Load</th>
        <th>Ampacity</th><th>Voltage Drop</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  document.getElementById('feeder-modal').classList.add('open');
}

function exportCSV() {
  const cables = nodes.filter(n => n.type === 'cable');
  let csv = 'Tag,From,To,Conductors,Size,Material,Insulation,Length(m),Voltage(V),Phases,Load(A),Ampacity(A),VD(V),VD(%),Status\n';
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
    const phases = (p.conductors || 1) >= 3 ? 3 : 1;
    const factor = phases === 3 ? Math.sqrt(3) : 2;
    const vd = factor * I * R * L;
    const vd_pct = V > 0 ? (vd / V * 100) : 0;
    const ampacity = mat === 'al' ? row.al : row.cu;
    const ampOk = ampacity <= 0 || I <= ampacity;
    const status = !ampOk ? 'OVERLOAD' : vd_pct > 5 ? 'VD_FAIL' : vd_pct > 3 ? 'VD_CHECK' : 'PASS';
    csv += `${p.name||''},${from},${to},${p.conductors||1},${p.size},${mat.toUpperCase()},${p.insulation||''},${L},${V},${phases},${I},${ampacity>0?ampacity:'N/A'},${vd.toFixed(3)},${vd_pct.toFixed(2)},${status}\n`;
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
  draw();
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = canvas.width;
  exportCanvas.height = canvas.height;
  const exportCtx = exportCanvas.getContext('2d');
  exportCtx.fillStyle = '#ffffff';
  exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
  exportCtx.drawImage(canvas, 0, 0);

  if (canvasStyle === 'engineering') {
    const imageData = exportCtx.getImageData(0, 0, exportCanvas.width, exportCanvas.height);
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      // Normalize the engineering backdrop to pure white in print output.
      if (r >= 228 && g >= 228 && b >= 228) {
        pixels[i] = 255;
        pixels[i + 1] = 255;
        pixels[i + 2] = 255;
      }
    }
    exportCtx.putImageData(imageData, 0, 0);
  }

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

  const printDoc = printFrame.contentDocument || (printFrame.contentWindow && printFrame.contentWindow.document);
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
            border: 1px solid #d0d0d0;
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
