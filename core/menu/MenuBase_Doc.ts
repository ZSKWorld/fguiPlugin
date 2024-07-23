import { MenuBase } from "./MenuBase";

/** 以 “编辑区菜单” 做父菜单的菜单，继承该类的菜单都会出现在 “编辑区菜单” 选项中 */
export abstract class MenuBase_Doc extends MenuBase {
    private static atIndex = 0;

    constructor() {
        super(CS.FairyEditor.App.docFactory.contextMenu);
        this.menuData.atIndex = MenuBase_Doc.atIndex++;
    }

    static AddSeperator() {
        CS.FairyEditor.App.docFactory.contextMenu.AddSeperator(MenuBase_Doc.atIndex);
    }
}