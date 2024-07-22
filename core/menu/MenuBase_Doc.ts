import { FairyEditor } from "csharp";
import { MenuBase } from "./MenuBase";

export abstract class MenuBase_Doc extends MenuBase {
    constructor() {
        super(FairyEditor.App.docFactory.contextMenu);
    }
}