import { MenuBase_Doc } from "../MenuBase_Doc";
interface Type2Type {
    type: string;
    asType: string;
    ext: string;
}
const LayaType2Type: { [key: string]: Type2Type } = {
    component: { type: "fairygui.GComponent", asType: ".asCom", ext: "com_" },
    Button: { type: "fairygui.GButton", asType: ".asButton", ext: "btn_" },
    ComboBox: { type: "fairygui.GComboBox", asType: ".asComboBox", ext: "cmb_" },
    Label: { type: "fairygui.GLabel", asType: ".asLabel", ext: "label_" },
    ProgressBar: { type: "fairygui.GProgressBar", asType: ".asProgress", ext: "pb_" },
    ScrollBar: { type: "fairygui.GScrollBar", asType: "", ext: "sb_" },
    Slider: { type: "fairygui.GSlider", asType: ".asSlider", ext: "slider_" },
    text: { type: "fairygui.GTextField", asType: ".asTextField", ext: "txt_" },
    richtext: { type: "fairygui.GRichTextField", asType: ".asRichTextField", ext: "rtxt_" },
    inputtext: { type: "fairygui.GTextInput", asType: ".asTextInput", ext: "itxt_" },
    graph: { type: "fairygui.GGraph", asType: ".asGraph", ext: "graph_" },
    list: { type: "fairygui.GList", asType: ".asList", ext: "list_" },
    loader: { type: "fairygui.GLoader", asType: ".asLoader", ext: "loader_" },
    group: { type: "fairygui.GGroup", asType: ".asGroup", ext: "group_" },
    loader3D: { type: "fairygui.GLoader3D", asType: "", ext: "loader3d_" },
    image: { type: "fairygui.GImage", asType: ".asImage", ext: "img_" },
    Controller: { type: "fairygui.Controller", asType: "", ext: "ctrl_" },
    Transition: { type: "fairygui.Transition", asType: "", ext: "trans_" },
};

export class MenuDoc_CreateLayaName extends MenuBase_Doc {
    protected InitMenuData(): void {
        const menuData = this.menuData;
        menuData.text = "创建Laya代码到剪切板";
        menuData.onSelected = () => this.OnSelected();
    }

    protected OnCreate(): void { }

    protected OnDestroy(): void { }

    private OnSelected() {
        const { children, controllers, transitions } = CS.FairyEditor.App.activeDoc.content;
        const childCount = children.Count;
        const ctrlCount = controllers.Count;
        const transCount = transitions.items.Count;
        let getStr = "";
        let defineStr = "";
        for (let i = 0; i < childCount; i++) {
            const child = children.get_Item(i);
            if (/^n[0-9]+$/g.test(child.name)) continue;
            let type = LayaType2Type[child.objectType];
            if (child instanceof CS.FairyEditor.FComponent) {
                if (LayaType2Type[child.extention?._type])
                    type = LayaType2Type[child.extention?._type];
            }
            defineStr += `\tpublic ${ type.ext }${ child.name }: ${ type.type };\n`;
            getStr += `\tthis.${ type.ext }${ child.name } = me.getChild("${ child.name }")${ type.asType };\n`;
        }
        for (let i = 0; i < ctrlCount; i++) {
            const ctrl = controllers.get_Item(i);
            let type = LayaType2Type.Controller;
            defineStr += `\tpublic ${ type.ext }${ ctrl.name }: ${ type.type };\n`;
            getStr += `\tthis.${ type.ext }${ ctrl.name } = me.getController("${ ctrl.name }");\n`;
        }
        for (let i = 0; i < transCount; i++) {
            const trans = transitions.items.get_Item(i);
            let type = LayaType2Type.Transition;
            defineStr += `\tpublic ${ type.ext }${ trans.name }: ${ type.type };\n`;
            getStr += `\tthis.${ type.ext }${ trans.name } = me.getTransition("${ trans.name }");\n`;
        }
        //#region
        //#endregion

        if (getStr) {
            defineStr = "//#region 节点\n" + defineStr + "\t//#endregion\n";
            getStr = "\t//#region 节点获取\n\tconst me = this.me;\n" + getStr + "\t//#endregion\n";
            CS.FairyEditor.Clipboard.SetText(defineStr + getStr);
        }
    }
}

