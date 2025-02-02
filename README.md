# Export Arc browser bookmarks

You can use this project to export Arc browser bookmarks easily.

## How to use?

### Environment Preparation

Arc browser

### Let's go

1. Navigate to https://xiaogliu.github.io/export-arc-bookmarks
2. Click `Choose File 📁`, it will open Finder
3. Press `⌘⇧G` in Finder to open `Go to the folder` dialog
4. Type `~/Library/Application Support/Arc/StorableSidebar.json` in Finder dialog
5. Press `Enter` to locate the bookmark file
   ![ArcBookmarksVSFirefoxBookmarks](./images/FindBookmarkJsonFile.png)

6. Press `Enter` again to select the `StorableSidebar.json` file. Once done, you will receive an `arcBookmarks.html` file. This is a standard bookmark file that can be imported into browsers such as Chrome, Edge, Safari, Firefox, etc
   ![ArcBookmarksVSFirefoxBookmarks](./images/ArcBookmarksVSFirefoxBookmarks.png)

#### ⚠️ Warning

I only tested on macOS, if you are using Windows or Linux, you may need to find the bookmark file manually by input `arc://version` in the Arc address bar and find the bookmark data storage path by `Profile Path`"

![ArcProfilePath](./images/ArcProfilePath.png)

## Which versions have been verified?

### MacOS

- Version 1.36.0 (48035), Chromium Engine Version 123.0.6312.87
- Version 1.37.0 (48361), Chromium Engine Version 123.0.6312.106
- Version 1.79.1 (58230), Chromium Engine Version 132.0.6834.160

## Declaration

All Bookmarks are handled locally in your browser, and are not transmitted to any cloud server, please feel free to use.

## License

MIT
