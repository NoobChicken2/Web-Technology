import express from 'express';
import cors from 'cors';

import token from './routes/token.js';
import auctions from "./routes/auctions.js";
import bids from './routes/bids.js';
import users from './routes/users.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/token", token);
app.use('/auctions', auctions);
app.use('/bids', bids);
app.use('/users', users);

app.get('/', (req, res) => {
  console.log(req);
  // res.send('Hello World!')
  res.json({ msg: "hello world"});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});