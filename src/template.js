const bodyContent = "`Uh-oh: ${errContent}`";
export const createServer = (flag = false) => {

  if(flag){
    return `import Koa, { Context, Next } from 'koa';
const App = new Koa();

App.use((ctx:Context, next:Next) => {
  ctx.body = "nail api";
});

App.use(async (ctx:Context, next:Next) => {
  const started:Date = Date.now();
  await next();
  const ellapsed:number = (Date.now() - started) + 'ms';
  console.log('Response time is:', ellapsed);
});

const port = '9094';
App.listen(port);`;
}
  return `const Koa = require('koa');
const App = new Koa();
  
App.use(async (ctx, next) => {
  const started = Date.now();
  await next();
  const ellapsed = (Date.now() - started) + 'ms';
  console.log('Response time is:', ellapsed);
});

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = 400
    ctx.body = ${bodyContent};
    console.log('Error handler:', err.message)
  }
});
  
const Router = require('./router');
App.use(Router.routes()).use(Router.allowedMethods());
  
const port = '9094';
App.listen(port);`;
}



export const createRouter = (flag = false) => {

  if(flag){
    return `import Koa, { Context, Next } from 'koa';
const App = new Koa();

App.use((ctx:Context, next:Next) => {
  ctx.body = "nail api";
});

App.use(async (ctx:Context, next:Next) => {
  const started:Date = Date.now();
  await next();
  const ellapsed:number = (Date.now() - started) + 'ms';
  console.log('Response time is:', ellapsed);
});

const port = '9094';
App.listen(port);`;
}
  return `const KoaRouter = require('koa-router');
const Router = new KoaRouter();
  
Router.get('/', (ctx, next) => {
  ctx.body = "nail get api";
})
  
Router.post('/', (ctx, next) => {
  ctx.body = "nail post api";
})
  
module.exports = Router;`;
}


export const createController = (name) => {
  return `export default ${name}Controller {}`
}