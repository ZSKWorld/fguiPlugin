"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onPublishStart = onPublishStart;
exports.onPublish = onPublish;
exports.onPublishEnd = onPublishEnd;
exports.onDestroy = onDestroy;
const csharp_1 = require("csharp");
const Const_1 = require("./core/common/Const");
const CustomSetting_1 = require("./core/common/CustomSetting");
const BaseInspector_1 = require("./core/inspectors/BaseInspector");
const BtnInspector_1 = require("./core/inspectors/BtnInspector");
const ComInspector_1 = require("./core/inspectors/ComInspector");
const InspectorData_1 = require("./core/inspectors/InspectorData");
const TextLayoutInspector_1 = require("./core/inspectors/TextLayoutInspector");
const BaseClass_1 = require("./core/libs/BaseClass");
const GenCode_TS_XiaoYanDemo_1 = require("./core/libs/GenCode_TS_XiaoYanDemo");
const MenuDoc_CreateComponent_1 = require("./core/menu/menuDoc/MenuDoc_CreateComponent");
const MenuDoc_CreateLayaName_1 = require("./core/menu/menuDoc/MenuDoc_CreateLayaName");
const MenuDoc_CreateLuaName_1 = require("./core/menu/menuDoc/MenuDoc_CreateLuaName");
const MenuDoc_CreateRelation_1 = require("./core/menu/menuDoc/MenuDoc_CreateRelation");
const MenuLib_CreateController_1 = require("./core/menu/menuLib/MenuLib_CreateController");
const MenuMain_ImageReference_1 = require("./core/menu/menuMain/MenuMain_ImageReference");
const MenuMain_Publish_1 = require("./core/menu/menuMain/MenuMain_Publish");
const MenuTest_Doc_1 = require("./core/menu/test/MenuTest_Doc");
const MenuTest_Lib_1 = require("./core/menu/test/MenuTest_Lib");
const MenuTest_Main_1 = require("./core/menu/test/MenuTest_Main");
const EditorUtils_1 = require("./core/utils/EditorUtils");
const MenuBase_Doc_1 = require("./core/menu/MenuBase_Doc");
const MenuBase_Lib_1 = require("./core/menu/MenuBase_Lib");
/** 加载插件UI包 */
csharp_1.FairyEditor.App.pluginManager.LoadUIPackage(EditorUtils_1.EditorUtils.GetPackagePath(Const_1.PkgCustom));
CustomSetting_1.CustomSetting.Init();
[
    //编辑区菜单
    new MenuDoc_CreateRelation_1.MenuDoc_CreateRelation(),
    new MenuDoc_CreateLuaName_1.MenuDoc_CreateLuaName(),
    new MenuDoc_CreateLayaName_1.MenuDoc_CreateLayaName(),
    new MenuDoc_CreateComponent_1.MenuDoc_CreateComponent(),
    //资源库菜单
    new MenuLib_CreateController_1.MenuLib_CreateController(),
    //主菜单
    new MenuMain_Publish_1.MenuMain_Publish(),
    new MenuMain_ImageReference_1.MenuMain_ImageReference(),
    //测试用例
    new MenuTest_Doc_1.MenuTest_Doc(),
    new MenuTest_Lib_1.MenuTest_Lib(),
    new MenuTest_Main_1.MenuTest_Main(),
    //检查器
    new BtnInspector_1.BtnInspector(new InspectorData_1.InspectorData(Const_1.PkgCustom, Const_1.PkgCustom_Btn, "BtnInspector" /* InspectorName.Custom_BtnInspector */, "按钮自定义数据", "Button" /* ShowObjectType.Button */, true)),
    new ComInspector_1.ComInspector(new InspectorData_1.InspectorData(Const_1.PkgCustom, Const_1.PkgCustom_Btn, "ComInspector" /* InspectorName.Custom_ComInspector */, "组件自定义数据", "component" /* ShowObjectType.Component */, true, true)),
    new TextLayoutInspector_1.TextLayoutInspector(new InspectorData_1.InspectorData(Const_1.PkgCustom, Const_1.PkgCustom_Text, "TextInspector", "文本横竖排", "mixed" /* ShowObjectType.Mixed */, true)),
].forEach(v => v.Create());
MenuBase_Doc_1.MenuBase_Doc.AddSeperator();
MenuBase_Lib_1.MenuBase_Lib.AddSeperator();
function onPublishStart() {
    console.log("[color=#00ff00]on publish start[/color]");
}
//自定义发布代码
function onPublish(handler) {
    if (!handler.genCode)
        return;
    console.log("[color=#ffff00]on publish code[/color] => [u][b]" + handler.pkg.name + "[/b][/u]");
    handler.genCode = false; //prevent default output
    (0, GenCode_TS_XiaoYanDemo_1.genCode_TS_XiaoYanDemo)(handler); //do it myself
}
function onPublishEnd() {
    console.log("[color=#00ff00]on publish end[/color]");
}
function onDestroy() {
    BaseClass_1.BaseClass[Const_1.DestroyInstanceMethodName]();
    BaseInspector_1.BaseInspector[Const_1.DestroyInstanceMethodName]();
}
