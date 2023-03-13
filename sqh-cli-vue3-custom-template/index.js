const path = require('path');
const fse = require('fs-extra');
const chalk = require('chalk');
const log = require('npmlog');
const ora = require('ora');
const inquirer = require('inquirer');
const glob = require('glob');
const ejs = require('ejs');

log.heading = 'sqh';
log.addLevel('success', 2000, { fg: 'green', bold: true });

async function install(options) {
  const templatePath = path.resolve(__dirname, 'template');
  const extraInfo = await inquirer.prompt([
    {
      type: 'input',
      name: 'description',
      message: '请输入项目描述',
      when: () => options.info.type === 'project'
    }
  ]);

  options.extraInfo = extraInfo;

  await copyTemplate(templatePath, options.cwd, options);
  await generateTemplate(options);
  helpInfoLog(options);
}

/**
 * 拷贝模板到执行目录
 *
 * @param {string} source
 * @param {string} target
 */
async function copyTemplate(source, target) {
  const spinner = ora('正在安装自定义模板...').start();

  fse.ensureDirSync(source);
  fse.ensureDirSync(target);
  fse.copySync(source, target);

  spinner.stop();
  log.success('自定义模板安装完成');
}

/**
 * 编译模板流程
 *
 * @param {object} options
 */
async function generateTemplate(options) {
  const spinner = ora('正在编译自定义模板...').start();

  await generateTemplateAsync(options);
  spinner.stop();
  log.success('自定义模板编译完成');
}

/**
 * 编译模板主逻辑（Promise）
 *
 * @param {object} options
 * @returns Promise
 */
function generateTemplateAsync(options) {
  return new Promise((resolve, reject) => {
    glob('**', {
      cwd: options.cwd,
      ignore: ['**/node_modules/**', '**/public/**'],
      nodir: true
    }, (err, files) => {
      if (err) {
        reject(err);
      }

      Promise
        .all(generateRenderPromises(files, options))
        .then((result) => resolve(result))
        .catch((err) => reject(err));
    });
  });
}

/**
 * 生成准备编译的文件任务
 *
 * @param {Array<string>} files
 * @param {object} options
 * @returns Array<Promise>
 */
function generateRenderPromises(files, options) {
  return files.map((file) => {
    const filePath = path.join(options.cwd, file);

    return new Promise((resolve, reject) => {
      ejs.renderFile(filePath, options, {}, (err, result) => {
        if (err) {
          reject(err);
        } else {
          fse.writeFileSync(filePath, result);
          resolve(result);
        }
      });
    });
  });
}

/**
 * 打印帮助信息
 *
 * @param {object} options
 */
function helpInfoLog(options) {
  log.success('自定义项目初始化完成');
  console.log();
  console.log(`可以在 ${options.cwd} 目录中执行命令：`);
  console.log();
  console.log(chalk.cyanBright('  npm run serve'));
  console.log('   本地启动项目');
  console.log();
  console.log(chalk.cyanBright('  npm run build'));
  console.log('   构建项目');
  console.log();

  if (options.root !== options.cwd) {
    console.log('执行以下命令以启动项目：');
    console.log();
    console.log(chalk.cyanBright('  cd'), options.info.name);
    console.log(chalk.cyanBright('  npm run serve'));
    console.log();
  }
}

module.exports = install;
