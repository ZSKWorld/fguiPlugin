import { FairyEditor, FairyGUI, System } from "csharp";
import { $generic } from "puerts";
import { Tip } from "../../common/Tip";
import { AppConfirmResult, InspectorControlListIndex, InspectorName, MoreControllIndex, ShowObjectType } from "../../common/Types";
import { EditorUtils } from "../../utils/EditorUtils";
import { MenuBase } from "../MenuBase";
const List = $generic(System.Collections.Generic.List$1, FairyEditor.FPackageItem);

export class MenuLib_CreateController extends MenuBase {
    /** libView item 点击事件 */
    private itemClick: FairyGUI.EventCallback1;
    /** “+更多控制” 点击事件 */
    private moreControlClick: FairyGUI.EventCallback1;
    /** 资源库选中资源 */
    private selectRES: System.Collections.Generic.List$1<FairyEditor.FPackageItem>;
    private createEnable: boolean;
    /** 添加的控制器名称 */
    private controllerName: string;

    protected InitMenuData(): void {
        this.menuData = {
            atIndex: 0,
            text: "为编辑对象创建图片控制器",
            selectCallback: () => this.CallBack()
        };
    }

    protected OnCreate(): void {
        this.selectRES = new List<FairyEditor.FPackageItem>();
        this.itemClick = new FairyGUI.EventCallback1(event => this.OnItemClick(event));
        const comp = FairyEditor.App.libView.GetChildAt(0).asCom;
        comp.GetChild("treeView").asList.onClickItem.Add(this.itemClick);
        comp.GetChild("listView").asList.onClickItem.Add(this.itemClick);
        comp.GetChild("treeView").asList.onRightClickItem.Add(this.itemClick);
        comp.GetChild("listView").asList.onRightClickItem.Add(this.itemClick);

        this.moreControlClick = new FairyGUI.EventCallback1((event) => {
            try {
                this.OnAddMoreControlClick(event);
            } catch (error) {
                return Tip.Inst.Show("偶尔有bug很正常，稍安勿躁，重新创建试试!!!");
            }
        });
        FairyEditor.App.inspectorView.GetInspector(InspectorName.Gear).panel.GetChild("add").asButton.onClick.Add(this.moreControlClick);
    }

    protected OnDestroy(): void {
        const comp = FairyEditor.App.libView.GetChildAt(0).asCom;
        comp.GetChild("treeView").asList.onClickItem.Remove(this.itemClick);
        comp.GetChild("listView").asList.onClickItem.Remove(this.itemClick);
        comp.GetChild("treeView").asList.onRightClickItem.Remove(this.itemClick);
        comp.GetChild("listView").asList.onRightClickItem.Remove(this.itemClick);
        FairyEditor.App.inspectorView.GetInspector(InspectorName.Gear).panel.GetChild("add").asButton.onClick.Remove(this.moreControlClick);
        this.itemClick = null;
        this.moreControlClick = null;
        this.selectRES.Clear();
        this.selectRES = null;
    }

