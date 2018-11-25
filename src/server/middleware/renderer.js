import path from 'path';
import fs from 'fs';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from '../../client/App';

export default (req, res, next) => {
  const filePath = path.resolve(__dirname, 'index.html');

  fs.readFile(filePath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('err', err);
      return res.status(404).end();
    }

    const html = ReactDOMServer.renderToString(<App />);
    const output = htmlData.replace(
      '<div id=\'root\'></div>',
      `<div id='root'>${html}</div>`,
    );

    return res.send(output);
  });
};
