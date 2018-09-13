### Example with Elasticsearch as event store

```shell
$ git clone https://github.com/forevertz/node-event-sourcing.git
$ cd node-event-sourcing/examples/with-custom-event-store/with-elasticsearch
$ npm install
$ npm run start:elasticsearch
# In an other terminal (optional)
$ npm run start:kibana
# In an other terminal
$ npm start
# To verify that event are saved => http://localhost:9200/event_*/_search
```
