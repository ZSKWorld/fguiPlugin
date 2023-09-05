"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuDoc_CreateComponent = void 0;
const MenuBase_1 = require("../MenuBase");
class MenuDoc_CreateComponent extends MenuBase_1.MenuBase {
    InitMenuData() {
        const onSelected = (name) => this.OnSelected(name);
        this.menuData = {
            text: "自定义组件",
            isSubMenu: true,
            onSelected: this.OnSelected,
            subMenuData: [
                { name: "button", text: "按钮组件", url: "ui://38ft0jfga4q55", onSelected, },
                { name: "list", text: "列表组件", url: "ui://2pshu6oingyqa7iufv", onSelected, },
                { name: "page", text: "分页组件", url: "ui://2pshu6oiau3n5i", onSelected, },
                { name: "enum", text: "枚举组件", url: "ui://2pshu6oiau3nh", onSelected, },
                { name: "text", text: "文本组件", url: "ui://2pshu6oid8p0a7iuft", onSelected, },
                { name: "image", text: "图片组件", url: "ui://2pshu6oioj7qiu9e", onSelected, },
            ]
        };
    }
    OnCreate() { }
    OnDestroy() { }
    OnSelected(name) {
        // let url = "";
        // const getUrl = function (data: IMenuData) {
        //     let temp = "";
        //     if (data.childs) {
        //         for (let i = 0; i < data.childs.length; i++) {
        //             const element = data.childs[i];
        //             if (element.childs) {
        //                 temp = getUrl(element);
        //             } else {
        //                 temp = element.name == name ? element.url : null;
        //             }
        //             if (temp) break;
        //         }
        //     } else {
        //         temp = data.name == name ? data.url : null;
        //     }
        //     return temp;
        // }
        // url = getUrl(menuData);
        // url && EditorUtils.AddComponent(url);
        // FairyEditor.App.activeDoc.SetModified(true);
    }
}
exports.MenuDoc_CreateComponent = MenuDoc_CreateComponent;
