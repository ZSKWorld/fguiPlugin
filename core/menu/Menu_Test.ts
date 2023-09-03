import { FairyEditor, FairyGUI, System } from "csharp";
import { MenuBase } from "./MenuBase";
import { ViewID } from "../common/Types";

export class Menu_Test extends MenuBase {
    protected InitMenuData(): void {
        this.menuData = {
            text: "测试",
            selectCallback: () => this.CallBack()
        };
    }

    protected OnCreate(): void {

    }

    protected OnDestroy(): void {
    }

    private CallBack() {
        const view = FairyEditor.App.viewManager.GetView(ViewID.ReferenceView);
        const field = view.GetType().GetField("_query", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
        const query = field["GetValue"](view) as FairyEditor.DependencyQuery;
        const selectRes = FairyEditor.App.libView.GetSelectedResources(false);
        if (selectRes.Count > 0) {
            query.QueryReferences(FairyEditor.App.project, selectRes.get_Item(0).GetURL());
            query.resultList.ForEach(v => console.log(111, v.item.name, v.item.owner?.name, v.item.parent?.name));
            query.references.ForEach(v => console.log(222, v.ownerPkg.name, v.pkgId, v.itemId, v.propKey));
        }
    }

}