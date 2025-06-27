const blocks = {
  "1": {
    label: "1",
    id: "1",
    children: {
      "1-1": {
        label: "1-1",
        children: {
          "1-1-1": { 
            label: "1-1-1", 
            id: "1-1-1",
            children: {
              "1-1-1-1": { 
                label: "1-1-1-1", 
                id: "1-1-1-1",
                children: {
                  "1-1-1-1-1": { label: "1-1-1-1-1", id: "1-1-1-1-1" },
                  "1-1-1-1-2": { label: "1-1-1-1-2", id: "1-1-1-1-2" },
                  "1-1-1-1-3": { label: "1-1-1-1-3", id: "1-1-1-1-3" },
                  "1-1-1-1-4": { label: "1-1-1-1-4", id: "1-1-1-1-4" }
                }
              },
              "1-1-1-2": { label: "1-1-1-2", id: "1-1-1-2" },
              "1-1-1-3": { label: "1-1-1-3", id: "1-1-1-3" },
              "1-1-1-4": { label: "1-1-1-4", id: "1-1-1-4" }
            }
          },
          "1-1-2": { label: "1-1-2", id: "1-1-2" },
          "1-1-3": { label: "1-1-3", id: "1-1-3" },
          "1-1-4": { label: "1-1-4", id: "1-1-4" },
          "1-1-5": { label: "1-1-5", id: "1-1-5" },
          "1-1-6": { label: "1-1-6", id: "1-1-6" },
          "1-1-7": { label: "1-1-7", id: "1-1-7" },
          "1-1-8": { label: "1-1-8", id: "1-1-8" }
        }
      },
      "1-2": {
        label: "RoadDirtStraight",
        children: {
          "1-2-1": { label: "Curve Left", id: "road_curve_left" },
          "1-2-2": { label: "Curve Right", id: "road_curve_right" }
        }
      },
      "1-3": {
        label: "RoadBumpStraight",
        children: {
          "1-3-1": { label: "Banked Left", id: "road_banked_left" },
          "1-3-2": { label: "Banked Right", id: "road_banked_right" }
        }
      },
      "1-4": {
        label: "RoadIceStraight",
        id: "road_start"
      },
      "1-5": {
        label: "RoadWaterStraight",
        children: {
          "1-3-1": { label: "Banked Left", id: "road_banked_left" },
          "1-3-2": { label: "Banked Right", id: "road_banked_right" }
        }
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
  let node = null;
  let level = blocks;

  for (const part of parts) {
    node = level[part];
    if (!node) return null;
    level = node.children || {};
  }

  return node;
}

function toggleNode(path) {
  const level = path.split("/").length - 1;

  if (expandedPaths[level] === path) {
    expandedPaths = expandedPaths.slice(0, level);
  } else {
    expandedPaths = expandedPaths.slice(0, level);
    expandedPaths[level] = path;
  }

  renderAllLevels();
}

function renderAllLevels() {
  browser.innerHTML = "";

  // Render level 0
  let levelData = blocks;
  let currentPath = "";

  browser.appendChild(renderLevelRow(levelData, currentPath));

  for (let i = 0; i < expandedPaths.length; i++) {
    currentPath = expandedPaths[i];
    const node = getNodeByPath(currentPath);
    if (!node || !node.children) break;
    levelData = node.children;

    browser.appendChild(renderLevelRow(levelData, currentPath));
  }
}

renderAllLevels();
