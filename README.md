<p align="center">
  <a href="" rel="noopener">
 <img width=280px height=200px src="https://camo.githubusercontent.com/e21ea375e60f3021851f49fe33206849b61a9648a489bace5931f340ab004679/68747470733a2f2f7777772e677265656e2d66656174686572732e636f2e756b2f63646e2f73686f702f61727469636c65732f616e696d616c2d616e696d616c2d776f726c642d626c75722d3230373930305f34303030782e6a70673f763d31353637373030343032" alt="Project logo"></a>
</p>

<h3 align="center">Ticketzinho</h3>

<div align="center">

  [![Status](https://img.shields.io/badge/status-active-success.svg)]() 
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> My personal take on a Public Transportation Ticket System in attempt to create a usable program that aligns with the Node.js best practices by <a href="https://github.com/goldbergyoni/nodebestpractices">Practica.js</a>
    <br> 
</p>


## 📝 Table of Contents
- [About](#about)
- [Built Using](#built_using)
- [Architecture](#architecture)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Deployment](#deployment)
- [Todo] (#todo)

## 🧐 About <a name = "about"></a>
The project is a personal take on a  Public Transportation Ticketing System, where users can sign up and login, buy tickets and monthly passes that can be validated and the ticket controllers can check the validity using the QR code provided by the application.

## ⛏️ Built Using <a name = "built_using"></a>
- [Qwik.js](https://qwik.builder.io/) - Client Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment
- [Express](https://expressjs.com/) - Server Framework
- [Supabase](https://supabase.com) - Authentication
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Nginx](https://www.nginx.com/) - Load balancing and reverse proxy

## Architecture <a name = "architecture"></a>

![architecture of the app](https://i.imgur.com/16iMVTl.png)

The application consists of:
- #### Frontend
   Written in Qwik.js with TypeScript, uses Supabase for handling authenticating and authorizing users, with http-only cookies. It uses JWT for access- and refresh tokens.

- #### API
   Express.js API with TypeScript, it can be used together with the Frontend, in which case it handles the tickets and orders of the users. It can also act as a completely separate REST API, for this purpose it has all the models  and endpoints that are necessary for creating new users, roles and permissions. It uses a dockerized PSQL database as dev/testing database.

## 🏁 Getting Started <a name = "getting_started"></a>
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites
The project is currently ongoing, so the containerization of all of the elements has not been finished yet. 
In order to run the project, you will need [Node.js](https://nodejs.org/en) and [Npm](https://npmjs.com) installed as well as [Docker](https://docker.com) and [Docker-Compose](https://docker.com).
You will also need [git](https://git-scm.com/) and you will have to clone the project to your computer.

### Installing

#### Frontend

Open the frontend folder in your terminal and install the dependencies, by running `npm install`. To run the application in development mode, run the `npm run dev` command, open your browser of choice and put `localhost:5173` in your url bar.

#### Backend

Open the backend folder in your terminal and install the dependencies, by running `npm install`. To start the test database go to `backend/services/ticket-service` folder and run `docker-compose -f ./test/docker-compose.yml up -d` that will start a test database. In order to have initial data, in the same folder run `npm run db:migrate` which will build the tables in the database based on the models and `npm run db:seed` which will populate those tables with some mock values. 
In order to run the API use `npm run start:dev` which will start the application on port `3005`.

#### Proxy

In order to utilize Nginx as a reverse proxy you will find a Proxy folder in the repository with an included Dockerfile. To build the image run `docker build -t IMAGENAME .`. After the image is built you can run it with `docker run -p 80:80 IMAGENAME` where IMAGENAME is the name you gave to the built image. This command will start a docker container that has the custom nginx configuration, which will work as a [load balancer](https://www.nginx.com/resources/glossary/load-balancing/) as well as a [reverse proxy](https://www.nginx.com/resources/glossary/reverse-proxy-server/).

## 🔧 Running the tests <a name = "tests"></a>
### Frontend
 TODO!

### Backend

In order to run the tests on the backend, you will need to open `backend/services/ticket-service` folder in your terminal and run `npm run test` command. Every time the tests are being run the test database is being started by Docker and the test data is being saved in this clean slate database. 

## 🎈 Usage <a name="usage"></a>
 TODO!

## 🚀 Deployment <a name = "deployment"></a>
 TODO!


## Todo <a name="todo"></a>

- [ ] shop and tickets components
- [ ] stripe integration
- [ ] admin role
- [ ] css for all components
- [ ] fix integration test for auth on the backend
- [ ] unit tests for service functions on the backend 
- [ ] frontend tests
- [ ] add deployment documentation
- [ ] add usage documentation




