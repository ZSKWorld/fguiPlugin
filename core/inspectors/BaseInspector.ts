import { DestroyInstanceClass, ViewChildInit } from "../utils/Decorators";
import { InspectorData } from "./InspectorData";

@DestroyInstanceClass("Dispose")
export abstract class BaseInspector extends CS.FairyEditor.View.PluginInspector {
    protected info: InspectorData;
    public constructor(info: InspectorData) {
        super();
        this.info = info;
        this.panel = CS.FairyGUI.UIPackage.CreateObject(info.PkgName, info.ComponentName).asCom;
        ViewChildInit(this);
        this.updateAction = () => this.OnUpdate();
        this.disposeAction = () => this.OnDestroy();
    }

    Create() {
        const { InspectorName, InspectorTitle, ForObjectType, ShowInSelection, ShowInComponent, ShowInTransition } = this.info;
        CS.FairyEditor.App.inspectorView.AddInspector(() => this, InspectorName, InspectorTitle);
        ShowInSelection && CS.FairyEditor.App.docFactory.ConnectInspector(InspectorName, ForObjectType, false, false);
        ShowInComponent && CS.FairyEditor.App.docFactory.ConnectInspector(InspectorName, ForObjectType, true, false);
        ShowInTransition && CS.FairyEditor.App.docFactory.ConnectInspector(InspectorName, ForObjectType, false, true);
        this.OnCreate();
    }

    protected abstract OnCreate(): void;
    protected abstract OnUpdate(): boolean;
    protected abstract OnDestroy(): void;
}