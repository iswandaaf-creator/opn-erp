.PHONY: up down logs shell-backend shell-web

# Infrastructure
up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

# Backend Helpers
dev-backend:
	cd backend && npm run start:dev

build-backend:
	cd backend && npm run build

# Frontend Helpers
dev-web:
	cd web && npm run dev

build-web:
	cd web && npm run build

# Mobile Helpers
dev-mobile:
	cd mobile && flutter run
