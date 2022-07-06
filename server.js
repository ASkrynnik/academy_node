const http = require("http");
const fs = require("fs");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const PORT = 3000;
let dynamicData = {};

let htmlPath = "";
let dataPath = "";

readline.question("Path to the HTML template file... \n", (path) => {
  htmlPath = path;
  readline.question("Path to the data file... \n", (path) => {
    dataPath = path;
    readline.close();


    if (fs.existsSync(htmlPath) && fs.existsSync(dataPath)) {
      try {
        const jsonData = fs.readFileSync(`${dataPath}`, "utf8");
        dynamicData = JSON.parse(jsonData);
      } catch (e) {
        console.log(e);
      }


      const request = (url, res, contentType = "text/html") => {
        fs.readFile(url, (err, data) => {
          if (err) {
            console.log(err);
            res.statusCode = 404;
            res.end(data.text);
          }
          res.writeHead("200", { "Content-Type": contentType });
          res.write(data);
          for (let key in dynamicData) {
            res.write(`<p>${dynamicData[key]}</p>`);
          }
          res.end();
        });
      };

      const server = http.createServer((req, res) => {
        if (req.url === "/template") {
          request(`${htmlPath}`, res);
        }
      });
      server.listen(PORT);
      console.log('server runnig on port 3000');
    } else {
      console.error("wrong file name or file don`t exist");
    }
  });
});
