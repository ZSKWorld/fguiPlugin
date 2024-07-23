"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComInspector = void 0;
const Decorators_1 = require("../utils/Decorators");
const BaseInspector_1 = require("./BaseInspector");
const App = CS.FairyEditor.App;
class ComInspector extends BaseInspector_1.BaseInspector {
    OnCreate() {
        this.panel.GetController("c1").selectedIndex = 1;
        // this.inputEffectKey.GetTextField().asTextInput.onChanged.Add(new FairyGUI.EventCallback0(()=>{
        //     console.log(this.inputEffectKey.title);
        // }));
        this.btnEffectAdd.onClick.Add((context) => this.OnBtnEffectAddClick(context));
        this.btnEffectRemove.onClick.Add((context) => this.OnBtnEffectRemoveClick(context));
    }
    OnUpdate() {
        let data = "";
        let selectCount = App.activeDoc.GetSelection().Count;
        if (selectCount == 0)
            data = App.activeDoc.content.remark;
        else {
            data = App.activeDoc.inspectingTarget.customData;
        }
        this.customJsonData = data ? JSON.parse(data) : null;
        this.inputEffectKey.title = "";
        this.inputEffectValue.title = "";
        return selectCount <= 1;
    }
    OnDestroy() {
        this.btnEffectAdd = null;
        this.btnEffectRemove = null;
        this.inputEffectKey = null;
        this.inputEffectValue = null;
    }
    OnBtnEffectAddClick(context) {
        let key = this.inputEffectKey.title.trim();
        let value = this.inputEffectValue.title.trim();
        if (!key || !value)
            return;
        this.customJsonData = this.customJsonData || {};
        this.customJsonData.effect = this.customJsonData.effect || {};
        this.customJsonData.effect[key] = value;
        this.SetCustomData();
    }
    OnBtnEffectRemoveClick(context) {
        if (!this.customJsonData.effect)
            return;
        let key = this.inputEffectKey.title.trim();
        delete this.customJsonData.effect[key];
        if (Object.keys(this.customJsonData.effect).length == 0) {
            delete this.customJsonData.effect;
        }
        this.SetCustomData();
    }
    SetCustomData() {
        const data = JSON.stringify(this.customJsonData);
        if (App.activeDoc.GetSelection().Count == 0) {
            App.activeDoc.content.remark = data == "{}" ? null : data;
            App.inspectorView.Refresh("comEtc" /* InspectorName.ComEtc */);
        }
        else {
            App.activeDoc.inspectingTarget.customData = data == "{}" ? null : data;
            App.inspectorView.Refresh("etc" /* InspectorName.Etc */);
        }
        App.inspectorView.Refresh("BtnInspector" /* InspectorName.Custom_BtnInspector */);
        App.activeDoc.SetModified(true);
    }
}
exports.ComInspector = ComInspector;
__decorate([
    (0, Decorators_1.ViewChild)("BtnEffectAdd")
], ComInspector.prototype, "btnEffectAdd", void 0);
__decorate([
    (0, Decorators_1.ViewChild)("BtnEffectRemove")
], ComInspector.prototype, "btnEffectRemove", void 0);
__decorate([
    (0, Decorators_1.ViewChild)("InputEffectKey")
], ComInspector.prototype, "inputEffectKey", void 0);
__decorate([
    (0, Decorators_1.ViewChild)("InputEffectValue")
], ComInspector.prototype, "inputEffectValue", void 0);
