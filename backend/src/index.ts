import express from 'express';

const app = express();

app.get('/', function (req, res) {
  res.status(200).json({
    message: 'It work',
  });
});

app.listen(4000, (err) => {
  if (!err) {
    console.log('Server started on http://localhost:4000');
  }
});

export default app;
