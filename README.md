# AMR Battery Monitoring Exporter

## Overview

This application periodically fetches battery status data from an AMR (Autonomous Mobile Robot) API and sends it to a specified Kafka broker. It is designed to run as a Docker container.

## Prerequisites

- You must have [Docker](https://www.docker.com/get-started) installed.

## Installation and Usage

1.  **Clone the Git Repository**

    ```bash
    # Replace <repository-url> with your actual Git repository address.
    git clone <repository-url>
    cd amr-battery
    ```

2.  **Build the Docker Image**

    From the project root directory, run the following command to build the Docker image.

    ```bash
    docker build -t amr-exporter .
    ```

3.  **Run the Docker Container**

    Run the container in the background using the built image. The `--restart always` flag ensures that the container will automatically restart if the server or Docker daemon reboots.

    ```bash
    docker run -d --name amr-exporter-container --restart always amr-exporter
    ```

## Container Management

Basic commands for managing the application container.

-   **Check Real-time Logs**

    ```bash
    docker logs -f amr-exporter-container
    ```

-   **Check Container Status**

    ```bash
    docker ps
    ```

-   **Stop the Container**

    ```bash
    docker stop amr-exporter-container
    ```

-   **Start the Container**

    ```bash
    docker start amr-exporter-container
    ```