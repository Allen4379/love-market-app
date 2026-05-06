const TOTAL_BUDGET = 500;
const MAX_SELECTION = 5;
const STORAGE_KEY = "loveMarketState_v6";

const dimensions = {
  security: "安全與信任",
  repair: "溝通與修復",
  intimacy: "親密與陪伴",
  attraction: "個人特質與吸引",
  lifestyle: "生活習慣與價值觀",
  future: "未來規劃與責任"
};

const options = [
  { name: "相處時感到自在", category: "安全感", dimension: "security" },
  { name: "願意給我空間／自由", category: "自由感", dimension: "security" },
  { name: "爭執後願意道歉", category: "修復力", dimension: "repair" },
  { name: "接納／包容／讚美／支持我", category: "支持感", dimension: "security" },
  { name: "願意表達愛", category: "表達愛", dimension: "intimacy" },
  { name: "願意傾聽我", category: "傾聽", dimension: "repair" },
  { name: "理解／回應我的情緒", category: "情緒回應", dimension: "repair" },
  { name: "寵愛我／欣賞我", category: "被珍惜", dimension: "intimacy" },
  { name: "常給我擁抱和觸摸", category: "親密感", dimension: "intimacy" },
  { name: "常有待在一起的陪伴", category: "陪伴", dimension: "intimacy" },

  { name: "誠實專情", category: "信任", dimension: "security" },
  { name: "大方不計較", category: "人格", dimension: "lifestyle" },
  { name: "溫柔脾氣好", category: "人格", dimension: "security" },
  { name: "情緒穩定", category: "穩定", dimension: "security" },
  { name: "聰明有才華", category: "欣賞", dimension: "attraction" },
  { name: "有自信", category: "魅力", dimension: "attraction" },
  { name: "幽默風趣", category: "有趣", dimension: "attraction" },
  { name: "有責任感", category: "未來", dimension: "future" },
  { name: "有上進心", category: "成長", dimension: "future" },
  { name: "製造驚喜", category: "浪漫", dimension: "intimacy" },

  { name: "能獨立安排生活", category: "生活能力", dimension: "lifestyle" },
  { name: "有共同的興趣愛好", category: "契合", dimension: "lifestyle" },
  { name: "喜歡運動／戶外", category: "生活", dimension: "lifestyle" },
  { name: "整潔／衛生習慣好", category: "習慣", dimension: "lifestyle" },
  { name: "不酗酒／賭博／抽菸", category: "習慣", dimension: "lifestyle" },
  { name: "品味與我相似", category: "品味", dimension: "lifestyle" },
  { name: "會打理自己的外貌", category: "外貌", dimension: "attraction" },
  { name: "金錢觀相似", category: "價值觀", dimension: "future" },
  { name: "信仰／政治立場相近", category: "價值觀", dimension: "future" },
  { name: "清楚需求的交流", category: "溝通", dimension: "repair" }
];

function defaultState() {
  return {
    theme: "warm",
    selected: Array(options.length).fill(false),
    values: Array(options.length).fill(0)
  };
}

function normalizeState(rawState) {
  const base = defaultState();

  if (!rawState || typeof rawState !== "object") {
    return base;
  }

  const selected = Array.isArray(rawState.selected) && rawState.selected.length === options.length
    ? rawState.selected.map(Boolean)
    : base.selected;

  let selectedCount = selected.filter(Boolean).length;

  if (selectedCount > MAX_SELECTION) {
    let kept = 0;

    for (let i = 0; i < selected.length; i += 1) {
      if (selected[i] && kept < MAX_SELECTION) {
        kept += 1;
      } else {
        selected[i] = false;
      }
    }
  }

  const values = Array.isArray(rawState.values) && rawState.values.length === options.length
    ? rawState.values.map((value, index) => {
        const numeric = Number(value) || 0;
        return selected[index] ? numeric : 0;
      })
    : base.values;

  return {
    theme: rawState.theme || "warm",
    selected,
    values
  };
}

function loadState() {
  try {
    return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY)));
  } catch {
    return defaultState();
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;

  document.querySelectorAll(".theme-dot").forEach((button) => {
    button.classList.toggle("active", button.dataset.themeChoice === theme);
  });
}

