export default (ex) => {
  console.error(ex.stack);
  process.exit(1);
}
