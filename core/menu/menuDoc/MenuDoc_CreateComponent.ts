import { MenuBase_Doc } from "../MenuBase_Doc";

export class MenuDoc_CreateComponent extends MenuBase_Doc {
    protected InitMenuData(): void {
        const menuData = this.menuData;
        menuData.text = "自定义组件";
        menuData.isSubMenu = true;
        const onSelected = (name: string) => this.OnSelected(name);
        menuData.subMenuData = [
            { name: "button", text: "按钮组件", url: "ui://38ft0jfga4q55", onSelected, },
            { name: "list", text: "列表组件", url: "ui://2pshu6oingyqa7iufv", onSelected, },
            { name: "page", text: "分页组件", url: "ui://2pshu6oiau3n5i", onSelected, },
            { name: "enum", text: "枚举组件", url: "ui://2pshu6oiau3nh", onSelected, },
            { name: "text", text: "文本组件", url: "ui://2pshu6oid8p0a7iuft", onSelected, },
            { name: "image", text: "图片组件", url: "ui://2pshu6oioj7qiu9e", onSelected, },
        ];
    }

    protected OnCreate(): void { }

    protected OnDestroy(): void { }

    private OnSelected(name: string) {
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

