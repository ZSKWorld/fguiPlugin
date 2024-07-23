"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuBase_Lib = void 0;
const MenuBase_1 = require("./MenuBase");
/** 以 “资源库菜单” 做父菜单的菜单，继承该类的菜单都会出现在 “资源库菜单” 选项中 */
class MenuBase_Lib extends MenuBase_1.MenuBase {
    constructor() {
        super(CS.FairyEditor.App.libView.contextMenu);
        this.menuData.atIndex = MenuBase_Lib.atIndex++;
    }
    static AddSeperator() {
        CS.FairyEditor.App.libView.contextMenu.AddSeperator(MenuBase_Lib.atIndex);
    }
}
exports.MenuBase_Lib = MenuBase_Lib;
MenuBase_Lib.atIndex = 0;
