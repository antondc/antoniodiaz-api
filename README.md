# API for www.antoniodiaz.me

API REST service written in Node and TypeScript for www.antoniodiaz.me.

## Install and run

### Environment variables

The application can be run via Makefile commands.
These commands take the proper docker compose configuration files and launch the app.
- On development, the environment variables come from the .env file. See ./.env-example for reference.
- On production, the environment variables come from the context of the pipeline runner, which are passed inlined to the Make command.

### Install dependencies

    - Install MySQL 8.0
    - Install Node
    - Install Nvm

### Launch

    npm install
    make start-dev # For development
    make start-prod # For production

## Create certificate

### Generate ssl certificates with Subject Alt Names on OSX

### Create `ssl.conf` file

      [ req ]
      default_bits       = 4096
      distinguished_name = req_distinguished_name
      req_extensions     = req_ext

      [ req_distinguished_name ]
      countryName                 = ES
      countryName_default         = MA
      stateOrProvinceName         = MA
      stateOrProvinceName_default = MA
      localityName                = MA
      localityName_default        = MA
      organizationName            = antoniodiaz
      organizationName_default    = antoniodiaz
      commonName                  = antoniodiaz.me
      commonName_max              = 64
      commonName_default          = localhost

      [ req_ext ]
      subjectAltName = @alt_names

      [alt_names]
      DNS.1   = antoniodiaz.me
      DNS.2   = dev.antoniodiaz.me

Create a directory `./ssl` for your project close to server, and place `ssl.conf` within it.
Open this folder.

### Generate a private key

    openssl genrsa -out private.key 4096

### Generate a Certificate Signing Request

    openssl req -new -sha256 \
        -out private.csr \
        -key private.key \
        -config ssl.conf

(You will be asked a series of questions about your certificate. Answer however you like, but for 'Common name' enter the name of your project, e.g. `my_project`)

### Now check the CSR

    openssl req -text -noout -in private.csr

You should see this:

    `X509v3 Subject Alternative Name: DNS:my-project.site` and
    `Signature Algorithm: sha256WithRSAEncryption`

### Generate the certificate

    openssl x509 -req \
        -sha256 \
        -days 3650 \
        -in private.csr \
        -signkey private.key \
        -out private.crt \
        -extensions req_ext \
        -extfile ssl.conf

### Add the certificate to Mac keychain and trust it

    sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain private.crt

(Alternatively, double click on the certificate file `private.crt` to open Keychain Access. Your project name `my_project` will be listed under the login keychain. Double click it and select 'Always trust' under the 'Trust' section.)

## Set domain

Add domain to `hosts` file:

    ##
    # Host Database
    ##
    127.0.0.1       localhost
    255.255.255.255 broadcasthost
    ::1             localhost
    127.0.0.1   dev.antoniodiaz.me # Added

Add local domain where app is accessed to `ENDPOINT_CLIENTS` at `config.test.json`:

    "ENDPOINT_CLIENTS": ["http://dev.antoniodiaz.me", "https://dev.antoniodiaz.me"],

## Conventions

### Naming conventions

    [I(nterface)][Module][Action][ModuleSubtype][ModuleType]

E. g.:

- `ILinkCreateResponse`
- `UserFollowingDeleteController`
- `LinkGetOneUseCase`
- `ILinkRepo`
- `StateRepo`
- `userFollowerGetAll`

## License

The MIT License (MIT)

Copyright (c) 2022 Antonio Díaz

## Reload

[1][2]