function bindThemeControls(state) {
  const toggleBtn = document.querySelector("#themeToggleBtn");
  const themePanel = document.querySelector("#themePanel");

  if (toggleBtn && themePanel) {
    toggleBtn.addEventListener("click", () => {
      themePanel.classList.toggle("open");
    });
  }

  document.querySelectorAll(".theme-dot").forEach((button) => {
    button.addEventListener("click", () => {
      state.theme = button.dataset.themeChoice;
      saveState(state);
      applyTheme(state.theme);

      if (themePanel) {
        themePanel.classList.remove("open");
      }
    });
  });
}

function getSelectedIndexes(state) {
  return state.selected
    .map((isSelected, index) => (isSelected ? index : null))
    .filter((index) => index !== null);
}

function getSelectedItems(state) {
  return getSelectedIndexes(state).map((index) => ({
    ...options[index],
    index,
    value: Number(state.values[index]) || 0
  }));
}

function getScoredItems(state) {
  return getSelectedItems(state)
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);
}

function getTotalUsed(state) {
  return state.values.reduce((sum, value) => sum + Number(value || 0), 0);
}

function getDimensionScores(state) {
  const scores = {};

  Object.keys(dimensions).forEach((key) => {
    scores[key] = 0;
  });

  options.forEach((item, index) => {
    if (!state.selected[index]) return;
    scores[item.dimension] += Number(state.values[index]) || 0;
  });

  return scores;
}

function getTopDimension(scores) {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [key, score] = sorted[0] || ["security", 0];

  return {
    key,
    label: dimensions[key],
    score
  };
}

function getTopThreeRatio(state) {
  const total = getTotalUsed(state);

  if (total === 0) {
    return 0;
  }

  const topThree = getScoredItems(state)
    .slice(0, 3)
    .reduce((sum, item) => sum + item.value, 0);

  return Math.round((topThree / total) * 100);
}

