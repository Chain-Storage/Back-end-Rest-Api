# Chain Storage Api

This is Chain Storage Node.js api maded from Yurikaza

Chain Storage is decentralize storage application provices you to storage files on IPFS storage system.

How to set up api

### Requarments

1. MongoDb
2. Ganache
3. Node.js

### change .env.example to .env

```
NODE_ENV=5000
PORT=5000
DB_URL=
DATABASE_LOCAL=<Local MongoDb Address>
JWT_SECRET=some-secret-key
JWT_EXPIRES_IN=34
JWT_COOKIE_EXPIRES_IN=34d
GANACHE_SERVER=http://127.0.0.1:7545
WEB3STORAGE=
WEB3_STORAGE_ACCES_LINK=<web3.storage token>
ADMIN_WALLET=<ganache public key>
```

### Download dependencies with yarn and Start the server

```
yarn install

yarn start:dev
```

Connect Us:

<a href="https://www.linkedin.com/company/chain-storage/about/">Linkedin</a>
