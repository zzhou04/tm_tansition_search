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

// Tracks expanded folder paths (e.g., "1", "1/1-1")
const expandedPaths = new Set();

function getParentPath(path) {
  const parts = path.split("/");
  parts.pop();
  return parts.join("/");
}

// Render siblings as buttons in a horizontal row
function renderLevelRow(nodes, pathPrefix) {
  const row = document.createElement("div");
  row.className = "level-row";
  row.dataset.levelPath = pathPrefix; // e.g., "", "1", "1/1-1"

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

// Remove all rows *below* the given level path (to collapse or reset deeper rows)
function removeRowsBelow(levelPath) {
  const rows = Array.from(browser.querySelectorAll(".level-row"));
  const index = rows.findIndex(r => r.dataset.levelPath === levelPath);
  if (index === -1) return;

  // Remove all rows after this index
  for (let i = rows.length - 1; i > index; i--) {
    rows[i].remove();
  }
}

// Toggle expand/collapse for a node at path
function toggleNode(path) {
  const isExpanded = expandedPaths.has(path);
  const parentPath = getParentPath(path);

  if (isExpanded) {
    // Collapse node: remove all rows below this node
    expandedPaths.delete(path);
    removeRowsBelow(path);
  } else {
    // Expand node: close siblings at same level first
    expandedPaths.add(path);
    removeRowsBelow(parentPath);

    // Render children row below the node's row
    const node = getNodeByPath(path);
    if (node && node.children) {
      const childrenRow = renderLevelRow(node.children, path);

      // Find row with dataset.levelPath === path
      const rows = Array.from(browser.querySelectorAll(".level-row"));
      const index = rows.findIndex(r => r.dataset.levelPath === path);

      if (index === -1) {
        // If no row found (should not happen), append at end
        browser.appendChild(childrenRow);
      } else {
        // Insert children row after the node's row
        if (index === rows.length - 1) {
          browser.appendChild(childrenRow);
        } else {
          browser.insertBefore(childrenRow, rows[index + 1]);
        }
      }
    }
  }
}

// Traverse blocks tree by path string like "1/1-1/1-1-2"
function getNodeByPath(path) {
  const parts = path.split("/");
  let node = blocks;
  for (const part of parts) {
    if (!node[part]) return null;
    node = node[part];
    if (node.children) {
      node = { ...node, children: node.children }; // keep children available
    }
  }
  return node;
}

// Initial render: top level row only
function render() {
  browser.innerHTML = "";
  const topRow = renderLevelRow(blocks, "");
  browser.appendChild(topRow);
}

render();
