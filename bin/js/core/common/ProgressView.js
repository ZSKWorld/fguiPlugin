"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressView = void 0;
const BaseClass_1 = require("../libs/BaseClass");
const Const_1 = require("./Const");
class ProgressView extends BaseClass_1.BaseClass {
    static get Inst() { return this._inst || (this._inst = new ProgressView()); }
    constructor() {
        super();
        this.InitComp();
    }
    Show(onCancel) {
        this._progress.value = 0;
        this._txtPro.text = "";
        this.SetTip("");
        this._onCancel = onCancel;
        this._btnSubmit.visible = false;
        this._btnCancel.visible = !!onCancel;
        this.RefreshProgress(0, 1);
        CS.FairyEditor.App.mainView.panel.AddChild(this._panel);
    }
    SetTip(tip) {
        this._txtTip.text = tip;
    }
    RefreshProgress(value, max) {
        this._txtPro.text = `${value}/${max}`;
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
    Destroy() {
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
    InitComp() {
        if (!this._panel) {
            this._panel = CS.FairyGUI.UIPackage.CreateObject(Const_1.PkgCustom, Const_1.PkgCustom_Progress).asCom;
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
    OnSubmit() {
        this.Hide();
    }
    OnCancel() {
        this._onCancel && this._onCancel();
        this._btnSubmit.visible = true;
        this._btnCancel.visible = false;
    }
}
exports.ProgressView = ProgressView;
