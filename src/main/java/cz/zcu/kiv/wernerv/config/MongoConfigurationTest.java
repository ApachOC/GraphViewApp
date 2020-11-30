package cz.zcu.kiv.wernerv.config;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import cz.zcu.kiv.wernerv.models.AppUser;
import de.flapdoodle.embed.mongo.config.IMongodConfig;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.ArrayList;
import java.util.Arrays;

import static java.util.Collections.singletonList;

    @Configuration
    @Profile({"test", "default"})
    public class MongoConfigurationTest extends AbstractMongoClientConfiguration {

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
            return new Seeder(mongo);
        }

        private static class Seeder implements CommandLineRunner {

            private final MongoTemplate mongo;

            public Seeder(MongoTemplate mongo) {
                this.mongo = mongo;
            }

            @Override
            public void run(String... args) throws Exception {
                mongo.insert(new AppUser(
                        "admin",
                        "$2a$10$C/yCdT49HGkiy7.A4T3B7OkIe..yXWI/qJYQcU57GBfOgD04h6w/G",
                        "admin@example.com",
                        "Administrator",
                        Arrays.asList("user", "admin"),
                        new ArrayList<>()
                ));
                mongo.insert(new AppUser(
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
