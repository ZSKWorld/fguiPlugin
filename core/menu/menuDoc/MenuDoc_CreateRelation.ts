import { InspectorName, ViewID } from '../../common/Types';
import { MenuBase_Doc } from '../MenuBase_Doc';

export class MenuDoc_CreateRelation extends MenuBase_Doc {
    /** 关联对象 */
    private relationFirst: CS.FairyEditor.FObject;
    /** 被关联对象 */
    private relationSecond: CS.FairyEditor.FObject;
    private rightClickCallback: CS.FairyGUI.EventCallback0;

    protected InitMenuData(): void {
        const menuData = this.menuData;
        menuData.text = "关联";
        menuData.isSubMenu = true;
        menuData.subMenuData = Object.keys(CS.FairyEditor.FRelationType).slice(0, 25).map(v => ({
            name: v,
            text: this.GetRelationText(v),
            onSelected: (name: string) => this.OnSelected(name)
        }));
    }

    protected OnCreate(): void {
        this.rightClickCallback = new CS.FairyGUI.EventCallback0(() => this.OnRightClick());
        CS.FairyEditor.App.docView.docContainer.onRightClick.Add(this.rightClickCallback);
        CS.FairyEditor.App.viewManager.GetView(ViewID.HierarchyView).onRightClick.Add(this.rightClickCallback);
    }

    protected OnDestroy(): void {
        CS.FairyEditor.App.docView.docContainer.onRightClick.Remove(this.rightClickCallback);
        CS.FairyEditor.App.viewManager.GetView(ViewID.HierarchyView).onRightClick.Remove(this.rightClickCallback);
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

    private OnSelected(name: string) {
        if (this.relationFirst && this.relationSecond) {
            this.relationFirst.relations.AddItem(this.relationSecond, CS.FairyEditor.FRelationType[name]);
            CS.FairyEditor.App.inspectorView.GetInspector(InspectorName.Relation).UpdateUI();
            CS.FairyEditor.App.activeDoc.SetModified(true);
        }
    }

    private OnRightClick() {
        let targets = CS.FairyEditor.App.activeDoc.GetSelection();
        this.relationFirst = null;
        this.relationSecond = null;
        let count: number = targets.Count;
        let text: string;
        if (count == 0) {
            text = "无关联对象";
        } else if (count == 1) {
            this.relationFirst = targets.get_Item(0);
            this.relationSecond = CS.FairyEditor.App.activeDoc.content;
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