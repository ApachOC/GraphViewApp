package cz.zcu.kiv.wernerv.config;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

import static java.util.Collections.singletonList;

@Configuration
@Profile({"dev", "default"})
public class MongoConfigurationDev {

    @Configuration
    public static class ApplicationContextEventTestsAppConfig extends AbstractMongoClientConfiguration {

        @Override
        public String getDatabaseName() {
            return "test";
        }

        @Override
        protected void configureClientSettings(MongoClientSettings.Builder builder) {
            builder.applyToClusterSettings(settings  -> {
                        settings.hosts(singletonList(new ServerAddress("127.0.0.1", 27017)));
                    });
        }
    }

}
