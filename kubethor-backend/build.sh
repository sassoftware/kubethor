#!/bin/bash

echo -e "\033[0;31mℹ️ RUNNING BUILD.SH: Please CHANGE THE API_BASE_URL and API_WS_URL in kubethor-frontend!\033[0m"

# Run npm run build command
cd ../kubethor-frontend
echo "ℹ️ Running npm run build command"
npm run build

# Copy the contents of the dist directory to kubethor-backend
echo "ℹ️ Copy dist folder [React app build to backend]"
rm -r ../kubethor-backend/dist/
cp -r dist ../kubethor-backend

# Now you can execute go build command
cd ../kubethor-backend
echo "ℹ️ Running go build command..."
go build