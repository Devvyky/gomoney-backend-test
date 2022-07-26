import express, { Application, NextFunction, Request, Response } from 'express';

const app: Application = express();

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello world!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000!');
});
