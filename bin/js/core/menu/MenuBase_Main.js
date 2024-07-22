"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuBase_Main = void 0;
const csharp_1 = require("csharp");
const MenuBase_1 = require("./MenuBase");
const mainSubMenu = (name) => csharp_1.FairyEditor.App.menu.GetSubMenu(name);
class MenuBase_Main extends MenuBase_1.MenuBase {
    constructor() {
        super(csharp_1.FairyEditor.App.menu);
    }
}
exports.MenuBase_Main = MenuBase_Main;
