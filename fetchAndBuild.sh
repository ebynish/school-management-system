#!/bin/bash

# Array of GitHub repository URLs
declare -A repos=(
  ["nestjs-app1"]="https://github.com/yourusername/nestjs-app1.git"
  ["nestjs-app2"]="https://github.com/yourusername/nestjs-app2.git"
  ["nestjs-app3"]="https://github.com/yourusername/nestjs-app3.git"
  ["nestjs-app4"]="https://github.com/yourusername/nestjs-app4.git"
  ["nestjs-app5"]="https://github.com/yourusername/nestjs-app5.git"
  ["react-app"]="https://github.com/yourusername/react-app.git"
)

# Function to clone or update repositories
fetch_repo() {
  local app_dir=$1
  local repo_url=$2

  if [ -d "$app_dir" ]; then
    echo "Updating repository $app_dir..."
    git -C "$app_dir" pull
  else
    echo "Cloning repository $repo_url into $app_dir..."
    git clone "$repo_url" "$app_dir"
  fi
}

# Loop through each repository and fetch the latest code
for app in "${!repos[@]}"; do
  fetch_repo "$app" "${repos[$app]}"
done

# Build and run the Docker containers with Docker Compose
echo "Building and starting Docker containers..."
docker-compose up --build -d

echo "All applications are up and running."
