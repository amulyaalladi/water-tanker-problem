 const SVG_NS = "http://www.w3.org/2000/svg";
  const CELL = 40;


  function trappedWater(heights) {
    let left = 0, right = heights.length - 1;
    let leftMax = 0, rightMax = 0, total = 0;
    while (left < right) {
      if (heights[left] < heights[right]) {
        leftMax = Math.max(leftMax, heights[left]);
        total += leftMax - heights[left];
        left++;
      } else {
        rightMax = Math.max(rightMax, heights[right]);
        total += rightMax - heights[right];
        right--;
      }
    }
    return total;
  }

 
  function waterPerColumn(heights) {
    const n = heights.length;
    const leftMax = new Array(n), rightMax = new Array(n);
    let m = 0;
    for (let i = 0; i < n; i++) { m = Math.max(m, heights[i]); leftMax[i] = m; }
    m = 0;
    for (let i = n - 1; i >= 0; i--) { m = Math.max(m, heights[i]); rightMax[i] = m; }
    return heights.map((h, i) => Math.min(leftMax[i], rightMax[i]) - h);
  }

  function parseInput(text) {
    const parts = text.replace(/[\[\]]/g, "").split(",").map(s => s.trim());
    if (parts.length === 0 || parts.some(p => p === "")) {
      throw new Error("Enter at least one number, separated by commas (e.g. 0,4,0,6).");
    }
    return parts.map(p => {
      const num = Number(p);
      if (!Number.isInteger(num) || num < 0) {
        throw new Error(`"${p}" is not valid. Use whole numbers of 0 or more.`);
      }
      if (num > 50) {
        throw new Error("Keep each height at 50 or below so the chart stays readable.");
      }
      return num;
    });
  }

  function el(name, attrs) {
    const node = document.createElementNS(SVG_NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  function render(heights, water) {
    const rows = Math.max(1, Math.max(...heights.map((h, i) => h + water[i])));
    const w = heights.length * CELL, h = rows * CELL;
    const svg = el("svg", { viewBox: `0 0 ${w} ${h}`, width: w, height: h, role: "img",
      "aria-label": `Bar chart of ${heights.length} blocks holding ${water.reduce((a, b) => a + b, 0)} units of water` });

    const cell = (col, row, fill) => svg.appendChild(el("rect", {
      x: col * CELL, y: h - (row + 1) * CELL, width: CELL, height: CELL,
      fill, stroke: "#14213d", "stroke-opacity": 0.35, "stroke-width": 1
    }));

  
    for (let c = 0; c < heights.length; c++)
      for (let r = 0; r < rows; r++)
        svg.appendChild(el("rect", { x: c * CELL, y: r * CELL, width: CELL, height: CELL,
          fill: "none", stroke: "#8a97ab", "stroke-opacity": 0.35, "stroke-width": 1 }));

    heights.forEach((bh, c) => {
      for (let r = 0; r < bh; r++) cell(c, r, "#ffd60a");
      for (let r = bh; r < bh + water[c]; r++) cell(c, r, "#00a6f4");
    });

    const chart = document.getElementById("chart");
    chart.replaceChildren(svg);
  }

  function run() {
    const errorEl = document.getElementById("error");
    errorEl.textContent = "";
    try {
      const heights = parseInput(document.getElementById("input").value);
      const water = waterPerColumn(heights);
      document.getElementById("total").textContent = trappedWater(heights);
      render(heights, water);
    } catch (e) {
      errorEl.textContent = e.message;
    }
  }

  document.getElementById("form").addEventListener("submit", e => { e.preventDefault(); run(); });
  run();