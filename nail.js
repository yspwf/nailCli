#!/usr/bin/env node
// import {Command} from 'commander';
const command = require('commander');

// import fs from 'fs-extra';
const fs = require('fs-extra');

// import inquirer from 'inquirer';
const inquirer = require('inquirer');

// import Chalk from 'chalk';
const Chalk = require('chalk');

// import figlet from 'figlet';
const figlet = require('figlet');

// import ora from 'ora';
const ora = require('ora');

// import * as execa from 'execa';
// import childProcess from 'child_process';

const childProcess = require('child_process');

const program = new command.Command();

program.name('nail').description('nail client for create server').version('1.0.0');

const ROOT_PATH = process.cwd();

const remove = (projectPath, spinner)=>{
  return new Promise((resolve, reject)=>{
    try{
      fs.removeSync(projectPath);
      createProject(projectPath, spinner);
      resolve(true);
    }catch(err){
      console.log(err);
      reject(err);
    }
  })
}

const copyPackge = (projectPath) => {
  return new Promise((resolve, reject)=>{
    fs.copy('./cliPackage.json', `${projectPath}/package.json`);
    resolve(true);
  })
}

const createProject = (projectPath, spinner) => {
  return new Promise((resolve, reject)=>{
    try{
      fs.ensureDir(projectPath);
      spinner.succeed(Chalk.green('Downloading source...'));
      resolve(true);
    }catch(err){
      console.log(err);
      reject(err);
    }
  })
}


const runNpm = (command, cwd) => {
  console.log("cwd", cwd)
  return new Promise((resolve, reject) => {
    const child = execa.execa(command, [], {
      cwd,
      stdio: ['inherit', 'pipe']
    })

    child.stdout.on('data', buffer => {
      process.stdout.write(buffer);
    })

    child.on('close', code => {
      if(code !== 0) {
        reject(new Error(`command failed: ${command}`))
        return
      }
      resolve()
    })
  })
}

// const loader = () => {
//   return new Promise((resolve, reject)=>{
//     const spinner = ora('Downloading source...').start();
//     resolve(true);
//   })
// }

const executeNpm = (projectPath, project, spinner) => {
  return new Promise((resolve, reject)=>{
    
    (async ()=>{
      // console.log(await copyPackge(projectPath));
      if(await copyPackge(projectPath)){
        const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
        const args = ['install']
       
        var ls = childProcess.spawn(npm, args, {
          stdio: ['inherit', 'pipe'],
          cwd: projectPath
        })
        ls.stdout.on('data', function (data) {
          console.log('stdout: ' + data)
        })
        ls.stderr.on('data', function (err) {
          console.log('stderr: ' + err)
        })
        ls.once('close', function () {
          console.log('install success...')
          spinner.succeed(Chalk.green('Download successful!'));

          console.log(Chalk.blue(`You can start by running: cd ${project}`));
        })
      }
    })()
    
    resolve(true);
    // runNpm('npm install', projectPath);
  })
}

program.command('create <name>')
      .description('create project')
      .action(async (name) => {
        console.log(Chalk.yellow(figlet.textSync('nail cli', { horizontalLayout: 'full' })));

        const projectPath = `${ROOT_PATH}/${name}`;
        if(fs.existsSync(projectPath)){
          const selectAnswer = await inquirer.prompt([{
            type: 'confirm',
            message: '是否重新创建项目',
            name: 'reCreate'
          }]);
         
          if(selectAnswer.reCreate){
            const spinner = ora('start create project').start();
            await remove(projectPath, spinner);
            await executeNpm(projectPath, name, spinner);
           
            //await runNpm('npm install', projectPath);
          }else{
            return false;
          }
        }else{
          const spinner = ora('start create project').start();
          await createProject(projectPath, spinner);
          await executeNpm(projectPath, name, spinner);
        }
      });

program.command('dev')
      .description('debug deveploment')
      .action(() => {
        console.log('dev');
        console.log(process.cwd())
        const npm = process.platform === 'win32' ? 'npx.cmd' : 'npx';
        //const args = ['nodemon', '--watch', './**/*.ts', '-e', '.ts', '--exec', 'ts-node-esm', './app.ts']
        // const args = ['nodemon', '-x', 'ts-node', './app.ts'];
        const args = ['ts-node-dev', '--respawn', '--debug', './app.ts']
        // const args = ['ts-node-dev', '--respawn', './app.ts']
        const child = childProcess.spawn(npm, args, {
          //stdio: ['inherit', 'pipe'],
          // cwd: './'
          stdio: 'inherit',
          cwd:process.cwd(),
          //shell: process.platform === 'win32'
        })

        // child.stdout.on('data', function (data) {
        //   console.log('stdout: ', data.toString());
        //   // const output = JSON.parse(JSON.stringify(data));
        //   // console.log(output.data.toString())
        // })

        // ls.stderr.on('data', function (err) {
        //   console.log('stderr: ' + err)
        // })
        child.on('error', e =>{
          log.error(e.message);
          process.exit(1);
        })

        child.on('exit', e=>{
          log.verbose('命令执行成功' + e);
          process.exit(e);
        })

        child.once('close', function () {
          //console.log('project start success...')
          process.exit(0);
        })

        console.log(Chalk.yellow(figlet.textSync('nail cli', { horizontalLayout: 'full' })));
        //console.log('project start success')
      })


program.command('build')
  .description('build project')
  .action(() => {
    const npm = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const args = ['tsc'];
    const child = childProcess.spawn(npm, args, {
      stdio: 'inherit',
      cwd:process.cwd()
    })

    child.on('error', e =>{
      log.error(e.message);
      process.exit(1);
    })
    
    child.on('exit', e=>{
      console.log('命令执行成功' + e);
      process.exit(e);
    })

    child.once('close', function () {
      //console.log('project start success...')
      process.exit(0);
    })

    console.log('build success');
  })

program.parse();

