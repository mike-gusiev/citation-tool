FROM node:18

WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm install


# Копируем файлы приложения
COPY . .

# Открываем порты
EXPOSE 3001

# Команда запуска
CMD ["npm", "start"]