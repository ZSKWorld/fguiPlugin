"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuTest_Lib = void 0;
const MenuBase_Lib_1 = require("../MenuBase_Lib");
class MenuTest_Lib extends MenuBase_Lib_1.MenuBase_Lib {
    InitMenuData() {
        const menuData = this.menuData;
        menuData.text = "测试";
        menuData.onSelected = () => this.OnSelected();
    }
    OnCreate() {
    }
    OnDestroy() {
    }
    OnSelected() {
        console.log("menu lib test");
        // const pyPath = `python ${ EditorUtils.GetPluginRootDir() }/aaa.py`;
        // FairyEditor.ProcessUtil.Start("python aaa.py", null, EditorUtils.GetPluginRootDir(), true);
    }
}
exports.MenuTest_Lib = MenuTest_Lib;
