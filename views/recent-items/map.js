function (doc) {
  if (doc.alias && doc.subject) {
    emit(doc.utc, {
      subject: doc.subject,
      alias: doc.alias,
      email: doc.email
    });
  }
};