    private OnItemClick(event: FairyGUI.EventContext) {
        const targetRES = FairyEditor.App.libView.GetSelectedResources(false);
        let count = this.selectRES.Count;
        let child: FairyEditor.FPackageItem;
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

    private OnAddMoreControlClick(event: FairyGUI.EventContext) {
        if (!this.createEnable) return;
        //点击图标按钮
        let iconButton = FairyEditor.App.groot.GetChildAt(1).asCom.GetChildAt(1).asList.GetChildAt(MoreControllIndex.Icon).asButton;
        iconButton.FireClick(true, true);

        //控制器页数
        let pageData: string[] = new Array(this.selectRES.Count).fill("");
        //添加控制器
        FairyEditor.App.activeDoc.AddController(EditorUtils.CreateControllerXML(this.controllerName, pageData));
        const controller = FairyEditor.App.activeDoc.content.GetController(this.controllerName);

        //选择图标控制器
        FairyEditor.App.inspectorView.GetInspector(InspectorName.Gear).panel
            .GetChild("list").asList.GetChildAt(InspectorControlListIndex.Icon).asCom.GetChild("controller").asLabel.onClick.Call();

        let iconControlBtn: FairyGUI.GButton;
        let ctrlList = FairyEditor.App.groot.GetChildAt(1).asCom.GetChildAt(1).asList;
        for (let i = 0; i < ctrlList.numItems; i++) {
            iconControlBtn = ctrlList.GetChildAt(i).asButton;
            if (iconControlBtn.title == this.controllerName) {
                iconControlBtn.FireClick(true, true);
                break;
            }
        }
        FairyEditor.App.libView.SetResourcesExported(this.selectRES, true);
        //为控制器每页设置icon
        for (let i = 0; i < this.selectRES.Count; i++) {
            const element = this.selectRES.get_Item(i);
            controller.selectedIndex = i;
            (FairyEditor.App.activeDoc.inspectingTarget as FairyEditor.FLoader).icon = element.GetURL();
        }
        //重置控制器选项
        controller.selectedIndex = 0;
        this.createEnable = false;
    }

    private CallBack() {
        if (FairyEditor.App.activeDoc.GetSelection().Count == 0) return Tip.Inst.Show("未选中编辑对象");
        if (FairyEditor.App.activeDoc?.inspectingObjectType != ShowObjectType.Loader)
            return Tip.Inst.Show("编辑对象必须是\"装载器\"");
        if (this.selectRES.Count) {
            let notImageFileNames: string[] = [];
            let notExportedFileNames: string[] = [];
            let index = 0;
            let selectStr = "确认控制器图片顺序:\n";
            this.selectRES.ForEach(v => {
                selectStr += `\t${ index++ }.\t${ v.fileName }\n`;
                (v.type != FairyEditor.FPackageItemType.IMAGE) && notImageFileNames.push(v.name);
                (v.exported == false && v.owner != FairyEditor.App.activeDoc.inspectingTarget.pkg) && notExportedFileNames.push(v.name);
            });
            if (notImageFileNames.length) return FairyEditor.App.Alert("不能包含非图片资源:\n" + notImageFileNames.join("\n"));
            if (notExportedFileNames.length) return FairyEditor.App.Alert("不能使用其他包未导出的图片资源:\n" + notExportedFileNames.join("\n"));
            if (this.selectRES.Count == 1) return Tip.Inst.Show("就选一个图片？？？直接拖不就行了？");
            FairyEditor.App.Confirm(selectStr, (result: string) => {
                if (result == AppConfirmResult.Yes) {
                    this.controllerName = this.GetDefaultControllerName();
                    FairyEditor.App.Input("控制器名字", this.controllerName, (name: string) => {
                        this.controllerName = name || this.controllerName;
                        //点击“+更多控制”
                        FairyEditor.App.inspectorView.GetInspector(InspectorName.Gear).panel.GetChild("add").asButton.FireClick(true, true);
                        this.createEnable = true;
                    });
                }
            });
        }
    }

    /** 获取新建控制器默认名称 */
    private GetDefaultControllerName(): string {
        const oldNames: string[] = [];
        FairyEditor.App.activeDoc.content.controllers.ForEach(v => oldNames.push(v.name));
        const count = FairyEditor.App.activeDoc.content.controllers.Count;
        for (let i = 1; i <= count; i++) {
            if (oldNames.indexOf("c" + i) == -1) {
                return "c" + i;
            }
        }
        return "c" + (count + 1);
    }

    /** 检查名字是否和已存在控制器名称重复 */
    private CheckDuplicateName(name: string) {
        const controllers = FairyEditor.App.activeDoc.content.controllers;
        for (let i = controllers.Count - 1; i >= 0; i--) {
            if (controllers.get_Item(i).name == name) {
                return true;
            }
        }
    }
}



















