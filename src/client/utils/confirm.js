const confirm = (message, callback) => {
  const options = {
    labels: { ok: 'Yes', cancel: 'No' },
  };

  return window.UIkit.modal.confirm(message, options)
    .then(callback, () => {});
};

export default confirm;
