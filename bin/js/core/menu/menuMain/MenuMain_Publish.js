"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuMain_Publish = void 0;
const csharp_1 = require("csharp");
const CustomSetting_1 = require("../../common/CustomSetting");
const Tip_1 = require("../../common/Tip");
const EditorUtils_1 = require("../../utils/EditorUtils");
const MenuBase_1 = require("../MenuBase");
class MenuMain_Publish extends MenuBase_1.MenuBase {
    constructor() {
        super(...arguments);
        /** 平台发布设置 */
        this.settingsMap = {};
    }
    InitMenuData() {
        this.platformCfg = EditorUtils_1.EditorUtils.GetConfig("publishSettings" /* ConfigType.PublishSettings */, "PlatformConfig");
        if (this.platformCfg) {
            this.platformKeys = Object.keys(this.platformCfg).filter(v => !!this.platformCfg[v].enable && this.platformCfg[v].configFiles.length > 0);
            this.InitSettings();
            this.menuData = {
                text: "未配置的发布平台",
                isSubMenu: true,
                subMenuData: this.platformKeys.map(key => {
                    const configFiles = this.platformCfg[key].configFiles;
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
                    };
                })
            };
        }
        else {
            this.menuData = {
                text: "未配置的发布平台",
                isSubMenu: true,
            };
        }
    }
    OnCreate() {
        const list = csharp_1.FairyEditor.App.mainView.panel.GetChild('menuBar').asCom.GetChild('list').asList;
        this.menuBtn = list.GetChildAt(list.numChildren - 1).asButton;
        this.menuBtn.GetChild('title').asTextField.UBBEnabled = true;
        if (!this.SetPulibcPlatormCfg(csharp_1.FairyEditor.App.project.type, CustomSetting_1.CustomSetting.PublishSelectedCfgIndex, false)) {
            try {
                let cfgIndex = -1;
                Object.keys(this.settingsMap).forEach(key => {
                    cfgIndex = this.settingsMap[key].findIndex(cfg => !!cfg);
                    if (cfgIndex >= 0) {
                        this.SetPulibcPlatormCfg(key, cfgIndex, false);
                        throw new Error();
                    }
                });
                if (cfgIndex == -1)
                    csharp_1.FairyEditor.App.Alert(`暂无可用发布配置，使用默认发布配置`);
            }
            catch (error) { }
        }
    }
    OnDestroy() {
        this.menuBtn = null;
    }
    InitSettings() {
        let errStr = "";
        this.platformKeys.forEach(key => {
            var _a;
            (_a = this.settingsMap)[key] || (_a[key] = []);
            this.platformCfg[key].configFiles.forEach((cfgFileName, cfgIndex) => {
                const setting = EditorUtils_1.EditorUtils.GetConfig("publishSettings" /* ConfigType.PublishSettings */, cfgFileName);
                this.settingsMap[key].push(setting);
                !setting && (errStr += `${key} 平台 ${cfgFileName} 配置文件不存在\n`);
            });
        });
        errStr && csharp_1.FairyEditor.App.Alert(errStr);
    }
    CopySetting(target, source) {
        //C#只读字段，不能更改
        const readOnlyKey = ["fileName"];
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                if (readOnlyKey.indexOf(key) >= 0)
                    continue;
                const element = source[key];
                if (element != null && key in target) {
                    if (typeof element == "object")
                        this.CopySetting(target[key], element);
                    else
                        target[key] = element;
                }
            }
        }
    }
    /** 设置发布平台配置 */
    SetPulibcPlatormCfg(platform, cfgIndex, showTip = true) {
        let result = false;
        const platformMap = this.settingsMap[platform];
        if (platformMap) {
            const setting = platformMap[cfgIndex];
            if (setting) {
                result = true;
                if (this.publicPlatform != platform || this.publicCfgIndex != cfgIndex) {
                    this.publicPlatform = platform;
                    this.publicCfgIndex = cfgIndex;
                    this.RefreshPublishPlatform();
                }
                let tipStr = `[color=#ff0000]${platform}[/color]`;
                const platformCfg = this.platformCfg[platform];
                if (platformCfg.configFiles.length > 1)
                    tipStr += ` [color=#0000ff]${platformCfg.configFiles[cfgIndex]}[/color]`;
                this.menuBtn.title = `当前发布到 ${tipStr}`;
                showTip && Tip_1.Tip.Inst.Show(`已切换发布平台到 ${tipStr}`);
            }
            else {
                const cfgName = this.platformCfg[platform].configFiles[cfgIndex];
                showTip && csharp_1.FairyEditor.App.Alert(`${platform} 平台 ${cfgName} 配置文件不存在`);
            }
        }
        else {
            showTip && csharp_1.FairyEditor.App.Alert(`未知的发布平台 => ${platform}`);
        }
        this.RefreshMenuChecked();
        return result;
    }
    /**刷新发布平台 */
    RefreshPublishPlatform() {
        const { settingsMap, publicPlatform, publicCfgIndex } = this;
        const setting = settingsMap[publicPlatform][publicCfgIndex];
        const project = csharp_1.FairyEditor.App.project;
        //设置全局设置并保存
        const globalSetting = project.GetSettings("Publish" /* SettingName.Publish */);
        this.CopySetting(globalSetting, setting);
        globalSetting.Save();
        //设置项目类型并保存
        project.type = publicPlatform;
        project.Save();
        //设置选择索引并保存
        CustomSetting_1.CustomSetting.PublishSelectedCfgIndex = publicCfgIndex;
        CustomSetting_1.CustomSetting.Save();
        project.allPackages.ForEach(v => v.Open());
    }
    RefreshMenuChecked() {
        const { parentMenu, menuData, platformKeys, publicPlatform, platformCfg, publicCfgIndex } = this;
        const curMenu = parentMenu.GetSubMenu(menuData.name);
        platformKeys.forEach(key => {
            curMenu.SetItemChecked(key, key == publicPlatform);
            if (platformCfg[key].configFiles.length > 1) {
                const curSubMenu = curMenu.GetSubMenu(key);
                platformCfg[key].configFiles.forEach((_, index) => {
                    curSubMenu.SetItemChecked(index.toString(), key == publicPlatform && index == publicCfgIndex);
                });
            }
        });
    }
}
exports.MenuMain_Publish = MenuMain_Publish;
