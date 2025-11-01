// IndexedDB Storage for Presentations

const DB_NAME = 'Present99DB';
const DB_VERSION = 1;
const STORE_NAME = 'presentations';

let db = null;

// Initialize IndexedDB
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB error:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      console.log('IndexedDB initialized');
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      
      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        objectStore.createIndex('topic', 'topic', { unique: false });
        objectStore.createIndex('lastModified', 'lastModified', { unique: false });
        console.log('Object store created');
      }
    };
  });
};

// Save presentation
export const savePresentation = async (presentation) => {
  if (!db) await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const presentationData = {
      ...presentation,
      lastModified: new Date().toISOString()
    };

    const request = store.put(presentationData);

    request.onsuccess = () => {
      console.log('Presentation saved:', presentation.id);
      resolve(presentation.id);
    };

    request.onerror = () => {
      console.error('Error saving presentation:', request.error);
      reject(request.error);
    };
  });
};

// Get presentation by ID
export const getPresentation = async (id) => {
  if (!db) await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      console.error('Error getting presentation:', request.error);
      reject(request.error);
    };
  });
};

// Get all presentations
export const getAllPresentations = async () => {
  if (!db) await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      // Sort by lastModified descending
      const presentations = request.result.sort((a, b) => 
        new Date(b.lastModified) - new Date(a.lastModified)
      );
      resolve(presentations);
    };

    request.onerror = () => {
      console.error('Error getting all presentations:', request.error);
      reject(request.error);
    };
  });
};

// Delete presentation
export const deletePresentation = async (id) => {
  if (!db) await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      console.log('Presentation deleted:', id);
      resolve();
    };

    request.onerror = () => {
      console.error('Error deleting presentation:', request.error);
      reject(request.error);
    };
  });
};

// Migrate from localStorage to IndexedDB
export const migrateFromLocalStorage = async () => {
  const keys = Object.keys(localStorage);
  const presentationKeys = keys.filter(key => key.startsWith('presentation_'));
  
  console.log(`Migrating ${presentationKeys.length} presentations from localStorage...`);
  
  for (const key of presentationKeys) {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      await savePresentation(data);
      // Don't delete from localStorage yet, keep as backup
    } catch (error) {
      console.error('Error migrating presentation:', key, error);
    }
  }
  
  console.log('Migration complete');
};

// Initialize on load
initDB().then(() => {
  // Optionally migrate existing data
  migrateFromLocalStorage().catch(console.error);
});
