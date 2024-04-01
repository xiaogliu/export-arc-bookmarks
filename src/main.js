let arcBookmarksHtml = "";
// 当前的语言
let currentLanguage = 'en';

// 存储翻译的对象
const translations = {
  en: {
    chooseFile: "Choose File",
    download: "Download",
    processing: "Processing...",
    success: "Processing successful: ",
    errorReadingFile: "Error reading file: ",
    errorParsingJSON: "Error parsing JSON string: "
  },
  zh: {
    chooseFile: "选择文件",
    download: "下载",
    processing: "处理中...",
    success: "处理成功：",
    errorReadingFile: "读取文件错误：",
    errorParsingJSON: "解析 JSON 字符串错误："
  },
};

function loadLanguage(userLanguage) {
  const translation = translations[userLanguage];
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = translation[node.getAttribute("data-i18n")];
  });
}

document
  .getElementById("languageSelect")
  .addEventListener("change", function () {
    loadLanguage(this.value);
    currentLanguage = this.value;
  });

// update JS translation
const translate = key => translations[currentLanguage][key];

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

document.getElementById("downloadBtn").addEventListener("click", function () {
  download("arcBookmarksHtml.html", arcBookmarksHtml);
});

document.getElementById("jsonFile").addEventListener("change", function () {
  const file = this.files[0];
  const uploadBtn = document.getElementById("jsonFile");
  const uploadBtnLabel = document.querySelector('label[for="jsonFile"]');
  const downloadBtn = document.getElementById("downloadBtn");
  const statusElement = document.getElementById("status");

  uploadBtn.disabled = true;
  uploadBtnLabel.innerText = translate('processing');
  uploadBtnLabel.style.backgroundColor = "gray";
  downloadBtn.style.display = "none";

  const reader = new FileReader();
  reader.onload = function () {
    setTimeout(() => {
      try {
        const arcBookmarks = JSON.parse(this.result);
        arcBookmarksHtml = convertToBookmarkFormat(arcBookmarks.sidebar);
        downloadBtn.style.display = "block";
        statusElement.innerText = translate('success') + " arcBookmarksHtml.html";
      } catch (err) {
        console.error("Error parsing JSON string:", err);
        statusElement.innerText = translate('errorParsingJSON') + err.message;
      } finally {
        uploadBtn.disabled = false;
        uploadBtnLabel.innerText = translate('chooseFile');
        uploadBtnLabel.style.backgroundColor = "#4CAF50";
      }
    }, 1000);
  };

  reader.onerror = function () {
    console.error("Error reading file:", this.error);
    statusElement.innerText = translate('errorReadingFile') + this.error.message;
    uploadBtn.disabled = false;
    uploadBtnLabel.innerText = translate('chooseFile');
    uploadBtnLabel.style.backgroundColor = "#4CAF50";
  };

  reader.readAsText(file);
});