function encodePayload(payload) {
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodePayload(encoded) {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getSharedPayloadFromUrl() {
  const hash = window.location.hash || "";

  if (!hash.startsWith("#data=")) {
    return null;
  }

  const encoded = hash.replace("#data=", "");
  return normalizeState(decodePayload(encoded));
}

function buildShareUrl(state) {
  const url = new URL("result.html", window.location.href);

  url.hash = `data=${encodePayload({
    theme: state.theme,
    selected: state.selected,
    values: state.values
  })}`;

  return url.toString();
}

async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function renderScoreBars(container, scores, total) {
  container.innerHTML = Object.entries(scores)
    .map(([key, value]) => {
      const percent = total === 0 ? 0 : Math.round((value / total) * 100);

      return `
        <div class="score-row">
          <div class="score-row-top">
            <span>${dimensions[key]}</span>
            <span>${value} 分｜${percent}%</span>
          </div>

          <div class="bar">
            <div class="bar-fill" style="width: ${percent}%"></div>
          </div>
        </div>
      `;
    })
    .join("");
}

function initIndexPage(state) {
  applyTheme(state.theme);
}

function initSelectPage(state) {
  const conditionGroups = document.querySelector("#conditionGroups");
  const selectedCount = document.querySelector("#selectedCount");
  const selectedPreview = document.querySelector("#selectedPreview");
  const goAllocateBtn = document.querySelector("#goAllocateBtn");
  const limitToast = document.querySelector("#limitToast");

  const grouped = Object.entries(dimensions).map(([dimensionKey, dimensionLabel]) => ({
    key: dimensionKey,
    label: dimensionLabel,
    items: options
      .map((item, index) => ({ ...item, index }))
      .filter((item) => item.dimension === dimensionKey)
  }));

  function showLimitToast() {
    limitToast.classList.remove("hidden");

    window.clearTimeout(showLimitToast.timer);

    showLimitToast.timer = window.setTimeout(() => {
      limitToast.classList.add("hidden");
    }, 1800);
  }

  function updateSelectedDisplay() {
    const selectedItems = getSelectedItems(state);

    selectedCount.textContent = `${selectedItems.length} / ${MAX_SELECTION}`;
    goAllocateBtn.disabled = selectedItems.length === 0;

    if (selectedItems.length === 0) {
      selectedPreview.classList.add("hidden");
      selectedPreview.innerHTML = "";
      return;
    }

    selectedPreview.classList.remove("hidden");
    selectedPreview.innerHTML = `
      <p class="selected-preview-title">目前已選 ${selectedItems.length} / ${MAX_SELECTION}</p>

      <div class="preview-chip-row">
        ${selectedItems
          .map((item) => `<span class="preview-chip">✓ ${item.name}</span>`)
          .join("")}
      </div>
    `;
  }

  function renderGroups() {
    const selectedTotal = getSelectedIndexes(state).length;

    conditionGroups.innerHTML = grouped
      .map((group) => {
        return `
          <section class="group-card">
            <h2 class="group-title">${group.label}</h2>

            <div class="chip-grid">
              ${group.items
                .map((item) => {
                  const isSelected = state.selected[item.index];
                  const isLocked = !isSelected && selectedTotal >= MAX_SELECTION;

                  return `
                    <button
                      class="condition-chip ${isSelected ? "selected" : ""} ${isLocked ? "locked" : ""}"
                      type="button"
                      data-index="${item.index}"
                    >
                      ${isSelected ? "✓ " : ""}${item.name}
                    </button>
                  `;
                })
                .join("")}
            </div>
          </section>
        `;
      })
      .join("");

    updateSelectedDisplay();
  }

  conditionGroups.addEventListener("click", (event) => {
    const chip = event.target.closest(".condition-chip");

    if (!chip) {
      return;
    }

    const index = Number(chip.dataset.index);
    const isCurrentlySelected = state.selected[index];
    const selectedTotal = getSelectedIndexes(state).length;

    if (!isCurrentlySelected && selectedTotal >= MAX_SELECTION) {
      chip.classList.add("shake");
      showLimitToast();

      window.setTimeout(() => {
        chip.classList.remove("shake");
      }, 320);

      return;
    }

    state.selected[index] = !state.selected[index];

    if (!state.selected[index]) {
      state.values[index] = 0;
    }

    saveState(state);
    renderGroups();
  });

  goAllocateBtn.addEventListener("click", () => {
    const selectedItems = getSelectedItems(state);

    if (selectedItems.length === 0) {
      showLimitToast();
      return;
    }

    saveState(state);
    window.location.href = "allocate.html";
  });

  renderGroups();
}

function initAllocatePage(state) {
  const selectedItems = getSelectedItems(state);

  if (selectedItems.length === 0) {
    window.location.href = "select.html";
    return;
  }

  const allocationList = document.querySelector("#allocationList");
  const usedBudget = document.querySelector("#usedBudget");
  const leftBudget = document.querySelector("#leftBudget");
  const chosenCount = document.querySelector("#chosenCount");
  const equalBtn = document.querySelector("#equalBtn");
  const clearBtn = document.querySelector("#clearBtn");
  const resultBtn = document.querySelector("#resultBtn");

  function updateBudgetDisplay() {
    const used = getTotalUsed(state);
    usedBudget.textContent = used;
    leftBudget.textContent = TOTAL_BUDGET - used;
    chosenCount.textContent = getSelectedIndexes(state).length;
  }

  function setValue(index, nextValue) {
    const oldValue = Number(state.values[index]) || 0;
    let newValue = Math.max(0, Math.min(TOTAL_BUDGET, Number(nextValue) || 0));
    newValue = Math.round(newValue / 10) * 10;

    const projectedTotal = getTotalUsed(state) - oldValue + newValue;

    if (projectedTotal > TOTAL_BUDGET) {
      const over = projectedTotal - TOTAL_BUDGET;
      newValue = Math.max(0, newValue - over);
      newValue = Math.round(newValue / 10) * 10;
    }

    state.values[index] = newValue;
    saveState(state);

    const valueLabel = document.querySelector(`#value-${index}`);
    const slider = document.querySelector(`.range[data-index="${index}"]`);

    if (valueLabel) {
      valueLabel.textContent = newValue;
    }

    if (slider) {
      slider.value = newValue;
    }

    updateBudgetDisplay();
  }

  function renderAllocationList() {
    const items = getSelectedItems(state);

    allocationList.innerHTML = items
      .map((item) => {
        return `
          <article class="allocation-card">
            <div class="allocation-top">
              <p class="allocation-name">${item.name}</p>
              <span class="allocation-category">${item.category}</span>
            </div>

            <div class="money">
              投入 <span id="value-${item.index}">${item.value}</span> 元
            </div>

            <div class="control-row">
              <button class="step-btn" data-action="minus" data-index="${item.index}" type="button">-10</button>

              <input
                class="range"
                type="range"
                min="0"
                max="500"
                step="10"
                value="${item.value}"
                data-index="${item.index}"
                aria-label="${item.name}"
              />

              <button class="step-btn" data-action="plus" data-index="${item.index}" type="button">+10</button>
            </div>
          </article>
        `;
      })
      .join("");

    updateBudgetDisplay();
  }

  allocationList.addEventListener("input", (event) => {
    if (!event.target.classList.contains("range")) {
      return;
    }

    const index = Number(event.target.dataset.index);
    setValue(index, Number(event.target.value));
  });

  allocationList.addEventListener("click", (event) => {
    const button = event.target.closest(".step-btn");

    if (!button) {
      return;
    }

    const index = Number(button.dataset.index);
    const action = button.dataset.action;
    const current = Number(state.values[index]) || 0;

    if (action === "minus") {
      setValue(index, current - 10);
    }

    if (action === "plus") {
      setValue(index, current + 10);
    }
  });

  equalBtn.addEventListener("click", () => {
    const selectedIndexes = getSelectedIndexes(state);
    const count = selectedIndexes.length;

    if (count === 0) {
      return;
    }

    state.values = state.values.map(() => 0);

    const base = Math.floor(TOTAL_BUDGET / count / 10) * 10;
    let remaining = TOTAL_BUDGET - base * count;

    selectedIndexes.forEach((index) => {
      state.values[index] = base;
    });

    selectedIndexes.forEach((index) => {
      if (remaining <= 0) {
        return;
      }

      state.values[index] += 10;
      remaining -= 10;
    });

    saveState(state);
    renderAllocationList();
  });

  clearBtn.addEventListener("click", () => {
    state.values = state.values.map(() => 0);
    saveState(state);
    renderAllocationList();
  });

  resultBtn.addEventListener("click", () => {
    if (getTotalUsed(state) === 0) {
      alert("請先分配至少一個條件的金額。");
      return;
    }

    saveState(state);
    window.location.href = "result.html";
  });

  renderAllocationList();
}

function getScoreReport(state) {
  const used = getTotalUsed(state);
  const selectedCount = getSelectedIndexes(state).length;
  const scoredItems = getScoredItems(state);
  const topThreeRatio = getTopThreeRatio(state);
  const scores = getDimensionScores(state);
  const topDimension = getTopDimension(scores);

  if (used === 0) {
    return "你目前尚未分配預算，因此沒有可呈現的分數報告。";
  }

  const topItemsText = scoredItems
    .slice(0, 3)
    .map((item) => `「${item.name}」`)
    .join("、");

  let concentrationText = "";

  if (topThreeRatio >= 70) {
    concentrationText = "你的分配偏集中，代表你對少數條件有很明確的優先順序。";
  } else if (topThreeRatio >= 45) {
    concentrationText = "你的分配有明顯重點，也保留部分彈性給其他條件。";
  } else {
    concentrationText = "你的分配比較平均，代表你傾向同時考慮多個條件，而不是只看單一面向。";
  }

  return [
    `你一共選擇 ${selectedCount} 個條件，並使用 ${used} / 500 元。最高面向是「${topDimension.label}」，共 ${topDimension.score} 分。`,
    `投入最高的前三項是 ${topItemsText || "尚未分配"}，合計佔總投入的 ${topThreeRatio}%。${concentrationText}`,
    "這份結果只呈現你的選擇與分數分配，不代表標準答案，也不替你下人格標籤。"
  ].join("\n\n");
}

function renderRankList(container, items, storyMode = false) {
  if (!items.length) {
    container.innerHTML = "<li>尚未分配</li>";
    return;
  }

  container.innerHTML = items
    .slice(0, MAX_SELECTION)
    .map((item, index) => {
      if (storyMode) {
        return `
          <li>
            <span class="story-rank-num">${index + 1}</span>
            <span>${item.name}</span>
            <span class="story-rank-money">${item.value}</span>
          </li>
        `;
      }

      return `
        <li>
          <span class="rank-num">${index + 1}</span>
          <span>${item.name}</span>
          <span class="rank-money">${item.value} 元</span>
        </li>
      `;
    })
    .join("");
}

function renderResultPage(state) {
  const sharedPayload = getSharedPayloadFromUrl();

  if (sharedPayload) {
    state.theme = sharedPayload.theme;
    state.selected = sharedPayload.selected;
    state.values = sharedPayload.values;
    saveState(state);
    applyTheme(state.theme);
  }

  const used = getTotalUsed(state);
  const selectedItems = getSelectedItems(state);
  const scoredItems = getScoredItems(state);
  const scores = getDimensionScores(state);
  const topDimension = getTopDimension(scores);
  const topThreeRatio = getTopThreeRatio(state);

  document.querySelector("#resultSummary").textContent =
    `你總共使用 ${used} / 500 元。以下內容只呈現你的條件分數，不替你取風格名稱。`;

  document.querySelector("#usedBudgetText").textContent = `${used} / 500`;
  document.querySelector("#topDimensionText").textContent =
    used === 0 ? "尚未分配" : `${topDimension.label}｜${topDimension.score} 分`;
  document.querySelector("#selectedCountText").textContent = `${selectedItems.length} 項`;
  document.querySelector("#topThreeRatioText").textContent = `${topThreeRatio}%`;

  renderRankList(document.querySelector("#topItems"), scoredItems, false);
  renderScoreBars(document.querySelector("#dimensionScores"), scores, used);

  document.querySelector("#scoreReport").textContent = getScoreReport(state);

  renderStoryCard(state, scores, used, topDimension, scoredItems);
  bindResultActions(state);
}

function renderStoryCard(state, scores, used, topDimension, scoredItems) {
  document.querySelector("#storyUsedBudget").textContent = `${used} / 500`;
  document.querySelector("#storyTopDimension").textContent =
    used === 0 ? "尚未分配" : `${topDimension.label}｜${topDimension.score} 分`;

  renderRankList(document.querySelector("#storyTopItems"), scoredItems, true);
  renderScoreBars(document.querySelector("#storyDimensionScores"), scores, used);
}

function buildShareText(state) {
  const used = getTotalUsed(state);
  const selectedItems = getSelectedItems(state);
  const scoredItems = getScoredItems(state);
  const scores = getDimensionScores(state);

  const scoreText = Object.entries(scores)
    .map(([key, value]) => `${dimensions[key]}：${value} 分`)
    .join("\n");

  const itemText = scoredItems.length
    ? scoredItems.map((item, index) => `${index + 1}. ${item.name}：${item.value} 元`).join("\n")
    : "尚未分配";

  return [
    "我的愛情條件分數",
    `已選條件：${selectedItems.length} / ${MAX_SELECTION}`,
    `使用預算：${used} / 500`,
    "",
    "我的條件分配：",
    itemText,
    "",
    "面向分數：",
    scoreText,
    "",
    "買家的你，如何挑選愛情？"
  ].join("\n");
}

async function downloadStoryCard(button) {
  const storyCard = document.querySelector("#storyCard");
  const originalText = button.textContent;

  try {
    button.textContent = "圖片生成中...";

    const canvas = await html2canvas(storyCard, {
      backgroundColor: null,
      scale: 3,
      useCORS: true,
      allowTaint: true,
      logging: false
    });

    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/png");
    });

    const file = new File([blob], "love-market-story.png", {
      type: "image/png"
    });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "我的愛情條件分數",
        text: "我的 500 元愛情條件分配結果"
      });
    } else {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "love-market-story.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    button.textContent = originalText;
  } catch {
    button.textContent = originalText;
    alert("圖片產生失敗，可以先用手機截圖保存結果。");
  }
}

