import { FairyEditor } from "csharp";
import { MenuBase } from "../MenuBase";

export class MenuMain_ImageReference extends MenuBase {
    private _query: FairyEditor.DependencyQuery;
    protected InitMenuData(): void {
        this.menuData = {
            text: "测试",
            selectCallback: () => this.onMenuClick()
        };
    }
    protected OnCreate(): void {

    }
    protected OnDestroy(): void {

    }

    private onMenuClick() {

    }
}