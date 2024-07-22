"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuBase_Main = void 0;
const csharp_1 = require("csharp");
const MenuBase_1 = require("./MenuBase");
/**
 * 以 “主菜单” 做父菜单的菜单，继承该类的菜单都会出现在 “主菜单” 选项中
 * 注意：使用mainMenu做父菜单时，menuData.isSubMenu必须为true
 */
class MenuBase_Main extends MenuBase_1.MenuBase {
    constructor() {
        super(csharp_1.FairyEditor.App.menu);
        this.menuData.isSubMenu = true;
    }
    mainSubMenu(name) {
        return csharp_1.FairyEditor.App.menu.GetSubMenu(name);
    }
}
exports.MenuBase_Main = MenuBase_Main;
