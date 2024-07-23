import { IMenuData } from "../common/Types";
import { BaseClass } from "../libs/BaseClass";
import { EditorUtils } from "../utils/EditorUtils";

/**
 * 菜单基类
 */
export abstract class MenuBase extends BaseClass {
    /** 菜单数据，name属性一般不需要手动设置，默认根据类名作为name */
    protected menuData: IMenuData;
    /** 父菜单，现在的菜单都是附加在已有的菜单上的 */
    protected parentMenu: CS.FairyEditor.Component.IMenu;

    constructor(parentMenu: CS.FairyEditor.Component.IMenu) {
        super();
        this.parentMenu = parentMenu;
        this.menuData = { text: "undefined", name: this["__proto__"].constructor.name };
    }

    Create() {
        this.InitMenuData();
        EditorUtils.CreateMenu(this.menuData, this.parentMenu);
        this.OnCreate();
    }

    protected Destroy() {
        this.parentMenu.RemoveItem(this.menuData.name);
        this.OnDestroy();
    }

    /**初始化菜单数据 */
    protected abstract InitMenuData(): void;

    /**菜单创建完后执行 */
    protected abstract OnCreate(): void;

    protected abstract OnDestroy(): void;

}
