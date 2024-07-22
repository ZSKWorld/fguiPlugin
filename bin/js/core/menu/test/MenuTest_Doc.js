"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuTest_Doc = void 0;
const MenuBase_Doc_1 = require("../MenuBase_Doc");
class MenuTest_Doc extends MenuBase_Doc_1.MenuBase_Doc {
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
        console.log("menu doc test");
    }
}
exports.MenuTest_Doc = MenuTest_Doc;
