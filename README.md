<img src="https://vereinfacht.digital/assets/github-header-1752496154.png" alt="vereinfacht repository header graphic">

# vereinfacht

**vereinfacht** is an open‑source, web‑based club management software, designed to digitize core organizational tasks for nonprofit and volunteer-based associations. It replaces paper forms and manual processes with flexible, multilingual online membership applications, customizable to each club's branding, structure, and member‑type needs. It includes an descriptive management interface and is built on an open source tools and dependencies, supporting smooth integration and self‑hosting at no cost.

This project still being actively developed and is in an early-adoption phase. It is is also [available as Software as a service](https://vereinfacht.digital/).

## Table of Contents

1. [Structure](#structure)
2. [Installation](#installation)
3. [Development](#swagger-api-docs)
4. [Development -> API](#api)
5. [Development -> API -> Swagger API docs](#swagger-api-docs)
6. [Development -> Web frontend](#web-frontend)
7. [Development -> Testing](#testing)
8. [License](#license)
9. [Contributing](#contributing)

## Structure

Inside this repository exist two applications required to run your own vereinfacht instance:
The Laravel API backend (`/api/`) and the Next.js web frontend (`/web_application/`).

### Core technologies

- Docker
- Laravel (API backend)
- JSON:API & Open API spec
- MariaDB
- Filament (admin panel)
- Next.js
- OpenAPI TypeScript
- Zod (schema validation)
- Tailwind CSS
- shadcn/ui component library
- Cypress (End-to-End testing)

## Development

### Development domains

| service                                | url                   |
| -------------------------------------- | --------------------- |
| web_application (tooling: npm run dev) | http://localhost:3000 |
| web_application (docker build)         | http://localhost:3003 |
| api                                    | http://localhost:3001 |
| swagger docs                           | http://localhost:3002 |

### API

The backend is a Laravel application using the [JSON:API](https://jsonapi.org/) specification. In order to adhere to the JSON:API specs, we use the package `laravel-json-api/laravel` as well as the package testing package `laravel-json-api/testing`. Refer to [the Laravel JSON:API docs](https://laraveljsonapi.io/4.x/) for more information.

#### Setup

Go into the tooling container:

```sh
docker compose exec tooling bash
cd api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seeder=FakeDatabaseSeeder
php artisan filament:assets
php artisan filament:assets
npm ci
npm run build
```

Aftwards create a token for the default super admin user:

```sh
php artisan tinker
```

```php
> User::find(1)->createToken('Super Admin Token')->plainTextToken;
```

Copy the generated token and supply it to the `/web_application/.env.local` file (see [web frontend](#web-frontend) setup below) as well as the `/e2e/cypress.config.ts`. If for any reason this token should change, remember to change it in those places as well.

You may now visit the login for the admin panel at [http://localhost:3001](http://localhost:3001) and use the seeded credentials for the super admin user:

```
Email: hello@vereinfacht.digital
Password: password
```

#### Swagger API docs

The Swagger API docs are available at the API URL via the path `/docs`. For local development this is [http://localhost:3002](http://localhost:3002).
Production API docs are available at [https://api.vereinfacht.digital/docs](https://api.vereinfacht.digital/docs).

The local API docs automatically use the API definition file stored in [`/api/public`](api/public/v1_openapi.json).

A new version of this file may be created with `php artisan jsonapi:openapi:generate v1` (requires the `FakeDatabaseSeeder` to be ran).

> [!NOTE]
> This process is **not** automated, because the generator package being used does not support all the specs / features the API needs.

The newly generated file can be found in `/api/storage/public`. For the time being you'll then have to manually copy over new additions to the previously mentioned and tracked file in [`/api/public`](api/public/v1_openapi.json). Remember to afterwards bump the version (`openapi.info.version`) of the specs accordingly:

```diff
{
    "openapi": "3.0.2",
    "info": {
        "title": "vereinfacht.digital JSON:API",
        "description": "JSON:API implementation for vereinfacht.digital",
-       "version": "0.0.1"
+       "version": "0.0.2"
    },
    ...
}
```

### Web frontend

#### Setup

Go into the tooling container:

```sh
docker compose exec tooling bash
cd web_application
cp .env.local.example .env.local
npm ci
```

Paste the API token mentioned in the previous API setup steps into the .env.local.

> [!WARNING]
> When running on production you should generate a new NextAuth secret (follow these steps: https://next-auth.js.org/configuration/options#secret).

Start the dev server while within the tooling container and inside `/web_application/`:

```sh
npm run dev
```

You may now visit the login for the club management at [http://localhost:3000](http://localhost:3000) and use the seeded credentials for the test user. For example:

```
Email: club-admin-1@example.org
Password: password
```

### Testing

#### Backend

Running the backend PHPUnit tests:

```sh
docker compose exec tooling bash
cd api
php artisan test
```

> [!NOTE]
> This repository does not yet include the End-to-End testing functionality described below. It will be included in the future.

#### End-to-End (web frontend)

We're using Cypress for End-to-End testing the web frontend areas of this project. Running tests successfully requires a database seeded with the `FakeDatabaseSeeder.php`, which is not being done automatically.

> [!WARNING]
> After running the Cypress End-to-End test suite, the database state is neither reset nor does it run with a separate testing database. This is different from the behavior of the PHPUnit tests in the `api` project. Keep that in mind when running the tests on your local copy of the application.

In order to use the component testing feature of Cypress, we would need to integrate Cypress into our Next.js application as an dependency. But then we're losing the option to test other parts of the mono repo in the future (i. e. a docs project or API pages). That's why Cypress was installed as a seperate project at the moment.

#### While developing

To run the tests, you'll first need to run a development process of the web_application app from the tooling container and make sure, the project is reachable under http://localhost:3000. Afterwards you can run the tests headlessly by entering `npm run test` from the `e2e` container:

```sh
docker exec -it verein_e2e bash
npm run test
```

#### Using the Cypress GUI

If you have node installed globally on the host machine, you can use the Cypress GUI while writing, debugging and running your tests (**highly recommended**). First, you have to follow these steps from your host machine:

```sh
cd /e2e
npm install
npx cypress install
```

After successfully installing Cypress as described above, you can run `npm run open` within the `/e2e` folder. You may also have to setup the host of the api on your machine in order to allow the Cypress GUI to make api requests.

In order to use the GUI within the docker container, additional steps are required and this project isn't setup for that now. More about this: https://www.cypress.io/blog/2019/05/02/run-cypress-with-a-single-docker-command/

#### Testing a frontend build

You can also test the current frontend build by changing the `baseUrl` value via the config flag to `http://web_application:3000` (see `./e2e/package.json`).

## License

Distributed under the MIT license. See [`LICENSE`](LICENSE) for more information.

## Contributing

Contributions are welcome and will be credited. A more detailed guide on how to contribute will follow.

[vereinfacht](https://github.com/vereinfacht) is actively being developed by [visuellverstehen](https://github.com/visuellverstehen) – in part on behalf of the municipality of [Süderbrarup](https://www.amt-suederbrarup.de/).
