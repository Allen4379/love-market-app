const TOTAL_BUDGET = 500;

const options = [
  { name: "相處時感到自在", category: "安全感", type: "security" },
  { name: "願意給我空間／自由", category: "自由感", type: "security" },
  { name: "爭執後願意道歉", category: "修復力", type: "repair" },
  { name: "接納／包容／讚美／支持我", category: "支持感", type: "security" },
  { name: "願意表達愛", category: "表達愛", type: "romance" },
  { name: "願意傾聽我", category: "傾聽", type: "repair" },
  { name: "理解／回應我的情緒", category: "情緒回應", type: "security" },
  { name: "寵愛我／欣賞我", category: "被珍惜", type: "romance" },
  { name: "常給我擁抱和觸摸", category: "親密感", type: "romance" },
  { name: "常有待在一起的陪伴", category: "陪伴", type: "companionship" },

  { name: "誠實專情", category: "信任", type: "security" },
  { name: "大方不計較", category: "人格", type: "personality" },
  { name: "溫柔脾氣好", category: "人格", type: "personality" },
  { name: "情緒穩定", category: "穩定", type: "security" },
  { name: "聰明有才華", category: "欣賞", type: "attraction" },
  { name: "有自信", category: "魅力", type: "attraction" },
  { name: "幽默風趣", category: "有趣", type: "attraction" },
  { name: "有責任感", category: "未來", type: "growth" },
  { name: "有上進心", category: "成長", type: "growth" },
  { name: "製造驚喜", category: "浪漫", type: "romance" },

  { name: "能獨立安排生活", category: "生活能力", type: "life" },
  { name: "有共同的興趣愛好", category: "契合", type: "compatibility" },
  { name: "喜歡運動／戶外", category: "生活", type: "compatibility" },
  { name: "整潔／衛生習慣好", category: "習慣", type: "life" },
  { name: "不酗酒／賭博／抽菸", category: "底線", type: "life" },
  { name: "品味與我相似", category: "品味", type: "compatibility" },
  { name: "會打理自己的外貌", category: "外貌", type: "attraction" },
  { name: "金錢觀相似", category: "價值觀", type: "values" },
  { name: "信仰／政治立場相近", category: "價值觀", type: "values" },
  { name: "清楚需求的交流", category: "溝通", type: "repair" }
];

const typeMap = {
  security: {
    title: "安全感收藏家",
    description:
      "你在愛情裡最重視穩定、誠實和被好好對待。你不是不喜歡浪漫，而是更在意對方能不能讓你安心。",
    quote: "你想要的不是忽冷忽熱的刺激，而是一個能讓你安心做自己的人。"
  },
  repair: {
    title: "關係修復型戀人",
    description:
      "你很在意兩個人吵架後能不能把話說清楚。比起永遠不吵架，你更需要一個願意傾聽、願意道歉、願意一起修復的人。",
    quote: "你不是怕衝突，你怕的是問題永遠沒有人願意好好處理。"
  },
  romance: {
    title: "高濃度戀愛體質",
    description:
      "你需要愛被說出來、被抱住、被感受到。你重視日常裡的溫度，也希望對方願意讓關係保有戀愛感。",
    quote: "你要的愛不是只有存在，而是要被清楚感覺到。"
  },
  companionship: {
    title: "陪伴感需求型",
    description:
      "你很重視對方是否願意把時間留給你。對你來說，陪伴不是形式，而是被放在心上的證明。",
    quote: "你其實不貪心，只是希望重要的人真的在。"
  },
  attraction: {
    title: "心動欣賞型",
    description:
      "你容易被有才華、有魅力、有趣或會打理自己的人吸引。你希望愛情裡不只有安全，也要有讓你欣賞的亮點。",
    quote: "你不是只看外表，你在意的是那個人身上讓你想靠近的光。"
  },
  growth: {
    title: "未來共建型",
    description:
      "你會看對方有沒有責任感、上進心和面對生活的能力。你想找的不只是戀人，也是一個能一起往前走的人。",
    quote: "你相信喜歡很重要，但能一起把日子過好也很重要。"
  },
  life: {
    title: "生活品質守門員",
    description:
      "你在意生活習慣、自律和基本底線。對你來說，很多感情不是敗給不愛，而是敗給日常裡反覆累積的不舒服。",
    quote: "你很清楚，愛情最後還是會回到每一天怎麼生活。"
  },
  compatibility: {
    title: "靈魂同頻型",
    description:
      "你重視共同興趣、生活節奏和品味。你希望伴侶不只是愛你，也能跟你一起分享日常、聊天、探索世界。",
    quote: "你想找的是能一起生活，也能一起發現生活的人。"
  },
  values: {
    title: "價值觀優先型",
    description:
      "你在意金錢觀、信仰、政治立場等深層差異。你知道短期可以靠喜歡靠近，但長期需要價值觀不要差太遠。",
    quote: "你要的不只是合拍，而是在人生重要選擇上能互相理解。"
  },
  personality: {
    title: "舒服相處型",
    description:
      "你很重視對方好不好相處。大方、溫柔、不太計較，這些看起來平凡，卻會決定一段關係每天是放鬆還是消耗。",
    quote: "你最容易被日常裡的好脾氣和好相處打動。"
  }
};

