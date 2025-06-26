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

// Tracks current expanded paths by level index, e.g. expandedPaths[0] = "1", expandedPaths[1] = "1/1-1"
let expandedPaths = [];

function renderLevelRow(nodes, pathPrefix) {
  const row = document.createElement("div");
  row.className = "level-row";
  row.dataset.levelPath = pathPrefix;

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

function getNodeByPath(path) {
  const parts = path.split("/");
  let node = blocks;
  for (const part of parts) {
    if (!node[part]) return null;
    node = node[part];
    if (node.children) {
      node = { ...node, children: node.children };
    }
  }
  return node;
}

function toggleNode(path) {
  // Determine level of this path (number of segments)
  const level = path.split("/").length - 1;

  // If already expanded at this level and same path, collapse it
  if (expandedPaths[level] === path) {
    // Remove this and all deeper expansions
    expandedPaths = expandedPaths.slice(0, level);
  } else {
    // Set/replace expansion at this level and clear deeper levels
    expandedPaths = expandedPaths.slice(0, level);
    expandedPaths[level] = path;
  }

  // Re-render all rows according to expandedPaths
  renderAllLevels();
}

function renderAllLevels() {
  browser.innerHTML = "";

  // Render top-level row
  let nodes = blocks;
  let currentPath = "";

  let row = renderLevelRow(nodes, currentPath);
  browser.appendChild(row);

  // Render subsequent rows for each expanded path
  for (let i = 0; i < expandedPaths.length; i++) {
    currentPath = expandedPaths[i];
    const node = getNodeByPath(currentPath);
    if (!node || !node.children) break;

    row = renderLevelRow(node.children, currentPath);
    browser.appendChild(row);
  }
}

// Initial render
renderAllLevels();
