const Koa = require('koa');
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
    ctx.body = `Uh-oh: ${errContent}`;
    console.log('Error handler:', err.message)
  }
});
  
const Router = require('./router');
App.use(Router.routes()).use(Router.allowedMethods());
  
const port = '9094';
App.listen(port);