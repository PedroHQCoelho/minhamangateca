const DB_NAME = "minha-mangateca-db";
const DB_VERSION = 1;
const STORE_NAME = "manga-covers";

// Abre o banco de dados
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Salva uma capa usando o ID do mangá
export async function saveCover(mangaId, imageFile) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    store.put(imageFile, mangaId);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };

    transaction.onabort = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

// Recupera a capa de um mangá
export async function getCover(mangaId) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(mangaId);

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    transaction.oncomplete = () => db.close();

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

// Exclui a capa de um mangá
export async function deleteCover(mangaId) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    store.delete(mangaId);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };

    transaction.onabort = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

// Recupera todas as capas armazenadas
export async function getAllCovers() {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);

    const keysRequest = store.getAllKeys();
    const valuesRequest = store.getAll();

    transaction.oncomplete = () => {
      const covers = keysRequest.result.map((id, index) => ({
        id,
        image: valuesRequest.result[index],
      }));

      db.close();
      resolve(covers);
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

// Substitui todas as capas pelas imagens do backup
export async function replaceAllCovers(covers) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    store.clear();

    covers.forEach((cover) => {
      store.put(cover.image, cover.id);
    });

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };

    transaction.onabort = () => {
      db.close();
      reject(transaction.error);
    };
  });
}
