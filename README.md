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