function bindResultActions(state) {
  const shareLinkBtn = document.querySelector("#shareLinkBtn");
  const downloadStoryBtn = document.querySelector("#downloadStoryBtn");
  const copyTextBtn = document.querySelector("#copyTextBtn");

  shareLinkBtn.addEventListener("click", async () => {
    const shareUrl = buildShareUrl(state);

    try {
      if (navigator.share) {
        await navigator.share({
          title: "我的愛情條件分數",
          text: "這是我的 500 元愛情條件分配結果",
          url: shareUrl
        });
      } else {
        await copyToClipboard(shareUrl);
        shareLinkBtn.textContent = "連結已複製";
        setTimeout(() => {
          shareLinkBtn.textContent = "分享我的分數連結";
        }, 1400);
      }
    } catch {
      await copyToClipboard(shareUrl);
      shareLinkBtn.textContent = "連結已複製";
      setTimeout(() => {
        shareLinkBtn.textContent = "分享我的分數連結";
      }, 1400);
    }
  });

  downloadStoryBtn.addEventListener("click", () => {
    downloadStoryCard(downloadStoryBtn);
  });

  copyTextBtn.addEventListener("click", async () => {
    await copyToClipboard(buildShareText(state));
    copyTextBtn.textContent = "已複製";
    setTimeout(() => {
      copyTextBtn.textContent = "複製分數文字";
    }, 1400);
  });
}

const state = loadState();

applyTheme(state.theme);
bindThemeControls(state);

const page = document.body.dataset.page;

if (page === "index") {
  initIndexPage(state);
}

if (page === "select") {
  initSelectPage(state);
}

if (page === "allocate") {
  initAllocatePage(state);
}

if (page === "result") {
  renderResultPage(state);
}
