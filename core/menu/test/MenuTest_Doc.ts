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
    }

}