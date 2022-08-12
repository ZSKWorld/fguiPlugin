import { FairyEditor, FairyGUI } from "csharp";
import { MenuBase } from "./MenuBase";

export class Menu_Test extends MenuBase {
    protected InitMenuData(): void {
        this.menuData = {
            text: "测试",
            selectCallback: () => this.CallBack()
        };
    }

    protected OnCreate(): void {
    }

    protected OnDestroy(): void {
    }

    private CallBack() { }

}