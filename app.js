const TOTAL_BUDGET = 500;
const STORAGE_KEY = "loveMarketScoreState_v3";

const stages = [
  {
    title: "關係安全感",
    description: "這一頁是關於相處時的安全感、情緒回應與關係修復。"
  },
  {
    title: "人格與吸引力",
    description: "這一頁是關於人格特質、吸引力、責任感與相處感受。"
  },
  {
    title: "生活與價值觀",
    description: "這一頁是關於生活習慣、金錢觀、興趣與長期契合度。"
  }
];

const dimensions = {
  security: "安全與信任",
  repair: "溝通與修復",
  intimacy: "親密與陪伴",
  attraction: "個人特質與吸引",
  lifestyle: "生活習慣與價值觀",
  future: "未來規劃與責任"
};

const options = [
  { name: "相處時感到自在", category: "安全感", dimension: "security", stage: 0 },
  { name: "願意給我空間／自由", category: "自由感", dimension: "security", stage: 0 },
  { name: "爭執後願意道歉", category: "修復力", dimension: "repair", stage: 0 },
  { name: "接納／包容／讚美／支持我", category: "支持感", dimension: "security", stage: 0 },
  { name: "願意表達愛", category: "表達愛", dimension: "intimacy", stage: 0 },
  { name: "願意傾聽我", category: "傾聽", dimension: "repair", stage: 0 },
  { name: "理解／回應我的情緒", category: "情緒回應", dimension: "repair", stage: 0 },
  { name: "寵愛我／欣賞我", category: "被珍惜", dimension: "intimacy", stage: 0 },
  { name: "常給我擁抱和觸摸", category: "親密感", dimension: "intimacy", stage: 0 },
  { name: "常有待在一起的陪伴", category: "陪伴", dimension: "intimacy", stage: 0 },

  { name: "誠實專情", category: "信任", dimension: "security", stage: 1 },
  { name: "大方不計較", category: "人格", dimension: "lifestyle", stage: 1 },
  { name: "溫柔脾氣好", category: "人格", dimension: "security", stage: 1 },
  { name: "情緒穩定", category: "穩定", dimension: "security", stage: 1 },
  { name: "聰明有才華", category: "欣賞", dimension: "attraction", stage: 1 },
  { name: "有自信", category: "魅力", dimension: "attraction", stage: 1 },
  { name: "幽默風趣", category: "有趣", dimension: "attraction", stage: 1 },
  { name: "有責任感", category: "未來", dimension: "future", stage: 1 },
  { name: "有上進心", category: "成長", dimension: "future", stage: 1 },
  { name: "製造驚喜", category: "浪漫", dimension: "intimacy", stage: 1 },

  { name: "能獨立安排生活", category: "生活能力", dimension: "lifestyle", stage: 2 },
  { name: "有共同的興趣愛好", category: "契合", dimension: "lifestyle", stage: 2 },
  { name: "喜歡運動／戶外", category: "生活", dimension: "lifestyle", stage: 2 },
  { name: "整潔／衛生習慣好", category: "習慣", dimension: "lifestyle", stage: 2 },
  { name: "不酗酒／賭博／抽菸", category: "底線", dimension: "lifestyle", stage: 2 },
  { name: "品味與我相似", category: "品味", dimension: "lifestyle", stage: 2 },
  { name: "會打理自己的外貌", category: "外貌", dimension: "attraction", stage: 2 },
  { name: "金錢觀相似", category: "價值觀", dimension: "future", stage: 2 },
  { name: "信仰／政治立場相近", category: "價值觀", dimension: "future", stage: 2 },
  { name: "清楚需求的交流", category: "溝通", dimension: "repair", stage: 2 }
];

function defaultState() {
  return {
    theme: "warm",
    values: Array(options.length).fill(0)
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed.values) || parsed.values.length !== options.length) {
      return defaultState();
    }

    return {
      theme: parsed.theme || "warm",
      values: parsed.values.map((value) => Number(value) || 0)
    };
  } catch {
    return defaultState();
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  document.querySelectorAll("#themeSelect").forEach((select) => {
    select.value = theme;
  });

  document.querySelectorAll(".theme-choice").forEach((button) => {
    button.classList.toggle("active", button.dataset.themeChoice === theme);
  });
}

