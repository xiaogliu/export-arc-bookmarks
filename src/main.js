let arcBookmarksHtml = "";

const processItem = (id, items, isTopApp = false) => {
  const item = items.find((item) => item.id === id);
  if (!item) {
    console.error(`No item found with id: ${id}`);
    return "";
  }

  // Skip top apps if it's empty
  if (isTopApp && item.childrenIds.length === 0) {
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

const convertToBookmarkFormat = (sidebar) => {
  const topApps = sidebar.containers[1].topAppsContainerIDs;
  const spaces = sidebar.containers[1].spaces;
  const items = sidebar.containers[1].items;

  const topAppsResult = processItem(topApps[1], items, true);

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
  uploadBtnLabel.innerText = "处理中...";
  uploadBtnLabel.style.backgroundColor = "gray";
  downloadBtn.style.display = "none";

  const reader = new FileReader();
  reader.onload = function () {
    setTimeout(() => {
      try {
        const arcBookmarks = JSON.parse(this.result);
        arcBookmarksHtml = convertToBookmarkFormat(arcBookmarks.sidebar);
        downloadBtn.style.display = "block";
        statusElement.innerText = "处理成功, arcBookmarksHtml.html";
      } catch (err) {
        console.error("Error parsing JSON string:", err);
        statusElement.innerText = "Error parsing JSON string: " + err.message;
      } finally {
        uploadBtn.disabled = false;
        uploadBtnLabel.innerText = "Choose File";
        uploadBtnLabel.style.backgroundColor = "#4CAF50";
      }
    }, 1000);
  };

  reader.onerror = function () {
    console.error("Error reading file:", this.error);
    statusElement.innerText = "Error reading file: " + this.error.message;
    uploadBtn.disabled = false;
    uploadBtnLabel.innerText = "Choose File";
    uploadBtnLabel.style.backgroundColor = "#4CAF50";
  };

  reader.readAsText(file);
});
