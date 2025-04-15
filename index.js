const fs = require('fs');
const csv = require('csv-parser');
const { Builder, By, until } = require('selenium-webdriver');
const percySnapshot = require('@percy/selenium-webdriver');

async function runTestsFromCSV(csvPath) {
  const testCases = await readCSV(csvPath);
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    for (let index = 0; index < testCases.length; index++) {
      const row = testCases[index];
      const testcase = row.testcase?.trim() || `Snapshot of ${row.url}`;
      const xpath = row.xpath?.trim();
      const url = row.url?.trim();

      if (!url) {
        console.warn(`⚠️ Row ${index + 1}: Missing URL, skipping...`);
        continue;
      }

      console.log(`\n➡️ Running [${index + 1}/${testCases.length}]: ${testcase} | URL: ${url}`);

      try {
        await driver.get(url);

        if (xpath) {
          const element = await driver.wait(
            until.elementLocated(By.xpath(xpath)),
            10000,
            `Timed out locating element: ${xpath}`
          );

          await driver.wait(
            until.elementIsVisible(element),
            5000,
            `Element not visible: ${xpath}`
          );

          // Inject attribute for scoped Percy snapshot
          const uniqueId = `percy-scope-${Date.now()}-${index}`;
          await driver.executeScript(
            "arguments[0].setAttribute('data-percy-scope', arguments[1]);",
            element,
            uniqueId
          );

          // Smooth scroll before snapshot
          await smoothScroll(driver);

          await percySnapshot(driver, testcase, {
            scope: `[data-percy-scope="${uniqueId}"]`
          });

          console.log(`✅ Scoped Percy snapshot taken for: ${testcase}`);
        } else {
          // Full-page snapshot with smooth scroll
          await smoothScroll(driver);
          await percySnapshot(driver, testcase);
          console.log(`✅ Full-page Percy snapshot taken for: ${testcase}`);
        }
      } catch (err) {
        console.error(`❌ Error in test "${testcase}" on row ${index + 1}: ${err.message}`);
        console.log(`📸 Attempting full-page snapshot fallback for: ${testcase}`);

        try {
          await smoothScroll(driver);
          await percySnapshot(driver, `${testcase} (Full Page Fallback)`);
        } catch (fallbackErr) {
          console.error(`❌ Percy fallback also failed: ${fallbackErr.message}`);
        }
      }
    }
  } finally {
    await driver.quit();
  }
}

// 📜 Smooth scroll helper
async function smoothScroll(driver) {
  await driver.executeScript(`
    return new Promise((resolve) => {
      let y = 0;
      const step = 100;
      const delay = 100;
      const height = document.body.scrollHeight;

      function scrollStep() {
        y += step;
        window.scrollTo(0, y);
        if (y < height) {
          setTimeout(scrollStep, delay);
        } else {
          resolve();
        }
      }
      scrollStep();
    });
  `);
  await driver.sleep(1000); // settle time for images/animations
}

// 📥 CSV Reader
function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        const normalized = {};
        for (const key in data) {
          const cleanKey = key.replace(/^\uFEFF/, ''); // remove BOM
          normalized[cleanKey] = data[key];
        }
        results.push(normalized);
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

// 🚀 Start the test runner
(async () => {
  await runTestsFromCSV('percy.csv');
})();
