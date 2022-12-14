## Requirements

Naming constraint 
```
  class                                 # ClassName (Uppercase 1st letter)
  medthod & function                    # cameCase
  variable & class attribute            # snanke_case
```

code architecture objective & behavior
```
 Entity class                       # ใช้สำหรับเป็น Concrete class หรือเป็น prototype ของข้อมูล object นั้น ๆ
 Controller & resolver class        # เป็น interface ที่สำหรับติดต่อกับภายนอกหน้าที่หลัก ๆ คือการกำหนด input type , หรือการทำ validateion ที่ไม่ซับช้อนมาก
 Service class                      # ทำหน้าที่จัดการ bussines logic ที่รับข้อมูลมาจาก controller และจะทำการ validation ข้อมูลที่ซับซ้อนเพื่อป้อนไปที่ repository class
 Repository class                   # ทำหน้าที่ Database Interface จะไม่มีการ validate ข้อมูลที่ซับซ้อน หน้าที่คือการเพิ่ม ,ลบ , อ่าน ,เขียน ลงไป database
```
## Environment Variables (.env file)

To run this project, you will need to add the following environment variables to your .env file

```
PASSWORD_SALT=YOUR_PASSWORD_SALT_AS_A_INTEGER

PORT=YOUR_LOCAL_DEVELOPMENT_PORT

DATABASE_PORT=YOUR_DATABASE_PORT

DATABASE_USERNAME=YOUR_DATABASE_USERNAME

DATABASE_PASSWORD=YOUR_DATABASE_PASSWORD

DATABASE_NAME=YOUR_DATABASE_NAME

TOKEN_SECRET=YOUR_TOKEN_SECRET

TOKEN_EXPIRES_IN=YOUR_TOKEN_EXPIRE_IN ex:60, "2 days", "10h", "7d" more : https://www.npmjs.com/package/jsonwebtoken
```



## Run Locally

Clone the project

```bash
  git clone https://github.com/OSCE-KMITL/osce-backend
```

Install dependencies

```bash
  npm install
```

Start docker-compose

```bash
  docker-compose up -d
```
Stop docker-compose

```bash
  docker-compose down
```

Start the server

```bash
  npm start
```

Project structure

    .
    ├── ...
    ├── src                     
    │   ├── modules             # Features of application 
    │   ├── shared              # Something Common to use and globally behavior such as Dto , type , enum
    │   └── utils               # Helper utilities such as pure function , helper function ,etc
    └── ...