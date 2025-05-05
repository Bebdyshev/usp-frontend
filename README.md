# Единый профиль учащигося

## Installation

### Standard Installation

Frontend:

```bash
npm i
npm run dev
```
Backend:
[Backend repository](https://github.com/Bebdyshev/usp-backend)
```bash
pip install -r requirements.txt
uvicorn app:app --reload
```

### Docker Installation

This project can also be run using Docker:

1. Build and start the container:

```bash
# Using docker compose (recommended)
docker-compose up -d

# Or using Docker directly
docker build -t usp-frontend .
docker run -p 3000:3000 usp-frontend
```

2. Access the application at http://localhost:3000

## Contributing

Pull requests are not welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.
