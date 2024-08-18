import { MenuBase_Doc } from "../MenuBase_Doc";

export class MenuTest_Doc extends MenuBase_Doc {
    protected InitMenuData(): void {
        const menuData = this.menuData;
        menuData.text = "测试";
        menuData.onSelected = () => this.OnSelected();
    }

    protected OnCreate(): void {
    }

    protected OnDestroy(): void {
    }

    private OnSelected() {
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