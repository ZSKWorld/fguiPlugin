import { FairyEditor, System } from 'csharp';
import CodeWriter from './CodeWriter';

/** 加入不同包的资源引入路径 */
function CollectClasses(
    handler: FairyEditor.PublishHandler,
    stripMember: boolean,
    ns: string,
) {
    let classes = handler.CollectClasses(stripMember, stripMember, ns);
    let hasOtherPkgRes = false;
    const clsCnt = classes.Count;
    for (let i = 0; i < clsCnt; i++) {
        const memberInfos = classes.get_Item(i).members;
        const memberCnt = memberInfos.Count;
        for (let j = 0; j < memberCnt; j++) {
            const info = memberInfos.get_Item(j);
            if (info.res && info.res.owner.name != handler.pkg.name) {
                if (!handler.items.Contains(info.res)) {
                    hasOtherPkgRes = true;
                    handler.items.Add(info.res);
                }
            }
        }
    }
    if (hasOtherPkgRes) {
        classes = handler.CollectClasses(stripMember, stripMember, ns);
        classes.ForEach(cls => {
            if (cls.res.owner.name == handler.pkg.name) {
                cls.members.ForEach(memberInfo => {
                    if (memberInfo.res && memberInfo.res.owner.name != handler.pkg.name) {
                        let existRes = false;
                        let tempClsCnt = classes.Count;
                        for (let k = 0; k < tempClsCnt; k++) {
                            if (classes.get_Item(k).res == memberInfo.res) {
                                existRes = true;
                                break;
                            }
                        }

                        if (existRes) {
                            memberInfo.type = memberInfo.res.name;
                            const ref = `/${ memberInfo.res.owner.name }/${ memberInfo.res.name }`;
                            if (cls.references.Contains(ref) == false)
                                cls.references.Add(ref);
                        }
                    }
                });
            }
        });
        const clsCnt = classes.Count;
        for (let i = clsCnt - 1; i >= 0; i--) {
            const cls = classes.get_Item(i);
            if (cls.res.owner.name != handler.pkg.name) {
                classes.RemoveAt(i);
            }
        }
    }
    return classes;
}

function genReferenceExt(writer: CodeWriter, references: System.Collections.Generic.List$1<string>) {
    let refCount = references.Count;
    if (refCount > 0) {
        for (let j: number = 0; j < refCount; j++) {
            let ref = references.get_Item(j);
            if (ref.startsWith("/")) {
                let tempArr = ref.split("/");
                writer.writeln('import %s from "..%s";', tempArr[ 2 ], ref);
            }
            else writer.writeln('import %s from "./%s";', ref, ref);
        }
        writer.writeln();
    }
}

export function genCode_TS_XiaoYanDemo(handler: FairyEditor.PublishHandler) {
    let settings = (<FairyEditor.GlobalPublishSettings>handler.project.GetSettings("Publish")).codeGeneration;
    let codePkgName = handler.ToFilename(handler.pkg.name); //convert chinese to pinyin, remove special chars etc.
    let exportCodePath = handler.exportCodePath + '/' + codePkgName;
    let namespaceName = codePkgName;
    let ns = "fgui";
    let isThree = handler.project.type == FairyEditor.ProjectType.ThreeJS;

    if (settings.packageName)
        namespaceName = settings.packageName + '.' + namespaceName;


    //CollectClasses(stripeMemeber, stripeClass, fguiNamespace)
    // let classes = handler.CollectClasses(settings.ignoreNoname, settings.ignoreNoname, ns);
    let classes = CollectClasses(handler, settings.ignoreNoname, ns);
    handler.SetupCodeFolder(exportCodePath, "ts"); //check if target folder exists, and delete old files

    let getMemberByName = settings.getMemberByName;

    let classCnt = classes.Count;
    let writer = new CodeWriter({ blockFromNewLine: false, usingTabs: true });
    for (let i: number = 0; i < classCnt; i++) {
        let classInfo = classes.get_Item(i);
        let members = classInfo.members;
        let references = classInfo.references;
        writer.reset();

        let refCount = references.Count;
        // if (refCount > 0) {
        //     for (let j: number = 0; j < refCount; j++) {
        //         let ref = references.get_Item(j);
        //         writer.writeln('import %s from "./%s";', ref, ref);
        //     }
        //     writer.writeln();
        // }
        genReferenceExt(writer, references);

        if (isThree) {
            writer.writeln('import * as fgui from "fairygui-three";');
            if (refCount == 0)
                writer.writeln();
        }

        writer.writeln('export default class %s extends %s', classInfo.className, classInfo.superClassName);
        writer.startBlock();
        writer.writeln();

        let memberCnt = members.Count;
        for (let j: number = 0; j < memberCnt; j++) {
            let memberInfo = members.get_Item(j);
            writer.writeln('public %s:%s;', memberInfo.varName, memberInfo.type);
        }
        writer.writeln('public static URL:string = "ui://%s%s";', handler.pkg.id, classInfo.resId);
        writer.writeln();

        writer.writeln('public static createInstance():%s', classInfo.className);
        writer.startBlock();
        writer.writeln('return <%s>(%s.UIPackage.createObject("%s", "%s"));', classInfo.className, ns, handler.pkg.name, classInfo.resName);
        writer.endBlock();
        writer.writeln();

        writer.writeln('protected override onConstruct():void');
        writer.startBlock();
        for (let j: number = 0; j < memberCnt; j++) {
            let memberInfo = members.get_Item(j);
            if (memberInfo.group == 0) {
                if (getMemberByName)
                    writer.writeln('this.%s = <%s>(this.getChild("%s"));', memberInfo.varName, memberInfo.type, memberInfo.name);
                else
                    writer.writeln('this.%s = <%s>(this.getChildAt(%s));', memberInfo.varName, memberInfo.type, memberInfo.index);
            }
            else if (memberInfo.group == 1) {
                if (getMemberByName)
                    writer.writeln('this.%s = this.getController("%s");', memberInfo.varName, memberInfo.name);
                else
                    writer.writeln('this.%s = this.getControllerAt(%s);', memberInfo.varName, memberInfo.index);
            }
            else {
                if (getMemberByName)
                    writer.writeln('this.%s = this.getTransition("%s");', memberInfo.varName, memberInfo.name);
                else
                    writer.writeln('this.%s = this.getTransitionAt(%s);', memberInfo.varName, memberInfo.index);
            }
        }
        writer.endBlock();

        writer.endBlock(); //class

        writer.save(exportCodePath + '/' + classInfo.className + '.ts');
    }

    writer.reset();

    let binderName = codePkgName + 'Binder';

    for (let i: number = 0; i < classCnt; i++) {
        let classInfo = classes.get_Item(i);
        writer.writeln('import %s from "./%s";', classInfo.className, classInfo.className);
    }

    if (isThree) {
        writer.writeln('import * as fgui from "fairygui-three";');
        writer.writeln();
    }

    writer.writeln();
    writer.writeln('export default class %s', binderName);
    writer.startBlock();

    writer.writeln('public static bindAll():void');
    writer.startBlock();
    for (let i: number = 0; i < classCnt; i++) {
        let classInfo = classes.get_Item(i);
        writer.writeln('%s.UIObjectFactory.setExtension(%s.URL, %s);', ns, classInfo.className, classInfo.className);
    }
    writer.endBlock(); //bindall

    writer.endBlock(); //class

    writer.save(exportCodePath + '/' + binderName + '.ts');
}