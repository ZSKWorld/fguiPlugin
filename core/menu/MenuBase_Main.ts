import { FairyEditor } from "csharp";
import { MainMenuType } from "../common/Types";
import { MenuBase } from "./MenuBase";

const mainSubMenu = (name: MainMenuType) => FairyEditor.App.menu.GetSubMenu(name);
export abstract class MenuBase_Main extends MenuBase {
    constructor() {
        super(FairyEditor.App.menu);
    }
}