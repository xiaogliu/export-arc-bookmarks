let arcBookmarksHtml = '';

const convertToBookmarkFormat = (space, items) => {
    let result = '';

    function processItem(id) {
        const item = items.find(item => item.id === id);
        if (!item) {
          console.error(`No item found with id: ${id}`);
          return;
        } else {
          // console.log(`Item found with id: ${id}`);
          // console.log(item);
        }

        if (item.childrenIds && item.childrenIds.length > 0) {
            result += `<DT><H3>${item.title}</H3><DL><p>`;
            item.childrenIds.forEach(processItem);
            result += `</DL><p>`;
        }
        
        if (item.childrenIds && item.childrenIds.length === 0 && item.data.tab) {
            result += `<DT><A HREF="${item.data.tab.savedURL}">${item.data.tab.savedTitle}</A></DT>`;
        }
    }

    space.forEach(spaceItem => {
        if (spaceItem.containerIDs) {
            console.log(spaceItem, '====space item====')
            result += `<DT><H3>${spaceItem.title}</H3></DT>`;
            spaceItem.containerIDs.slice(spaceItem.containerIDs.indexOf('pinned') + 1, spaceItem.containerIDs.indexOf('pinned') + 2).forEach(processItem);
        }
    });

    return `
    <!DOCTYPE NETSCAPE-Bookmark-file-1>
        <HTML>
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
        <Title>Bookmarks</Title>
        ${result}
        </HTML>
    `;
}

const download = (filename, text) => {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

document.getElementById('downloadBtn').addEventListener('click', function() {
  // 使用你的文件名和 arcBookmarksHtml 变量
  download('arcBookmarksHtml.html', arcBookmarksHtml);
});

document.getElementById('jsonFile').addEventListener('change', function() {
    const file = this.files[0];
    const uploadBtn = document.getElementById('jsonFile');
    const uploadBtnLabel = document.querySelector('label[for="jsonFile"]');
    const downloadBtn = document.getElementById('downloadBtn');

    uploadBtn.disabled = true;
    uploadBtnLabel.innerText = '处理中...';
    uploadBtnLabel.style.backgroundColor = 'gray';

    const reader = new FileReader();
    reader.onload = function() {
        setTimeout(() => {
          try {
            const arcBookmarks = JSON.parse(this.result);
            arcBookmarksHtml = convertToBookmarkFormat(arcBookmarks.sidebar.containers[1].spaces, arcBookmarks.sidebar.containers[1].items);
            downloadBtn.style.display = 'block'; // 显示下载按钮
            document.getElementById('status').innerText = '处理成功, arcBookmarksHtml.html';
          } catch(err) {
              console.error('Error parsing JSON string:', err);
              document.getElementById('status').innerText = 'Error parsing JSON string: ' + err.message;
          } finally {
              uploadBtn.disabled = false;
              uploadBtnLabel.innerText = 'Choose File';
              uploadBtnLabel.style.backgroundColor = '#4CAF50';
          }
        }, 1000);

    };
    reader.readAsText(file);
});
