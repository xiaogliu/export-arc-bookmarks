const translations = {
  en: {
    chooseFile: "Choose File",
    download: "Download",
  },
  zh: {
    chooseFile: "选择文件",
    download: "下载",
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
  });

window.addEventListener("load", function () {
  loadLanguage("en");
});
