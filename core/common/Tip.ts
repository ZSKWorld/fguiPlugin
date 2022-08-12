import { FairyEditor, FairyGUI } from "csharp";
import { BaseClass } from "../libs/BaseClass";
import { PkgCustom, PkgCustom_Tip } from "./Const";
/** 弹窗提示 */
export class Tip extends BaseClass {
    private static _inst: Tip;
    public static get Inst() { return Tip._inst || (Tip._inst = new Tip()); }
    private readonly targetY = 20;
    private readonly duration: number = 150;
    private label: FairyGUI.GLabel;
    private intervalId: number;
    private startTime: number;
    private stayTime: number;
    private outLabel: boolean;
    private startY: number;

    private constructor() {
        super();
        this.InitComp();
    }

    public Show(msg: string) {
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

    protected Destroy(): void {
        clearInterval(this.intervalId);
        if (this.label) {
            this.label.Dispose();
            this.label = null;
        }
    }

    private InitComp() {
        if (!this.label) {
            this.label = FairyGUI.UIPackage.CreateObject(PkgCustom, PkgCustom_Tip).asLabel;

            const main = FairyEditor.App.mainView.panel;
            main.AddChildAt(this.label, 5);

            this.label.touchable = false;
            this.label.SetXY(main.width / 2, -28);
            this.label.AddRelation(main, FairyGUI.RelationType.Center_Center);
        }
    }

}