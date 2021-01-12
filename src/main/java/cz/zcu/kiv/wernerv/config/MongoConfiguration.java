package cz.zcu.kiv.wernerv.config;

import com.mongodb.AuthenticationMechanism;
import com.mongodb.MongoClientSettings;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;
import cz.zcu.kiv.wernerv.models.UserModel;
import de.flapdoodle.embed.mongo.config.IMongodConfig;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import java.util.ArrayList;
import java.util.Arrays;

import static java.util.Collections.singletonList;

/**
 * This class contains Spring configurations regarding MongoDB
 */
@EnableMongoRepositories()
@Order(1)
public class MongoConfiguration {

    /**
     * This config should be used on production environment.
     */
    @Configuration
    @Profile("prod")
    public static class MongoConfigurationProd extends AbstractMongoClientConfiguration {

        @Override
        public String getDatabaseName() {
            return "graph-app";
        }

        @Override
        protected void configureClientSettings(MongoClientSettings.Builder builder) {
            builder.applyToClusterSettings(settings  -> {
                settings.hosts(singletonList(new ServerAddress("mongo", 27017)));
            });
        }
    }

    /**
     * This config should be used only on testing environment.
     * It uses embedded MongoDB instance to store data.
     */
    @Configuration
    @Profile({"test", "default"})
    public static class MongoConfigurationTest extends AbstractMongoClientConfiguration {

        private final int port;

        public MongoConfigurationTest(IMongodConfig config) {
            this.port = config.net().getPort();
        }

        @Override
        public String getDatabaseName() {
            return "test";
        }

        @Override
        protected void configureClientSettings(MongoClientSettings.Builder builder) {
            builder.applyToClusterSettings(settings  -> {
                settings.hosts(singletonList(new ServerAddress("127.0.0.1", port)));
            });
        }

        @Bean
        CommandLineRunner populateDB(MongoTemplate mongo) {
            return new cz.zcu.kiv.wernerv.config.MongoConfiguration.TestSeeder(mongo);
        }
    }

    /**
     * This CMD-line runner inserts initial data into the embedded Mongo instance
     */
    private static class TestSeeder implements CommandLineRunner {

        private final MongoTemplate mongo;

        public TestSeeder(MongoTemplate mongo) {
            this.mongo = mongo;
        }

        @Override
        public void run(String... args) throws Exception {
            mongo.insert(new UserModel(
                    "admin",
                    "$2a$10$C/yCdT49HGkiy7.A4T3B7OkIe..yXWI/qJYQcU57GBfOgD04h6w/G",
                    "admin@example.com",
                    "Administrator",
                    Arrays.asList("user", "admin"),
                    new ArrayList<>()
            ));
            mongo.insert(new UserModel(
                    "user",
                    "$2a$10$C/yCdT49HGkiy7.A4T3B7OkIe..yXWI/qJYQcU57GBfOgD04h6w/G",
                    "user@example.com",
                    "Default User",
                    singletonList("user"),
                    new ArrayList<>()
            ));
        }
    }
}
