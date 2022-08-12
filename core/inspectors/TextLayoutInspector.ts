import { FairyEditor, FairyGUI } from "csharp";
import { InspectorName, ShowObjectType } from "../common/Types";
import { ViewChild } from "../utils/Decorators";
import {BaseInspector} from "./BaseInspector";
const { App, FRelationType } = FairyEditor;

export class TextLayoutInspector extends BaseInspector {
    @ViewChild("TextArea")
    private textArea: FairyGUI.GLabel;
    @ViewChild("BtnSubmit")
    private btnSubmit: FairyGUI.GButton;

    protected OnCreate(): void {
        this.btnSubmit.onClick.Add(() => this.OnBtnSubmitClick());
    }

    protected OnUpdate(): boolean {
        const type = App.activeDoc.inspectingObjectType;
        const show = type == ShowObjectType.Text || type == ShowObjectType.RichText;
        if (show) {
            this.textArea.title = this.TransformLine(App.activeDoc.inspectingTarget.text);
        }
        return show;
    }

    protected OnDestroy(): void {
        this.textArea = null;
        this.btnSubmit = null;
    }

    private OnBtnSubmitClick() {
        App.activeDoc.inspectingTarget.relations.AddItem(App.activeDoc.content, FRelationType.Size);
        App.activeDoc.inspectingTarget.text = this.TransformLine(this.textArea.title);
        const type = App.activeDoc.inspectingObjectType;
        App.inspectorView.GetInspector(type == ShowObjectType.Text ? InspectorName.Text : InspectorName.RichText).UpdateUI();
    }

    private TransformLine(str: string) {
        let result = str;
        if (result) {
            const arr = result.split("\n");
            let strLen: number;
            let tempArr: any[];
            const resultArr: any[][] = [];
            arr.forEach((v, index) => {
                strLen = v.length;
                for (let i = 0; i < strLen; i++) {
                    resultArr[ i ] = resultArr[ i ] || [];
                    tempArr = resultArr[ i ];
                    this.FillChar(tempArr, index);
                    tempArr.push(v[ i ]);
                }
            });
            result = "";
            resultArr.forEach((v) => {
                result += v.join("") + "\n";
            });
        }
        return result.trim();
    }

    private FillChar(arr: any[], length: number) {
        if (arr.length < length) {
            for (let i = arr.length; i < length; i++) {
                arr.push("\t");
            }
        }
    }

}