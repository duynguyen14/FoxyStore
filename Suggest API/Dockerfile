FROM python:3.13-slim
WORKDIR /app
COPY requirements.txt /app/requirements.txt
COPY ./ /app
RUN pip install --upgrade pip && pip install -r requirements.txt
EXPOSE 8000
# 6. Run the app with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]