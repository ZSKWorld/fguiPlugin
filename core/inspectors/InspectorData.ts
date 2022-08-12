import { ShowObjectType } from "../common/Types";

/**检查器创建数据 */
export class InspectorData {
    /**检查器名称 */
    public InspectorName: string;
    /**包名 */
    public PkgName: string;
    /**包内组件名 */
    public ComponentName: string;
    /**检查器显示标题 */
    public InspectorTitle: string;
    /**显示元件类型 */
    public ForObjectType: ShowObjectType
    /**是否选中时组件显示 */
    public ShowInSelection = false;
    /**是否选中时背景显示 */
    public ShowInComponent = true;
    /**是否在动效面板显示 */
    public ShowInTransition = true;

    public constructor(
        PkgName: string,
        ComponentName: string,
        InspectorName: string,
        InspectorTitle: string,
        ForObjectType: ShowObjectType = ShowObjectType.Mixed,
        ShowInSelection: boolean = false,
        ShowInComponent: boolean = false,
        ShowInTransition: boolean = false
    ) {
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