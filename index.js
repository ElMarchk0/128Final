//Local server configuration
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 9000;

app.use(express.static("public"));
app.use(cors());

app.get('/', (res) => {
  res.sendFile(`${__dirname}/public/index.html/`, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    }
  });
});

app.listen(PORT, () => {console.log(`Live on http://localhost:${PORT}`)});

