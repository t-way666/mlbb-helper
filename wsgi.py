from waitress import serve  # type: ignore
from app import app

if __name__ == '__main__':
    serve(app, host='127.0.0.1', port=8080) 