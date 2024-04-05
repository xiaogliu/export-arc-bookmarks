let arcBookmarksHtml = "";
let currentLanguage = "en";
const downloadBtnContainer = document.querySelector("#downloadBtnContainer");

const translations = {
  en: {
    chooseFile: "Choose File 📁",
    download: "Download",
    processing: "Processing...",
    success: "✅ Processing successful: ",
    errorReadingFile: "⚠️ Error reading file: ",
    errorParsingJSON: "⚠️ Error parsing JSON string: ",
    exportArcBookmarks: "🔖 Export Arc Bookmarks",
    howToUse: "How to use?",
    step01: "1. Enter arc://version in the Arc address bar",
    step02: "2. Determine the data storage path by `profile` path for Arc",
    step03: "3. Navigate to the Arc browser folder via Finder: such as `/Users/vincentliu/Library/Application Support/Arc`",
    step04: "4. Copy `StorableSidebar.json` to somewhere that you can easily find",
    step05: "5. Click 'Choose File 📁' and upload your Arc 'StorableSidebar.json' file. Once done, you will receive an 'arcBookmarks.html' file. This is a standard bookmark file that can be imported into browsers such as Chrome, Edge, Safari, Firefox, etc.",
    declaration: "All Bookmarks are handled locally in your browser",
    whichVersions: "Which versions have been verified?",
  },
  zh: {
    chooseFile: "选择文件 📁",
    download: "下载",
    processing: "处理中...",
    success: "✅ 处理成功：",
    errorReadingFile: "⚠️ 读取文件错误：",
    errorParsingJSON: "⚠️ 解析 JSON 字符串错误：",
    exportArcBookmarks: "🔖 导出 Arc 书签",
    howToUse: "使用教程",
    step01: "1. 在 Arc 地址栏中输入 arc://version",
    step02: "2. 通过 Arc 的 `profile` 路径确定数据存储路径",
    step03: "3. 通过 Finder 导航到 Arc 浏览器文件夹：比如 `/Users/vincentliu/Library/Application Support/Arc`",
    step04: "4. 将 `StorableSidebar.json` 复制到你可以轻松找到的地方",
    step05: "5. 点击 '选择文件 📁' 并上传你的 Arc 'StorableSidebar.json' 文件。完成后，你将收到一个 'arcBookmarks.html' 文件。这是一个标准的书签文件，可以导入到 Chrome、Edge、Safari、Firefox 等浏览器中。",
    declaration: "所有的书签都在您的浏览器本地处理",
    whichVersions: "已验证的版本有哪些？",
  },
};

function loadLanguage(userLanguage) {
  const translation = translations[userLanguage];
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = translation[node.getAttribute("data-i18n")];
  });
}

document
  .querySelector("#languageSelect")
  .addEventListener("change", function () {
    loadLanguage(this.value);
    currentLanguage = this.value;
    downloadBtnContainer.style.display = 'none';
  });

const translate = (key) => translations[currentLanguage][key];

window.addEventListener("load", function () {
  loadLanguage("en");
});

const processItem = (id, items, isTopApp = false) => {
  const item = items.find((item) => item.id === id);
  if (!item) {
    console.log(`No item found with id: ${id}`);
    return "";
  }

  // Skip top apps if it's empty
  if (isTopApp && item.childrenIds.length === 0) {
    console.log("No top app bookmarks found");
    return "";
  }

  if (item.childrenIds && item.childrenIds.length > 0) {
    const customTitle = isTopApp ? "Top Apps" : "Pinned bookmarks";
    return (
      `<DT><H3>${
        item.title === null && item.parentID === null ? customTitle : item.title
      }</H3><DL><p>` +
      item.childrenIds.map((childId) => processItem(childId, items)).join("") +
      `</DL><p>`
    );
  }

  if (item.childrenIds && item.childrenIds.length === 0 && item.data.tab) {
    return `<DT><A HREF="${item.data.tab.savedURL}">${item.data.tab.savedTitle}</A>`;
  }

  return "";
};

// Function to find the container with items and spaces
const findContainerWithItemsAndSpaces = (containers) => {
  return containers.find((container) => container.items && container.spaces);
};

const convertToBookmarkFormat = (sidebar) => {
  const container = findContainerWithItemsAndSpaces(sidebar.containers);
  if (!container) {
    console.error("No container found with items and spaces");
    return "";
  }

  const { topAppsContainerIDs, spaces, items } = container;

  const topAppsResult = processItem(
    topAppsContainerIDs.find((item) => typeof item === "string"),
    items,
    true
  );

  const pinnedBookmarksResult = spaces
    .filter((spaceItem) => spaceItem.containerIDs)
    .map((spaceItem) => {
      const containerContent = spaceItem.containerIDs
        .slice(
          spaceItem.containerIDs.indexOf("pinned") + 1,
          spaceItem.containerIDs.indexOf("pinned") + 2
        )
        .map((id) => processItem(id, items))
        .join("");
      return `<DT><H3>${spaceItem.title} - Space</H3><DL><p>${containerContent}</DL><p>`;
    })
    .join("");

  const result = topAppsResult + pinnedBookmarksResult;

  return `
    <!DOCTYPE NETSCAPE-Bookmark-file-1>
        <HTML>
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
        <Title>Arc Bookmarks</Title>
        ${result}
        </HTML>
    `;
};

const download = (filename, text) => {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

document
  .querySelector("#downloadBtn")
  .addEventListener("click", function () {
    download("arcBookmarks.html", arcBookmarksHtml);
  });

document.querySelector("#jsonFile").addEventListener("click", function () {
  downloadBtnContainer.style.display = 'none';
});

document.querySelector("#jsonFile").addEventListener("change", function () {
  if (this.files.length === 0) {
    // User cancelled file selection
    return;
  }

  const file = this.files[0];
  const uploadBtn = document.querySelector("#jsonFile");
  const uploadBtnLabel = document.querySelector('label[for="jsonFile"]');
  const statusElement = document.querySelector("#status");
  const downloadBtnAndDividerElement = document.querySelector("#downloadBtnAndDivider");
  downloadBtnAndDividerElement.style.display = 'flex';


  uploadBtn.disabled = true;
  uploadBtnLabel.innerText = translate("processing");
  downloadBtnContainer.style.display = 'none';

  const reader = new FileReader();
  reader.onload = function () {
    try {
      const arcBookmarks = JSON.parse(this.result);
      arcBookmarksHtml = convertToBookmarkFormat(arcBookmarks.sidebar);
      downloadBtnContainer.style.display = 'block';
      statusElement.innerText = translate("success") + " arcBookmarks.html";
    } catch (err) {
      console.error("Error parsing JSON string:", err);
      downloadBtnContainer.style.display = 'block';
      downloadBtnAndDividerElement.style.display = 'none';
      statusElement.innerText = translate("errorParsingJSON") + err.message;
    } finally {
      uploadBtn.disabled = false;
      uploadBtnLabel.innerText = translate("chooseFile");
      uploadBtn.value = ""; // Add this line to allow re-uploading the same file
    }
  };

  reader.onerror = function () {
    console.error("Error reading file:", this.error);
    statusElement.innerText =
      translate("errorReadingFile") + this.error.message;
    uploadBtn.disabled = false;
    uploadBtnLabel.innerText = translate("chooseFile");
    downloadBtnContainer.style.display = 'block';
    downloadBtnAndDividerElement.style.display = 'none';
  };

  reader.readAsText(file);
});
