from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

URL_DATABASE = 'postgresql://postgres:Pp1282Pp@localhost:5432/TaskService' # Đây là địa chỉ giao hàng (Database).

engine = create_engine(URL_DATABASE) # Thằng engine này sẽ giao hàng ở địa chỉ này.

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) # Tạo session để thực hiện các truy vấn đến database.

Base = declarative_base() # Tạo base để định nghĩa các model(các model giống như các bảng trong database). Ánh xạ các model sang các bảng tương ứng trong database.
