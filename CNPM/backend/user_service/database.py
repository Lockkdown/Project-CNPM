from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

"""
+ create_engine là gì? -> tạo engine (hiểu nôm na là shipper) để kết nối với database.
+ sessionmaker là gì? -> tạo session để thực hiện các truy vấn (thêm, xóa, sửa) đến database.
+ declarative_base là gì? -> tạo base để định nghĩa các model.
"""

URL_DATABASE = 'postgresql://postgres:123456@localhost:5432/UserService' # Đây là địa chỉ giao hàng (Database).

engine = create_engine(URL_DATABASE) # Thằng engine này sẽ giao hàng ở địa chỉ này.

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) # Tạo session để thực hiện các truy vấn đến database.

"""
+autocommit là gì ? -> Tự động lưu vĩnh viễn dữ liệu 
+attoflush là gì ?  -> Tự động đẩy dữ liệu lên database
+bind=engine là gì ? -> Liên kết session với engine đã tạo, nghĩa là các phiên sẽ sử dụng engine này để kết nối tới cơ sở dữ liệu.
"""

Base = declarative_base() # Tạo base để định nghĩa các model(các model giống như các bảng trong database). Ánh xạ các model sang các bảng tương ứng trong database.
