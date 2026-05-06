const TOTAL_BUDGET = 500;

const options = [
  { name: "相處時感到自在", category: "關係安全感", type: "security" },
  { name: "願意給我空間／自由", category: "關係安全感", type: "security" },
  { name: "爭執後願意道歉", category: "關係修復", type: "repair" },
  { name: "接納／包容／讚美／支持我", category: "關係安全感", type: "security" },
  { name: "願意表達愛", category: "親密表達", type: "romance" },
  { name: "願意傾聽我", category: "關係修復", type: "repair" },
  { name: "理解／回應我的情緒", category: "關係安全感", type: "security" },
  { name: "寵愛我／欣賞我", category: "親密表達", type: "romance" },
  { name: "常給我擁抱和觸摸", category: "親密表達", type: "romance" },
  { name: "常有待在一起的陪伴", category: "陪伴需求", type: "companionship" },

  { name: "誠實專情", category: "人格特質", type: "security" },
  { name: "大方不計較", category: "人格特質", type: "personality" },
  { name: "溫柔脾氣好", category: "人格特質", type: "personality" },
  { name: "情緒穩定", category: "人格特質", type: "security" },
  { name: "聰明有才華", category: "吸引力", type: "attraction" },
  { name: "有自信", category: "吸引力", type: "attraction" },
  { name: "幽默風趣", category: "吸引力", type: "attraction" },
  { name: "有責任感", category: "未來生活", type: "growth" },
  { name: "有上進心", category: "未來生活", type: "growth" },
  { name: "製造驚喜", category: "浪漫感", type: "romance" },

  { name: "能獨立安排生活", category: "生活能力", type: "life" },
  { name: "有共同的興趣愛好", category: "生活契合", type: "compatibility" },
  { name: "喜歡運動／戶外", category: "生活契合", type: "compatibility" },
  { name: "整潔／衛生習慣好", category: "生活能力", type: "life" },
  { name: "不酗酒／賭博／抽菸", category: "生活底線", type: "life" },
  { name: "品味與我相似", category: "生活契合", type: "compatibility" },
  { name: "會打理自己的外貌", category: "吸引力", type: "attraction" },
  { name: "金錢觀相似", category: "價值觀", type: "values" },
  { name: "信仰／政治立場相近", category: "價值觀", type: "values" },
  { name: "清楚需求的交流", category: "溝通方式", type: "repair" }
];

const questions = document.querySelector("#questions");
const usedBudget = document.querySelector("#usedBudget");
const leftBudget = document.querySelector("#leftBudget");
const result = document.querySelector("#result");
const analyzeBtn = document.querySelector("#analyzeBtn");
const resetBtn = document.querySelector("#resetBtn");

function renderOptions() {
  questions.innerHTML = "";

  options.forEach((option, index) => {
    const item = document.createElement("article");
    item.className = "item";

    item.innerHTML = `
      <div class="item-header">
        <h3>${index + 1}. ${option.name}</h3>
        <span class="category">${option.category}</span>
      </div>
      <div class="value">
        投入：<span id="value-${index}">0</span> 元
      </div>
      <input 
        type="range" 
        min="0" 
        max="500" 
        step="10" 
        value="0" 
        data-index="${index}"
      />
    `;

    questions.appendChild(item);
  });
}

function getValues() {
  const sliders = document.querySelectorAll("input[type='range']");
  return Array.from(sliders).map((slider, index) => ({
    ...options[index],
    value: Number(slider.value)
  }));
}

function updateBudget(changedSlider) {
  const sliders = document.querySelectorAll("input[type='range']");
  let total = 0;

  sliders.forEach(slider => {
    total += Number(slider.value);
  });

  if (total > TOTAL_BUDGET) {
    const over = total - TOTAL_BUDGET;
    changedSlider.value = Math.max(0, Number(changedSlider.value) - over);
    total = TOTAL_BUDGET;
  }

  sliders.forEach((slider, index) => {
    document.querySelector(`#value-${index}`).textContent = slider.value;
  });

  usedBudget.textContent = total;
  leftBudget.textContent = TOTAL_BUDGET - total;
}

