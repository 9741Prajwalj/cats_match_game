# Cat Crush Game - Docker Setup

This project is a simple web-based match-3 game called "Cat Crush". This README provides instructions on how to build and run the game using Docker.

## Prerequisites

- Docker installed on your system. You can download it from [https://www.docker.com/get-started](https://www.docker.com/get-started).

## Building the Docker Image

Open a terminal or command prompt in the project directory (where the `Dockerfile` is located) and run the following command to build the Docker image:

```bash
docker build -t cat-crush-game .
```

This command builds the Docker image and tags it as `cat-crush-game`.

## Running the Docker Container

After building the image, run the container with the following command:

```bash
docker run -p 8000:8000 cat-matcher-game
```

This command maps port 8000 on your local machine to port 8000 inside the container.

## Accessing the Game

Open your web browser and navigate to:

```
http://localhost:8000
```

You should see the Cat Crush game load and be able to play it.

## Stopping the Container

To stop the running container, press `Ctrl+C` in the terminal where the container is running.

## Pushing the Image to Docker Hub

If you want to share or deploy your image on Docker Hub, follow these steps:

1. **Tag the image** with your Docker Hub username and repository name:
   ```bash
   docker tag cat-crush-game your-dockerhub-username/cat-crush-game
   ```

2. **Log in to Docker Hub**:
   ```bash
   docker login
   ```
   Enter your Docker Hub username and password when prompted.

3. **Push the image** to Docker Hub:
   ```bash
   docker push your-dockerhub-username/cat-crush-game
   ```

Replace `your-dockerhub-username` with your actual Docker Hub username.

## Notes

- The Dockerfile uses a lightweight Python HTTP server to serve the static files.
- Make sure port 8000 is not in use by another application on your machine before running the container.

## Troubleshooting

- If you encounter issues building or running the Docker container, ensure Docker is properly installed and running.
- Check for any error messages in the terminal and verify that the project files are in the correct directory.

Enjoy playing Cat Crush!
