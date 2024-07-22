import { FairyEditor, FairyGUI } from "csharp";
import { MenuBase_Main } from "../MenuBase_Main";
import { EditorUtils } from "../../utils/EditorUtils";

export class MenuTest_Main extends MenuBase_Main {
    // private publicAll: FairyGUI.EventListener;
    protected InitMenuData(): void {
        const menuData = this.menuData;
        menuData.text = "测试";
        menuData.subMenuData = [
            {
                text: "全部发布",
                onSelected:()=>this.OnSelected(),
            }
        ]
    }

    protected OnCreate(): void {
        // const publicDialog: FairyEditor.Dialog.DialogBase = new FairyEditor.Dialog["PublishDialog"]();
        // this.publicAll = publicDialog.contentPane.GetChild("publishAll").asButton.onClick;

        // var onClick = EditorUtils.GetFields(this.publicAll);
        // for (let i = 0; i < onClick.Length; i++) {
        //     const element = onClick.get_Item(i);
        //     console.error(element.toString());
        //     const temp = EditorUtils.GetFields(element["GetValue"](this.publicAll));
        //     for (let j = 0; j < temp.Length; j++) {
        //         console.log(temp.get_Item(j).ToString());
                
        //     }
        // }
        
        // publicDialog.Dispose();
    }

    protected OnDestroy(): void {
        
    }

    private OnSelected() {
        console.log("menu main test");
        // this.publicDialog.contentPane.GetChild("publishAll").asButton.FireClick(true, true);
        // this.publicAll.Call();
    }

}