FROM maven:3.6.3-jdk-11 AS build
WORKDIR /build
COPY . /build
RUN mvn install

FROM openjdk:11
WORKDIR /app
COPY --from=build /build/target/graph-view-app-0.0.1-SNAPSHOT.jar /app/app.jar
EXPOSE 8080
CMD ["java","-jar","/app/app.jar","--spring.profiles.active=prod"]