const questionList = document.querySelector("#questionList");
const usedBudget = document.querySelector("#usedBudget");
const leftBudget = document.querySelector("#leftBudget");
const analyzeBtn = document.querySelector("#analyzeBtn");
const resetBtn = document.querySelector("#resetBtn");
const resultSection = document.querySelector("#resultSection");
const resultTitle = document.querySelector("#resultTitle");
const resultDescription = document.querySelector("#resultDescription");
const resultQuote = document.querySelector("#resultQuote");
const topItems = document.querySelector("#topItems");
const downloadBtn = document.querySelector("#downloadBtn");
const copyTextBtn = document.querySelector("#copyTextBtn");
const shareCard = document.querySelector("#shareCard");

let lastShareText = "";

function renderQuestions() {
  questionList.innerHTML = "";

  options.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "option-card";

    card.innerHTML = `
      <div class="option-top">
        <p class="option-name">${index + 1}. ${item.name}</p>
        <span class="category">${item.category}</span>
      </div>

      <div class="money">
        投入 <span id="value-${index}">0</span> 元
      </div>

      <input
        class="range"
        type="range"
        min="0"
        max="500"
        step="10"
        value="0"
        data-index="${index}"
        aria-label="${item.name}"
      />
    `;

    questionList.appendChild(card);
  });
}

function getCurrentValues() {
  const sliders = document.querySelectorAll(".range");

  return Array.from(sliders).map((slider, index) => ({
    ...options[index],
    value: Number(slider.value)
  }));
}

function updateBudget(changedSlider) {
  const sliders = document.querySelectorAll(".range");
  let total = Array.from(sliders).reduce((sum, slider) => {
    return sum + Number(slider.value);
  }, 0);

  if (total > TOTAL_BUDGET && changedSlider) {
    const over = total - TOTAL_BUDGET;
    changedSlider.value = Math.max(0, Number(changedSlider.value) - over);
  }

  total = Array.from(sliders).reduce((sum, slider) => {
    return sum + Number(slider.value);
  }, 0);

  sliders.forEach((slider, index) => {
    document.querySelector(`#value-${index}`).textContent = slider.value;
  });

  usedBudget.textContent = total;
  leftBudget.textContent = TOTAL_BUDGET - total;
}

function getResultType(values) {
  const score = {};

  values.forEach((item) => {
    score[item.type] = (score[item.type] || 0) + item.value;
  });

  const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]);
  const topType = sorted[0]?.[0];

  return typeMap[topType] || typeMap.security;
}

function analyze() {
  const values = getCurrentValues();
  const selected = values.filter((item) => item.value > 0);
  const total = selected.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    alert("請先分配你的 500 元預算。");
    return;
  }

  const sortedItems = selected.sort((a, b) => b.value - a.value);
  const topFive = sortedItems.slice(0, 5);
  const result = getResultType(values);

  resultTitle.textContent = `你是「${result.title}」`;
  resultDescription.textContent = result.description;
  resultQuote.textContent = result.quote;

  topItems.innerHTML = topFive
    .map((item) => `<li>${item.name}｜${item.value} 元</li>`)
    .join("");

  lastShareText = `我的愛情偏好是「${result.title}」\n\n我最重視：\n${topFive
    .map((item, index) => `${index + 1}. ${item.name}｜${item.value} 元`)
    .join("\n")}\n\n${result.quote}`;

  resultSection.classList.remove("hidden");

  setTimeout(() => {
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 120);
}

function resetAll() {
  document.querySelectorAll(".range").forEach((slider) => {
    slider.value = 0;
  });

  updateBudget();
  resultSection.classList.add("hidden");
}

async function downloadShareCard() {
  try {
    downloadBtn.textContent = "圖片生成中...";

    const canvas = await html2canvas(shareCard, {
      backgroundColor: null,
      scale: 3,
      useCORS: true,
      allowTaint: true,
      logging: false
    });

    const dataUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "love-market-result.png";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    downloadBtn.textContent = "下載社群分享圖";
  } catch (error) {
    downloadBtn.textContent = "下載社群分享圖";
    alert("圖片下載失敗，可以先截圖保存結果卡。");
  }
}

async function copyShareText() {
  if (!lastShareText) return;

  try {
    await navigator.clipboard.writeText(lastShareText);
    copyTextBtn.textContent = "已複製";
    setTimeout(() => {
      copyTextBtn.textContent = "複製分享文字";
    }, 1400);
  } catch (error) {
    alert("你的瀏覽器不支援自動複製，可以手動截圖分享。");
  }
}

renderQuestions();
updateBudget();

questionList.addEventListener("input", (event) => {
  if (event.target.classList.contains("range")) {
    updateBudget(event.target);
  }
});

analyzeBtn.addEventListener("click", analyze);
resetBtn.addEventListener("click", resetAll);
downloadBtn.addEventListener("click", downloadShareCard);
copyTextBtn.addEventListener("click", copyShareText);
