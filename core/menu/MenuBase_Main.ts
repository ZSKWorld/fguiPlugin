import { FairyEditor } from "csharp";
import { MainMenuType } from "../common/Types";
import { MenuBase } from "./MenuBase";

/**
 * 以 “主菜单” 做父菜单的菜单，继承该类的菜单都会出现在 “主菜单” 选项中
 * 注意：使用mainMenu做父菜单时，menuData.isSubMenu必须为true
 */
export abstract class MenuBase_Main extends MenuBase {
    
    constructor() {
        super(FairyEditor.App.menu);
        this.menuData.isSubMenu = true;
    }

    protected mainSubMenu(name: MainMenuType) {
        return FairyEditor.App.menu.GetSubMenu(name);
    }
}