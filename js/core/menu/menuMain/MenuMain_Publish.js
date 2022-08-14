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
            this.initSettings();
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
                        selectCallback: isSubMenu ? ((str) => this.selectedPlatform = str) : ((str) => {
                            this.selectedPlatform = str;
                            this.refreshPublishPlatform(0, true);
                        }),
                        subMenuData: isSubMenu ? configFiles.map((cfg, index) => ({
                            name: index.toString(),
                            text: configFiles[index],
                            selectCallback: (str) => this.refreshPublishPlatform(+str, true)
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
        this.selectedPlatform = csharp_1.FairyEditor.App.project.type;
        if (this.settingsMap[this.selectedPlatform]) {
            let cfgIndex = CustomSetting_1.CustomSetting.PublishSelectedCfgIndex;
            cfgIndex = Math.min(cfgIndex, this.settingsMap[this.selectedPlatform].length - 1);
            this.refreshPublishPlatform(cfgIndex, false);
        }
    }
    OnDestroy() {
        this.menuBtn = null;
    }
    initSettings() {
        let errStr = "";
        this.platformKeys.forEach(key => {
            this.platformCfg[key].configFiles.forEach(cfgFileName => {
                var _a;
                const setting = EditorUtils_1.EditorUtils.GetConfig("publishSettings" /* ConfigType.PublishSettings */, cfgFileName);
                (_a = this.settingsMap)[key] || (_a[key] = []);
                this.settingsMap[key].push(setting);
                !setting && (errStr += `${key} 平台 ${cfgFileName} 配置错误\n`);
            });
        });
        errStr && csharp_1.FairyEditor.App.Alert(errStr + "请检查上述配置文件是否存在！！！");
    }
    copySetting(target, source) {
        //C#只读字段，不能更改
        const readOnlyKey = ["fileName"];
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                if (readOnlyKey.indexOf(key) >= 0)
                    continue;
                const element = source[key];
                if (element != null && key in target) {
                    if (typeof element == "object")
                        this.copySetting(target[key], element);
                    else
                        target[key] = element;
                }
            }
        }
    }
    /**刷新发布平台 */
    refreshPublishPlatform(cfgIndex, showTip = true) {
        const newSetting = this.settingsMap[this.selectedPlatform][cfgIndex];
        if (newSetting) {
            const project = csharp_1.FairyEditor.App.project;
            //设置全局设置并保存
            const globalSetting = project.GetSettings("Publish" /* SettingName.Publish */);
            this.copySetting(globalSetting, newSetting);
            globalSetting.Save();
            //设置项目类型并保存
            project.type = this.selectedPlatform;
            project.Save();
            //设置选择索引并保存
            CustomSetting_1.CustomSetting.PublishSelectedCfgIndex = cfgIndex;
            CustomSetting_1.CustomSetting.Save();
            project.allPackages.ForEach(v => v.Open());
            this.lastCfgIndex = cfgIndex;
            let cfgStr = `[color=#ff0000]${project.type}[/color]`;
            const platformCfg = this.platformCfg[this.selectedPlatform];
            if (platformCfg.configFiles.length > 1)
                cfgStr += ` [color=#0000ff]${platformCfg.configFiles[cfgIndex]}[/color]`;
            this.menuBtn.title = `当前发布到 ${cfgStr}`;
            showTip && Tip_1.Tip.Inst.Show(`已切换发布平台到 ${cfgStr}`);
        }
        else {
            cfgIndex = this.lastCfgIndex || 0;
            const cfgName = this.platformCfg[this.selectedPlatform].configFiles[cfgIndex];
            csharp_1.FairyEditor.App.Alert(`${this.selectedPlatform} 平台 ${cfgName} 配置错误，请检查配置文件是否存在`);
        }
        this.refreshMenuChecked(cfgIndex);
    }
    refreshMenuChecked(cfgIndex) {
        const curMenu = this.parentMenu.GetSubMenu(this.menuData.name);
        this.platformKeys.forEach(key => {
            curMenu.SetItemChecked(key, key == this.selectedPlatform);
            const curSubMenu = curMenu.GetSubMenu(key);
            if (this.platformCfg[key].configFiles.length > 1) {
                this.platformCfg[key].configFiles.forEach((_, index) => {
                    curSubMenu.SetItemChecked(index.toString(), key == this.selectedPlatform && index == cfgIndex);
                });
            }
        });
    }
}
exports.MenuMain_Publish = MenuMain_Publish;
