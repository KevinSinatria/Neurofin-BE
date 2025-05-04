# NeuroFin Backend AUTH & EXPENSES API  Documentation

NeuroFin Backend API adalah layanan backend yang dirancang untuk mengelola data/pencatatan pengeluaran (expenses). API ini dibangun menggunakan framework **Hapi.js** dan memanfaatkan **PostgreSQL** sebagai database, yang dikelola melalui **Sequelize ORM**.

---
- [ API Auth Origin ](https://github.com/AgungADL/Capstone-backend-auth)
---
## Fitur Utama Expense

- **Menambahkan Pengeluaran (Add Expense)**
- **Melihat Semua Pengeluaran (Get All Expenses)**
- **Melihat Detail Pengeluaran Berdasarkan ID (Get Expense by ID)**
- **Memperbarui Pengeluaran Berdasarkan ID (Update Expense by ID)**
- **Menghapus Pengeluaran Berdasarkan ID (Delete Expense by ID)**

---

## Struktur Database

```sql
CREATE TABLE expenses (
    expenseid VARCHAR(11) PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    uangmasuk NUMERIC(15, 2) DEFAULT 0.00,
    uangkeluar NUMERIC(15, 2) DEFAULT 0.00,
    uangakhir NUMERIC(15, 2) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL
);
```

---

## Instalasi

### Clone Repository
```bash
git clone <repository-url>
cd NeuroFin
```

### Instal Dependencies
```bash
npm install
```

### Konfigurasi Database
Ganti file `config/config.example.json` menjadi `config/config.json`
```
kemudian isi keterangannya.
"development": {
    "username": "username",
    "password": "password",
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
```
  
### .Env
Ganti file `.env.example` menjadi `.env` dan sesuaikan isi konfigurasinya
```
EMAIL_SERVICE=gmail
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_app_password
JWT_SECRET=jwtsecret
PORT=9000
```


### Migrasi Database
```bash
npx sequelize-cli db:migrate
```

### Menjalankan Server di Local
```bash
npm run dev
```
Server akan berjalan di [http://localhost:9000](http://localhost:9000).

---

## Endpoint API Expense
- **URL:** `POST /expenses`
- **Headers:** `Content-Type: application/json`
- **Headers:** `Authorization: Bearer {{authToken}}`
- **Body:**
  ```json
  {
    "category": "Food",
    "uangMasuk": 0,
    "uangKeluar": 50000,
    "uangAkhir": 950000,
    "description": "Lunch with friends",
    "transaction_date": "2025-03-28"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "message": "Expense berhasil ditambahkan",
    "data": {
      "expenseid": "random11char"
    }
  }
  ```

### 2. Get All Expenses

- **URL:** `GET /expenses`
- **Response:**
  ```json
  {
    "status": "success",
    "data": {
      "expenses": [
        {
          "expenseid": "random11char",
          "category": "Food",
          "uangmasuk": 0,
          "uangkeluar": 50000,
          "uangakhir": 950000,
          "description": "Lunch with friends",
          "transaction_date": "2025-03-28",
          "createdAt": "2025-03-28T12:00:00.000Z",
          "updatedAt": "2025-03-28T12:00:00.000Z"
        }
      ]
    }
  }
  ```

### 3. Get Expense by ID

- **URL:** `GET /expenses/{expenseid}`

- **Response (Jika Ditemukan):**
  ```json
  {
    "status": "success",
    "data": {
      "expense": {
        "expenseid": "random11char",
        "category": "Food",
        "uangmasuk": 0,
        "uangkeluar": 50000,
        "uangakhir": 950000,
        "description": "Lunch with friends",
        "transaction_date": "2025-03-28",
        "createdAt": "2025-03-28T12:00:00.000Z",
        "updatedAt": "2025-03-28T12:00:00.000Z"
      }
    }
  }
  ```

- **Response (Jika Tidak Ditemukan):**
  ```json
  {
    "status": "fail",
    "message": "Expense tidak ditemukan"
  }
  ```

### 4. Update Expense by ID

- **URL:** `PUT /expenses/{expenseid}`
- **Headers:** `Content-Type: application/json`
- **Headers:** `Authorization: Bearer {{authToken}}`
- **Body:**
  ```json
  {
    "category": "Transport",
    "uangMasuk": 0,
    "uangKeluar": 20000,
    "uangAkhir": 930000,
    "description": "Taxi fare",
    "transaction_date": "2025-03-28"
  }
  ```
- **Response (Jika Berhasil):**
  ```json
  {
    "status": "success",
    "message": "Expense berhasil diperbarui"
  }
  ```
- **Response (Jika Tidak Ditemukan):**
  ```json
  {
    "status": "fail",
    "message": "Expense gagal diperbarui. Id tidak ditemukan"
  }
  ```

### 5. Delete Expense by ID

- **URL:** `DELETE /expenses/{expenseid}`
- **Response (Jika Berhasil):**
  ```json
  {
    "status": "success",
    "message": "Expense berhasil dihapus"
  }
  ```
- **Response (Jika Tidak Ditemukan):**
  ```json
  {
    "status": "fail",
    "message": "Expense gagal dihapus. Id tidak ditemukan"
  }
  ```

---

## Error Handling

Semua error dikembalikan dalam format berikut:
```json
{
  "status": "fail",
  "message": "Deskripsi error"
}
```

---

## Testing

Gunakan file Postman Collection pada folder postman untuk menguji API:
- **Collection:** `[NeuroFin] Expense API TEST.postman_collection.json`
- **Environment:** `[NeuroFin] Expenses API Environtment.postman_environment.json`

---

## Kontributor

- **Backend Developer:** Rayan Khairullah Al Rafy  & [ Agung Arya Dwipa Laksana ](https://github.com/AgungADL/Capstone-backend-auth)
- **From:** NeuroFin Project
