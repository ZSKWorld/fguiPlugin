"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuLib_CreateController = void 0;
const puerts_1 = require("puerts");
const Tip_1 = require("../../common/Tip");
const EditorUtils_1 = require("../../utils/EditorUtils");
const MenuBase_Lib_1 = require("../MenuBase_Lib");
const List = (0, puerts_1.$generic)(CS.System.Collections.Generic.List$1, CS.FairyEditor.FPackageItem);
class MenuLib_CreateController extends MenuBase_Lib_1.MenuBase_Lib {
    InitMenuData() {
        const menuData = this.menuData;
        menuData.text = "为编辑对象创建图片控制器";
        menuData.onSelected = () => this.OnSelected();
    }
    OnCreate() {
        this.selectRES = new List();
        this.itemClick = new CS.FairyGUI.EventCallback1(event => this.OnItemClick(event));
        const comp = CS.FairyEditor.App.libView.GetChildAt(0).asCom;
        comp.GetChild("treeView").asList.onClickItem.Add(this.itemClick);
        comp.GetChild("listView").asList.onClickItem.Add(this.itemClick);
        comp.GetChild("treeView").asList.onRightClickItem.Add(this.itemClick);
        comp.GetChild("listView").asList.onRightClickItem.Add(this.itemClick);
        this.moreControlClick = new CS.FairyGUI.EventCallback1((event) => {
            try {
                this.OnAddMoreControlClick(event);
            }
            catch (error) {
                return Tip_1.Tip.Inst.Show("偶尔有bug很正常，稍安勿躁，重新创建试试!!!");
            }
        });
        CS.FairyEditor.App.inspectorView.GetInspector("gear" /* InspectorName.Gear */).panel.GetChild("add").asButton.onClick.Add(this.moreControlClick);
    }
    OnDestroy() {
        const comp = CS.FairyEditor.App.libView.GetChildAt(0).asCom;
        comp.GetChild("treeView").asList.onClickItem.Remove(this.itemClick);
        comp.GetChild("listView").asList.onClickItem.Remove(this.itemClick);
        comp.GetChild("treeView").asList.onRightClickItem.Remove(this.itemClick);
        comp.GetChild("listView").asList.onRightClickItem.Remove(this.itemClick);
        CS.FairyEditor.App.inspectorView.GetInspector("gear" /* InspectorName.Gear */).panel.GetChild("add").asButton.onClick.Remove(this.moreControlClick);
        this.itemClick = null;
        this.moreControlClick = null;
        this.selectRES.Clear();
        this.selectRES = null;
    }
    OnItemClick(event) {
        const targetRES = CS.FairyEditor.App.libView.GetSelectedResources(false);
        let count = this.selectRES.Count;
        let child;
        //去掉未选中的
        for (let i = count - 1; i >= 0; i--) {
            child = this.selectRES.get_Item(i);
            if (targetRES.Contains(child) == false) {
                this.selectRES.RemoveAt(i);
            }
        }
        count = targetRES.Count;
        //添加新选中的
        for (let i = 0; i < count; i++) {
            child = targetRES.get_Item(i);
            if (this.selectRES.Contains(child) == false) {
                this.selectRES.Add(child);
            }
        }
    }
    OnAddMoreControlClick(event) {
        if (!this.createEnable)
            return;
        //点击图标按钮
        let iconButton = CS.FairyEditor.App.groot.GetChildAt(1).asCom.GetChildAt(1).asList.GetChildAt(6 /* MoreControllIndex.Icon */).asButton;
        iconButton.FireClick(true, true);
        //控制器页数
        let pageData = new Array(this.selectRES.Count).fill("");
        //添加控制器
        CS.FairyEditor.App.activeDoc.AddController(EditorUtils_1.EditorUtils.CreateControllerXML(this.controllerName, pageData));
        const controller = CS.FairyEditor.App.activeDoc.content.GetController(this.controllerName);
        //选择图标控制器
        CS.FairyEditor.App.inspectorView.GetInspector("gear" /* InspectorName.Gear */).panel
            .GetChild("list").asList.GetChildAt(8 /* InspectorControlListIndex.Icon */).asCom.GetChild("controller").asLabel.onClick.Call();
        let iconControlBtn;
        let ctrlList = CS.FairyEditor.App.groot.GetChildAt(1).asCom.GetChildAt(1).asList;
        for (let i = 0; i < ctrlList.numItems; i++) {
            iconControlBtn = ctrlList.GetChildAt(i).asButton;
            if (iconControlBtn.title == this.controllerName) {
                iconControlBtn.FireClick(true, true);
                break;
            }
        }
        CS.FairyEditor.App.libView.SetResourcesExported(this.selectRES, true);
        //为控制器每页设置icon
        for (let i = 0; i < this.selectRES.Count; i++) {
            const element = this.selectRES.get_Item(i);
            controller.selectedIndex = i;
            CS.FairyEditor.App.activeDoc.inspectingTarget.icon = element.GetURL();
        }
        //重置控制器选项
        controller.selectedIndex = 0;
        this.createEnable = false;
    }
    OnSelected() {
        var _a;
        if (CS.FairyEditor.App.activeDoc.GetSelection().Count == 0)
            return Tip_1.Tip.Inst.Show("未选中编辑对象");
        if (((_a = CS.FairyEditor.App.activeDoc) === null || _a === void 0 ? void 0 : _a.inspectingObjectType) != "loader" /* ShowObjectType.Loader */)
            return Tip_1.Tip.Inst.Show("编辑对象必须是\"装载器\"");
        if (this.selectRES.Count) {
            let notImageFileNames = [];
            let notExportedFileNames = [];
            let index = 0;
            let selectStr = "确认控制器图片顺序:\n";
            this.selectRES.ForEach(v => {
                selectStr += `\t${index++}.\t${v.fileName}\n`;
                (v.type != CS.FairyEditor.FPackageItemType.IMAGE) && notImageFileNames.push(v.name);
                (v.exported == false && v.owner != CS.FairyEditor.App.activeDoc.inspectingTarget.pkg) && notExportedFileNames.push(v.name);
            });
            if (notImageFileNames.length)
                return CS.FairyEditor.App.Alert("不能包含非图片资源:\n" + notImageFileNames.join("\n"));
            if (notExportedFileNames.length)
                return CS.FairyEditor.App.Alert("不能使用其他包未导出的图片资源:\n" + notExportedFileNames.join("\n"));
            if (this.selectRES.Count == 1)
                return Tip_1.Tip.Inst.Show("就选一个图片？？？直接拖不就行了？");
            CS.FairyEditor.App.Confirm(selectStr, (result) => {
                if (result == "yes" /* AppConfirmResult.Yes */) {
                    this.controllerName = this.GetDefaultControllerName();
                    CS.FairyEditor.App.Input("控制器名字", this.controllerName, (name) => {
                        this.controllerName = name || this.controllerName;
                        //点击“+更多控制”
                        CS.FairyEditor.App.inspectorView.GetInspector("gear" /* InspectorName.Gear */).panel.GetChild("add").asButton.FireClick(true, true);
                        this.createEnable = true;
                    });
                }
            });
        }
    }
    /** 获取新建控制器默认名称 */
    GetDefaultControllerName() {
        const oldNames = [];
        CS.FairyEditor.App.activeDoc.content.controllers.ForEach(v => oldNames.push(v.name));
        const count = CS.FairyEditor.App.activeDoc.content.controllers.Count;
        for (let i = 1; i <= count; i++) {
            if (oldNames.indexOf("c" + i) == -1) {
                return "c" + i;
            }
        }
        return "c" + (count + 1);
    }
    /** 检查名字是否和已存在控制器名称重复 */
    CheckDuplicateName(name) {
        const controllers = CS.FairyEditor.App.activeDoc.content.controllers;
        for (let i = controllers.Count - 1; i >= 0; i--) {
            if (controllers.get_Item(i).name == name) {
                return true;
            }
        }
    }
}
exports.MenuLib_CreateController = MenuLib_CreateController;
