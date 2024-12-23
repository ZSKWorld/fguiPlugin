import { MenuBase_Doc } from "../MenuBase_Doc";
interface Type2Type {
    type: string;
    asType: string;
    ext: string;
}
const LuaType2Type: { [key: string]: Type2Type } = {
    component: { type: "FairyGUI.GComponent", asType: ".asCom", ext: "com_" },
    Button: { type: "FairyGUI.GButton", asType: ".asButton", ext: "btn_" },
    ComboBox: { type: "FairyGUI.GComboBox", asType: ".asComboBox", ext: "cmb_" },
    Label: { type: "FairyGUI.GLabel", asType: ".asLabel", ext: "label_" },
    ProgressBar: { type: "FairyGUI.GProgressBar", asType: ".asProgress", ext: "pb_" },
    ScrollBar: { type: "FairyGUI.GScrollBar", asType: "", ext: "sb_" },
    Slider: { type: "FairyGUI.GSlider", asType: ".asSlider", ext: "slider_" },
    text: { type: "FairyGUI.GTextField", asType: ".asTextField", ext: "txt_" },
    richtext: { type: "FairyGUI.GRichTextField", asType: ".asRichTextField", ext: "rtxt_" },
    inputtext: { type: "FairyGUI.GTextInput", asType: ".asTextInput", ext: "itxt_" },
    graph: { type: "FairyGUI.GGraph", asType: ".asGraph", ext: "graph_" },
    list: { type: "FairyGUI.GList", asType: ".asList", ext: "list_" },
    loader: { type: "FairyGUI.GLoader", asType: ".asLoader", ext: "loader_" },
    group: { type: "FairyGUI.GGroup", asType: ".asGroup", ext: "group_" },
    loader3D: { type: "FairyGUI.GLoader3D", asType: ".asLoader3D", ext: "loader3d_" },
    image: { type: "FairyGUI.GImage", asType: ".asImage", ext: "img_" },
    Controller: { type: "FairyGUI.Controller", asType: "", ext: "ctrl_" },
    Transition: { type: "FairyGUI.Transition", asType: "", ext: "trans_" },
};

export class MenuDoc_CreateLuaName extends MenuBase_Doc {
    protected InitMenuData(): void {
        const menuData = this.menuData;
        menuData.text = "创建Lua名称代码到剪切板";
        menuData.onSelected = () => this.OnSelected();
    }

    protected OnCreate(): void { }

    protected OnDestroy(): void { }

    private OnSelected() {
        const { children, controllers, transitions } = CS.FairyEditor.App.activeDoc.content;
        const childCount = children.Count;
        const ctrlCount = controllers.Count;
        const transCount = transitions.items.Count;
        let getStr = "";
        for (let i = 0; i < childCount; i++) {
            const child = children.get_Item(i);
            if (/^n[0-9]+$/g.test(child.name)) continue;
            let type = LuaType2Type[child.objectType];
            if (child instanceof CS.FairyEditor.FComponent) {
                if (LuaType2Type[child.extention?._type])
                    type = LuaType2Type[child.extention?._type];
            }
            getStr += `\tself.${ type.ext }${ child.name } = self:GetChild("${ child.name }")${ type.asType }\n`;
        }
        for (let i = 0; i < ctrlCount; i++) {
            const ctrl = controllers.get_Item(i);
            let type = LuaType2Type.Controller;
            getStr += `\tself.${ type.ext }${ ctrl.name } = self:GetController("${ ctrl.name }")\n`;
        }
        for (let i = 0; i < transCount; i++) {
            const trans = transitions.items.get_Item(i);
            let type = LuaType2Type.Transition;
            getStr += `\tself.${ type.ext }${ trans.name } = self:GetTransition("${ trans.name }")\n`;
        }
        //#region
        //#endregion

        if (getStr) {
            getStr = "---#region 节点获取\n" + getStr + "\t---#endregion\n";
            CS.FairyEditor.Clipboard.SetText(getStr);
        }
    }
}