function bindThemeControls(state) {
  const select = document.querySelector("#themeSelect");

  if (select) {
    select.addEventListener("change", () => {
      state.theme = select.value;
      saveState(state);
      applyTheme(state.theme);
    });
  }

  document.querySelectorAll(".theme-choice").forEach((button) => {
    button.addEventListener("click", () => {
      state.theme = button.dataset.themeChoice;
      saveState(state);
      applyTheme(state.theme);
    });
  });
}

function getStageFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const stage = Number(params.get("stage"));
  if ([0, 1, 2].includes(stage)) return stage;
  return 0;
}

function getTotalUsed(values) {
  return values.reduce((sum, value) => sum + Number(value), 0);
}

function getSelectedItems(values) {
  return options
    .map((item, index) => ({
      ...item,
      value: Number(values[index]) || 0
    }))
    .filter((item) => item.value > 0);
}

function getDimensionScores(values) {
  const scores = {};

  Object.keys(dimensions).forEach((key) => {
    scores[key] = 0;
  });

  options.forEach((item, index) => {
    scores[item.dimension] += Number(values[index]) || 0;
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
  if (!hash.startsWith("#data=")) return null;

  const encoded = hash.replace("#data=", "");
  const payload = decodePayload(encoded);

  if (!payload || !Array.isArray(payload.values)) return null;
  if (payload.values.length !== options.length) return null;

  return {
    theme: payload.theme || "warm",
    values: payload.values.map((value) => Number(value) || 0)
  };
}

function buildShareUrl(state) {
  const url = new URL("result.html", window.location.href);
  const payload = {
    theme: state.theme,
    values: state.values
  };

  url.hash = `data=${encodePayload(payload)}`;
  return url.toString();
}

function copyToClipboard(text) {
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

  return Promise.resolve();
}

function initIndexPage(state) {
  const startBtn = document.querySelector("#startBtn");

  startBtn.addEventListener("click", () => {
    saveState(state);
    window.location.href = "quiz.html?stage=0";
  });
}

function initQuizPage(state) {
  const stage = getStageFromUrl();
  const stageData = stages[stage];

  const stagePill = document.querySelector("#stagePill");
  const stageTitle = document.querySelector("#stageTitle");
  const stageDescription = document.querySelector("#stageDescription");
  const stageBarFill = document.querySelector("#stageBarFill");
  const questionList = document.querySelector("#questionList");
  const usedBudget = document.querySelector("#usedBudget");
  const leftBudget = document.querySelector("#leftBudget");
  const prevBtn = document.querySelector("#prevBtn");
  const nextBtn = document.querySelector("#nextBtn");
  const resultBtn = document.querySelector("#resultBtn");

  stagePill.textContent = `Step ${stage + 1} / ${stages.length}`;
  stageTitle.textContent = stageData.title;
  stageDescription.textContent = stageData.description;
  stageBarFill.style.width = `${((stage + 1) / stages.length) * 100}%`;

  function updateBudgetDisplay() {
    const used = getTotalUsed(state.values);
    usedBudget.textContent = used;
    leftBudget.textContent = TOTAL_BUDGET - used;
  }

  function renderQuestions() {
    questionList.innerHTML = "";

    options.forEach((item, index) => {
      if (item.stage !== stage) return;

      const card = document.createElement("article");
      card.className = "option-card";

      card.innerHTML = `
        <div class="option-top">
          <p class="option-name">${index + 1}. ${item.name}</p>
          <span class="category">${item.category}</span>
        </div>

        <div class="money">
          投入 <span id="value-${index}">${state.values[index]}</span> 元
        </div>

        <input
          class="range"
          type="range"
          min="0"
          max="500"
          step="10"
          value="${state.values[index]}"
          data-index="${index}"
          aria-label="${item.name}"
        />
      `;

      questionList.appendChild(card);
    });
  }

  questionList.addEventListener("input", (event) => {
    if (!event.target.classList.contains("range")) return;

    const slider = event.target;
    const index = Number(slider.dataset.index);
    const oldValue = state.values[index];
    let newValue = Number(slider.value);

    const projectedTotal = getTotalUsed(state.values) - oldValue + newValue;

    if (projectedTotal > TOTAL_BUDGET) {
      const over = projectedTotal - TOTAL_BUDGET;
      newValue = Math.max(0, newValue - over);
    }

    state.values[index] = newValue;
    slider.value = newValue;

    const valueLabel = document.querySelector(`#value-${index}`);
    if (valueLabel) valueLabel.textContent = newValue;

    saveState(state);
    updateBudgetDisplay();
  });

  prevBtn.disabled = stage === 0;
  prevBtn.addEventListener("click", () => {
    if (stage > 0) {
      saveState(state);
      window.location.href = `quiz.html?stage=${stage - 1}`;
    }
  });

  if (stage === stages.length - 1) {
    nextBtn.classList.add("hidden");
    resultBtn.classList.remove("hidden");
  }

  nextBtn.addEventListener("click", () => {
    if (stage < stages.length - 1) {
      saveState(state);
      window.location.href = `quiz.html?stage=${stage + 1}`;
    }
  });

  resultBtn.addEventListener("click", () => {
    if (getTotalUsed(state.values) === 0) {
      alert("請先分配至少一個條件的預算。");
      return;
    }

    saveState(state);
    window.location.href = "result.html";
  });

  renderQuestions();
  updateBudgetDisplay();
}

function drawRadar(scores) {
  const radarSvg = document.querySelector("#radarSvg");
  if (!radarSvg) return;

  const keys = Object.keys(dimensions);
  const center = 160;
  const maxRadius = 100;
  const levels = [0.25, 0.5, 0.75, 1];
  const maxScore = Math.max(...Object.values(scores), 1);

  function angleFor(index) {
    return (-90 + (360 / keys.length) * index) * (Math.PI / 180);
  }

  function point(radius, index) {
    const angle = angleFor(index);
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius
    };
  }

  const rings = levels
    .map((level) => {
      const points = keys
        .map((_, index) => {
          const p = point(maxRadius * level, index);
          return `${p.x},${p.y}`;
        })
        .join(" ");

      return `<polygon class="radar-ring" points="${points}"></polygon>`;
    })
    .join("");

  const axes = keys
    .map((_, index) => {
      const p = point(maxRadius, index);
      return `<line class="radar-axis" x1="${center}" y1="${center}" x2="${p.x}" y2="${p.y}"></line>`;
    })
    .join("");

  const areaPoints = keys
    .map((key, index) => {
      const ratio = scores[key] / maxScore;
      const radius = Math.max(8, maxRadius * ratio);
      const p = point(radius, index);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  const dots = keys
    .map((key, index) => {
      const ratio = scores[key] / maxScore;
      const radius = Math.max(8, maxRadius * ratio);
      const p = point(radius, index);
      return `<circle class="radar-dot" cx="${p.x}" cy="${p.y}" r="4"></circle>`;
    })
    .join("");

  const labels = keys
    .map((key, index) => {
      const p = point(126, index);
      const anchor = p.x > center + 8 ? "start" : p.x < center - 8 ? "end" : "middle";

      return `
        <text class="radar-label" x="${p.x}" y="${p.y}" text-anchor="${anchor}">
          ${dimensions[key]}
        </text>
        <text class="radar-label" x="${p.x}" y="${p.y + 15}" text-anchor="${anchor}" opacity="0.62">
          ${scores[key]} 分
        </text>
      `;
    })
    .join("");

  radarSvg.innerHTML = `
    ${rings}
    ${axes}
    <polygon class="radar-area" points="${areaPoints}"></polygon>
    ${dots}
    ${labels}
  `;
}

function renderResultPage(state) {
  const resultSummary = document.querySelector("#resultSummary");
  const cardUsedBudget = document.querySelector("#cardUsedBudget");
  const cardTopDimension = document.querySelector("#cardTopDimension");
  const dimensionScores = document.querySelector("#dimensionScores");
  const topItems = document.querySelector("#topItems");

  const used = getTotalUsed(state.values);
  const scores = getDimensionScores(state.values);
  const topDimension = getTopDimension(scores);
  const selected = getSelectedItems(state.values).sort((a, b) => b.value - a.value);

  resultSummary.textContent = `你總共使用 ${used} / 500 元。以下結果只呈現你的分數分配，不替你下人格標籤。`;
  cardUsedBudget.textContent = `${used} / 500`;
  cardTopDimension.textContent = used === 0 ? "尚未分配" : `${topDimension.label}｜${topDimension.score} 分`;

  dimensionScores.innerHTML = Object.entries(scores)
    .map(([key, score]) => {
      const percent = used === 0 ? 0 : Math.round((score / used) * 100);

      return `
        <div class="score-row">
          <div class="score-row-top">
            <span>${dimensions[key]}</span>
            <span>${score} 分｜${percent}%</span>
          </div>
          <div class="bar">
            <div class="bar-fill" style="width: ${percent}%"></div>
          </div>
        </div>
      `;
    })
    .join("");

  topItems.innerHTML = selected.length
    ? selected
        .slice(0, 6)
        .map((item) => `<li>${item.name}｜${item.value} 元</li>`)
        .join("")
    : `<li>尚未分配</li>`;

  drawRadar(scores);
}

function buildShareText(state) {
  const used = getTotalUsed(state.values);
  const scores = getDimensionScores(state.values);
  const selected = getSelectedItems(state.values).sort((a, b) => b.value - a.value);

  const dimensionText = Object.entries(scores)
    .map(([key, score]) => `${dimensions[key]}：${score} 分`)
    .join("\n");

  const itemText = selected
    .map((item, index) => `${index + 1}. ${item.name}：${item.value} 元`)
    .join("\n");

  return [
    "我的愛情條件分數",
    `使用預算：${used} / 500`,
    "",
    "面向分數：",
    dimensionText,
    "",
    "我的條件分配：",
    itemText || "尚未分配",
    "",
    "買家的你，如何挑選愛情？"
  ].join("\n");
}

function initResultPage(state) {
  const sharedPayload = getSharedPayloadFromUrl();

  if (sharedPayload) {
    state.theme = sharedPayload.theme;
    state.values = sharedPayload.values;
    saveState(state);
    applyTheme(state.theme);
  }

  renderResultPage(state);

  const shareLinkBtn = document.querySelector("#shareLinkBtn");
  const downloadBtn = document.querySelector("#downloadBtn");
  const copyTextBtn = document.querySelector("#copyTextBtn");
  const shareCard = document.querySelector("#shareCard");

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
        setTimeout(() => (shareLinkBtn.textContent = "分享我的分數連結"), 1400);
      }
    } catch {
      await copyToClipboard(shareUrl);
      shareLinkBtn.textContent = "連結已複製";
      setTimeout(() => (shareLinkBtn.textContent = "分享我的分數連結"), 1400);
    }
  });

  copyTextBtn.addEventListener("click", async () => {
    await copyToClipboard(buildShareText(state));
    copyTextBtn.textContent = "已複製";
    setTimeout(() => (copyTextBtn.textContent = "複製分數文字"), 1400);
  });

  downloadBtn.addEventListener("click", async () => {
    try {
      downloadBtn.textContent = "圖片生成中...";

      const canvas = await html2canvas(shareCard, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png");
      });

      const file = new File([blob], "love-market-score.png", {
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
        link.download = "love-market-score.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }

      downloadBtn.textContent = "儲存 IG 限動圖";
    } catch {
      downloadBtn.textContent = "儲存 IG 限動圖";
      alert("圖片產生失敗，可以直接截圖保存結果。");
    }
  });
}

const state = loadState();
applyTheme(state.theme);
bindThemeControls(state);

const page = document.body.dataset.page;

if (page === "index") {
  initIndexPage(state);
}

if (page === "quiz") {
  initQuizPage(state);
}

if (page === "result") {
  initResultPage(state);
}
