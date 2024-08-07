"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuDoc_CreateRelation = void 0;
const MenuBase_Doc_1 = require("../MenuBase_Doc");
class MenuDoc_CreateRelation extends MenuBase_Doc_1.MenuBase_Doc {
    InitMenuData() {
        const menuData = this.menuData;
        menuData.text = "关联";
        menuData.isSubMenu = true;
        menuData.subMenuData = Object.keys(CS.FairyEditor.FRelationType).slice(0, 25).map(v => ({
            name: v,
            text: this.GetRelationText(v),
            onSelected: (name) => this.OnSelected(name)
        }));
    }
    OnCreate() {
        this.rightClickCallback = new CS.FairyGUI.EventCallback0(() => this.OnRightClick());
        CS.FairyEditor.App.docView.docContainer.onRightClick.Add(this.rightClickCallback);
        CS.FairyEditor.App.viewManager.GetView("fairygui.HierarchyView" /* ViewID.HierarchyView */).onRightClick.Add(this.rightClickCallback);
    }
    OnDestroy() {
        CS.FairyEditor.App.docView.docContainer.onRightClick.Remove(this.rightClickCallback);
        CS.FairyEditor.App.viewManager.GetView("fairygui.HierarchyView" /* ViewID.HierarchyView */).onRightClick.Remove(this.rightClickCallback);
        this.relationFirst = null;
        this.relationSecond = null;
        this.rightClickCallback = null;
    }
    GetRelationText(str) {
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
    OnSelected(name) {
        if (this.relationFirst && this.relationSecond) {
            this.relationFirst.relations.AddItem(this.relationSecond, CS.FairyEditor.FRelationType[name]);
            CS.FairyEditor.App.inspectorView.GetInspector("relation" /* InspectorName.Relation */).UpdateUI();
            CS.FairyEditor.App.activeDoc.SetModified(true);
        }
    }
    OnRightClick() {
        let targets = CS.FairyEditor.App.activeDoc.GetSelection();
        this.relationFirst = null;
        this.relationSecond = null;
        let count = targets.Count;
        let text;
        if (count == 0) {
            text = "无关联对象";
        }
        else if (count == 1) {
            this.relationFirst = targets.get_Item(0);
            this.relationSecond = CS.FairyEditor.App.activeDoc.content;
            text = `${this.relationFirst.name} 关联 容器`;
        }
        else {
            this.relationFirst = targets.get_Item(0);
            this.relationSecond = targets.get_Item(1);
            text = `${this.relationFirst.name} 关联 ${this.relationSecond.name}`;
        }
        this.parentMenu.SetItemText(this.menuData.name, text);
        const curMenu = this.parentMenu.GetSubMenu(this.menuData.name);
        this.menuData.subMenuData.forEach(v => curMenu.SetItemEnabled(v.name, count > 0));
    }
}
exports.MenuDoc_CreateRelation = MenuDoc_CreateRelation;
