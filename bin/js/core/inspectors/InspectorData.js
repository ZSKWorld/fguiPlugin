"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InspectorData = void 0;
/**检查器创建数据 */
class InspectorData {
    constructor(PkgName, ComponentName, InspectorName, InspectorTitle, ForObjectType = "mixed" /* ShowObjectType.Mixed */, ShowInSelection = false, ShowInComponent = false, ShowInTransition = false) {
        /**是否选中时组件显示 */
        this.ShowInSelection = false;
        /**是否选中时背景显示 */
        this.ShowInComponent = true;
        /**是否在动效面板显示 */
        this.ShowInTransition = true;
        this.PkgName = PkgName;
        this.ComponentName = ComponentName;
        this.InspectorName = InspectorName;
        this.InspectorTitle = InspectorTitle;
        this.ForObjectType = ForObjectType;
        this.ShowInSelection = ShowInSelection;
        this.ShowInComponent = ShowInComponent;
        this.ShowInTransition = ShowInTransition;
    }
}
exports.InspectorData = InspectorData;
