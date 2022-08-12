"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menu_Test = void 0;
const MenuBase_1 = require("./MenuBase");
class Menu_Test extends MenuBase_1.MenuBase {
    InitMenuData() {
        this.menuData = {
            text: "测试",
            selectCallback: () => this.CallBack()
        };
    }
    OnCreate() {
    }
    OnDestroy() {
    }
    CallBack() { }
}
exports.Menu_Test = Menu_Test;
