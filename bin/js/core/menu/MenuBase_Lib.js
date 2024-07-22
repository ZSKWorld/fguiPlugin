"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuBase_Lib = void 0;
const csharp_1 = require("csharp");
const MenuBase_1 = require("./MenuBase");
class MenuBase_Lib extends MenuBase_1.MenuBase {
    constructor() {
        super(csharp_1.FairyEditor.App.libView.contextMenu);
    }
}
exports.MenuBase_Lib = MenuBase_Lib;
