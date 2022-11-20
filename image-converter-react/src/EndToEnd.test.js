import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import os from "os";
import { mkdtemp } from "node:fs/promises";

describe("App", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  it("Page contains Download All Button", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForSelector(".downloadAllButton");
    const text = await page.$eval(".downloadAllButton", (e) => e.textContent);
    expect(text).toContain("Download all");
  });

  const extensions = ["png", "gif", "jpeg", "bmp"];
  const extensionpairs = extensions.flatMap((ext1) =>
    extensions.map((ext2) => [ext1, ext2])
  );

  it.each(extensionpairs)(
    "Uploaded %s successfully converted to %s",
    async (fromExtension, toExtension) => {
      expect(fs.existsSync(`./test/test_image.${fromExtension}`)).toBe(true);
      await page.goto("http://localhost:3000");
      // Configure the page to allow downloads to a temporary directory
      const directory = await mkdtemp(
        path.join(os.tmpdir(), "temp-image-converter-downloads")
      );
      const client = await page.target().createCDPSession();
      await client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: directory,
      });
      // Upload the input file
      const fileInput = await page.waitForSelector(".dropzoneInput");
      await fileInput.uploadFile(`./test/test_image.${fromExtension}`);
      // Select the output format
      const formatButton = await page.waitForSelector(
        `.formatButton${toExtension}`
      );
      await formatButton.click();
      // Download the output file
      await page.waitForSelector(".downloadButton:not([disabled])");
      const expectedOutputFilePath = path.join(
        directory,
        `test_image.${toExtension}`
      );
      const downloadExists = () => {
        return fs.existsSync(expectedOutputFilePath);
      };

      // Test file can be downloaded with it's own download button
      expect(downloadExists()).toBe(false);
      await page.click(".downloadButton:not([disabled])");
      await retry(10, 1000, downloadExists);
      expect(downloadExists()).toBe(true);

      // Test the download button has the correct label
      const text = await page.$eval(".downloadButton", (e) => e.textContent);
      expect(text).toContain(`test_image.${toExtension}`);

      // Test file can be downloaded with the "Download All Button"
      fs.rmSync(expectedOutputFilePath);
      expect(downloadExists()).toBe(false);
      await page.click(".downloadAllButton:not([disabled])");
      await retry(10, 1000, downloadExists);
      expect(downloadExists()).toBe(true);

      // Clean up the temporary directory
      fs.rmSync(directory, { recursive: true, force: true });
    }
  );

  afterAll(() => browser.close());
});

function sleep(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

async function retry(num, delay, callable) {
  for (let i = 0; i < num; i++) {
    if (callable()) {
      return;
    }
    await sleep(delay);
  }
  throw new Error("Too many failed attempts");
}
