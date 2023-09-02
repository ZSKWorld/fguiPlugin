import { FairyEditor } from "csharp";
import { ShowObjectType } from "../../common/Types";
import { MenuBase } from "../MenuBase";
interface Type2Type {
    type: string;
    asType: string;
    ext: string;
}
const LuaType2Type: { [key: string]: Type2Type } = {
    Button: { type: "FairyGUI.GButton", asType: "asButton", ext: "btn_" },
    text: { type: "FairyGUI.GTextField", asType: "asTextField", ext: "txt_" },
    richtext: { type: "FairyGUI.GRichTextField", asType: "asRichTextField", ext: "rtxt_" },
    inputtext: { type: "FairyGUI.GTextInput", asType: "asTextInput", ext: "itxt_" },
    graph: { type: "FairyGUI.GGraph", asType: "asGraph", ext: "graph_" },
    list: { type: "FairyGUI.GList", asType: "asList", ext: "list_" },
    loader: { type: "FairyGUI.GLoader", asType: "asLoader", ext: "loader_" },
    loader3D: { type: "FairyGUI.GLoader3D", asType: "", ext: "loader3d_" },
    Slider: { type: "FairyGUI.GSlider", asType: "asSlider", ext: "slider_" },
    component: { type: "FairyGUI.GComponent", asType: "asCom", ext: "com_" },
    image: { type: "FairyGUI.GImage", asType: "asImage", ext: "img_" },
    group: { type: "FairyGUI.GGroup", asType: "asGroup", ext: "group_" },
    ComboBox: { type: "FairyGUI.GComboBox", asType: "asComboBox", ext: "cmb_" },
    ProgressBar: { type: "FairyGUI.GProgressBar", asType: "asProgress", ext: "pb_" },
    ScrollBar: { type: "FairyGUI.GScrollBar", asType: "", ext: "sb_" },
    Controller: { type: "FairyGUI.Controller", asType: "", ext: "ctrl_" },
    Transition: { type: "FairyGUI.Transition", asType: "", ext: "trans_" },
};

export class MenuDoc_CreateLuaName extends MenuBase {
    protected InitMenuData(): void {
        this.menuData = {
            name: "MenuDoc_CreateLuaName",
            text: "创建Lua名称代码到剪切板",
            atIndex: 0,
            selectCallback: () => this.CallBack()
        };
    }

    protected OnCreate(): void { }

    protected OnDestroy(): void { }

    private CallBack() {
        const { children, controllers, transitions } = FairyEditor.App.activeDoc.content;
        const childCount = children.Count;
        const ctrlCount = controllers.Count;
        const transCount = transitions.items.Count;
        let getStr = "";
        for (let i = 0; i < childCount; i++) {
            const child = children.get_Item(i);
            if (/^n[0-9]+$/g.test(child.name)) continue;
            let type = LuaType2Type[child._objectType];
            if (child instanceof FairyEditor.FComponent) {
                if (LuaType2Type[child.extention?._type])
                    type = LuaType2Type[child.extention?._type];
            }
            getStr += `\t\t\tself.${ type.ext }${ child.name } = self:GetChild("${ child.name }").${ type.asType }\n`;
        }
        for (let i = 0; i < ctrlCount; i++) {
            const ctrl = controllers.get_Item(i);
            let type = LuaType2Type.Controller;
            getStr += `\t\t\tself.${ type.ext }${ ctrl.name } = self:GetController("${ ctrl.name }")\n`;
        }
        for (let i = 0; i < transCount; i++) {
            const trans = transitions.items.get_Item(i);
            let type = LuaType2Type.Transition;
            getStr += `\t\t\tself.${ type.ext }${ trans.name } = self:GetTransition("${ trans.name }")\n`;
        }
        //#region 
        //#endregion

        if (getStr) {
            getStr = "\t\t\t---#region 节点获取\n" + getStr + "\t\t\t---#endregion\n";
            FairyEditor.Clipboard.SetText(getStr);
        }
    }
}
