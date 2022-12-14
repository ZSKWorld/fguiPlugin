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
    /** 发布的平台 */
    private publicPlatform: string;
    /** 发布的平台配置索引 */
    private publicCfgIndex: number;

    protected InitMenuData(): void {
        this.platformCfg = EditorUtils.GetConfig(ConfigType.PublishSettings, "PlatformConfig");
        if (this.platformCfg) {
            this.platformKeys = Object.keys(this.platformCfg).filter(v =>
                !!this.platformCfg[ v ].enable && this.platformCfg[ v ].configFiles.length > 0);
            this.InitSettings();
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
                        selectCallback: isSubMenu ? () => this.RefreshMenuChecked() : (name) => this.SetPulibcPlatormCfg(name, 0, true),
                        subMenuData: isSubMenu ? configFiles.map((cfg, index) => ({
                            name: index.toString(),
                            text: cfg,
                            selectCallback: (name) => this.SetPulibcPlatormCfg(key, +name, true)
                        })) : null
                    }
                })
            };
        } else {
            this.menuData = {
                text: "未配置的发布平台",
                isSubMenu: true,
            }
        }
    }

    protected OnCreate(): void {
        const list = FairyEditor.App.mainView.panel.GetChild('menuBar').asCom.GetChild('list').asList;
        this.menuBtn = list.GetChildAt(list.numChildren - 1).asButton;
        this.menuBtn.GetChild('title').asTextField.UBBEnabled = true;
        if (!this.SetPulibcPlatormCfg(FairyEditor.App.project.type, CustomSetting.PublishSelectedCfgIndex, false)) {
            try {
                let cfgIndex = -1;
                Object.keys(this.settingsMap).forEach(key => {
                    cfgIndex = this.settingsMap[ key ].findIndex(cfg => !!cfg);
                    if (cfgIndex >= 0) {
                        this.SetPulibcPlatormCfg(key, cfgIndex, false);
                        throw new Error();
                    }
                });
                if (cfgIndex == -1) FairyEditor.App.Alert(`暂无可用发布配置，使用默认发布配置`);
            } catch (error) { }
        }
    }

    protected OnDestroy(): void {
        this.menuBtn = null;
    }

    private InitSettings() {
        let errStr = "";
        this.platformKeys.forEach(key => {
            this.settingsMap[ key ] ||= [];
            this.platformCfg[ key ].configFiles.forEach((cfgFileName, cfgIndex) => {
                const setting = EditorUtils.GetConfig(ConfigType.PublishSettings, cfgFileName);
                this.settingsMap[ key ].push(setting);
                !setting && (errStr += `${ key } 平台 ${ cfgFileName } 配置文件不存在\n`);
            });
        });
        errStr && FairyEditor.App.Alert(errStr);
    }

    private CopySetting(target: any, source: any) {
        //C#只读字段，不能更改
        const readOnlyKey = [ "fileName" ];
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                if (readOnlyKey.indexOf(key) >= 0) continue;
                const element = source[ key ];
                if (element != null && key in target) {
                    if (typeof element == "object") this.CopySetting(target[ key ], element);
                    else target[ key ] = element;
                }
            }
        }
    }

    /** 设置发布平台配置 */
    private SetPulibcPlatormCfg(platform: string, cfgIndex: number, showTip = true) {
        let result = false;
        const platformMap = this.settingsMap[ platform ];
        if (platformMap) {
            const setting = platformMap[ cfgIndex ];
            if (setting) {
                result = true;
                if (this.publicPlatform != platform || this.publicCfgIndex != cfgIndex) {
                    this.publicPlatform = platform;
                    this.publicCfgIndex = cfgIndex;
                    this.RefreshPublishPlatform();
                }
                let tipStr = `[color=#ff0000]${ platform }[/color]`;
                const platformCfg = this.platformCfg[ platform ];
                if (platformCfg.configFiles.length > 1)
                    tipStr += ` [color=#0000ff]${ platformCfg.configFiles[ cfgIndex ] }[/color]`;
                this.menuBtn.title = `当前发布到 ${ tipStr }`;
                showTip && Tip.Inst.Show(`已切换发布平台到 ${ tipStr }`);
            } else {
                const cfgName = this.platformCfg[ platform ].configFiles[ cfgIndex ];
                showTip && FairyEditor.App.Alert(`${ platform } 平台 ${ cfgName } 配置文件不存在`);
            }
        } else {
            showTip && FairyEditor.App.Alert(`未知的发布平台 => ${ platform }`);
        }
        this.RefreshMenuChecked();
        return result;
    }

    /**刷新发布平台 */
    private RefreshPublishPlatform() {
        const { settingsMap, publicPlatform, publicCfgIndex } = this;
        const setting = settingsMap[ publicPlatform ][ publicCfgIndex ];
        const project = FairyEditor.App.project;
        //设置全局设置并保存
        const globalSetting = project.GetSettings(SettingName.Publish) as FairyEditor.GlobalPublishSettings;
        this.CopySetting(globalSetting, setting);
        globalSetting.Save();

        //设置项目类型并保存
        project.type = publicPlatform;
        project.Save();

        //设置选择索引并保存
        CustomSetting.PublishSelectedCfgIndex = publicCfgIndex;
        CustomSetting.Save()

        project.allPackages.ForEach(v => v.Open());
    }

    private RefreshMenuChecked() {
        const { parentMenu, menuData, platformKeys, publicPlatform, platformCfg, publicCfgIndex } = this;
        const curMenu = parentMenu.GetSubMenu(menuData.name);
        platformKeys.forEach(key => {
            curMenu.SetItemChecked(key, key == publicPlatform);
            if (platformCfg[ key ].configFiles.length > 1) {
                const curSubMenu = curMenu.GetSubMenu(key);
                platformCfg[ key ].configFiles.forEach((_, index) => {
                    curSubMenu.SetItemChecked(index.toString(), key == publicPlatform && index == publicCfgIndex);
                });
            }
        });
    }
}