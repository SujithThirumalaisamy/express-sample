const initializeTable = (tableName, app) => {
  const datastore = app.datastore();
  const table = datastore.table(tableName);
  return table;
};

module.exports = {
  initializeTable,
};
