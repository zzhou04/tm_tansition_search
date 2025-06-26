const blocks = {
  "1": {
    label: "Road",
    children: {
      "1-1": {
        label: "Straight",
        children: {
          "1-1-1": { label: "Straight 1", id: "road_straight_1" },
          "1-1-2": { label: "Straight 2", id: "road_straight_2" }
        }
      },
      "1-2": {
        label: "Curves",
        children: {
          "1-2-1": { label: "Curve Left", id: "road_curve_left" },
          "1-2-2": { label: "Curve Right", id: "road_curve_right" }
        }
      },
      "1-3": {
        label: "Banked",
        children: {
          "1-3-1": { label: "Banked Left", id: "road_banked_left" },
          "1-3-2": { label: "Banked Right", id: "road_banked_right" }
        }
      },
      "1-4": {
        label: "Start Block",
        id: "road_start"
      }
    }
  },
  "2": {
    label: "Terrain",
    children: {
      "2-1": { label: "Grass", id: "terrain_grass" },
      "2-2": { label: "Dirt", id: "terrain_dirt" }
    }
  }
};

const browser = document.getElementById("browser");

// State to track which nodes are expanded: map path string -> true/false
const expandedPaths = new Set();

// Helper: get parent path (all but last segment)
function getParentPath(path) {
  const parts = path.split("/");
  parts.pop();
  return parts.join("/");
}

// Render level row of siblings
function renderLevelRow(nodes, pathPrefix) {
  const row = document.createElement("div");
  row.className = "level-row";
  row.dataset.levelPath = pathPrefix; // e.g. "", "1", "1/1-1"

  for (const key in nodes) {
    const node = nodes[key];
    const fullPath = pathPrefix ? `${pathPrefix}/${key}` : key;
    const button = document.createElement("button");
    button.textContent = `${key} - ${node.label}`;
    if (node.children) {
      button.classList.add("folder-label");
      button.onclick = () => toggleNode(fullPath);
    } else {
      button.onclick = () => alert(`Selected: ${node.label} (ID: ${node.id})`);
    }
    row.appendChild(button);
  }
  return row;
}

// Remove all rows below a given levelPath (used when collapsing or changing)
function removeRowsBelow(levelPath) {
  const rows = Array.from(browser.querySelectorAll(".level-row"));
  let foundIndex = rows.findIndex(r => r.dataset.levelPath === levelPath);
  if (foundIndex === -1) return;
  // Remove all rows after foundIndex
  for (let i = rows.length - 1; i > foundIndex; i--) {
    rows[i].remove();
  }
}

// Toggle a node open/closed
function toggleNode(path) {
  const isExpanded = expandedPaths.has(path);
  const parentPath = getParentPath(path);

  if (isExpanded) {
    // Collapse: remove all rows below this node's level (i.e. its children)
    expandedPaths.delete(path);
    removeRowsBelow(path);
  } else {
    // Expand: remove rows below the parent level (to close siblings)
    expandedPaths.add(path);
    removeRowsBelow(parentPath);

    // Render children of the expanded node on next row below
    const node = getNodeByPath(path);
    if (node && node.children) {
      const childrenRow = renderLevelRow(node.children, path);
      // Insert after the row with levelPath = path
      const rows = Array.from(browser.querySelectorAll(".level-row"));
      const index = rows.findIndex(r => r.dataset.levelPath === path);
      if (index !== -1) {
        if (index === rows.length - 1) {
          browser.appendChild(childrenRow);
        } else {
          browser.insertBefore(childrenRow, rows[index + 1]);
        }
      } else {
        // If row doesn't exist (shouldn't happen), append at end
        browser.appendChild(childrenRow);
      }
    }
  }
}

// Helper: traverse blocks object by path string like "1/1-1/1-1-2"
function getNodeByPath(path) {
  const parts = path.split("/");
  let node = blocks;
  for (const p of parts) {
    if (!node[p]) return null;
    node = node[p].children || node[p];
  }
  return node;
}

// Initial render: top-level row only
function render() {
  browser.innerHTML = "";
  const topRow = renderLevelRow(blocks, "");
  browser.appendChild(topRow);
}

render();
