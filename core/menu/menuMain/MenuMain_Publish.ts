import { FairyEditor, FairyGUI } from "csharp";
import { CustomSetting } from "../../common/CustomSetting";
import { Tip } from "../../common/Tip";
import { ConfigType, SettingName } from "../../common/Types";
import { EditorUtils } from "../../utils/EditorUtils";
import { MenuBase } from "../MenuBase";

type Partial<T> = { [ P in keyof T ]?: Partial<T[ P ]>; };
type PlatformConfig = { [ key: string ]: { enable: boolean, configFiles: string[] } };

export class MenuMain_Publish extends MenuBase {
    /** 主菜单按钮 */
    private menuBtn: FairyGUI.GButton;
    private platformKeys: string[];
    /** 平台配置文件 */
    private platformCfg: PlatformConfig;
    /** 平台发布设置 */
    private settingsMap: { [ key: string ]: Partial<FairyEditor.GlobalPublishSettings>[] } = {};
    /** 选中的平台 */
    private selectedPlatform: string;
    private lastCfgIndex: number;

    protected InitMenuData(): void {
        this.platformCfg = EditorUtils.GetConfig(ConfigType.PublishSettings, "PlatformConfig");
        if (this.platformCfg) {
            this.platformKeys = Object.keys(this.platformCfg).filter(v =>
                !!this.platformCfg[ v ].enable && this.platformCfg[ v ].configFiles.length > 0);
            this.initSettings();
            this.menuData = {
                text: "未配置的发布平台",
                isSubMenu: true,
                subMenuData: this.platformKeys.map(key => {
                    const configFiles = this.platformCfg[ key ].configFiles;
                    const isSubMenu = configFiles.length > 1;
                    return {
                        name: key,
                        text: key,
                        isSubMenu: isSubMenu,
                        selectCallback: isSubMenu ? ((str) => this.selectedPlatform = str) : ((str) => {
                            this.selectedPlatform = str;
                            this.refreshPublishPlatform(0, true);
                        }),
                        subMenuData: isSubMenu ? configFiles.map((cfg, index) => ({
                            name: index.toString(),
                            text: configFiles[ index ],// + " => " + this.settingsMap[ key ][ index ].path,
                            selectCallback: (str) => this.refreshPublishPlatform(+str, true)
                        })) : null
                    }
                })
            };
        }
    }

    protected OnCreate(): void {
        const list = FairyEditor.App.mainView.panel.GetChild('menuBar').asCom.GetChild('list').asList;
        this.menuBtn = list.GetChildAt(list.numChildren - 1).asButton;
        this.menuBtn.GetChild('title').asTextField.UBBEnabled = true;
        this.selectedPlatform = FairyEditor.App.project.type;

        if (this.settingsMap[ this.selectedPlatform ]) {
            let cfgIndex = CustomSetting.PublishSelectedCfgIndex;
            cfgIndex = Math.min(cfgIndex, this.settingsMap[ this.selectedPlatform ].length - 1);
            this.refreshPublishPlatform(cfgIndex, false);
        }
    }

    protected OnDestroy(): void {
        this.menuBtn = null;
    }

    private initSettings() {
        let errStr = "";
        this.platformKeys.forEach(key => {
            this.platformCfg[ key ].configFiles.forEach(cfgFileName => {
                const setting = EditorUtils.GetConfig(ConfigType.PublishSettings, cfgFileName);
                this.settingsMap[ key ] ||= [];
                this.settingsMap[ key ].push(setting);
                !setting && (errStr += `${ key } 平台 ${ cfgFileName } 配置错误\n`);
            });
        });
        errStr && FairyEditor.App.Alert(errStr + "请检查上述配置文件是否存在！！！");
    }

    private copySetting(target: any, source: any) {
        //C#只读字段，不能更改
        const readOnlyKey = [ "fileName" ];
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                if (readOnlyKey.indexOf(key) >= 0) continue;
                const element = source[ key ];
                if (element != null && key in target) {
                    if (typeof element == "object") this.copySetting(target[ key ], element);
                    else target[ key ] = element;
                }
            }
        }
    }

    /**刷新发布平台 */
    private refreshPublishPlatform(cfgIndex: number, showTip: boolean = true) {
        const newSetting = this.settingsMap[ this.selectedPlatform ][ cfgIndex ];
        if (newSetting) {
            const project = FairyEditor.App.project;
            //设置全局设置并保存
            const globalSetting = project.GetSettings(SettingName.Publish) as FairyEditor.GlobalPublishSettings;
            this.copySetting(globalSetting, newSetting);
            globalSetting.Save();

            //设置项目类型并保存
            project.type = this.selectedPlatform;
            project.Save();

            //设置选择索引并保存
            CustomSetting.PublishSelectedCfgIndex = cfgIndex;
            CustomSetting.Save()
        
            project.allPackages.ForEach(v => v.Open());

            this.lastCfgIndex = cfgIndex;
            let cfgStr = `[color=#ff0000]${ project.type }[/color]`;
            const platformCfg = this.platformCfg[ this.selectedPlatform ];
            if (platformCfg.configFiles.length > 1)
                cfgStr += ` [color=#0000ff]${ platformCfg.configFiles[ cfgIndex ] }[/color]`;
            this.menuBtn.title = `当前发布到 ${ cfgStr }`;
            showTip && Tip.Inst.Show(`已切换发布平台到 ${ cfgStr }`);
        } else {
            cfgIndex = this.lastCfgIndex || 0;
            const cfgName = this.platformCfg[ this.selectedPlatform ].configFiles[ cfgIndex ];
            FairyEditor.App.Alert(`${ this.selectedPlatform } 平台 ${ cfgName } 配置错误，请检查配置文件是否存在`);
        }
        this.refreshMenuChecked(cfgIndex);
    }

    private refreshMenuChecked(cfgIndex: number) {
        const curMenu = this.parentMenu.GetSubMenu(this.menuData.name);
        this.platformKeys.forEach(key => {
            curMenu.SetItemChecked(key, key == this.selectedPlatform);
            const curSubMenu = curMenu.GetSubMenu(key);
            if (this.platformCfg[ key ].configFiles.length > 1) {
                this.platformCfg[ key ].configFiles.forEach((_, index) => {
                    curSubMenu.SetItemChecked(index.toString(), key == this.selectedPlatform && index == cfgIndex)
                });
            }
        });
    }
}