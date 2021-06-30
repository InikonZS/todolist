class Database {
  public db: IDBDatabase = null;

  constructor() {

  }

  init(dbName: string, version?: number) {
    const iDB = window.indexedDB;
    const openRequest = iDB.open(dbName, version);
    openRequest.onupgradeneeded = () => {
      const database = openRequest.result;
      const store = database.createObjectStore('testCollection', { keyPath: 'id', autoIncrement: true });
      store.createIndex('name', 'name');
      store.createIndex('email', 'email', { unique: true });
      this.db = database;
    };

    openRequest.onsuccess = () => {
      this.db = openRequest.result;
    };
  }

  write<RecordType>(collection:string, data:RecordType):Promise<RecordType> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(collection, 'readwrite');
      transaction.oncomplete = () => {
        resolve(transResult);
      };
      const store = transaction.objectStore(collection);
      // store.add({fsdg:34, fdgfsdg:'fdgdsg', name:'fdgdg', email:'a'});
      const res = store.add({});
      let transResult:RecordType = null;
      res.onsuccess = () => {
        res.result;
        const newRecord:RecordType = { ...data, id: res.result };
        transResult = newRecord;
        // let newRecord:MyRecord = { fsdg: 334544, fdgfsdg: 'fdgd56789876567sg', name: 'fd3g', email: res.result.toString(), id:res.result};
        const result = store.put(newRecord);
        console.log(result);
        // let result = store.add({fsdg:34, fdgfsdg:'fdgdsg', name:'fdgdg', email:'asf1'});
        result.onsuccess = () => {
          console.log('complete', result.result);
        };
        result.onerror = () => {
          console.log('error', result.error);
        };
      };
    });
  }

  readAll<RecordType>(collection:string):Promise<Array<RecordType>> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(collection, 'readonly');
      const store = transaction.objectStore(collection);
      const result = store.getAll();

      transaction.oncomplete = () => {
        resolve(result.result);
      };

      transaction.onerror = () => {
        reject(result.error);
      };
    });
  }

  readFiltered<RecordType>(collection:string, filter:(item:RecordType)=>boolean):Promise<Array<RecordType>> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(collection, 'readonly');
      const store = transaction.objectStore(collection);
      const result = store.index('email').openCursor(null, 'prev');
      const resData: Array<RecordType> = [];
      result.onsuccess = () => {
        const cursor = result.result;
        if (cursor) {
          console.log(cursor.value);
          /* if (cursor.value.email[0] == 'a') {
            resData.push(cursor.value);
          } */
          const currentValue:RecordType = cursor.value;
          if (filter(currentValue)) {
            resData.push(currentValue);
          }
          cursor.continue();
        }
      };

      transaction.oncomplete = () => {
        console.log(resData);
        resolve(resData);
      };
    });
  }
}

export default Database;
