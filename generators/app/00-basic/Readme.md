# <%=appName%>

# Run tets with docker
```
docker build -t "testbuild" . && docker run --name=database -d mongo:4.4.0 && docker run --name=test --link=database:database --env-file .env.test testbuild npm run test-mocha-with-coverage; docker rm test; docker rm -f database;
```
