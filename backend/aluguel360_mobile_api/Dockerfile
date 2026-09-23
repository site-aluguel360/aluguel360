FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y \
    binutils \
    libproj-dev \
    gdal-bin \
    libgdal-dev \
    python3-gdal \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements/base.txt requirements/development.txt /app/requirements/
RUN pip install --no-cache-dir -r requirements/development.txt

COPY . /app/
