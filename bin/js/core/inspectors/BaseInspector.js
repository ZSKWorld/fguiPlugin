"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseInspector = void 0;
const Decorators_1 = require("../utils/Decorators");
let BaseInspector = class BaseInspector extends CS.FairyEditor.View.PluginInspector {
    constructor(info) {
        super();
        this.info = info;
        this.panel = CS.FairyGUI.UIPackage.CreateObject(info.PkgName, info.ComponentName).asCom;
        (0, Decorators_1.ViewChildInit)(this);
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
};
exports.BaseInspector = BaseInspector;
exports.BaseInspector = BaseInspector = __decorate([
    (0, Decorators_1.DestroyInstanceClass)("Dispose")
], BaseInspector);
