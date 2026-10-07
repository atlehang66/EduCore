const app = require("./src/app");
const { port } = require("./src/config/env");

app.listen(port, () => {
    console.log(`EduCore API running on http://localhost:${port}`);
});