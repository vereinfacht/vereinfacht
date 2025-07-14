<img src="https://vereinfacht.digital/assets/github-header.png" alt="Logo">

# vereinfacht

**vereinfacht** is an open‑source, web‑based club management platform, designed to digitize core organizational tasks for nonprofit and volunteer-based associations. It replaces paper forms and manual processes with flexible, multilingual online membership applications, customizable to each club's branding, structure, and member‑type needs. It includes an descriptive management interface and is built on an open source tools and dependencies, supporting smooth integration and self‑hosting at no cost.

This project still being actively developed an is an early-adoption phase. **vereinfacht** is also [available as Software as a service](https://vereinfacht.digital/).

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

-   Docker
-   Laravel (API backend)
-   JSON:API & Open API spec
-   MariaDB
-   Filament (admin panel)
-   Next.js
-   Zod (schema validation)
-   Tailwind CSS
-   shadcn/ui component library
-   Cypress (End-to-End testing)

## Installation

> [!WARNING]
> Instructions as well as files required to setup your own vereinfacht instances are still being developed.

## Development

### API

The backend is a Laravel application using the [JSON:API](https://jsonapi.org/) specification. In order to adhere to the JSON:API specs, we use the package `laravel-json-api/laravel` as well as the package testing package `laravel-json-api/testing`. Refer to [the Laravel JSON:API docs](https://laraveljsonapi.io/4.x/) for more information.

#### Setup

> [!NOTE]
> The following steps require a `docker-compose.yml` as well as other files which are not yet included in this repository. However, they will be added shorly.

Go into the tooling container:

```sh
docker exec -it verein_tooling bash
cd api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seeder=FakeDatabaseSeeder
```

Aftwards create a token for the default super admin user:

```sh
php artisan tinker
```

```php
> User::find(1)->createToken('Super Admin Token')->plainTextToken;
```

Copy the generated token and supply it to the `/web_application/.env.local` file (see [web frontend](#web-frontend) setup below) as well as the `/e2e/cypress.config.ts`. If for any reason this token should change, remember to change it in those places as well.

#### Swagger API docs

The Swagger API docs are available at the API URL with the path prefix `/docs`. For local development this is [http://api.verein.localhost/docs](http://api.verein.localhost/docs). A publicly available Swagger UI version will be available in the future.

The local API docs automatically use the API definition file stored in [`/api/public`](api/public/v1_openapi.json).

A new version of this file may be greated with `php artisan jsonapi:openapi:generate v1` (requires the `FakeDatabaseSeeder` to be ran).

> [!NOTE] This process is **not** automated, because the generator package being used does not support all the specs / features the API needs.

The newly generated file can be found in `/api/storage/public`. For the time being you'll then have to manually copy over new additions to the previously mentioned and tracked file in [`/api/public`](api/public/v1_openapi.json). Remember to afterwards bump the version (`openapi.info.version`) of the specs accordingly:

```json
{
    "openapi": "3.0.2",
    "info": {
        "title": "vereinfacht.digital JSON:API",
        "description": "JSON:API implementation for vereinfacht.digital",
        "version": "0.0.1"
    },
    …
}
```

### Web frontend

#### Setup

To run web_application in development mode, expose the ports 3000 of your tooling container in your `/docker-compose.override.yml`:

```yaml
services:
    tooling:
        ports:
            - 3000:3000
```

Go into the tooling container:

```sh
docker exec -it verein_tooling bash
cd web_application
cp .env.local.example .env.local
```

Paste the API token mentioned in the previous setup steps into the .env.local.

Start the dev server while within the tooling container and inside `/web_application/`:

```sh
npm run dev
```

### Testing

#### Backend

Running the backend PHPUnit tests:

```sh
docker exec -it verein_tooling bash
cd api
php artisan test
```

> [!NOTE]
> This repository does not yet include the End-to-End testing functionality described below. It will be included in the future.

#### End-to-End (web frontend)

We're using Cypress for End-to-End testing the web frontend areas of this project. Running tests successfully requires a database seeded with the `FakeDatabaseSeeder.php`, which is not being done automatically.

> Other than running the PHPUnit tests in the `api` project, the database state currently neither is reset after running the Cypress test suite nor do they run with a separate testing database. Keep that in mind when running the tests on our local copy of the application.

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

Distributed under the **tbd**. See [`LICENSE`](LICENSE) for more information.

## Contributing

Contributions are welcome and will be credited. A more detailed guide on how to contribute will follow.

[vereinfacht](https://github.com/vereinfacht) is actively being developed by [visuellverstehen](https://github.com/visuellverstehen) – in part on behalf of the municipality of [Süderbrarup](https://www.amt-suederbrarup.de/).
