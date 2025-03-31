import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Lấy đường dẫn đến thư mục gốc của backend
BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / 'setting.env'
logger.info(f"Loading .env from: {env_path}")
logger.info(f"File exists: {os.path.exists(env_path)}")

# Load environment variables
load_dotenv(env_path)

def send_reset_password_email(email: str, token: str) -> bool:
    logger.info(f"Starting to send reset password email to: {email}")
    try:
        # Cấu hình SMTP
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        
        # Đọc trực tiếp từ file .env
        logger.debug("Reading SMTP credentials from .env file")
        with open(env_path, 'r') as f:
            env_vars = {}
            for line in f:
                if line.strip() and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    env_vars[key] = value

        sender_email = env_vars.get('SMTP_USERNAME')
        sender_password = env_vars.get('SMTP_PASSWORD')

        # Debug
        logger.debug(f"SMTP_USERNAME: {sender_email}")
        logger.debug(f"SMTP_PASSWORD length: {len(sender_password) if sender_password else 0}")

        if not sender_email or not sender_password:
            logger.error("Error: SMTP credentials not found in environment variables")
            return False

        # Tạo message
        logger.debug("Creating email message")
        msg = MIMEMultipart()
        msg['From'] = f"Management Habit <{sender_email}>"
        msg['To'] = email
        msg['Subject'] = "Đặt lại mật khẩu"

        # Tạo nội dung email
        reset_link = f"http://localhost:3000/reset-password?token={token}"
        body = f"""
        Xin chào,

        Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng click vào link sau để đặt lại mật khẩu:

        {reset_link}

        Link này sẽ hết hạn sau 30 phút.

        Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.

        Trân trọng,
        Task Management Team
        """

        msg.attach(MIMEText(body, 'plain'))

        # Kết nối và gửi email
        logger.info(f"Connecting to SMTP server: {smtp_server}:{smtp_port}")
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            logger.debug("Starting TLS")
            server.starttls()
            logger.debug("Logging in to SMTP server")
            server.login(sender_email, sender_password)
            logger.debug("Sending email")
            server.send_message(msg)

        logger.info(f"Email sent successfully to {email}")
        return True
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        logger.debug(f"Current working directory: {os.getcwd()}")
        logger.debug(f"Environment variables: {dict(os.environ)}")
    return False