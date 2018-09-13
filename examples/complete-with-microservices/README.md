### Complete example split into microservices

This example uses:

- **Kafka** as `Queue`
- **Elasticsearch** as `Event Store`
- **Redis** as `State Store`
- **micro** as http server

```shell
$ git clone https://github.com/forevertz/node-event-sourcing.git
$ cd node-event-sourcing/examples/complete-with-microservices
$ docker-compose up zookeeper kafka elasticsearch redis
# Wait for services to run, then in an other terminal
$ docker-compose up --build receiver archivist eventprocessor myapp
# Open http://localhost:3000
```

![Services](https://raw.githubusercontent.com/forevertz/node-event-sourcing/master/docs/images/services.png)
