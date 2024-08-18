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
        const { children, controllers, transitions } = CS.FairyEditor.App.activeDoc.content;
        const childCount = children.Count;
        for (let i = 0; i < childCount; i++) {
            const child = children.get_Item(i);
            console.log(child.name, child.objectType);
            if (child instanceof CS.FairyEditor.FComponent && child.extention) {
                console.log("---", child.name, child.extention._type);
            }
        }
    }
}
exports.MenuTest_Doc = MenuTest_Doc;
