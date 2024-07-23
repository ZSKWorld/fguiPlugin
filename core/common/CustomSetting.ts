import { EditorUtils } from "../utils/EditorUtils";
import { ConfigType } from "./Types";

export class CustomSetting {
    private static get SettingName() { return "CustomSetting"; };
    public static PublishSelectedCfgIndex: number = 0;

    public static Init() {
        const cfg = EditorUtils.GetConfig(ConfigType.None, this.SettingName);
        if (cfg) {
            this.PublishSelectedCfgIndex = cfg.PublishSelectedCfgIndex;
        }
    }

    public static Save() {
        const obj = {};
        Object.keys(CustomSetting).forEach(key => obj[key] = CustomSetting[key]);
        CS.System.IO.File.WriteAllText(EditorUtils.GetConfigPath(ConfigType.None, this.SettingName), JSON.stringify(obj));
    }
}