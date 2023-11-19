"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menu_Test = void 0;
const csharp_1 = require("csharp");
const EditorUtils_1 = require("../utils/EditorUtils");
const MenuBase_1 = require("./MenuBase");
class Menu_Test extends MenuBase_1.MenuBase {
    InitMenuData() {
        this.menuData = {
            text: "测试",
            onSelected: () => this.OnSelected()
        };
    }
    OnCreate() {
    }
    OnDestroy() {
    }
    OnSelected() {
        const pyPath = `python ${EditorUtils_1.EditorUtils.GetPluginRootDir()}/aaa.py`;
        csharp_1.FairyEditor.ProcessUtil.Start("python aaa.py", null, EditorUtils_1.EditorUtils.GetPluginRootDir(), true);
    }
}
exports.Menu_Test = Menu_Test;
