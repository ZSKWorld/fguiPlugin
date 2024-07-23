"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuBase_Doc = void 0;
const MenuBase_1 = require("./MenuBase");
/** 以 “编辑区菜单” 做父菜单的菜单，继承该类的菜单都会出现在 “编辑区菜单” 选项中 */
class MenuBase_Doc extends MenuBase_1.MenuBase {
    constructor() {
        super(CS.FairyEditor.App.docFactory.contextMenu);
        this.menuData.atIndex = MenuBase_Doc.atIndex++;
    }
    static AddSeperator() {
        CS.FairyEditor.App.docFactory.contextMenu.AddSeperator(MenuBase_Doc.atIndex);
    }
}
exports.MenuBase_Doc = MenuBase_Doc;
MenuBase_Doc.atIndex = 0;
