#!/usr/bin/env node

// import { program } from 'commander';
import { Command } from 'commander';
const program = new Command();

import fs from 'fs-extra';
import * as chalk from 'chalk';
import * as ora from 'ora';
import path from 'node:path';

import { runCmd, devCmd, startCmd, devCmdts, startCmdts, runCmdts } from './util';
import { createServer, createRouter, createController } from './template';

import inquirer from 'inquirer';

const rootPath = process.cwd();

program.name('jscli-with-commander').description('CLI to run calculations.').version('0.0.1')

program.command('new <projectName>').description('初始化项目').action(async (projectName)=>{
  const projectPath = `${rootPath}/${projectName}`; 
  try{
    const existResult = fs.pathExistsSync(projectPath);
    if(existResult) {
      const inquirerResult = await inquirer.prompt([
        {
          type: "confirm",
          name: "newProject",
          message: "是否重建项目",
          default: true
        }
      ]);
      // console.log(inquirerResult);
      if(inquirerResult.newProject){
        await fs.remove(projectPath);
      }else{
        process.exit();
      }
    }

    const listResult = await inquirer.prompt([
      {
        type: 'list', 
        name: 'frame', 
        message: '请选择框架', 
        choices: ['koa', 'express'],
        default: 1
      }
    ]);

    // console.log("listResult", listResult);

    const readStr = await fs.readJsonSync(__dirname +`/../template/${listResult.frame}Package.json`);
    // console.log(readStr.dependencies);

    await fs.remove(__dirname +`/../template/${listResult.frame}`);
    await fs.ensureDir(__dirname +`/../template/${listResult.frame}`);

    // const tsResult = await inquirer.prompt({
    //   type: "confirm",
    //   name: "typescript",
    //   message: "是否安装typescript",
    //   default: true
    // })

    const tsResult = await inquirer.prompt({
      type: "list",
      name: "isTs",
      message: "是否安装typescript",
      choices: ['javascript', 'typescript'],
      default: 1
    })


    // console.log("tsresult ====", tsResult);

    if(tsResult.isTs === 'typescript') {
      readStr.dependencies['typescript'] = '^5.5.4';
      readStr.devDependencies['@types/koa'] = '^2.15.0';
      readStr.devDependencies['@types/node'] = '^22.2.0';
      readStr.devDependencies['@types/koa-router'] = '^7.4.8';
      // console.log(readStr);
      const serverContent = createServer(true);
      const routerContent = createRouter(true);
      await fs.writeJsonSync(__dirname + `/../template/${listResult.frame}/package.json`, readStr, { spaces: 2, EOL: '\r\n' });
      await fs.writeFile(__dirname + `/../template/${listResult.frame}/app.ts`, serverContent, { spaces: 2, EOL: '\r\n' });
      await fs.writeFile(__dirname + `/../template/${listResult.frame}/router.ts`, routerContent, { spaces: 2, EOL: '\r\n' });
    }else{
      await fs.writeJsonSync(__dirname + `/../template/${listResult.frame}/package.json`, readStr, { spaces: 2, EOL: '\r\n' });
      const serverContent = createServer();
      const routerContent = createRouter();
      await fs.writeFile(__dirname + `/../template/${listResult.frame}/app.js`, serverContent, { spaces: 2, EOL: '\r\n' });
      await fs.writeFile(__dirname + `/../template/${listResult.frame}/router.js`, routerContent, { spaces: 2, EOL: '\r\n' });
    }

    const spanner = ora(chalk.green('初始化项目中.......')).start();

    await fs.copy(__dirname +`/../template/${listResult.frame}`, projectPath);

    await runCmd(projectPath)

    spanner.succeed(chalk.green('创建成功'));
    console.log(chalk.blue(`You can start by running:
    ${chalk.green(`cd ${projectName}`)}
    ${chalk.green('npm run dev for development')}
    ${chalk.green('npm run build for production')}`));
    process.exit();
  } catch (error) {
    console.log(error);
    //spinner.fail(chalk.redBright('创建失败'));
  }
})


program.command('dev').option("-js, --javascript", "select javascript").option("-ts, --typescript", "select typescript").description('开发模式').action(async (options)=>{
  try{
    if(options?.javascript){
      await devCmd(rootPath);
    } 

    if(options?.typescript){
      await devCmdts(rootPath);
    } 
   
  }catch(error){
    console.log(error);
  }
  // try{
  //   try {
  //     await devCmd(rootPath);
  //   } catch (err) {
  //     console.log(err)
  //   }
  // } catch (error) {
  //   console.log(error);
  // }
})


program.command('start').option("-js, --javascript", "select javascript").option("-ts, --typescript", "select typescript").description('生产模式').action(async (options)=>{
  try{
    if(options?.javascript){
      await startCmd(rootPath);
    } 

    if(options?.typescript){
      try{
        await startCmdts(rootPath);
      }catch(error){
        // console.log("startCmdts", error)
      }

      try{
        await runCmdts(rootPath);
      }catch(error){
        // console.log("runCmdts", error)
      }
    } 
  } catch (error) {
    console.log(error);
  }
  // try{
  //   try {
  //     await startCmd(rootPath);
  //   } catch (err) {
  //     console.log(err)
  //   }
  // } catch (error) {
  //   console.log(error);
  // }
})

program.command('controller <controllerName>').description("创建模版").action(async (controllerName) => {
  if(!controllerName){
    return false;
  }
  
  const controllerContent =  createController(controllerName);
  await fs.writeFile(`${rootPath}/${controllerName}.js`, controllerContent, { spaces: 2, EOL: '\r\n' });
});


// program.on('*', obj => {
//   console.error('未知的命令：' + obj[0])
//   // 获取已经注册的命令
//   const availableCommands = program.commands.map(cmd => cmd.name())
//   console.log('可用命令：' + availableCommands.join(','))
// })





program.parse(process.argv);

