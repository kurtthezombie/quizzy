import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// A transparent rotating mesh with triangular faces and orbiting polyhedra.
const size = 360;
const count = 120;
const frames = Buffer.alloc(size * size * 4 * count);
function line(frame, a, b, color) {
  const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
  for (let step = 0; step <= Math.ceil(length * 2); step++) {
    const t = step / Math.ceil(length * 2);
    const x = Math.round(a[0] + (b[0] - a[0]) * t);
    const y = Math.round(a[1] + (b[1] - a[1]) * t);
    for (let dy = 0; dy <= 0; dy++) {
      for (let dx = 0; dx <= 0; dx++) {
        if (x + dx < 0 || x + dx >= size || y + dy < 0 || y + dy >= size) continue;
        const offset = (frame * size * size + (y + dy) * size + x + dx) * 4;
        frames.set([...color, 255], offset);
      }
    }
  }
}
function rotate([x, y, z], phase) {
  const rx = x * Math.cos(phase) + z * Math.sin(phase);
  const rz = -x * Math.sin(phase) + z * Math.cos(phase);
  const tilt = .4;
  return [rx, y * Math.cos(tilt) - rz * Math.sin(tilt), y * Math.sin(tilt) + rz * Math.cos(tilt)];
}
const vertices = [];
const edges = [];
const rows = 8;
const columns = 16;
for (let row = 0; row <= rows; row++) {
  const latitude = Math.PI * row / rows;
  for (let col = 0; col < columns; col++) {
    const longitude = Math.PI * 2 * col / columns;
    vertices.push([Math.sin(latitude) * Math.cos(longitude), Math.cos(latitude), Math.sin(latitude) * Math.sin(longitude)]);
    const index = row * columns + col;
    const next = row * columns + (col + 1) % columns;
    if (row > 0 && row < rows) edges.push([index, next]);
    if (row < rows) {
      edges.push([index, index + columns]);
      if (row > 0 && row < rows - 1) edges.push([index, next + columns]);
    }
  }
}
for (let frame = 0; frame < count; frame++) {
  const phase = frame / count * Math.PI * 2;
  const points = vertices.map(point => rotate(point, phase));
  const sorted = [...edges].sort(([a,b], [c,d]) => points[a][2] + points[b][2] - points[c][2] - points[d][2]);
  for (const [a,b] of sorted) {
    const front = (points[a][2] + points[b][2]) / 2 > 0;
    const color = front ? [153, 102, 83] : [75, 58, 57];
    line(frame, [180 + points[a][0] * 147, 180 + points[a][1] * 147], [180 + points[b][0] * 147, 180 + points[b][1] * 147], color);
  }
  for (let satellite = 0; satellite < 3; satellite++) {
    const angle = phase + satellite * Math.PI * 2 / 3;
    const center = [180 + Math.cos(angle) * 153, 180 + Math.sin(angle) * 153];
    const poly = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
    const projected = poly.map(p => rotate(p, -phase * 2));
    for (let a = 0; a < 6; a++) for (let b = a + 1; b < 6; b++) {
      if (Math.floor(a / 2) === Math.floor(b / 2)) continue;
      line(frame, [center[0] + projected[a][0] * 17, center[1] + projected[a][1] * 17], [center[0] + projected[b][0] * 17, center[1] + projected[b][1] * 17], [181, 83, 67]);
    }
  }
}
const output = fileURLToPath(new URL('../public/geometric-orbit.gif', import.meta.url));
const result = spawnSync('ffmpeg', [
  '-y', '-f', 'rawvideo', '-pixel_format', 'rgba', '-video_size', `${size}x${size}`,
  '-framerate', '10', '-i', 'pipe:0', '-filter_complex',
  '[0:v]split[a][b];[a]palettegen=reserve_transparent=1[p];[b][p]paletteuse=dither=none',
  '-loop', '0', output,
], { input: frames, maxBuffer: 4 * 1024 * 1024 });
if (result.error) throw result.error;
if (result.status !== 0) throw new Error(result.stderr.toString());
console.log(`Generated ${output}`);
