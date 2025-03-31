from fastapi import Request
import time
import logging


# Cấu hình logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def logging_middleware(request: Request, call_next):
    start_time = time.time()
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        
        # Lấy thông tin user nếu có
        user_id = getattr(request.state, "user_id", None)
        user_info = f" - User: {user_id}" if user_id else ""
        
        logger.info(
            f"{request.method} {request.url.path} - {response.status_code} - {process_time:.2f}s{user_info}"
        )
        return response
    except Exception as e:
        process_time = time.time() - start_time
        logger.error(
            f"{request.method} {request.url.path} - Error: {str(e)} - {process_time:.2f}s"
        )
        raise