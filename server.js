const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;
const fs = require('fs');

app.use(cors());
app.use(express.json());

var dir = './files';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

app.use('/api/xmls', require('./routes/xmls'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
