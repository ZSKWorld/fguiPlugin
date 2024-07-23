import { Tip } from "../common/Tip";
import { IComponentCustomData, InspectorName } from "../common/Types";
import { ViewChild } from "../utils/Decorators";
import { BaseInspector } from "./BaseInspector";
const App = CS.FairyEditor.App;

export class BtnInspector extends BaseInspector {
    @ViewChild("BtnFunc")
    private btnFunc: CS.FairyGUI.GButton;
    @ViewChild("InputFunc")
    private inputFunc: CS.FairyGUI.GLabel;
    @ViewChild("BtnTip")
    private btnTip: CS.FairyGUI.GButton;
    @ViewChild("InputTip")
    private inputTip: CS.FairyGUI.GLabel;
    @ViewChild("BtnHoldPress")
    private btnHoldPress: CS.FairyGUI.GButton;
    @ViewChild("InputHoldPress")
    private inputHoldPress: CS.FairyGUI.GLabel;

    /**自定义的json数据 */
    private customJsonData: IComponentCustomData;

    protected OnCreate(): void {
        this.panel.GetController("c1").selectedIndex = 0;
        this.btnFunc.onClick.Add((context) => this.OnBtnFuncClick(context));
        this.btnTip.onClick.Add((context) => this.OnBtnTipClick(context));
        this.btnHoldPress.onClick.Add((context) => this.OnBtnHoldPressClick(context));
    }

    protected OnUpdate(): boolean {
        const data = App.activeDoc.inspectingTarget.customData;
        this.customJsonData = data ? JSON.parse(data) : null;
        this.inputFunc.title = this.customJsonData?.funcId?.toString() || "";
        this.inputTip.title = this.customJsonData?.tipType || "";
        this.inputHoldPress.title = this.customJsonData?.holdPress || "0";
        return App.activeDoc.GetSelection().Count <= 1;
    }

    protected OnDestroy() {
        this.btnFunc = null;
        this.inputFunc = null;
        this.btnTip = null;
        this.inputTip = null;
        this.btnHoldPress = null;
        this.inputHoldPress = null;
    }

    private OnBtnFuncClick(context: CS.FairyGUI.EventContext) {
        if (this.inputFunc.title) {
            let funcId = Number(this.inputFunc.title);
            if (isNaN(funcId)) return Tip.Inst.Show("必须纯数字");
            this.customJsonData = this.customJsonData || {};
            this.customJsonData.funcId = Number(this.inputFunc.title);
        }
        else if (this.customJsonData) {
            delete this.customJsonData.funcId;
        } else return;
        this.SetCustomData();
    }

    private OnBtnTipClick(context: CS.FairyGUI.EventContext) {
        if (this.inputTip.title) {
            this.customJsonData = this.customJsonData || {};
            this.customJsonData.tipType = this.inputTip.title;
        }
        else if (this.customJsonData) {
            delete this.customJsonData.tipType;
        } else return;
        this.SetCustomData();
    }

    private OnBtnHoldPressClick(context: CS.FairyGUI.EventContext) {
        let text = Number(this.inputHoldPress.title)
        if (text) {
            this.customJsonData = this.customJsonData || {};
            this.customJsonData.holdPress = text.toString();
        } else if (this.customJsonData) {
            delete this.customJsonData.holdPress;
        } else return;
        this.SetCustomData();
    }

    private SetCustomData() {
        const data = JSON.stringify(this.customJsonData);
        App.activeDoc.inspectingTarget.customData = data == "{}" ? null : data;
        App.inspectorView.Refresh(InspectorName.Etc);
        App.inspectorView.Refresh(InspectorName.Custom_ComInspector);
        App.activeDoc.SetModified(true);
    }
}