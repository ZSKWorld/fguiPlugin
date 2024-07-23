import { BaseClass } from "../libs/BaseClass";
import { PkgCustom, PkgCustom_Progress } from "./Const";

export class ProgressView extends BaseClass {
    private static _inst: ProgressView;
    public static get Inst() { return this._inst || (this._inst = new ProgressView()); }
    private _panel: CS.FairyGUI.GComponent;
    private _progress: CS.FairyGUI.GProgressBar;
    private _btnSubmit: CS.FairyGUI.GButton;
    private _btnCancel: CS.FairyGUI.GButton;
    private _txtPro: CS.FairyGUI.GTextField;
    private _txtTip: CS.FairyGUI.GTextField;
    private _onCancel: Function;

    private constructor() {
        super();
        this.InitComp();
    }

    Show(onCancel?: Function) {
        this._progress.value = 0;
        this._txtPro.text = "";
        this.SetTip("");
        this._onCancel = onCancel;
        this._btnSubmit.visible = false;
        this._btnCancel.visible = !!onCancel;
        this.RefreshProgress(0, 1);
        CS.FairyEditor.App.mainView.panel.AddChild(this._panel);
    }

    SetTip(tip: string) {
        this._txtTip.text = tip;
    }

    RefreshProgress(value: number, max: number) {
        this._txtPro.text = `${ value }/${ max }`;
        const pro = value / max;
        this._progress.value = Math.floor(pro * 1000);
        if (pro >= 1) {
            this._btnSubmit.visible = true;
        }
    }

    Hide() {
        this._onCancel = null;
        this._panel.RemoveFromParent();
    }

    protected Destroy(): void {
        if (this._panel) {
            this._panel.Dispose();
        }
        this._panel = null;
        this._progress = null;
        this._btnSubmit = null;
        this._btnCancel = null;
        this._txtPro = null;
        this._txtTip = null;
        this._onCancel = null;
    }

    private InitComp() {
        if (!this._panel) {
            this._panel = CS.FairyGUI.UIPackage.CreateObject(PkgCustom, PkgCustom_Progress).asCom;

            const main = CS.FairyEditor.App.mainView.panel;

            this._panel.SetSize(main.width, main.height);
            this._panel.AddRelation(main, CS.FairyGUI.RelationType.Size);

            this._progress = this._panel.GetChild("progress").asProgress;
            this._btnSubmit = this._panel.GetChild("submit").asButton;
            this._btnCancel = this._panel.GetChild("cancel").asButton;
            this._txtPro = this._panel.GetChild("txtPro").asTextField;
            this._txtTip = this._panel.GetChild("txtTip").asTextField;

            this._btnSubmit.onClick.Add(() => this.OnSubmit());
            this._btnCancel.onClick.Add(() => this.OnCancel());
        }
    }

    private OnSubmit() {
        this.Hide();
    }

    private OnCancel() {
        this._onCancel && this._onCancel();
        this._btnSubmit.visible = true;
        this._btnCancel.visible = false;
    }

}