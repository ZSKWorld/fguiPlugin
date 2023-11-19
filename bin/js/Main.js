"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onDestroy = exports.onPublish = void 0;
const csharp_1 = require("csharp");
const Const_1 = require("./core/common/Const");
const CustomSetting_1 = require("./core/common/CustomSetting");
const BaseInspector_1 = require("./core/inspectors/BaseInspector");
const BaseClass_1 = require("./core/libs/BaseClass");
const GenCode_TS_XiaoYanDemo_1 = require("./core/libs/GenCode_TS_XiaoYanDemo");
const MenuDoc_CreateLayaName_1 = require("./core/menu/menuDoc/MenuDoc_CreateLayaName");
const MenuDoc_CreateLuaName_1 = require("./core/menu/menuDoc/MenuDoc_CreateLuaName");
const MenuMain_ImageReference_1 = require("./core/menu/menuMain/MenuMain_ImageReference");
const MenuMain_Publish_1 = require("./core/menu/menuMain/MenuMain_Publish");
const Menu_Test_1 = require("./core/menu/Menu_Test");
const EditorUtils_1 = require("./core/utils/EditorUtils");
/** 加载插件UI包 */
csharp_1.FairyEditor.App.pluginManager.LoadUIPackage(EditorUtils_1.EditorUtils.GetPackagePath(Const_1.PkgCustom));
CustomSetting_1.CustomSetting.Init();
const docMenu = csharp_1.FairyEditor.App.docFactory.contextMenu;
const libMenu = csharp_1.FairyEditor.App.libView.contextMenu;
const mainMenu = csharp_1.FairyEditor.App.menu;
const mainSubMenu = (name) => mainMenu.GetSubMenu(name);
[
    //测试用例
    new Menu_Test_1.Menu_Test(libMenu),
    //编辑区菜单
    // new MenuDoc_CreateComponent(docMenu),
    // new MenuDoc_CreateRelation(docMenu),
    new MenuDoc_CreateLuaName_1.MenuDoc_CreateLuaName(docMenu),
    new MenuDoc_CreateLayaName_1.MenuDoc_CreateLayaName(docMenu),
    //资源库菜单
    // new MenuLib_CreateController(libMenu),
    //主菜单，注意：使用mainMenu做父菜单时，menuData.isSubMenu必须为true
    new MenuMain_Publish_1.MenuMain_Publish(mainMenu),
    new MenuMain_ImageReference_1.MenuMain_ImageReference(mainMenu),
    //检查器
    // new BtnInspector(new InspectorData(PkgCustom, PkgCustom_Btn, InspectorName.Custom_BtnInspector, "按钮自定义数据", ShowObjectType.Button, true)),
    // new ComInspector(new InspectorData(PkgCustom, PkgCustom_Btn, InspectorName.Custom_ComInspector, "组件自定义数据", ShowObjectType.Component, true, true)),
    // new TextLayoutInspector(new InspectorData(PkgCustom, PkgCustom_Text, "TextInspector", "文本横竖排", ShowObjectType.Mixed, true)),
].forEach(v => v.Create());
//自定义发布代码
function onPublish(handler) {
    if (!handler.genCode)
        return;
    handler.genCode = false; //prevent default output
    console.log('Handling gen code in plugin');
    (0, GenCode_TS_XiaoYanDemo_1.genCode_TS_XiaoYanDemo)(handler); //do it myself
}
exports.onPublish = onPublish;
function onDestroy() {
    BaseClass_1.BaseClass[Const_1.DestroyInstanceMethodName]();
    BaseInspector_1.BaseInspector[Const_1.DestroyInstanceMethodName]();
}
exports.onDestroy = onDestroy;
