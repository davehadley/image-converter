import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import os from "os";
import { mkdtemp } from "node:fs/promises";

jest.setTimeout(10000);

describe("App", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  const fromExtensions = ["png"]; // "gif", "jpeg", "bmp"];
  const toExtensions = [
    "png",
    "gif",
    "jpeg",
    "bmp",
    "pbm",
    "tiff",
    "tga",
    "ico",
    "ff",
  ];
  const extensionpairs = fromExtensions.flatMap((ext1) =>
    toExtensions.map((ext2) => [ext1, ext2])
  );

  it.each(extensionpairs)(
    "Uploaded %s successfully converted to %s",
    async (fromExtension, toExtension) => {
      expect(fs.existsSync(`./test/test_image.${fromExtension}`)).toBe(true);
      page = await browser.newPage();
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
      // Select the output format
      const formatButton = await page.waitForSelector(
        `.formatButton${toExtension}:not([disabled])`
      );
      await formatButton.click();
      await page.waitForSelector(
        `.formatButton${toExtension}.formatButtonIsSelected:not([disabled])`
      );
      // Upload the input file
      const fileInput = await page.waitForSelector(".dropzoneInput");
      await fileInput.uploadFile(`./test/test_image.${fromExtension}`);
      // download button should appear in loading state
      // Download the output file
      const expectedOutputFilePath = path.join(
        directory,
        `test_image.${toExtension}`
      );
      const downloadExists = () => {
        return fs.existsSync(expectedOutputFilePath);
      };
      // Test file can be downloaded with it's own download button
      expect(downloadExists()).toBe(false);
      // give react time to respond to the formatButton press
      // if we immediately press it the button may from not-disabled from the
      // last format
      const downloadButton = await page.waitForSelector(
        ".downloadButton.ok:not([disabled])"
      );
      // sometimes pressing the download button fails?
      await retryAsync(5, 2000, async () => {
        await downloadButton.click();
        return downloadExists();
      });
      expect(downloadExists()).toBe(true);

      // Test the download button has the correct label
      const text = await page.$eval(".downloadButton", (e) => e.textContent);
      expect(text).toContain(`test_image.${toExtension}`);

      // Test file can be downloaded with the "Download All Button"
      fs.rmSync(expectedOutputFilePath);
      expect(downloadExists()).toBe(false);
      const downloadAllButton = await page.waitForSelector(
        ".downloadAllButton:not([disabled])"
      );
      await downloadAllButton.click();
      await retry(5, 1000, downloadExists);
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

async function retryAsync(num, delay, callable) {
  for (let i = 0; i < num; i++) {
    if (await callable()) {
      return;
    }
    await sleep(delay);
  }
  throw new Error("Too many failed attempts");
}
