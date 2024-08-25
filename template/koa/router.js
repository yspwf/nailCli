const KoaRouter = require('koa-router');
const Router = new KoaRouter();
  
Router.get('/', (ctx, next) => {
  ctx.body = "nail get api";
})
  
Router.post('/', (ctx, next) => {
  ctx.body = "nail post api";
})
  
module.exports = Router;