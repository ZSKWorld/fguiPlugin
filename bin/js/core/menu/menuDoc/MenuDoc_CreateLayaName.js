"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuDoc_CreateLayaName = void 0;
const csharp_1 = require("csharp");
const MenuBase_1 = require("../MenuBase");
const LayaType2Type = {
    Button: { type: "fairygui.GButton", asType: "asButton", ext: "btn_" },
    text: { type: "fairygui.GTextField", asType: "asTextField", ext: "tf_" },
    richtext: { type: "fairygui.GRichTextField", asType: "asRichTextField", ext: "rtf_" },
    inputtext: { type: "fairygui.GTextInput", asType: "asTextInput", ext: "txtIpt_" },
    graph: { type: "fairygui.GGraph", asType: "asGraph", ext: "graph_" },
    list: { type: "fairygui.GList", asType: "asList", ext: "list_" },
    loader: { type: "fairygui.GLoader", asType: "asLoader", ext: "loader_" },
    loader3D: { type: "fairygui.GLoader3D", asType: "", ext: "loader3d_" },
    Slider: { type: "fairygui.GSlider", asType: "asSlider", ext: "slider_" },
    component: { type: "fairygui.GComponent", asType: "asCom", ext: "com_" },
    image: { type: "fairygui.GImage", asType: "asImage", ext: "img_" },
    group: { type: "fairygui.GGroup", asType: "asGroup", ext: "group_" },
    ComboBox: { type: "fairygui.GComboBox", asType: "asComboBox", ext: "cmb_" },
    ProgressBar: { type: "fairygui.GProgressBar", asType: "asProgress", ext: "pb_" },
    ScrollBar: { type: "fairygui.GScrollBar", asType: "", ext: "sb_" },
};
class MenuDoc_CreateLayaName extends MenuBase_1.MenuBase {
    InitMenuData() {
        const _this = this;
        this.menuData = {
            name: "MenuDoc_CreateLayaName",
            text: "创建Laya代码到剪切板",
            atIndex: 0,
            selectCallback: () => { _this.CallBack(); }
        };
    }
    OnCreate() { }
    OnDestroy() { }
    CallBack() {
        const target = csharp_1.FairyEditor.App.activeDoc.GetSelection();
        const count = target.Count;
        let getStr = "";
        let defineStr = "";
        if (count) {
            for (let i = 0; i < count; i++) {
                const child = target.get_Item(i);
                const type = LayaType2Type[child.objectType];
                defineStr += `public ${type.ext}${child.name}: ${type.type};\n`;
                getStr += `this.${type.ext}${child.name} = this.me.getChild("${child.name}").${type.asType};\n`;
            }
        }
        if (getStr)
            csharp_1.FairyEditor.Clipboard.SetText(defineStr + getStr);
    }
}
exports.MenuDoc_CreateLayaName = MenuDoc_CreateLayaName;
