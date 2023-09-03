const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const args = process.argv.splice(2);

const exportPathes = [
    "E:/study/IT/Projects/Laya/Laya2.13.1_beta_framework/ui/plugins",
    // "E:/study/IT/Projects/Laya/XiuXian/ui/plugins",
    // "E:/study/IT/Projects/Laya/JiuChongShiLian/ui/plugins",
    // "E:/study/IT/Projects/FairyGUI/FGUICustomInspector/plugins"
];

/**删除目录，包括目录中所有文件和子目录 */
const removeDir = function (dir) {
    if (fs.existsSync(dir) == false) return;
    let files = fs.readdirSync(dir)
    for (var i = 0; i < files.length; i++) {
        let newPath = path.join(dir, files[i]);
        let stat = fs.statSync(newPath)
        if (stat.isDirectory()) {
            //如果是文件夹就递归下去
            removeDir(newPath);
        } else {
            //删除文件
            fs.unlinkSync(newPath);
        }
    }
    fs.rmdirSync(dir)
}

/**获取目录中的所有文件 */
const getAllFiles = function (dirPath) {
    const names = [];
    fs.readdirSync(dirPath).forEach(filename => {
        const filePath = path.resolve(dirPath, filename);
        const state = fs.statSync(filePath);
        if (state.isDirectory()) {
            names.push(...getAllFiles(filePath));
        } else if (state.isFile()) {
            names.push(path.resolve(dirPath, filename));
        }
    });
    return names;
}

removeDir(path.resolve(__dirname, "../bin/js"));
return;
childProcess.exec("tsc", (err, stdout, stderr) => {
    if (!err && args[0]) {
        let allFiles = [""];
        allFiles.length = 0;
        copyFileOrDir.forEach(v => {
            const tempPath = path.resolve(rootDir, v);
            const stat = fs.statSync(tempPath);
            if (stat.isDirectory())
                allFiles.push(...getAllFiles(tempPath));
            else
                allFiles.push(tempPath);
        });

        exportPathes.forEach(ev => {
            let copyConfig = true;
            if (!fs.existsSync(ev) || !fs.existsSync(path.resolve(ev, rootDirName + "/config")))
                removeDir(ev);
            else {
                copyConfig = false;
                removeDir(path.resolve(ev, "js"));
            }
            allFiles.forEach(file => {
                console.log(file, "  ", copyConfig);
                if (file.includes("config") && !copyConfig) return;
                const tempPath = file.replace(rootParentDir, ev).replace(/\\/g, "/");
                const lastIndex = tempPath.lastIndexOf("/");
                const dir = tempPath.substring(0, lastIndex);
                fs.mkdirSync(dir, { recursive: true });
                fs.copyFileSync(file, tempPath);
            });
        });
    }
});