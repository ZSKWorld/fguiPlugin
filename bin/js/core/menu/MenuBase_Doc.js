"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuBase_Doc = void 0;
const csharp_1 = require("csharp");
const MenuBase_1 = require("./MenuBase");
class MenuBase_Doc extends MenuBase_1.MenuBase {
    constructor() {
        super(csharp_1.FairyEditor.App.docFactory.contextMenu);
    }
}
exports.MenuBase_Doc = MenuBase_Doc;
