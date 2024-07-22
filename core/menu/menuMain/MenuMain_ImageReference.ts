import { FairyEditor, System } from "csharp";
import { ProgressView } from "../../common/ProgressView";
import { MenuBase_Main } from "../MenuBase_Main";

export class MenuMain_ImageReference extends MenuBase_Main {
    private _query: FairyEditor.DependencyQuery;
    protected InitMenuData(): void {
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

    protected OnCreate(): void {
        this._query = new FairyEditor.DependencyQuery();
    }

    protected OnDestroy(): void {

    }

    private OnSelected() {
        const project = FairyEditor.App.project;
        const allPng: FairyEditor.FPackageItem[] = [];
        project.allPackages.ForEach(pkg => {
            pkg.items.ForEach(item => {
                if (item.type == FairyEditor.FPackageItemType.IMAGE) {
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
                ProgressView.Inst.SetTip(findingStr.substring(0, findingPro % findingStr.length));
            }
        };
        const query = this._query;
        const assetsPath = FairyEditor.App.project.assetsPath;
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
                ProgressView.Inst.RefreshProgress(index + 1, count);
            } else {
                clearInterval(intervalId);
                ProgressView.Inst.RefreshProgress(count, count);
                const targetPath = FairyEditor.App.project.basePath + "\\image_references.json";
                let tip = `查找完毕！用时:[color=#00ff00]${ Date.now() - startTime }ms[/color]\n引用文件已保存至：${ targetPath }`;
                ProgressView.Inst.SetTip(tip);
                System.IO.File.WriteAllText(targetPath, JSON.stringify(data, null, "\t"));
            }
        }, 1);
        ProgressView.Inst.Show(() => {
            clearInterval(intervalId);
            ProgressView.Inst.SetTip(`[color=#ff0000]已取消！[/color]`);
        });
    }
}