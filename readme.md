# Mongo Sentinel

## Introduction 🚀

The MongoDB Sentinel application is designed to monitor and capture all communication between MongoDB and the applications interacting with it. It listens to the communication at the lowest layer of the OSI model, starting from the TCP layer. From there, it decodes the MongoDB Wire Protocol, effectively parsing and analyzing all MongoDB transactions that pass through the network.

The application provides flexibility in how the captured data is handled:

* **Local Storage**: Logs can be stored locally for quick access and analysis. 🗄️
* **MongoDB Collection**: Alternatively, the transactions can be logged into a MongoDB collection for further querying, reporting, or archival purposes. 📊

By decoding and logging these transactions, the MongoDB Sentinel ensures deep visibility into the interaction between applications and the MongoDB server, offering valuable insights into the queries, updates, and other operations being performed in real-time. 🔍

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![NPM](https://img.shields.io/badge/NPM-CB3837?style=for-the-badge&logo=npm&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) ![PCAP](https://img.shields.io/badge/PCAP-007ACC?style=for-the-badge&logo=wireshark&logoColor=white) ![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

# Installation 🛠️

## 📋 Requirements
To run the application locally or via Docker, you will need the following:

* Node.js (v19 or higher) 🟢
* Docker (for containerized runs) 🐳
* sudo access (required for packet capturing) 🔐

| Requirement         | Description                                                                                       |
|---------------------|---------------------------------------------------------------------------------------------------|
| Node.js             | v19 or higher                                                                                     |
| Docker              | For containerized runs                                                                            |
| sudo access         | Required for packet capturing                                                                     |

## 🌐 Environment Variables

Before running the application, ensure the environment variables are set up correctly. The following environment variables are used by the application:

| Variable            | Description                                                                                       | Example                                                                                       |
|---------------------|---------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| MONGO_URI           | MongoDB connection string for the main database.                                                  | `mongodb://127.0.0.1:27017/mongo-sentinel?authSource=admin`                                   |
| MONGO_LOG_URI       | MongoDB connection string for the logging database.                                               | `mongodb://127.0.0.1:27017/mongo-sentinel?authSource=admin`                                   |
| STORAGE_TYPE        | Defines where logs will be stored. Options are local or mongodb.                                  | `"local"` or `"mongodb"`                                                                      |
| LOG_FILE_LOCATION   | Directory for log file storage (used when STORAGE_TYPE is set to local).                          | `"/home/ubuntu/logs"`                                                                         |

### 📝 Example Env
```
MONGO_URI=mongodb://127.0.0.1:27017/mongo-sentinel?authSource=admin
MONGO_LOG_URI=mongodb://127.0.0.1:27017/mongo-sentinel?authSource=admin
STORAGE_TYPE=local
LOG_FILE_LOCATION=/home/ubuntu/logs
```

### 💻 Running Locally

#### Step 1: Install Dependencies

Ensure that Node.js and npm are installed. Navigate to your project folder and install the necessary dependencies:

```
npm install
```

#### Step 2: Build the Application

```
npm run build
```

#### Step 3: Set Environment Variables

Create a .env file in your project’s root directory with the required environment variables (as shown above).

#### Step 4: Run the Application

```
sudo node ./dist/index.js

or

sudo npm run start
```

---

### 🐳 Running with Docker

#### Step 1: Build Docker Image

From the project root, build the Docker image:
```
docker build -t mongo-sentinel:1.0.0 .
```

#### Step 2: Prepare Environment File

Create a file named example.env with your environment variables (as shown above). This file will be used to pass environment variables into the Docker container.

#### Step 3: Run the Docker Container
Use the following command to run the application within a Docker container:
```
sudo docker run -d -it \
    --name sentinel \
    --env-file /path/to/example.env \
    --network host \
    -v /home/dodosec/logs:/app/logs \
    mongo-sentinel:1.0.0
```

* --env-file: Points to the environment file you created earlier.
* --network host: Allows the container to use the host network, enabling access to MongoDB running on the host machine.
* -v /home/ubuntu/logs:/app/logs: Mounts the local logs directory to the container.

#### Step 4: Access Logs

If you have set **STORAGE_TYPE=local**, you can find the log files at /home/dodosec/logs on your host machine. If logs are being stored in **MongoDB**, they will be available in the **sentinellogtrnxs** collection.

---

# Conclusion 🎉

You can now run the MongoDB Sentinel application both locally and within Docker. Be sure to configure the environment variables correctly for your preferred setup. The application will log all MongoDB transactions, either to a local file or to a MongoDB collection, based on your configuration.

## 🌟 Stargazers

Show your support by giving us a star on GitHub! ⭐

[![Stargazers repo roster for @dodosec/mongo-sentinel](https://reporoster.com/stars/dodosec/mongo-sentinel)](https://github.com/DogukanGezer/mongo-sentinel/stargazers)