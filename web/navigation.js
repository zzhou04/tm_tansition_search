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

function createEntry(key, node, path) {
  const container = document.createElement("div");
  container.className = "entry";

  const fullPath = [...path, key].join("/");
  const button = document.createElement("button");
  button.textContent = `${key} - ${node.label}`;

  if (node.children) {
    button.classList.add("folder-label");
    button.dataset.path = fullPath;
    button.onclick = () => toggleFolder(fullPath, container, node.children);
  } else {
    button.dataset.blockId = node.id;
    button.onclick = () => alert(`Selected: ${node.label} (ID: ${node.id})`);
  }

  container.appendChild(button);
  return container;
}

function toggleFolder(path, parentContainer, children) {
  let existing = parentContainer.querySelector(`[data-subpath="${path}"]`);
  
  if (existing) {
    existing.remove();
    return;
  }

  // Remove all siblings' open subfolders at this level or deeper
  const level = path.split("/").length;
  const siblings = browser.querySelectorAll(`[data-subpath]`);
  siblings.forEach(el => {
    const elPath = el.dataset.subpath;
    if (elPath.startsWith(path.slice(0, path.lastIndexOf("/"))) && elPath.split("/").length >= level) {
      el.remove();
    }
  });

  // Create container for children horizontally below parent
  const subContainer = document.createElement("div");
  subContainer.className = "children";
  subContainer.dataset.subpath = path;

  for (const childKey in children) {
    const childNode = children[childKey];
    const childEntry = createEntry(childKey, childNode, path.split("/"));
    subContainer.appendChild(childEntry);
  }

  parentContainer.appendChild(subContainer);
}

function render() {
  for (const key in blocks) {
    const node = blocks[key];
    const entry = createEntry(key, node, []);
    browser.appendChild(entry);
  }
}

render();
