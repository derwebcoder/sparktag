If you want to update the database schema or export / import format, you have to make sure you follow a few steps:

1. Start with adding a new version in `AppDB.ts`. Make sure to define an upgrade transaction.
2. Add a new backup format in `Backup.ts` and a safe guard
3. Add a new import upgrade method in `importJSONWorker.ts`. Don't forget to update the final backup type check (currently line 60)
4. Now you can use the new data

Note: If you add a new table, remember to also implement a `CAREFUL_deleteAllData()` function in the corresponding service and call this from the settings when the user wants to delete all data.