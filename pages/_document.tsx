import Document, { Head, Main, NextScript } from 'next/document';
import Footer from '../components/Footer';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const { nonce } = ctx.res.locals;

    return {
      ...initialProps,
      nonce,
    };
  }

  public render() {
    const { nonce } = this.props;

    return (
      <html>
      <Head nonce={nonce} title='Brew'/>
      <body>
      <Main/>
      <Footer/>
      <NextScript nonce={nonce}/>
      </body>
      </html>
    );
  }
}
