# Budget Board

This project is in development! Expect breaking changes!

## About The Project

After a certain free budgeting app was closed down, I created this app with the goal of a simple and focused app for monthly budgeting and tracking financial goals.

I've created this mostly for personal use, so development will probably be sporadic and guided by whatever I find useful.

Feel free to leave feedback!

## Getting Started

### Prerequisites

#### Mandatory

- Docker Compose

- A [PostgreSQL](https://www.postgresql.org/) database

  - You can either self-host this or choose a cloud provider. There are several that offer free tiers for personal use.
  - The connection string will need to be added to the docker-compose.override

#### Optional

- A [SimpleFin Bridge](https://beta-bridge.simplefin.org/) account is highly recommended

  - This is used to automatically sync account balances and transactions to your database.
  - The API key can be set under account settings in the app.

## Setup

### EF Core Migration

TODO: Need to apply the ef migration

### Docker Compose

You will need to configure the docker-compose.override as follows:

```
services:
  backend:
    environment:
      - Logging__LogLevel__Default=Information
      - CONNECTION_STRING_USERS={DbServerString}
      - CLIENT_URL=https://example.com
    ports:
      - 8080:8080
  client:
    build:
      args:
        - VITE_API_URL=https://example.com
      ports:
        - 80:80
        - 443:443
```

| Option                  | Details                                                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| CONNECTION_STRING_USERS | This is the PostgreSQL database connection string.                                                                      |
| CLIENT_URL              | This is the domain/ip you will use to access your deployed project. If hosting locally this will be `http://localhost`. |
| ports                   | The default values here are fine unless you have a reason to change them.                                               |
| VITE_API_URL            | See CLIENT_URL. These will be the same unless you have a reason to change.                                              |

### Nginx

There are two example nginx.conf files depending on how you would like to deploy.

- The http example is ready to deploy as is (just need to remove the .example extension). This will deploy the app at `http://localhost`.
- The https example has placeholders for your domain name and for your ssl cert and key names (assuming they are stored at the given location). You will need to fill those in and remove the .example extension.

## Deploy

Build & deploy by running the following command

```
docker-compose up --build
```
