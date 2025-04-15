# 📸 Percy Visual Regression Testing via CSV

Automate visual regression testing with [Percy](https://percy.io/) and [Selenium](https://www.selenium.dev/) using test case data from a CSV file.

Supports:
- Full-page or scoped Percy snapshots via XPath
- Smooth scrolling to trigger lazy-loaded content
- Clean, fail-safe fallback logic

🔗 **GitHub Repo:** [rohanojha/percyVRT](https://github.com/rohanojha/percyVRT)

---

## 📂 Project Structure

```
percyVRT/
├── index.js         # Main automation script
├── percy.csv        # CSV file with test case data
├── package.json     # Project dependencies
└── README.md        # Project guide
```

---

## 🧪 CSV Format

`percy.csv` should have the following headers:

```csv
testcase,url,xpath
SeasonEpisode,https://www.max.com/shows/peacemaker-2022/a939d96b-7ffb-4481-96f6-472838d104ca,"//section[contains(@class,'episodes-parent')]"
Java example,https://www.max.com/,""
```

- `module`: Name of the test (used for snapshot)
- `xpath`: (Optional) XPath of the specific element to snapshot
- `url`: URL of the page

If `xpath` is empty, the script takes a full-page screenshot.

---

## 🚀 How to Use

### 1. Clone the repo

```bash
git clone https://github.com/rohanojha/percyVRT.git
cd percyVRT
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Percy CLI (if you haven't already)

```bash
npm install --global @percy/cli
```

Authenticate Percy:

```bash
npx percy login
```

### 4. Run the script

```bash
npx percy exec -- node index.js
```

---

## 💡 Features

✅ Read test steps from `percy.csv`  
✅ Take Percy snapshots (full or scoped)  
✅ Smooth scroll before screenshot  
✅ Wait for elements to load  
✅ Error handling + fallback snapshot  
✅ Easy to extend for CSS selectors or log export

---

## 📸 Percy Integration

This script uses Percy’s [Selenium SDK](https://docs.percy.io/docs/selenium). Make sure you've:

- Signed into Percy
- Set up a project on the Percy dashboard
- Authenticated your CLI with `npx percy login`

---

## 🛠️ Todo / Ideas

- [ ] Export results to a JSON or CSV log
- [ ] Add support for CSS selectors
- [ ] Retry logic for flaky tests
- [ ] Slack/Webhook notifications

---

## 🙌 Author

Made with 💻 by [Rohan Ojha](https://github.com/rohanojha)

---

## 📄 License

[MIT License](LICENSE)
