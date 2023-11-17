const app = require("./src/app");
const PORT = 3333

const server = app.listen(PORT, () => {
    console.log(`WSV ecommerce start with port:` + PORT)
})

process.on('SIGINT', () => {
    server.close(() => console.log(`Exit server`))
})