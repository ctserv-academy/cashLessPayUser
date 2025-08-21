const DB_NAME = 'CashlessPayDB_Users';
const STORE_NAME = 'preferences';
const DB_VERSION = 1;

class Storage {
    constructor() {
        this.db = null;
        this.initialized = false;
        this.initPromise = this.initDB();
    }

    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => {
                console.error('Error opening database:', event.target.error);
                reject('Error opening database');
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                this.initialized = true;
                console.log('Database initialized successfully');
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                    console.log('Object store created');
                }
            };
        });
    }

    async ensureInitialized() {
        if (!this.initialized) {
            await this.initPromise;
        }
    }

    async set(key, value) {
        await this.ensureInitialized();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put(value, key);

            request.onsuccess = () => resolve();
            request.onerror = (event) => {
                console.error('Error storing data:', event.target.error);
                reject('Error storing data');
            };
        });
    }

    async get(key) {
        await this.ensureInitialized();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => {
                console.error('Error retrieving data:', event.target.error);
                reject('Error retrieving data');
            };
        });
    }

    async remove(key) {
        await this.ensureInitialized();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(key);

            request.onsuccess = () => resolve();
            request.onerror = (event) => {
                console.error('Error removing data:', event.target.error);
                reject('Error removing data');
            };
        });
    }
}

// Create a singleton instance
const storage = new Storage();

export async function setToDB(key, value) {
    await storage.set(key, value);
}

export async function getFromDB(key) {
    return await storage.get(key);
}

export async function removeFromDB(key) {
    await storage.remove(key);
}

export default storage; 