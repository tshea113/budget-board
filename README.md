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

### Docker Compose

You will need to configure the docker-compose.override as follows:

```
services:
  backend:
    environment:
      - Logging__LogLevel__Default=Information
      - POSTGRES_HOST=host
      - POSTGRES_DATABASE=database
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - CLIENT_URL=https://example.com
      - AUTO_UPDATE_DB=false
      - EMAIL_SENDER=test@gmail.com,
      - EMAIL_SENDER_PASSWORD=yourPassword,
      - EMAIL_SMTP_HOST=smtp.gmail.com,
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

| Option                | Details                                                                                                                             |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| POSTGRES_HOST         | The host for the PostgreSQL database.                                                                                               |
| POSTGRES_DATABASE     | The postgresql database name.                                                                                                       |
| POSTGRES_USER         | The postgresql database user that budget board will use to connect to and interact with the database.                               |
| POSTGRES_PASSWORD     | The user password.                                                                                                                  |
| CLIENT_URL            | This is the domain/ip you will use to access your deployed project. If hosting locally this will be `http://localhost`.             |
| AUTO_UPDATE_DB        | If set to true, the database will automatically be updated when the schema changes. Otherwise, you will need to update it manually. |
| EMAIL_SENDER          | The email address that will send emails for verification, password resets, etc.                                                     |
| EMAIL_SENDER_PASSWORD | The password of the email that will send emails for verification, password resets, etc.                                             |
| EMAIL_SMTP_HOST       | The host server that will send the email.                                                                                           |
| ports                 | The default values here are fine unless you have a reason to change them.                                                           |
| VITE_API_URL          | See CLIENT_URL. These will be the same unless you have a reason to change.                                                          |

### PostgreSQL Database Configuration

The ASP.NET app will connect to the database using the parameters provided in `docker-compose.override`. These parameters will be configured when setting up the database.

### EF Core Migration

You can configure the ASP.NET app to automatically apply and database schema changes to your database using the `AUTO_UPDATE_DB` variable in `docker-compose.override`.

**WARNING: THIS COULD POTENTIALLY RESULT IN DATA LOSS. USE AT YOUR OWN RISK, ESPECIALLY WHILE THE APP IS STILL IN DEVELOPMENT!**

### Email Configuration

Budget Board requires an email service to send emails for account password resets. You can configure this in any way you'd like (self-hosted service, paid cloud service, etc.), but an easy way to do this for a small set of users is to create a gmail account.

If you do want to use a gmail account there are many articles online about how to configure a google account get the gmail smtp access.

### Nginx

There are two example nginx.conf files depending on how you would like to deploy.

- The http example is ready to deploy as is (just need to remove the .example extension). This will deploy the app at `http://localhost`.
- The https example has placeholders for your domain name and for your ssl cert and key names (assuming they are stored at the given location). You will need to fill those in and remove the .example extension.

## Deploy

Build & deploy by running the following command

```
docker-compose up --build
```
