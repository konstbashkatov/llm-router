# O2GPT

Корпоративная платформа для работы с LLM на базе LibreChat.

## Быстрый старт

```bash
# 1. Клонировать репозиторий
git clone https://github.com/konstbashkatov/llm-router.git
cd llm-router

# 2. Создать .env файл
cp .env.example .env
# Отредактировать .env, добавить OPENROUTER_KEY и JWT секреты

# 3. Запустить
docker compose up -d

# 4. Открыть в браузере
# http://localhost:3080
```

## Структура проекта

```
├── docker-compose.yml      # Docker конфигурация
├── .env                    # Секреты (не в git)
├── librechat.yaml          # Конфиг LibreChat
├── nginx/                  # Reverse proxy + SSL
├── o2gpt-api/              # FastAPI backend (в разработке)
└── o2gpt-admin/            # React admin panel (в разработке)
```

## Документация

- [PRD](docs/o2gpt-prd.md) - Требования к продукту
- [Tech Spec](docs/o2gpt-tech-spec.md) - Техническое задание
