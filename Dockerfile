# https://docs.docker.com/get-started/
# https://www.docker.com/blog/how-i-built-my-first-containerized-java-web-application/
FROM openjdk:11
MAINTAINER https://github.com/makuska
COPY target/library-app-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]