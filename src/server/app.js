import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import serverRenderer from './middleware/renderer';

const app = express();
const router = express.Router();

router.use('^/$', serverRenderer);
app.use(router);
app.use(express.static(path.resolve(__dirname, '.')));
app.use(logger('dev'));
app.use(cookieParser());

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
