FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./

# Clean install - remove any cached modules and reinstall
RUN rm -rf node_modules package-lock.json && npm install

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev", "--", "--host"]