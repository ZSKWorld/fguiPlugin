import { FairyEditor, System } from "csharp";
import { MenuBase } from "../MenuBase";

export class MenuMain_ImageReference extends MenuBase {
    private _query: FairyEditor.DependencyQuery;
    protected InitMenuData(): void {
        this.menuData = {
            text: "查找图片引用",
            isSubMenu: true,
            subMenuData: [
                {
                    text: "启动",
                    onSelected: () => this.OnSelected()
                }
            ]
        };
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
        const query = this._query;
        const assetsPath = FairyEditor.App.project.assetsPath;
        const data = {};
        const count = allPng.length;
        let index = -1;
        const startTime = Date.now();
        const intervalId = setInterval(() => {
            if (++index < count) {
                const item = allPng[ index ];
                query.QueryReferences(project, item.GetURL());
                const references = [];
                if (query.resultList.Count > 0) {
                    query.resultList.ForEach(ref => {
                        references.push(ref.item.file.replace(assetsPath + "\\", "").replace("\\", "/"));
                    });
                }
                data[ item.file.replace(assetsPath + "\\", "").replace("\\", "/") ] = references;
                FairyEditor.App.ShowWaiting(`已查找 ${ index + 1 }/${ count }`);
            } else {
                clearInterval(intervalId);
                setTimeout(() => {
                    FairyEditor.App.CloseWaiting();
                }, 2000);
                FairyEditor.App.ShowWaiting(`查找完毕！用时:${ Date.now() - startTime }ms`);
                System.IO.File.WriteAllText(FairyEditor.App.project.basePath + "\\image_references.json", JSON.stringify(data, null, "\t"));
            }
        }, 1);
    }
}