import express, {Express, Request, Response} from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import { Client } from 'pg';
import client from './db/conn'
import contactRoutes from './routes/contactRouter'
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send("Server Up and running!")
})

app.use('/api/contact', contactRoutes);

client.connect((err) => {
  if(err){
    console.error('Error in connecting to DB:', err);
    return;
  }

  client.query("select * from Contact", [], (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(result.rows);
  });
});



app.listen(4000)
