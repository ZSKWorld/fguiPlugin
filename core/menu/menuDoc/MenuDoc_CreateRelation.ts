import { FairyEditor, FairyGUI } from 'csharp';
import { InspectorName, ViewID } from '../../common/Types';
import { MenuBase } from '../MenuBase';

export class MenuDoc_CreateRelation extends MenuBase {
    /** 关联对象 */
    private relationFirst: FairyEditor.FObject;
    /** 被关联对象 */
    private relationSecond: FairyEditor.FObject;
    private rightClickCallback: FairyGUI.EventCallback0;

    protected InitMenuData(): void {
        this.menuData = {
            text: "关联",
            atIndex: 0,
            isSubMenu: true,
            subMenuData: Object.keys(FairyEditor.FRelationType).slice(0, 25).map(v => ({
                name: v,
                text: this.GetRelationText(v),
                selectCallback: (name: string) => this.CallBack(name)
            }))
        };
    }

    protected OnCreate(): void {
        this.rightClickCallback = new FairyGUI.EventCallback0(() => this.OnRightClick());
        FairyEditor.App.docView.docContainer.onRightClick.Add(this.rightClickCallback);
        FairyEditor.App.viewManager.GetView(ViewID.HierarchyView).onRightClick.Add(this.rightClickCallback);
    }

    protected OnDestroy(): void {
        FairyEditor.App.docView.docContainer.onRightClick.Remove(this.rightClickCallback);
        FairyEditor.App.viewManager.GetView(ViewID.HierarchyView).onRightClick.Remove(this.rightClickCallback);
        this.relationFirst = null;
        this.relationSecond = null;
        this.rightClickCallback = null;
    }

    private GetRelationText(str: string) {
        str = str.replace(/LeftExt/g, "左延展")
            .replace(/RightExt/g, "右延展")
            .replace(/TopExt/g, "顶延展")
            .replace(/BottomExt/g, "底延展")
            .replace(/Center_Center/g, "左右居中")
            .replace(/Middle_Middle/g, "上下居中")
            .replace(/Left/g, "左")
            .replace(/Right/g, "右")
            .replace(/Center/g, "中")
            .replace(/Width/g, "宽->宽")
            .replace(/Top/g, "顶")
            .replace(/Middle/g, "中")
            .replace(/Bottom/g, "底")
            .replace(/Height/g, "高->高")
            .replace(/Size/g, "宽->宽，高->高")
            .replace(/_/g, "->");
        return str;
    }

    private CallBack(name: string) {
        if (this.relationFirst && this.relationSecond) {
            this.relationFirst.relations.AddItem(this.relationSecond, FairyEditor.FRelationType[ name ]);
            FairyEditor.App.inspectorView.GetInspector(InspectorName.Relation).UpdateUI();
            FairyEditor.App.activeDoc.SetModified(true);
        }
    }

    private OnRightClick() {
        let targets = FairyEditor.App.activeDoc.GetSelection();
        this.relationFirst = null;
        this.relationSecond = null;
        let count: number = targets.Count;
        let text: string;
        if (count == 0) {
            text = "无关联对象";
        } else if (count == 1) {
            this.relationFirst = targets.get_Item(0);
            this.relationSecond = FairyEditor.App.activeDoc.content;
            text = `${ this.relationFirst.name } 关联 容器`;
        } else {
            this.relationFirst = targets.get_Item(0);
            this.relationSecond = targets.get_Item(1);
            text = `${ this.relationFirst.name } 关联 ${ this.relationSecond.name }`;
        }
        this.parentMenu.SetItemText(this.menuData.name, text);
        const curMenu = this.parentMenu.GetSubMenu(this.menuData.name);
        this.menuData.subMenuData.forEach(v => curMenu.SetItemEnabled(v.name, count > 0));
    }
}