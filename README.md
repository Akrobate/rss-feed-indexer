# rss-feed-indexer

### Generate dataset

```sql
SELECT 
    id, website_url 
FROM 
    companies 
WHERE 
    is_active = TRUE
    AND website_url IS NOT NULL
    AND website_url != ''
```

### Api server

To start the API server you'll need to up the infrastructure

```sh
docker-compose -f docker-compose-mongodb.yml
```

Then youll need to up the server

```sh
docker-compose -f docker-compose-mongodb.yml
```

The command launched by the docker is

```sh
npm start
```

### Exploitation scripts

#### Process the full download and valide urls

```sh
node src/scripts/process-feeds-check-rss-items-download
```

#### Process the full download on valid urls

```sh
node src/scripts/process-optimised-rss-items-download
```

