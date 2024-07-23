"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tip = void 0;
const BaseClass_1 = require("../libs/BaseClass");
const Const_1 = require("./Const");
/** 弹窗提示 */
class Tip extends BaseClass_1.BaseClass {
    static get Inst() { return this._inst || (this._inst = new Tip()); }
    constructor() {
        super();
        this.targetY = 20;
        this.duration = 150;
        this.InitComp();
    }
    Show(msg) {
        clearInterval(this.intervalId);
        this.label.title = msg;
        this.startTime = Date.now();
        this.startY = 22 - this.label.height;
        this.label.y = this.startY;
        this.stayTime = (this.label.height - 13) / 35 * ((this.label.width - 73) / 250 * 1000);
        this.outLabel = true;
        this.intervalId = setInterval(() => {
            const nowTime = Date.now();
            const subTime = nowTime - this.startTime;
            const percent = subTime / this.duration;
            if (this.outLabel) {
                this.label.y = this.startY + (this.targetY - this.startY) * Math.min(percent, 1);
                if (percent >= 1) {
                    if ((subTime - this.duration) > this.stayTime) {
                        this.outLabel = !this.outLabel;
                        this.startTime = nowTime;
                    }
                }
            }
            else {
                this.label.y = this.startY + (this.targetY - this.startY) * (1 - Math.min(percent, 1));
                percent >= 1 && clearInterval(this.intervalId);
            }
        }, 1000 / 60);
        // this.showAni.Play();
    }
    Destroy() {
        clearInterval(this.intervalId);
        if (this.label) {
            this.label.Dispose();
            this.label = null;
        }
    }
    InitComp() {
        if (!this.label) {
            this.label = CS.FairyGUI.UIPackage.CreateObject(Const_1.PkgCustom, Const_1.PkgCustom_Tip).asLabel;
            const main = CS.FairyEditor.App.mainView.panel;
            main.AddChildAt(this.label, 5);
            this.label.touchable = false;
            this.label.SetXY(main.width / 2, -28);
            this.label.AddRelation(main, CS.FairyGUI.RelationType.Center_Center);
        }
    }
}
exports.Tip = Tip;
