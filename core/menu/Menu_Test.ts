import { FairyEditor } from "csharp";
import { EditorUtils } from "../utils/EditorUtils";
import { MenuBase } from "./MenuBase";

export class Menu_Test extends MenuBase {
    protected InitMenuData(): void {
        this.menuData = {
            text: "测试",
            onSelected: () => this.OnSelected()
        };
    }

    protected OnCreate(): void {
    }

    protected OnDestroy(): void {
    }

    private OnSelected() {
        const pyPath = `python ${ EditorUtils.GetPluginRootDir() }/aaa.py`;
        FairyEditor.ProcessUtil.Start("python aaa.py", null, EditorUtils.GetPluginRootDir(), true);
    }

}