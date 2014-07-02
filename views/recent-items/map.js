function (doc) {
  if (doc.url) {
    emit(doc.utc, {
      url: doc.url
    });
  }
};