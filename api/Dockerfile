FROM python:3.12-slim
WORKDIR /app
RUN pip install --no-cache-dir poetry
COPY api/pyproject.toml api/poetry.lock /app/
RUN poetry config virtualenvs.create false && poetry install --no-interaction --no-root
COPY api /app/
EXPOSE 8000
CMD ["poetry", "run", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]