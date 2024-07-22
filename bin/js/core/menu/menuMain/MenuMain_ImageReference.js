"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuMain_ImageReference = void 0;
const csharp_1 = require("csharp");
const ProgressView_1 = require("../../common/ProgressView");
const MenuBase_Main_1 = require("../MenuBase_Main");
class MenuMain_ImageReference extends MenuBase_Main_1.MenuBase_Main {
    InitMenuData() {
        const menuData = this.menuData;
        menuData.text = "查找图片引用";
        menuData.isSubMenu = true;
        menuData.subMenuData = [
            {
                text: "启动",
                onSelected: () => this.OnSelected(),
            }
        ];
    }
    OnCreate() {
        this._query = new csharp_1.FairyEditor.DependencyQuery();
    }
    OnDestroy() {
    }
    OnSelected() {
        const project = csharp_1.FairyEditor.App.project;
        const allPng = [];
        project.allPackages.ForEach(pkg => {
            pkg.items.ForEach(item => {
                if (item.type == csharp_1.FairyEditor.FPackageItemType.IMAGE) {
                    allPng.push(item);
                }
            });
        });
        let findingPro = 0;
        let findingTime = 10;
        const findingStr = "查找中....";
        const updateFinding = () => {
            if (++findingTime > 5) {
                findingTime = 0;
                findingPro++;
                ProgressView_1.ProgressView.Inst.SetTip(findingStr.substring(0, findingPro % findingStr.length));
            }
        };
        const query = this._query;
        const assetsPath = csharp_1.FairyEditor.App.project.assetsPath;
        const data = {};
        const count = allPng.length;
        let index = -1;
        const startTime = Date.now();
        const intervalId = setInterval(() => {
            updateFinding();
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
                ProgressView_1.ProgressView.Inst.RefreshProgress(index + 1, count);
            }
            else {
                clearInterval(intervalId);
                ProgressView_1.ProgressView.Inst.RefreshProgress(count, count);
                const targetPath = csharp_1.FairyEditor.App.project.basePath + "\\image_references.json";
                let tip = `查找完毕！用时:[color=#00ff00]${Date.now() - startTime}ms[/color]\n引用文件已保存至：${targetPath}`;
                ProgressView_1.ProgressView.Inst.SetTip(tip);
                csharp_1.System.IO.File.WriteAllText(targetPath, JSON.stringify(data, null, "\t"));
            }
        }, 1);
        ProgressView_1.ProgressView.Inst.Show(() => {
            clearInterval(intervalId);
            ProgressView_1.ProgressView.Inst.SetTip(`[color=#ff0000]已取消！[/color]`);
        });
    }
}
exports.MenuMain_ImageReference = MenuMain_ImageReference;
