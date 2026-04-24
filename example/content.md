# 01 開場：為什麼要做講義模板
> 與其每次從零生成網頁，不如把成果變成可重複使用的系統。

## 課程背景

### 這次要解決的問題
- 只靠一次性產生的 HTML，後續調整成本很高
- 直接修改大段 HTML，對非前端使用者不友善
- 同一位講師反覆備課時，需要穩定風格與可維護流程

> **核心觀念**
> 我們不是追求「一次生成就完美」，而是建立「可長期維護與擴充」的工作流。

## 今天會完成的目標

[flow]
1. 先用 AI 產生第一版講義網頁
2. 將網頁結構抽象成 Markdown 規範
3. 透過 build script 轉換為穩定 HTML
4. 封裝成可重複觸發的 Agent Skill
[/flow]

[tags]
- [green] 低門檻：以 Markdown 維護內容
- [blue] 可擴充：支援多課程資料夾
- [purple] 可重複：同一流程套用到不同主題
- [orange] 高價值：降低後續維運成本
[/tags]

---

# 02 實作：從終端機到可運行專案
> 先讓環境可執行，再談精修體驗與流程封裝。

## Step 1：準備環境與 Codex

### 確認環境
- 建立或開啟專案資料夾（給 AI 明確工作區）
- 確認 `node -v` 可正常執行
- 依需求安裝 `nvm` 與 LTS Node.js

```prompt [label="常用環境檢查指令"]
node -v
nvm -v
nvm install --lts
```

### 安裝與登入 Codex
- 全域安裝：`npm i -g @openai/codex`
- 使用 ChatGPT 帳號或 API Key 登入
- 首次啟動確認信任工作目錄

```prompt [label="安裝 Codex"]
npm i -g @openai/codex
codex
```

## Step 2：先產生第一版網頁

### 初版提示詞設計重點
- 明確目標：只要單一 HTML，方便部署
- 指定風格：例如日系、漸層、清楚層級
- 指定結構：標題、流程、目錄、社群區塊

> **提醒**
> 第一次結果通常「可用但不夠好」，這很正常，因為它還不是模板化成果。

## Step 3：把可用版升級成可維護版

### 為什麼不直接改 HTML
- 與 AI 反覆對話調整，結果有隨機性
- 手改 HTML 成本高，易破版
- 難以複用到下一門課程

### 轉換策略
- 定義 Markdown 結構：`# / ## / ###`、清單、流程、摘要、提示框
- 內容與版型分離：`content.md` 管文字，`config.yaml` 管頁面設定
- 透過 script 固定輸出：避免每次都重做樣式

---

# 03 封裝：建立 Agent Skill 工作流
> 讓 AI 自動做對的事，比每次手動重做更重要。

## Skill 應包含什麼

### 目標與觸發
- 使用者提供主題或草稿時觸發
- 自動建立新課程資料夾
- 產出 `content.md`、`config.yaml`、`index.html`

### 執行順序
[flow]
1. 分析輸入內容與受眾
2. 轉成規範化 Markdown
3. 生成頁面設定與 SEO 資訊
4. build 輸出 HTML
5. 啟動 dev server 預覽
[/flow]

### 實務上會遇到的坑
- 草稿結構太散，轉換後章節不平衡
- 缺 OG 設定，分享網址預覽效果差
- 資料夾切分不清，後續多課程難管理

[summary]
- 🧱 **先有模板再求美化** | 優先確保可維護與可重複
- 🧭 **把規則寫進 Skill** | 讓 AI 有穩定可執行的流程
- 🗂️ **一課程一資料夾** | 降低後續維護與部署風險
- 🔁 **用 build 固定輸出** | 減少手工改版造成的不一致
[/summary]

---

# 04 驗證：生成、預覽、部署
> 把流程走完一次，才能真正確認這套方法可落地。

## 生成講義的兩種輸入

### 方式 A：只給主題
- 例如：生成式 AI 資安、Agent Skills、RAG 實戰
- AI 需先研究脈絡再生成內容

### 方式 B：提供草稿（本次示範）
- 直接把 `example/README.md` 當輸入來源
- 轉成規範化 `content.md`
- build 為 `example/index.html`

```prompt [label="build 與啟動"]
node .agents/skills/course-page-generator/scripts/build.mjs example
node .agents/skills/course-page-generator/scripts/dev.mjs example --port 3000
```

## 部署與分享

### GitHub Pages 注意事項
- 確認路徑包含課程資料夾名稱（例如 `/example/`）
- 設定 `seo.url` 與 `seo.image` 為完整網址
- 部署後用 OG 檢查工具驗證預覽資訊

> **可量測成果**
> 建立新課程頁的時間顯著下降，且版面與資訊品質更一致。

---

# 05 結語：從工具使用者到流程設計者
> 真正的差異，不在「你用哪個 AI」，而在「你是否設計了自己的工作流」。

## 三個帶得走的重點
- 先做出可維護模板，再追求視覺與互動細節
- 把常改內容放 `content.md`，把共用設定放 `config/*.yaml`
- 把流程封裝成 Agent Skill，讓每次生成都可重現

> **最後一句**
> 當你能持續迭代自己的模板，AI 產出的價值才會從一次性 Demo，變成長期可用的產品資產。
