"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuMain_ImageReference = void 0;
const csharp_1 = require("csharp");
const MenuBase_1 = require("../MenuBase");
class MenuMain_ImageReference extends MenuBase_1.MenuBase {
    InitMenuData() {
        this.menuData = {
            text: "查找图片引用",
            isSubMenu: true,
            subMenuData: [
                {
                    text: "启动",
                    selectCallback: () => this.CallBack()
                }
            ]
        };
    }
    OnCreate() {
        this._query = new csharp_1.FairyEditor.DependencyQuery();
    }
    OnDestroy() {
    }
    CallBack() {
        const project = csharp_1.FairyEditor.App.project;
        const allPng = [];
        project.allPackages.ForEach(pkg => {
            pkg.items.ForEach(item => {
                if (item.type == csharp_1.FairyEditor.FPackageItemType.IMAGE) {
                    allPng.push(item);
                }
            });
        });
        const query = this._query;
        const assetsPath = csharp_1.FairyEditor.App.project.assetsPath;
        const data = {};
        const count = allPng.length;
        let index = -1;
        const startTime = Date.now();
        const intervalId = setInterval(() => {
            if (++index < count) {
                const item = allPng[index];
                query.QueryReferences(project, item.GetURL());
                const references = [];
                if (query.resultList.Count > 0) {
                    query.resultList.ForEach(ref => {
                        references.push(ref.item.file.replace(assetsPath + "\\", "").replace("\\", "/"));
                    });
                }
                data[item.file.replace(assetsPath + "\\", "").replace("\\", "/")] = references;
                csharp_1.FairyEditor.App.ShowWaiting(`已查找 ${index + 1}/${count}`);
            }
            else {
                clearInterval(intervalId);
                setTimeout(() => {
                    csharp_1.FairyEditor.App.CloseWaiting();
                }, 2000);
                csharp_1.FairyEditor.App.ShowWaiting(`查找完毕！用时:${Date.now() - startTime}ms`);
                csharp_1.System.IO.File.WriteAllText(csharp_1.FairyEditor.App.project.basePath + "\\image_references.json", JSON.stringify(data, null, "\t"));
            }
        }, 1);
    }
}
exports.MenuMain_ImageReference = MenuMain_ImageReference;
