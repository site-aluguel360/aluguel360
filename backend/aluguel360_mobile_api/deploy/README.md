# Deploy da Aluguel360 API

Este diretório contém templates versionáveis para o deploy da API em Ubuntu com Nginx, Gunicorn e Celery. Os arquivos não devem ser copiados para `/etc` sem preencher o domínio, os caminhos de certificado e os IPs autorizados do Admin.

## Pré-requisitos

A Fase 4 exige Python 3.13, PostgreSQL/PostGIS, Redis, Nginx, Certbot, um usuário de sistema `aluguel360`, domínio apontado para o servidor e um arquivo de ambiente protegido em `/etc/aluguel360/aluguel360.env`.

O arquivo de ambiente deve conter todos os valores de `.env.example`, com `DEBUG=False`, `ALLOWED_HOSTS` restrito ao domínio, `DB_SSLMODE=require`, segredos fortes e credenciais externas fornecidas por secret manager ou arquivo com permissões restritas.

## Instalação no staging

```bash
sudo install -d -o aluguel360 -g aluguel360 /opt/aluguel360
sudo install -d -m 750 -o root -g aluguel360 /etc/aluguel360
sudo cp .env /etc/aluguel360/aluguel360.env
sudo chmod 640 /etc/aluguel360/aluguel360.env

sudo cp deploy/nginx/aluguel360-django.conf /etc/nginx/sites-available/aluguel360-django
sudo ln -s /etc/nginx/sites-available/aluguel360-django /etc/nginx/sites-enabled/aluguel360-django
sudo nginx -t

sudo cp deploy/systemd/*.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now aluguel360-django.service
sudo systemctl enable --now aluguel360-celery.service
sudo systemctl enable --now aluguel360-celery-beat.service
sudo systemctl enable --now nginx
```

Antes de ativar HTTPS, emitir o certificado com Certbot e confirmar que os caminhos definidos no template Nginx existem. O Admin deve permanecer bloqueado até que os IPs autorizados da equipe sejam substituídos no arquivo de configuração.

## Validações obrigatórias

```bash
sudo -u aluguel360 /opt/aluguel360/backend/venv/bin/python manage.py check --deploy --settings=config.settings.production
curl -I https://api-mobile.aluguel360.com.br/health
sudo systemctl status aluguel360-django aluguel360-celery aluguel360-celery-beat nginx
sudo journalctl -u aluguel360-django -n 100 --no-pager
```

Não declarar produção pronta sem HTTPS, HSTS, Admin restrito, worker e Beat ativos, Sentry validado e upload de vídeo de 100 MB aprovado. A ativação pública exige revisão manual do servidor e do certificado.
