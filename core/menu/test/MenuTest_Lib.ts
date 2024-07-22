import { MenuBase_Lib } from "../MenuBase_Lib";

export class MenuTest_Lib extends MenuBase_Lib {
    protected InitMenuData(): void {
        const menuData = this.menuData;
        menuData.text = "测试";
        menuData.onSelected = () => this.OnSelected();
    }

    protected OnCreate(): void {
    }

    protected OnDestroy(): void {
    }

    private OnSelected() {
        console.log("menu lib test");
        // const pyPath = `python ${ EditorUtils.GetPluginRootDir() }/aaa.py`;
        // FairyEditor.ProcessUtil.Start("python aaa.py", null, EditorUtils.GetPluginRootDir(), true);
    }

}