import { FairyEditor } from "csharp";
import { MenuBase } from "./MenuBase";

/** 以 “资源库菜单” 做父菜单的菜单，继承该类的菜单都会出现在 “资源库菜单” 选项中 */
export abstract class MenuBase_Lib extends MenuBase {
    private static atIndex = 0;

    constructor() {
        super(FairyEditor.App.libView.contextMenu);
        this.menuData.atIndex = MenuBase_Lib.atIndex++;
    }

    static AddSeperator() {
        FairyEditor.App.libView.contextMenu.AddSeperator(MenuBase_Lib.atIndex);
    }
}