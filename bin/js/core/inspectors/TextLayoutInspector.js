"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextLayoutInspector = void 0;
const csharp_1 = require("csharp");
const Decorators_1 = require("../utils/Decorators");
const BaseInspector_1 = require("./BaseInspector");
const { App, FRelationType } = csharp_1.FairyEditor;
class TextLayoutInspector extends BaseInspector_1.BaseInspector {
    OnCreate() {
        this.btnSubmit.onClick.Add(() => this.OnBtnSubmitClick());
    }
    OnUpdate() {
        const type = App.activeDoc.inspectingObjectType;
        const show = type == "text" /* ShowObjectType.Text */ || type == "richtext" /* ShowObjectType.RichText */;
        if (show) {
            this.textArea.title = this.TransformLine(App.activeDoc.inspectingTarget.text);
        }
        return show;
    }
    OnDestroy() {
        this.textArea = null;
        this.btnSubmit = null;
    }
    OnBtnSubmitClick() {
        App.activeDoc.inspectingTarget.relations.AddItem(App.activeDoc.content, FRelationType.Size);
        App.activeDoc.inspectingTarget.text = this.TransformLine(this.textArea.title);
        const type = App.activeDoc.inspectingObjectType;
        App.inspectorView.GetInspector(type == "text" /* ShowObjectType.Text */ ? "text" /* InspectorName.Text */ : "richtext" /* InspectorName.RichText */).UpdateUI();
    }
    TransformLine(str) {
        let result = str;
        if (result) {
            const arr = result.split("\n");
            let strLen;
            let tempArr;
            const resultArr = [];
            arr.forEach((v, index) => {
                strLen = v.length;
                for (let i = 0; i < strLen; i++) {
                    resultArr[i] = resultArr[i] || [];
                    tempArr = resultArr[i];
                    this.FillChar(tempArr, index);
                    tempArr.push(v[i]);
                }
            });
            result = "";
            resultArr.forEach((v) => {
                result += v.join("") + "\n";
            });
        }
        return result.trim();
    }
    FillChar(arr, length) {
        if (arr.length < length) {
            for (let i = arr.length; i < length; i++) {
                arr.push("\t");
            }
        }
    }
}
__decorate([
    (0, Decorators_1.ViewChild)("TextArea")
], TextLayoutInspector.prototype, "textArea", void 0);
__decorate([
    (0, Decorators_1.ViewChild)("BtnSubmit")
], TextLayoutInspector.prototype, "btnSubmit", void 0);
exports.TextLayoutInspector = TextLayoutInspector;
