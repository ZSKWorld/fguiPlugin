"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuDoc_CreateLuaName = void 0;
const csharp_1 = require("csharp");
const MenuBase_1 = require("../MenuBase");
class MenuDoc_CreateLuaName extends MenuBase_1.MenuBase {
    constructor() {
        super(...arguments);
        this.typeToType = {
            Button: "FairyGUI.GButton",
            text: "FairyGUI.GTextField",
            richtext: "FairyGUI.GRichTextField",
            inputtext: "FairyGUI.GTextInput",
            graph: "FairyGUI.GGraph",
            list: "FairyGUI.GList",
            loader: "FairyGUI.GLoader",
            loader3D: "FairyGUI.GLoader3D",
            Slider: "FairyGUI.GSlider",
            component: "FairyGUI.GComponent",
            image: "FairyGUI.GImage",
            group: "FairyGUI.GGroup",
            ComboBox: "FairyGUI.GComboBox",
            ProgressBar: "FairyGUI.GProgressBar",
            ScrollBar: "FairyGUI.GScrollBar",
        };
    }
    InitMenuData() {
        this.menuData = { text: "创建Lua名称代码到剪切板", selectCallback: () => this.CallBack() };
    }
    OnCreate() { }
    OnDestroy() { }
    CallBack() {
        var _a;
        const target = csharp_1.FairyEditor.App.activeDoc.GetSelection();
        const count = target.Count;
        const ctrlCount = csharp_1.FairyEditor.App.activeDoc.content.controllers.Count;
        let result = "";
        if (count) {
            // ---@type CS.FairyGUI.GTextField
            // self.TxtName = com:GetChild("n10")
            for (let i = 0; i < count; i++) {
                const child = target.get_Item(i);
                if (child instanceof csharp_1.FairyEditor.FComponent && ((_a = child.extention) === null || _a === void 0 ? void 0 : _a._type) == "Button" /* ShowObjectType.Button */) {
                    result += `---@type CommonBtnView\n`
                        + `self.${child.name} = self:AddView(com:GetChild("${child.name}"),CommonBtnView.Create())\n`;
                }
                else {
                    result += `---@type CS.${this.typeToType[child.objectType]}\nself.${child.name} = com:GetChild("${child.name}")\n`;
                }
            }
        }
        else if (ctrlCount > 0) {
            for (let i = 0; i < ctrlCount; i++) {
                const child = csharp_1.FairyEditor.App.activeDoc.content.controllers.get_Item(i);
                result += `---@type CS.FairyGUI.Controller\n`;
                result += `self.Ctrl_${child.name} = com:GetController("${child.name}")\n`;
            }
        }
        if (result)
            csharp_1.FairyEditor.Clipboard.SetText(result);
    }
}
exports.MenuDoc_CreateLuaName = MenuDoc_CreateLuaName;
