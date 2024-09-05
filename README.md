# Kubethor

Kubethor is a Kubernetes management web application built using Go and React. It provides a user-friendly interface to manage and monitor Kubernetes clusters efficiently. 

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Dockerhub](https://img.shields.io/badge/dockerhub-images-important.svg?logo=Docker)](https://hub.docker.com/r/kubethor/kubethor)
[![Static Badge](https://img.shields.io/badge/youtube-channel?logo=youtube&label=Tutorial&color=%23FF0000)](https://www.youtube.com/watch?v=Lt12M7kNoPE)
[![Static Badge](https://img.shields.io/badge/wiki-pedia?logo=wikipedia&label=Documentation)](https://github.com/sassoftware/kubethor/wiki/Kubethor-Documentation-Hub)

## Table of Contents

- [Features](#features)
- [Built With](#built-with)
- [Docker Image](#docker-image)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
  - [Running the Application as Standalone](#running-the-application-as-standalone)
  - [Build and Run Docker Image](#build-and-run-docker-image)
  - [Kubernetes Deployment](#kubernetes-deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Cluster Management:** Easily manage multiple Kubernetes clusters.
- **Resource Monitoring:** Visualize and monitor Kubernetes resources such as Pods, Services, Deployments, etc.
- **Log Aggregation:** Centralized logging to view logs from different containers.
- **Resource Editor:** Edit Kubernetes resources directly from the web interface.
- **Resource Delete:** Delete Kubernetes resources with ease.
- **Resource Detail View:** View detailed information about Kubernetes resources.
- **Switch Between Namespaces:** Seamlessly switch between different namespaces to manage resources.

## Built with

- Frontend

  - [React](https://react.dev/): A JavaScript library for building user interfaces.
  - [Flowbite](https://flowbite.com/): UI components built with Tailwind CSS.

- Backend
  - [Go (Golang)](https://go.dev/): The programming language used for the backend.
  - [Kubernetes Client](https://pkg.go.dev/k8s.io/client-go/kubernetes): Client library for interacting with Kubernetes clusters.
 
## Docker Image

1. Pull the Docker Image: `docker pull kubethor/kubethor`
2. Run the Docker Container: `docker run -p 8080:8080 kubethor/kubethor`
3. Access the application via http://localhost:8080 on your browser.

For more details about the Docker image, visit the [Kubethor Docker Hub page](https://hub.docker.com/r/kubethor/kubethor).

## Folder Structure

Here's an overview of the project structure:

```
kubethor/
├── kubethor-frontend/          # React frontend
│   ├── public/                 # Public assets
│   ├── src/                    # React source code
│       ├── assets              # Contains frontend assets
│       ├── components          # Contains commonly used hooks and components
│       ├── layouts             # Contains common page layouts
│       ├── pages               # Contains pages component
│       ├── App.jsx
│       └── ...                 # Other frontend files
│   ├── package.json            # Node.js dependencies
│   └── ...                     # Other frontend files
│
├── kubethor-backend/           # Go backend
│   ├── main.go                 # Main Go application
│   ├── go.mod                  # Go module dependencies
│   ├── api                     # Contains api's
│   ├── config                  # Contains configuration
│   ├── build.sh                # Build script for standalone app
│   ├── k8s.yaml                # Kubernetes deployment file
│   ├── Dockerfile              # Kubernetes deployment file
│   ├── dist                    # Compiled React build (Need to copy from frontend folder after build)
│   └── ...                     # Other backend files and folders
│
├── README.md                   # Project README
└── ...                         # Other project files
```

- `kubethor-frontend/`

  - `public/`: Contains static assets such as images, fonts, and the index.html file that serves as the entry point for the React application.
  - `src/`: The main source code for the React application.
    - `assets/`: Contains frontend assets such as images, icons, and styles.
    - `components/`: Contains reusable React components and hooks used throughout the application.
    - `layouts/`: Contains layout components that define the structure of common page layouts.
    - `pages/`: Contains page components that represent different views or routes in the application.
    - `App.jsx`: The main application component that sets up the routing and renders the core layout of the application.
  - `package.json`: Defines the Node.js dependencies and scripts for the frontend project.

- `kubethor-backend/`
  - `main.go`: The main Go application file that initializes and runs the backend server.
  - `go.mod`: Defines the Go module dependencies for the backend project.
  - `api/`: Contains the API implementations that the backend server exposes.
  - `config/`: Contains configuration files for different environments and settings used by the backend.
  - `build.sh`: A build script used to compile the standalone backend application and manage the build process.
  - `k8s.yaml`: The Kubernetes deployment file that specifies how to deploy the backend application on a Kubernetes cluster.
  - `Dockerfile`: The Docker build file used to create a Docker image for the backend application.
  - `dist/`: A directory where the compiled React build is copied from the frontend folder after the build process. This allows the backend to serve the frontend application.

## Getting Started

### Prerequisites

- [Go](https://golang.org/doc/install) (version 1.16 or higher)
- [Node.js](https://nodejs.org/) (version 18.x or higher)
- [Docker](https://www.docker.com/get-started) (optional, for containerized deployment)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) (for interacting with Kubernetes clusters)

Video: [![YouTube](http://i.ytimg.com/vi/Lt12M7kNoPE/hqdefault.jpg)](https://www.youtube.com/watch?v=Lt12M7kNoPE)


### Installation

1. **Clone the repository:**

   ```sh
   git clone git@github.com:sassoftware/kubethor.git
   cd kubethor
   ```

2. **Frontend Setup:**

   - Navigate to the `kubethor-frontend` directory:

     ```sh
     cd ../kubethor-frontend
     ```

   - Install the dependencies:

     ```sh
     npm install
     ```
     If any error use: 

     ```sh
     npm config set registry https://registry.npmjs.org/
     npm install --verbose
     ```

   - Build the React app:

     ```sh
     npm run build
     ```

   - For running React app in Development Environment:

     ```sh
     npm run dev
     ```

3. **Backend Setup:**

   - Navigate to the `kubethor-backend` directory:

     ```sh
     cd ../kubethor-backend
     ```

   - Copy dist folder [React app build to backend] from `kubethor-frontend` into `kubethor-backend` directory:

     ```sh
     cp -r ../kubethor-frontend/dist/ ../kubethor-backend
     ```

   - Download all dependencies:

     ```sh
     go mod download
     ```

   - Build the Go application:

     ```sh
     go build -o kubethor-backend
     ```

### Running the Application

1. **Start the Backend:**

   - Navigate to the `backend` directory:

     ```sh
     cd kubethor-backend
     ```

   - Run the Go application:

     ```sh
     ./kubethor-backend
     ```

   The backend application will run on `http://localhost:8080`.

2. **Start the Frontend:**

   - Navigate to the `frontend` directory:

     ```sh
     cd ../kubethor-frontend
     ```

   - Start the development server:

     ```sh
     npm run dev
     ```

   The frontend application will run on `http://localhost:3000`.

### Running the Application as Standalone

1. **Build the Standalone Application:**

   - Navigate to the `kubethor-backend` directory:

     ```sh
     cd kubethor-backend
     ```

   - Run the `build.sh` script:

     ```sh
     ./build.sh
     ```

   > **Note:** The `build.sh` script builds the React application, copies it into the `kubethor-backend` folder, and then embeds it into the Go executable. This single executable can be run to serve the entire application on `http://localhost:8080` without needing to run the frontend separately.

2. **Run the Standalone Application:**

   - After running `build.sh`, start the application:

     ```sh
     ./kubethor-backend
     ```

   The application will be available at `http://localhost:8080`.

### Build and Run Docker Image

As the Docker image is also a type of standalone application, ensure you copy the latest `dist` folder into the `kubethor-backend` folder. If you are building the image to deploy on a host server, make sure to change the `API_BASE_URL` and `API_WS_URL` in `kubethor-frontend` with your host name. The `build.sh` script builds the React application, copies it into the `kubethor-backend` folder. It is good to run `build.sh` before building your docker image.

1. **Build the Docker Image:**

   - Navigate to the `kubethor-backend` directory:

     ```sh
     cd kubethor-backend
     ```

   - Build the Docker image:

     ```sh
     docker build --no-cache -t kubethor-backend .
     ```

2. **Run the Docker Container:**

   - Run the Docker container:

     ```sh
     docker run -p 8080:8080 kubethor-backend
     ```

3. **Push to Docker Registry:**

   - Log in to your Docker registry:

     ```sh
     docker login YOUR_REGISTERY.com
     ```

   - Tag the Docker image:

     ```sh
     docker tag kubethor-backend:latest YOUR_REGISTERY.com/kubethor/kubethor-backend:latest
     ```

   - Push the Docker image:

     ```sh
     docker push YOUR_REGISTERY.com/kubethor/kubethor-backend
     ```

### Kubernetes Deployment

1. **Deploy to Kubernetes Cluster:**

   - Navigate to the `kubethor-backend` directory:

     ```sh
     cd kubethor-backend
     ```

   - Ensure you have a Kubernetes cluster running and `kubectl` configured to interact with it.
   - Update the `k8s.yaml` file in the `kubethor-backend` directory with your **Docker image link and host URL**:

   - Apply the Kubernetes configuration:

     ```sh
     kubectl apply -f k8s.yaml -n my-namespace
     ```

   - After successful deployment, go to your host url

   > **Note:** Ensure you have the necessary permissions to deploy resources to your Kubernetes cluster. The `k8s.yaml` file contains the configuration for deploying the Kubethor application, including deployment, service, ingress, and horizontal pod autoscaler and other resources needed for the application to run in a Kubernetes environment.

## Support

### GitHub Issues

See the [SUPPORT.md](SUPPORT.md) file for information on how to open an issue against this repository.

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the Apache 2.0 License. See the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or support, please reach out to:

- [Huzaib Sayyed](mailto:huzaib.sayyed@gmail.com)
- [Vishal Kulkarni](mailto:vishalkulkarniind@gmail.com)
