import { FairyEditor } from "csharp";
import { MenuBase } from "./MenuBase";

export abstract class MenuBase_Lib extends MenuBase {
    constructor() {
        super(FairyEditor.App.libView.contextMenu);
    }
}