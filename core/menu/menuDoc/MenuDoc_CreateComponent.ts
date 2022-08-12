import { MenuBase } from "../MenuBase";

export class MenuDoc_CreateComponent extends MenuBase {
    protected InitMenuData(): void {
        const callback = (name: string) => this.CallBack(name);
        this.menuData = {
            text: "自定义组件",
            isSubMenu: true,
            selectCallback: this.CallBack,
            subMenuData: [
                { name: "button", text: "按钮组件", url: "ui://38ft0jfga4q55", selectCallback: callback, },
                { name: "list", text: "列表组件", url: "ui://2pshu6oingyqa7iufv", selectCallback: callback, },
                { name: "page", text: "分页组件", url: "ui://2pshu6oiau3n5i", selectCallback: callback, },
                { name: "enum", text: "枚举组件", url: "ui://2pshu6oiau3nh", selectCallback: callback, },
                { name: "text", text: "文本组件", url: "ui://2pshu6oid8p0a7iuft", selectCallback: callback, },
                { name: "image", text: "图片组件", url: "ui://2pshu6oioj7qiu9e", selectCallback: callback, },
            ]
        };
    }

    protected OnCreate(): void { }

    protected OnDestroy(): void { }

    private CallBack(name: string) {
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

