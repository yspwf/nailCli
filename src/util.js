import { spawn, exec } from 'child_process';

export const runCmd = (path) => {
  return new Promise((resolve, reject) => {
    // console.log("====path", path);
    const isWin32 = process.platform === 'win32'
    const spawnCli = spawn(isWin32 ? 'npm.cmd':'npm', ['install'], {
      cwd: path,
      shell: process.platform === 'win32',
      stdio: ["pipe"]
    })
    // const spawnCli = spawn('ls', ['-lh', '/usr'], {
    //   cwd: path,
    //   shell: process.platform === 'win32'
    // });

    // spawnCli.stdout.on('data', (data) => {
    //   console.log(`stdout: ${data}`);
    // });
    
    // spawnCli.stderr.on('data', (data) => {
    //   console.log(`stderr: ${data}`);
    // });
    
    // spawnCli.on('close', (code) => {
    //   console.log(`子进程退出码：${code}`);
    // });

    spawnCli.stdout.on("data", data => {
        // console.log(`stdout: ${data}`);
        resolve(true);
    });
    
    spawnCli.stderr.on("data", data => {
        // console.log(`stderr: ${data}`);
        reject(true);
    });
    
    spawnCli.on('error', (error) => {
        // console.log(`error: ${error.message}`);
        reject(true);
    });
    
    // spawnCli.on("close", code => {
    //     console.log(`child process exited with code ${code}`);
    // });
  })
}


export const devCmd = (path) => {
  return new Promise((resolve, reject) => {
    const spawnCli = spawn('npx', ['nodemon', 'app.js'], {
      cwd: path,
      shell: process.platform === 'win32',
      stdio: ["pipe"]
    })
  
    let fibo_res = '';
    spawnCli.stdout.on("data", data => {
        // console.log("父进程监听子进程输出: "+data.toString())
        // console.log(`stdout: ${data}`);
        fibo_res += data.toString();
        console.log(`stdout: ${fibo_res}`);
        resolve(true);
    });
  
    spawnCli.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
        reject(true);
    });
    
    spawnCli.on('error', (error) => {
        console.log(`error: ${error.message}`);
        reject(true);
    });
    
    spawnCli.on("close", code => {
        console.log(`child process exited with code ${code}`);
    });
  })
}



export const startCmd = (path) => {
  return new Promise((resolve, reject) => {
    const spawnCli = spawn('node', ["app.js"], {
      cwd: path,
      shell: process.platform === 'win32',
      stdio: ["pipe"]
    })
    
    spawnCli.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
        resolve(true);
    });
    
    spawnCli.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
        reject(true);
    });
    
    spawnCli.on('error', (error) => {
        console.log(`error: ${error.message}`);
        reject(true);
    });
    
    spawnCli.on("close", code => {
        console.log(`child process exited with code ${code}`);
    });
  })
}


export const devCmdts = (path) => {
  return new Promise((resolve, reject) => {
    const spawnCli = spawn("npx", ["ts-node-dev", "--respawn", "app.ts"], {
      cwd: path,
      shell: process.platform === 'win32',
      stdio: ["pipe"]
    })
    let fibo_res = '';
    spawnCli.stdout.on("data", data => {
      fibo_res += data.toString();
      console.log(`stdout: ${fibo_res}`);
      resolve(true);
        // console.log(`stdout: ${data}`);
        // resolve(true);
    });
    
    spawnCli.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
        reject(true);
    });
    
    spawnCli.on('error', (error) => {
        console.log(`error: ${error.message}`);
        reject(true);
    });
    
    spawnCli.on("close", code => {
        console.log(`child process exited with code ${code}`);
    });
  })
}


export const startCmdts = (path) => {
  return new Promise((resolve, reject) => {
  
    const spawnCli = spawn("npx", ["tsc"], {
      cwd: path,
      shell: process.platform === 'win32',
      stdio: ["pipe"]
    });

    let tscres = '';
    spawnCli.stdout.on("data", data => {
      tscres += data.toString();
      console.log(`stdout: ${tscres}`);
      resolve(true);
        // console.log(`stdout: ${data}`);
        // resolve(true);
    });
    
    spawnCli.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
        reject(true);
    });
    
    spawnCli.on('error', (error) => {
        console.log(`error: ${error.message}`);
        reject(true);
    });
    
    spawnCli.on("close", code => {
        console.log(`spawnCli child process exited with code ${code}`);
        reject(true);
    });
  })
}


export const runCmdts = (path) => {
  return new Promise((resolve, reject) => {
    const nodeCli = spawn("node", ["dist/app.js"], {
      cwd: path,
      shell: process.platform === 'win32',
      stdio: ["pipe"]
    });

    let noderes = '';
    nodeCli.stdout.on("data", data => {
      noderes += data.toString();
      console.log(`stdout: ${noderes}`);
      resolve(true);
        // console.log(`stdout: ${data}`);
        // resolve(true);
    });
    
    nodeCli.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
        reject(true);
    });
    
    nodeCli.on('error', (error) => {
        console.log(`error: ${error.message}`);
        reject(true);
    });
    
    nodeCli.on("close", code => {
        console.log(`nodeCli child process exited with code ${code}`);
    });
  });
}
