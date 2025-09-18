# Use the official Python image
FROM python:3.9-alpine

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container
COPY . /app

# Expose port 8000
EXPOSE 8000

# Start the simple HTTP server
CMD ["python", "-m", "http.server", "8000"]
