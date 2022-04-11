const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./public/json/cart.json')
const middlewares = jsonServer.defaults();
const PORT = 3000

server.use(middlewares)

server.use(router)
server.listen(PORT, () => {
  console.log(`JSON resources: http://localhost:${PORT}`)
})