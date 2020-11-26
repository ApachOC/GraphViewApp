# GraphViewApp

The aim of this project is to create a web application which will allow the user to view and manipulate graphs / networks. 
In addition to this the app will be able to run the graph data through external library and display results.

This project has been started as a part of KIV/PIA and KIV/PRJ5 courses.

This repo Spring Boot application which both serves HTML content and acts as a backend, plus Angular
 application which serves as a frontend. 

## Build

If you have Docker installed you can use `docker-compose up` to automatically
download all dependencies, build and launch the application in a container.

You can also use Maven to build the application manually.
In that case there first needs to be a MongoDB instance running.
Then run `mvn install`. This will build the application and provide an
executable JAR.

## Run

Use Docker or execute the JAR build using Maven.

## TODO

- Implement user management
- Implement external library management
- Implement basic graph editor operations
- Implement persistent project storage
