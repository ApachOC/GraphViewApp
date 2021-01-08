# GraphViewApp

The aim of this project is to create a web application which will allow the user to view and manipulate graphs / networks. 
In addition to this the app will be able to run the graph data through external library and display results.

This project has been started as a part of KIV/PIA and KIV/PRJ5 courses.

This repo contains Spring Boot application which acts as a backend and also serves the HTML content,
plus Angular application which serves as a frontend.

## Build & Run

If you have Docker installed you can use `docker-compose` to automatically download all dependencies,
build and launch the application in a Docker container.

Alternatively you can use Maven to build the application for testing purposes.
Simply run `mvn install`. This will build the application and provide an executable JAR file.
The app built using this method will use embedded MongoDB instance, which does not persist data.
The minimal supported Java is version 8.

The application is available on the port 8080.

## Folder structure

The root folder contains mostly files used by package managers, Dockerfiles and other config files.

The application source is in the `/src/main` folder.
You can find all Java code in the `java` subfolder, where it is then split between individual folders according to
component type.
The Angular application can be found in the `angular` subfolder, where all application code is located in the `app`
subfolder.

## Used technologies

The backend part of the application is written in Java and uses *Spring 5* and *Spring Boot 2* platforms.

Storage is handled by *MongoDB 4* database, which can be run either externally or as an embedded part of the
application depending on the selected Maven build profile.

The frontend is written in *Typescript* and uses *Angular 11* framework. Graph visualization is accomplished using the
*d3* library.
Communication between the backend and frontend is done using HTML REST-ful API.

The project uses Maven as a build system. During the build the compiled frontend application is moved into the
`resources/public` folder and included in the final executable, from where it is later served by the embedded
*Tomcat* webserver core.

Docker compose downloads Maven image automatically and builds the application in the container, which means that neither
Maven, nor Java is required to be installed on the build machine.
