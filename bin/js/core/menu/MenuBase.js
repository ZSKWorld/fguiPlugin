"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuBase = void 0;
const BaseClass_1 = require("../libs/BaseClass");
const EditorUtils_1 = require("../utils/EditorUtils");
/**
 * 菜单基类
 */
class MenuBase extends BaseClass_1.BaseClass {
    constructor(parentMenu) {
        super();
        this.parentMenu = parentMenu;
        this.menuData = { text: "undefined", name: this["__proto__"].constructor.name };
    }
    Create() {
        this.InitMenuData();
        EditorUtils_1.EditorUtils.CreateMenu(this.menuData, this.parentMenu);
        this.OnCreate();
    }
    Destroy() {
        this.parentMenu.RemoveItem(this.menuData.name);
        this.OnDestroy();
    }
}
exports.MenuBase = MenuBase;
