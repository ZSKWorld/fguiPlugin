"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSetting = void 0;
const csharp_1 = require("csharp");
const EditorUtils_1 = require("../utils/EditorUtils");
class CustomSetting {
    static get SettingName() { return "CustomSetting"; }
    ;
    static Init() {
        const cfg = EditorUtils_1.EditorUtils.GetConfig("" /* ConfigType.None */, this.SettingName);
        if (cfg) {
            this.PublishSelectedCfgIndex = cfg.PublishSelectedCfgIndex;
        }
    }
    static Save() {
        const obj = {};
        Object.keys(CustomSetting).forEach(key => obj[key] = CustomSetting[key]);
        csharp_1.System.IO.File.WriteAllText(EditorUtils_1.EditorUtils.GetConfigPath("" /* ConfigType.None */, this.SettingName), JSON.stringify(obj));
    }
}
CustomSetting.PublishSelectedCfgIndex = 0;
exports.CustomSetting = CustomSetting;
