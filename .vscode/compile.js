const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const args = process.argv.splice(2);

const exportPathes = [
    "E:/study/IT/Projects/Laya/Laya2.13.1_beta_framework/ui/plugins/myplugin",
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
    const names = [""];
    names.length = 0;
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

const binDir = path.resolve(__dirname, "../bin").replace(/\\/g, "/");
const jsDir = path.resolve(binDir, "js");

removeDir(jsDir);
childProcess.exec("tsc", (err, stdout, stderr) => {
    if (!err && args[0]) {
        console.log("编译成功！");
        exportPathes.forEach(epPath => {
            let haveConfig = false;
            if (fs.existsSync(epPath)) {
                fs.readdirSync(epPath).forEach(epName => {
                    if (epName != "config") {
                        const evPath = path.resolve(epPath, epName);
                        const state = fs.statSync(evPath);
                        if (state.isDirectory()) removeDir(evPath);
                        else if (state.isFile()) fs.unlinkSync(evPath);
                    } else haveConfig = true;
                });
            }
            const allFiles = getAllFiles(binDir);
            allFiles.forEach(filePath => {
                filePath = filePath.replace(/\\/g, "/");
                const relativePath = filePath.replace(binDir + "/", "");
                if (relativePath.startsWith("config/") && haveConfig) return;
                const targetPath = path.resolve(epPath, relativePath);
                fs.mkdirSync(path.dirname(targetPath), { recursive: true });
                fs.copyFileSync(filePath, targetPath);
            });
        });
        console.log("发布成功！");
    } else {
        console.log("编译失败！");
        console.log(stdout);
    }
});