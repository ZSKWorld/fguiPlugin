"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuMain_Publish = void 0;
const CustomSetting_1 = require("../../common/CustomSetting");
const Tip_1 = require("../../common/Tip");
const EditorUtils_1 = require("../../utils/EditorUtils");
const MenuBase_Main_1 = require("../MenuBase_Main");
class MenuMain_Publish extends MenuBase_Main_1.MenuBase_Main {
    InitMenuData() {
        this.platformCfg = EditorUtils_1.EditorUtils.GetConfig("publishSettings" /* ConfigType.PublishSettings */, "PlatformConfig");
        if (this.platformCfg) {
            this.platformKeys = Object.keys(this.platformCfg).filter(v => !!this.platformCfg[v].enable && this.platformCfg[v].configFiles.length > 0);
            this.InitSettings();
            const menuData = this.menuData;
            menuData.text = `当前发布到 [color=#ff0000]${CS.FairyEditor.App.project.type}[/color]`;
            menuData.subMenuData = this.platformKeys.map(key => {
                const configFiles = this.platformCfg[key].configFiles;
                const isSubMenu = configFiles.length > 1;
                return {
                    name: key,
                    text: key,
                    isSubMenu: isSubMenu,
                    onSelected: isSubMenu
                        ? (str) => this.TryChangePlatform(this.selectedPlatform, this.selectedIndex)
                        : (str) => this.TryChangePlatform(str, 0),
                    subMenuData: isSubMenu ? configFiles.map((cfg, index) => ({
                        name: index.toString(),
                        text: configFiles[index],
                        onSelected: (str) => this.TryChangePlatform(key, +str)
                    })) : null
                };
            });
        }
    }
    OnCreate() {
        const list = CS.FairyEditor.App.mainView.panel.GetChild('menuBar').asCom.GetChild('list').asList;
        this.menuBtn = list.GetChildAt(list.numChildren - 1).asButton;
        this.menuBtn.GetChild('title').asTextField.UBBEnabled = true;
        this.selectedPlatform = CS.FairyEditor.App.project.type;
        this.selectedIndex = 0;
        if (this.settingsMap[this.selectedPlatform]) {
            let cfgIndex = CustomSetting_1.CustomSetting.PublishSelectedCfgIndex;
            cfgIndex = Math.max(0, Math.min(cfgIndex, this.settingsMap[this.selectedPlatform].length - 1));
            this.selectedIndex = cfgIndex;
            this.RefreshPublishPlatform(false);
        }
    }
    OnDestroy() {
        this.menuBtn = null;
    }
    InitSettings() {
        this.settingsMap = {};
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
        errStr && CS.FairyEditor.App.Alert(errStr + "请检查上述配置文件是否存在或配置数据是否正确！！！");
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
    TryChangePlatform(platform, cfgIndex) {
        if (this.selectedPlatform == platform && this.selectedIndex == cfgIndex) {
            this.RefreshMenuChecked();
        }
        else {
            const newSetting = this.settingsMap[platform][cfgIndex];
            if (newSetting) {
                this.selectedPlatform = platform;
                this.selectedIndex = cfgIndex;
                this.RefreshPublishPlatform(true);
            }
            else {
                this.RefreshMenuChecked();
                const cfgName = this.platformCfg[platform].configFiles[cfgIndex];
                CS.FairyEditor.App.Alert(`${platform} 平台 ${cfgName} 配置错误\n请检查该配置文件是否存在或配置数据是否正确！！！`);
            }
        }
    }
    /**刷新发布平台 */
    RefreshPublishPlatform(showTip = true) {
        const newSetting = this.settingsMap[this.selectedPlatform][this.selectedIndex];
        //设置全局设置并保存
        const globalSetting = CS.FairyEditor.App.project.GetSettings("Publish" /* SettingName.Publish */);
        this.CopySetting(globalSetting, newSetting);
        globalSetting.Save();
        //设置项目类型并保存
        CS.FairyEditor.App.project.type = this.selectedPlatform;
        CS.FairyEditor.App.project.Save();
        //设置选择索引并保存
        CustomSetting_1.CustomSetting.PublishSelectedCfgIndex = this.selectedIndex;
        CustomSetting_1.CustomSetting.Save();
        //刷新package包发布设置。包设置居然是一开始就设置好的，不是发布时候才使用全局进行配置的，所以要刷新一下
        //没找到刷新包设置的API，只有Open才能刷新，Open刷新的时候编辑区会闪一下，问题不大
        CS.FairyEditor.App.project.allPackages.ForEach(v => v.Open());
        this.RefreshMenuChecked();
        let cfgStr = `[color=#ff0000]${CS.FairyEditor.App.project.type}[/color]`;
        const platformCfg = this.platformCfg[this.selectedPlatform];
        if (platformCfg.configFiles.length > 1)
            cfgStr += ` [color=#0000ff]${platformCfg.configFiles[this.selectedIndex]}[/color]`;
        this.menuBtn.title = `当前发布到 ${cfgStr}`;
        showTip && Tip_1.Tip.Inst.Show(`已切换发布平台到 ${cfgStr}`);
    }
    RefreshMenuChecked() {
        const curMenu = this.parentMenu.GetSubMenu(this.menuData.name);
        this.platformKeys.forEach(key => {
            curMenu.SetItemChecked(key, key == this.selectedPlatform);
            const curSubMenu = curMenu.GetSubMenu(key);
            if (this.platformCfg[key].configFiles.length > 1) {
                this.platformCfg[key].configFiles.forEach((_, index) => {
                    curSubMenu.SetItemChecked(index.toString(), key == this.selectedPlatform && index == this.selectedIndex);
                });
            }
        });
    }
}
exports.MenuMain_Publish = MenuMain_Publish;
