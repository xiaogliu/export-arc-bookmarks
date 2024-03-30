{
  "space": [
    "thebrowser.company.defaultPersonalSpaceID",  // space id
    {
      "title" : "XG",
      "containerIDs" : [ // 该 space 下存储的 containerIDs, 去到 items 递归查找就好了. Container 目前有两种, 固定的 和 active 的 tab, 但是没有固定的
        "pinned",
        "thebrowser.company.defaultPersonalSpacePinnedContainerID", // ⭐️ 包含比如 imported from chrome
        "unpinned",
        "thebrowser.company.defaultPersonalSpaceUnpinnedContainerID" // 这里是 active 的 tab, 不需要导出
      ],
      "id" : "thebrowser.company.defaultPersonalSpaceID"
    },
    "196E7B62-5F8E-49AF-B217-37207EF6AA70",
    {
      "title" : "work",
      "containerIDs" : [
        "pinned",
        "36B7B040-BC3C-4E13-B675-7FB7265180B9",
        "unpinned",
        "F8DDF350-0A8E-4939-B91B-8E441858C886"
      ],
      "id" : "196E7B62-5F8E-49AF-B217-37207EF6AA70",
    }
  ],
  "topAppsContainerIDs" : [ // 顶部的 app, 也是 container
    {
      "default" : {

      }
    },
    "2CE510A3-A671-4703-B070-B5DA97ACBFED"
  ],
  "items" : [ // items 是 flat 结构,没有层级
    "thebrowser.company.defaultPersonalSpacePinnedContainerID", // containerID, items[id + 1] 即对应 bookmark 的详细信息, 这种是西省存储空间换查询时间
    {
      "isUnread" : false,
      "title" : null,
      "parentID" : null,
      "originatingDevice" : "AEE9E4C2-F2B9-4ED3-BA19-0B5C4CDE0977",
      "childrenIds" : [ // containerId 下的子元素
        "thebrowser.company.arcBasicsFolderID", // 递归查找 childrenIds, 知道 childrenIds 为空
        "ACBF5D17-B4D9-4630-A8F7-0FAD7A4451D4",
        "F3E8109A-C48C-495C-AD8F-682D29368A74",
        "thebrowser.company.recentlyRecoveredFolderID"
      ],
      "createdAt" : 725971999.73541,
      "id" : "thebrowser.company.defaultPersonalSpacePinnedContainerID",
      "data" : {
        "itemContainer" : {
          "containerType" : {
            "spaceItems" : {
              "_0" : "thebrowser.company.defaultPersonalSpaceID"
            }
          }
        }
      }
    },
    "F3E8109A-C48C-495C-AD8F-682D29368A74",
    {
      "data" : {
        "list" : {

        }
      },
      "createdAt" : 726730078.509543,
      "title" : "InkSeeker",
      "id" : "F3E8109A-C48C-495C-AD8F-682D29368A74",
      "childrenIds" : [
        "7C8AD86D-5D65-4426-9F14-FF773E31AC01"
      ],
      "originatingDevice" : "AEE9E4C2-F2B9-4ED3-BA19-0B5C4CDE0977",
      "parentID" : "thebrowser.company.defaultPersonalSpacePinnedContainerID", // parentID link to space.containerIDs
      "isUnread" : false
    },
    "7C8AD86D-5D65-4426-9F14-FF773E31AC01",
    {
      "createdAt" : 726729943.588631,
      "title" : null,
      "data" : {
        "tab" : {
          "tabId" : 328472567,
          "timeLastActiveAt" : 731864447.163927,
          "savedMuteStatus" : "allowAudio",
          "savedURL" : "https:\/\/progressier.com\/pwa-icons-and-ios-splash-screen-generator", // bookmarks 转义
          "savedTitle" : "PWA Icons & iOS Splash Screens Generator | Progressier",
          "activeTabBeforeCreationID" : "FD9EC16D-77D1-4CBE-949A-5E2D0A7BA098"
        }
      },
      "parentID" : "F3E8109A-C48C-495C-AD8F-682D29368A74",
      "isUnread" : false,
      "childrenIds" : [

      ],
      "originatingDevice" : "AEE9E4C2-F2B9-4ED3-BA19-0B5C4CDE0977",
      "id" : "7C8AD86D-5D65-4426-9F14-FF773E31AC01"
    },
  ]
}