function getPersonalityAnalysis(values) {
  const scores = {};

  values.forEach(item => {
    if (!scores[item.type]) {
      scores[item.type] = 0;
    }
    scores[item.type] += item.value;
  });

  const sortedTypes = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topType = sortedTypes[0]?.[0];

  const analysisMap = {
    security: {
      title: "安全感與穩定關係取向",
      text: "你在感情裡很重視信任、穩定和被好好對待。比起一時的浪漫，你更在意對方是不是誠實、情緒穩定，能不能讓你安心。"
    },
    repair: {
      title: "溝通與修復關係取向",
      text: "你不是害怕吵架，而是很在意吵架後能不能好好處理。你適合願意聽你說、願意反省，也願意把問題講清楚的人。"
    },
    romance: {
      title: "親密表達與戀愛感取向",
      text: "你很重視被愛的感覺。擁抱、陪伴、表達喜歡、製造驚喜，對你來說不是小事，而是確認關係溫度的重要方式。"
    },
    attraction: {
      title: "欣賞與吸引力取向",
      text: "你容易被有魅力、有才華、幽默或會打理自己的人吸引。你需要的不只是穩定，也希望關係裡有欣賞與心動。"
    },
    growth: {
      title: "成長與未來規劃取向",
      text: "你會在意對方是否有責任感、上進心和面對生活的能力。你希望伴侶不是只陪你談戀愛，也能一起往未來走。"
    },
    life: {
      title: "生活習慣與自律取向",
      text: "你很在意生活品質與基本習慣。對你來說，整潔、自律、不沉迷不良嗜好，會直接影響關係能不能長久。"
    },
    compatibility: {
      title: "生活契合與共同感取向",
      text: "你重視兩個人有沒有共同話題、生活節奏和興趣。你希望伴侶不只是愛你，也能跟你一起享受日常。"
    },
    values: {
      title: "價值觀一致取向",
      text: "你在意金錢觀、信仰、政治立場等比較深層的差異。你知道短期可以靠喜歡撐過去，但長期需要價值觀不要差太遠。"
    },
    personality: {
      title: "舒服人格取向",
      text: "你希望對方是好相處、脾氣好、不太計較的人。你很重視日常互動裡的舒服感，不喜歡一直消耗彼此。"
    },
    companionship: {
      title: "陪伴需求取向",
      text: "你很重視對方是否願意把時間留給你。對你來說，陪伴不是形式，而是被放在心上的證明。"
    }
  };

  return analysisMap[topType] || {
    title: "尚未形成明顯偏好",
    text: "你目前的分配比較平均，可以再想想哪些條件是你真的不能妥協的。"
  };
}

function analyze() {
  const values = getValues();
  const selected = values.filter(item => item.value > 0);
  const total = selected.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    result.classList.remove("hidden");
    result.innerHTML = `
      <h2>你還沒有投入預算</h2>
      <p class="warning">請先把 500 元分配到你重視的條件，再產生分析。</p>
    `;
    return;
  }

  const topItems = selected.sort((a, b) => b.value - a.value).slice(0, 5);
  const analysis = getPersonalityAnalysis(values);

  result.classList.remove("hidden");
  result.innerHTML = `
    <h2>你的愛情偏好分析</h2>

    <div class="result-card">
      <h3>${analysis.title}</h3>
      <p>${analysis.text}</p>
    </div>

    <h3>你最重視的前 5 個條件</h3>
    <ol class="result-list">
      ${topItems.map(item => `
        <li>
          <strong>${item.name}</strong>：${item.value} 元
        </li>
      `).join("")}
    </ol>

    <div class="result-card">
      <h3>給你的選擇建議</h3>
      <p>
        你可以把投入最高的前三項當成「必要條件」，不是隨便加分而已。
        之後在認識對象時，不只看對方有沒有吸引力，也可以觀察對方在衝突、陪伴、情緒和生活習慣上的表現。
      </p>
    </div>
  `;

  result.scrollIntoView({ behavior: "smooth" });
}

function resetAll() {
  const sliders = document.querySelectorAll("input[type='range']");
  sliders.forEach(slider => {
    slider.value = 0;
  });

  updateBudget({ value: 0 });
  result.classList.add("hidden");
  result.innerHTML = "";
}

renderOptions();

questions.addEventListener("input", event => {
  if (event.target.matches("input[type='range']")) {
    updateBudget(event.target);
  }
});

analyzeBtn.addEventListener("click", analyze);
resetBtn.addEventListener("click", resetAll);
