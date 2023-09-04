"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuMain_ImageReference = void 0;
const MenuBase_1 = require("../MenuBase");
class MenuMain_ImageReference extends MenuBase_1.MenuBase {
    InitMenuData() {
        this.menuData = {
            text: "测试",
            selectCallback: () => this.onMenuClick()
        };
    }
    OnCreate() {
    }
    OnDestroy() {
    }
    onMenuClick() {
    }
}
exports.MenuMain_ImageReference = MenuMain_ImageReference;
