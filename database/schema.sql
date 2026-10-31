PRAGMA foreign_keys = ON;

-- 1. 飼主資料表
CREATE TABLE Owners (
    owner_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT
);

-- 2. 寵物資料表
CREATE TABLE Pets (
    pet_id INTEGER PRIMARY KEY,
    owner_id INTEGER,
    name TEXT NOT NULL,
    species TEXT NOT NULL,
    breed TEXT,
    gender TEXT,
    birth_date TEXT,
    adoption_date TEXT,
    FOREIGN KEY (owner_id) REFERENCES Owners(owner_id)
);

-- 3. 餵食紀錄資料表
CREATE TABLE FeedingRecords (
    feeding_id INTEGER PRIMARY KEY,
    pet_id INTEGER,
    food_name TEXT NOT NULL,
    amount REAL,
    unit TEXT,
    feeding_time TEXT,
    notes TEXT,
    FOREIGN KEY (pet_id) REFERENCES Pets(pet_id)
);

-- 4. 體重紀錄資料表
CREATE TABLE WeightRecords (
    weight_id INTEGER PRIMARY KEY,
    pet_id INTEGER,
    weight REAL NOT NULL,
    recorded_at TEXT,
    notes TEXT,
    FOREIGN KEY (pet_id) REFERENCES Pets(pet_id)
);

-- 5. 疫苗紀錄資料表
CREATE TABLE VaccinationRecords (
    vaccine_id INTEGER PRIMARY KEY,
    pet_id INTEGER,
    vaccine_name TEXT NOT NULL,
    vaccination_date TEXT,
    next_due_date TEXT,
    notes TEXT,
    FOREIGN KEY (pet_id) REFERENCES Pets(pet_id)
);
