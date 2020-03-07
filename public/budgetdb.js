//budgetdb manages indexedDB actions

let db;
// create new request for budget database/request a database instance
//could also be window.IndexedDB
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
   // create object store (table) called pending
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

// Onsuccess, means database has successfully been opened up the database console the result
request.onsuccess = function(event) {
  console.log(request.result);
  db = event.target.result;

  // check if app is online before checking the database
  if (navigator.onLine) {
    checkDatabase();
  } else {
    console.log("App is not online")
  }
};

request.onerror = function(event) {
  console.log("There was an error:" + event.target.errorCode);
};

function saveRecord(record) {
  // create transaction on pending db
  const transaction = db.transaction(["pending"], "readwrite");

  // access pending
  const store = transaction.objectStore("pending");

  // add record to pending
  store.add(record);
}

function checkDatabase() {
  // open a transaction on pending db and access it
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");

  // get all records from pending and set to a variable
  const getAll = store.getAll();

  //if records exist (count greater than 0) post all records as a group
  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(() => {
        // if successful, open transaction on pending db
        const transaction = db.transaction(["pending"], "readwrite");

        // access pending 
        const store = transaction.objectStore("pending");

        // clear all items in your store
        store.clear();
      });
    }
  };
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);
