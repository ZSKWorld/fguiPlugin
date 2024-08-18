"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuDoc_CreateLuaName = void 0;
const MenuBase_Doc_1 = require("../MenuBase_Doc");
const LuaType2Type = {
    component: { type: "FairyGUI.GComponent", asType: "asCom", ext: "com_" },
    Button: { type: "FairyGUI.GButton", asType: "asButton", ext: "btn_" },
    ComboBox: { type: "FairyGUI.GComboBox", asType: "asComboBox", ext: "cmb_" },
    Label: { type: "FairyGUI.GLabel", asType: "asLabel", ext: "label_" },
    ProgressBar: { type: "FairyGUI.GProgressBar", asType: "asProgress", ext: "pb_" },
    ScrollBar: { type: "FairyGUI.GScrollBar", asType: "", ext: "sb_" },
    Slider: { type: "FairyGUI.GSlider", asType: "asSlider", ext: "slider_" },
    text: { type: "FairyGUI.GTextField", asType: "asTextField", ext: "txt_" },
    richtext: { type: "FairyGUI.GRichTextField", asType: "asRichTextField", ext: "rtxt_" },
    inputtext: { type: "FairyGUI.GTextInput", asType: "asTextInput", ext: "itxt_" },
    graph: { type: "FairyGUI.GGraph", asType: "asGraph", ext: "graph_" },
    list: { type: "FairyGUI.GList", asType: "asList", ext: "list_" },
    loader: { type: "FairyGUI.GLoader", asType: "asLoader", ext: "loader_" },
    group: { type: "FairyGUI.GGroup", asType: "asGroup", ext: "group_" },
    loader3D: { type: "FairyGUI.GLoader3D", asType: "", ext: "loader3d_" },
    image: { type: "FairyGUI.GImage", asType: "asImage", ext: "img_" },
    Controller: { type: "FairyGUI.Controller", asType: "", ext: "ctrl_" },
    Transition: { type: "FairyGUI.Transition", asType: "", ext: "trans_" },
};
class MenuDoc_CreateLuaName extends MenuBase_Doc_1.MenuBase_Doc {
    InitMenuData() {
        const menuData = this.menuData;
        menuData.text = "创建Lua名称代码到剪切板";
        menuData.onSelected = () => this.OnSelected();
    }
    OnCreate() { }
    OnDestroy() { }
    OnSelected() {
        var _a, _b;
        const { children, controllers, transitions } = CS.FairyEditor.App.activeDoc.content;
        const childCount = children.Count;
        const ctrlCount = controllers.Count;
        const transCount = transitions.items.Count;
        let getStr = "";
        for (let i = 0; i < childCount; i++) {
            const child = children.get_Item(i);
            if (/^n[0-9]+$/g.test(child.name))
                continue;
            let type = LuaType2Type[child.objectType];
            if (child instanceof CS.FairyEditor.FComponent) {
                if (LuaType2Type[(_a = child.extention) === null || _a === void 0 ? void 0 : _a._type])
                    type = LuaType2Type[(_b = child.extention) === null || _b === void 0 ? void 0 : _b._type];
            }
            getStr += `\t\t\tself.${type.ext}${child.name} = self:GetChild("${child.name}").${type.asType}\n`;
        }
        for (let i = 0; i < ctrlCount; i++) {
            const ctrl = controllers.get_Item(i);
            let type = LuaType2Type.Controller;
            getStr += `\t\t\tself.${type.ext}${ctrl.name} = self:GetController("${ctrl.name}")\n`;
        }
        for (let i = 0; i < transCount; i++) {
            const trans = transitions.items.get_Item(i);
            let type = LuaType2Type.Transition;
            getStr += `\t\t\tself.${type.ext}${trans.name} = self:GetTransition("${trans.name}")\n`;
        }
        //#region
        //#endregion
        if (getStr) {
            getStr = "\t\t\t---#region 节点获取\n" + getStr + "\t\t\t---#endregion\n";
            CS.FairyEditor.Clipboard.SetText(getStr);
        }
    }
}
exports.MenuDoc_CreateLuaName = MenuDoc_CreateLuaName;
