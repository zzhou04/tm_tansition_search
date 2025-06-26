
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
let path = [];

function renderLevel(currentLevel) {
  browser.innerHTML = '';

  if (path.length > 0) {
    const backButton = document.createElement("button");
    backButton.textContent = "⬅ Back";
    backButton.className = "back-button";
    backButton.onclick = () => {
      path.pop();
      let level = blocks;
      for (const p of path) {
        level = level[p].children;
      }
      renderLevel(level);
    };
    browser.appendChild(backButton);
  }

  for (const key in currentLevel) {
    const entry = currentLevel[key];
    const btn = document.createElement("button");
    btn.textContent = `${key} - ${entry.label}`;

    if (entry.children) {
      btn.onclick = () => {
        path.push(key);
        renderLevel(entry.children);
      };
    } else {
      btn.dataset.blockId = entry.id;
      btn.onclick = () => {
        alert(`Selected block: ${entry.label}\nID: ${entry.id}`);
        // Future: lookup transitions using entry.id
      };
    }

    browser.appendChild(btn);
  }
}

// Initial render
renderLevel(blocks);
