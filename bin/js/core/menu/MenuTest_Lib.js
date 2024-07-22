"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuTest_Lib = void 0;
const csharp_1 = require("csharp");
const EditorUtils_1 = require("../utils/EditorUtils");
const MenuBase_Lib_1 = require("./MenuBase_Lib");
class MenuTest_Lib extends MenuBase_Lib_1.MenuBase_Lib {
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
exports.MenuTest_Lib = MenuTest_Lib;
