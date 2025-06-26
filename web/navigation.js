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
const expanded = {}; // Keeps track of expanded nodes by key

function render() {
  browser.innerHTML = '';
  renderLevel(blocks, browser, []);
}

function renderLevel(level, container, path) {
  for (const key in level) {
    const entry = level[key];
    const fullPath = [...path, key].join("/");

    const entryDiv = document.createElement("div");
    entryDiv.className = "entry";

    const btn = document.createElement("button");
    btn.textContent = `${key} - ${entry.label}`;

    if (entry.children) {
      btn.classList.add("folder-label");
      btn.onclick = () => {
        // Collapse siblings
        const parentPath = path.join("/");
        for (const expandedKey in expanded) {
          if (expandedKey.startsWith(parentPath) && expandedKey !== fullPath && expandedKey.split("/").length === fullPath.split("/").length) {
            delete expanded[expandedKey];
          }
        }

        expanded[fullPath] = !expanded[fullPath];
        render();
      };
    } else {
      btn.dataset.blockId = entry.id;
      btn.onclick = () => {
        alert(`Selected: ${entry.label} (ID: ${entry.id})`);
      };
    }

    entryDiv.appendChild(btn);
    container.appendChild(entryDiv);

    if (entry.children && expanded[fullPath]) {
      const childContainer = document.createElement("div");
      childContainer.className = "entry";
      renderLevel(entry.children, childContainer, [...path, key]);
      container.appendChild(childContainer);
    }
  }
}

render();
