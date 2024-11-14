# Budget Board

[![Docker Image CI](https://github.com/tshea113/budget-board/actions/workflows/docker-image.yml/badge.svg?branch=main)](https://github.com/tshea113/budget-board/actions/workflows/docker-image.yml)

A simple and focused app for monthly budgeting and tracking financial goals

> [!WARNING]
> This project is in development!
> Expect breaking changes!

## About The Project

I created this app as a replacement for the now shut down app Mint.

It's mostly for my personal use, and such I've ported over most of the features I found most useful.
I'm working towards making this something others can use too, so give it a try!
Still, this is a side project, so development will probably be sporadic.

Feel free to open an issue if you notice any bugs or have any feature requests!

## Getting Started

This project is deployed using Docker Compose. You will need to create a `compose.override.yml` file with some configuration information.
An example has been provided, and more details about the configurations are below.

### Configuration

#### Setting up Docker Compose

You will need to create a `compose.override.yml` file with some necessary configuration information.
You can use `compose.override.example` as a template.

Here are some of the configuration options for the different containers:

#### budget-board-server

This container runs the back-end API of the app.

| Option                | Details                                                                                                                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POSTGRES_HOST         | The host for the PostgreSQL database. If you are using the budget-board-db container, you do not need to configure this variable.                                                        |
| POSTGRES_DATABASE     | The postgresql database name. If you are using the budget-board-db container, this should match `POSTGRES_DB`.                                                                           |
| POSTGRES_USER         | The postgresql database user that budget board will use to connect to and interact with the database. If you are using the budget-board-db container, this should match `POSTGRES_USER`. |
| POSTGRES_PASSWORD     | The user password. If you are using the budget-board-db container, this should match `POSTGRES_PASSWORD`.                                                                                |
| CLIENT_URL            | This is the URL you will use to access your deployed project. See Configuring the Client URL under Additional Details for more information.                                              |
| AUTO_UPDATE_DB        | Setting this to true will automatically update the database when the schema changes. Otherwise, you will need to update it manually.                                                     |
| EMAIL_SENDER          | The email address that will send emails for verification, password resets, etc. See Additional Details for more information about setting this up.                                       |
| EMAIL_SENDER_PASSWORD | The password of the email that will send emails for verification, password resets, etc.                                                                                                  |
| EMAIL_SMTP_HOST       | The host server that will send the email.                                                                                                                                                |

#### budget-board-client

This container creates a reverse-proxy to serve the front-end client and route API requests to the back-end.

| Option       | Details                                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| VITE_API_URL | See CLIENT_URL. These will be the same unless you have a reason to change.                                                                  |
| volumes      | These can be omitted if you aren't using HTTPS, see below about SSL Certs. These will map the certs on your local machine to the container. |

#### budget-board-db

This container hosts a PostgreSQL database used for storing app data. If you have an existing database or wish to use a cloud-based service, you can omit this container from the overrides file.

| Option            | Details                                                                                                                                                              |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POSTGRES_USER     | The postgresql database user that will be used to connect to and interact with the database. This should match `POSTGRES_USER` in the budget-board-server container. |
| POSTGRES_PASSWORD | The user password. This should match `POSTGRES_PASSWORD` in the budget-board-server container.                                                                       |
| POSTGRES_DATABASE | The postgresql database name. This should match `POSTGRES_DB` in the budget-board-server container.                                                                  |

### Setting up Nginx

The budget-board-client container requires a configuration file for nginx.
There are two example nginx.conf files located in `.docker/nginx/conf`.
You will need to update some fields in the file and rename one of the following files to `nginx.conf`.

The files are largely the same, except the https config file will redirect all traffic to port 443 and require that the site be connect to through https.
You will need to enter the names for your certs.
This should match the values you configured for `volumes` in `compose.override.yml`.

### Deploy

Deploy the app by running the following command:

```
docker compose --profile include-db up
```

If you don't want to run the postgres container, you can run:

```
docker compose up
```

You can now access the app at the specified `CLIENT_URL`.

## Additional Details

### Configuring the Client URL

There are a couple places where you need to specify the domain that points to this app.
This is dependent upon how you expect to access this app and where you are hosting it.
Here are a couple of examples and their use cases:

- `localhost` - If you only intend to access the app on the same system which you are hosting it (i.e. testing some changes for development).
- The local IP or hostname - If you are only exposing this app to your local network, you can configure the `CLIENT_URL` and related options to the local IP or hostname of the system hosting the app (i.e. `192.168.1.23` or `budget-board.lan`).
- The public IP or public domain - If you are exposing this app to the internet, then you would configure this to be the public IP or domain name that points to the app (i.e. `70.2.4.53` or `budget-board.com`).
  - Note: This will require some extra network configuration beyond what is covered here.

### SimpleFIN Bridge

[SimpleFIN Bridge](https://beta-bridge.simplefin.org/) is a service that allows you to securely share your financial transaction data with apps.
Budget Board can use SimpleFIN Bridge to automatically sync your bank account info and transaction details.
After connecting your accounts in SimpleFIN, you can enter the API key on Budget Board under your account settings.

### Database schema updates

Occasionally the database schema will change and require the database to be updated.
As mentioned above, you can configure this to be automatic using the `AUTO_UPDATE_DB` variable.

> [!WARNING]
> There is a potential for certain updates to result in data loss while the app is still in development.
> If you are concerned about losing data, it is recommended to periodically back up your database and manually apply each database migration.

Here is some information about [manually applying EF Core Migrations](https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/applying?tabs=dotnet-core-cli#command-line-tools).

### SMTP Server

Budget Board requires SMTP server to send emails for account password resets.
You can configure this in any way you'd like (self-hosted service, paid cloud service, etc.), but an easy way to do this for a small set of users is to create a gmail account.

If you do want to use a gmail account there are many articles online about how to configure a google account get the gmail smtp access.
