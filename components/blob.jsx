import { createNoise2D } from "simplex-noise";

function formatPoints(points, close) {
  points = [...points];
  // so that coords can be passed as objects or arrays
  if (!Array.isArray(points[0])) {
    points = points.map(({ x, y }) => [x, y]);
  }

  if (close) {
    const lastPoint = points[points.length - 1];
    const secondToLastPoint = points[points.length - 2];

    const firstPoint = points[0];
    const secondPoint = points[1];

    points.unshift(lastPoint);
    points.unshift(secondToLastPoint);

    points.push(firstPoint);
    points.push(secondPoint);
  }

  return points.flat();
}

function spline(points = [], tension = 1, close = false, cb) {
  points = formatPoints(points, close);

  const size = points.length;
  const last = size - 4;

  const startPointX = close ? points[2] : points[0];
  const startPointY = close ? points[3] : points[1];

  let path = "M" + [startPointX, startPointY];

  cb && cb("MOVE", [startPointX, startPointY]);

  const startIteration = close ? 2 : 0;
  const maxIteration = close ? size - 4 : size - 2;
  const inc = 2;

  for (let i = startIteration; i < maxIteration; i += inc) {
    const x0 = i ? points[i - 2] : points[0];
    const y0 = i ? points[i - 1] : points[1];

    const x1 = points[i + 0];
    const y1 = points[i + 1];

    const x2 = points[i + 2];
    const y2 = points[i + 3];

    const x3 = i !== last ? points[i + 4] : x2;
    const y3 = i !== last ? points[i + 5] : y2;

    const cp1x = x1 + ((x2 - x0) / 6) * tension;
    const cp1y = y1 + ((y2 - y0) / 6) * tension;

    const cp2x = x2 - ((x3 - x1) / 6) * tension;
    const cp2y = y2 - ((y3 - y1) / 6) * tension;

    path += "C" + [cp1x, cp1y, cp2x, cp2y, x2, y2];

    cb && cb("CURVE", [cp1x, cp1y, cp2x, cp2y, x2, y2]);
  }

  return path;
}


/*
<svg viewBox="0 0 200 200">
          <defs>
            <linearGradient id="gradient" gradientTransform="rotate(90)">
              <stop id="gradientStop1" offset="0%" stopColor="var(--startColor)" />
              <stop id="gradientStop2 " offset="100%" stopColor="var(--stopColor)" />
            </linearGradient>
          </defs>
          <path d="" fill="url('#gradient')"></path>
        </svg>
*/
// our <path> element
const path = document.querySelector("path");
// used to set our custom property values
const root = document.documentElement;

let hueNoiseOffset = 0;
let noiseStep = 0.005;

const noise2D = createNoise2D();

const points = createPoints();

(function animate() {
  path.setAttribute("d", spline(points, 1, true));

  for (let i = 0; i < points.length; i++) {
    const point = points[i];

    // return a pseudo random value between -1 / 1 based on this point's current x, y positions in "time"
    const nX = noise(point.noiseOffsetX, point.noiseOffsetX);
    const nY = noise(point.noiseOffsetY, point.noiseOffsetY);
    // map this noise value to a new value, somewhere between it's original location -20 and it's original location + 20
    const x = Utils.map(nX, -1, 1, point.originX - 20, point.originX + 20);
    const y = Utils.map(nY, -1, 1, point.originY - 20, point.originY + 20);

    // update the point's current coordinates
    point.x = x;
    point.y = y;

    // progress the point's x, y values through "time"
    point.noiseOffsetX += noiseStep;
    point.noiseOffsetY += noiseStep;
  }

  const hueNoise = noise(hueNoiseOffset, hueNoiseOffset);
  const hue = Utils.map(hueNoise, -1, 1, 0, 360);

  root.style.setProperty("--startColor", `hsl(${hue}, 100%, 75%)`);
  root.style.setProperty("--stopColor", `hsl(${hue + 60}, 100%, 75%)`);
  document.body.style.background = `hsl(${hue + 60}, 75%, 5%)`;

  hueNoiseOffset += noiseStep / 6;

  //requestAnimationFrame(animate);
})();



function noise(x, y) {
  return noise2D(x, y);
}

function createPoints() {
  const points = [];
  // how many points do we need
  const numPoints = 6;
  // used to equally space each point around the circle
  const angleStep = (Math.PI * 2) / numPoints;
  // the radius of the circle
  const rad = 75;

  for (let i = 1; i <= numPoints; i++) {
    // x & y coordinates of the current point
    const theta = i * angleStep;

    const x = 100 + Math.cos(theta) * rad;
    const y = 100 + Math.sin(theta) * rad;

    // store the point's position
    points.push({
      x: x,
      y: y,
      // we need to keep a reference to the point's original point for when we modulate the values later
      originX: x,
      originY: y,
      // more on this in a moment!
      noiseOffsetX: Math.random() * 1000,
      noiseOffsetY: Math.random() * 1000
    });
  }

  return points;
}

document.querySelector("path").addEventListener("mouseover", () => {
  noiseStep = 0.01;
});

document.querySelector("path").addEventListener("mouseleave", () => {
  noiseStep = 0.005;
});
