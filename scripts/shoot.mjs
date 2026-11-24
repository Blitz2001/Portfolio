// node scripts/shoot.mjs : captures live pages for the freelance and lab cards (1440×900, top of page).
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const { Browser, sleep } = await import(pathToFileURL(resolve(".claude/skills/taste-skill/scripts/lib/cdp.mjs")).href);

const SHOTS = [
  ["https://africa-travel-demo.vercel.app", "public/freelance/africa-travel.jpg"],
  ["https://pro-assignment-six.vercel.app", "public/lab/proassignment.jpg"],
  ["https://geekspot-five.vercel.app", "public/lab/geekspot.jpg"],
];

const browser = await Browser.launch();
try {
  for (const [url, out] of SHOTS) {
    mkdirSync(dirname(out), { recursive: true });
    const page = await browser.newPage({ width: 1440, height: 900 });
    await page.goto(url, { timeoutMs: 45000, settleMs: 2500 });
    await sleep(1500);
    await page.screenshot({ path: out, quality: 82 });
    await page.close();
    console.log("saved", out);
  }
} finally {
  await browser.close();
}
