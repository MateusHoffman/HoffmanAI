FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY apps/api/pom.xml apps/api/pom.xml
COPY apps/api/src apps/api/src
COPY curriculo.md curriculo.md
RUN mvn -f apps/api/pom.xml -q package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/apps/api/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
