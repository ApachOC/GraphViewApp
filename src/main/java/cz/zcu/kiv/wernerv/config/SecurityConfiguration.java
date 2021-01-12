package cz.zcu.kiv.wernerv.config;

import cz.zcu.kiv.wernerv.models.UserModel;
import cz.zcu.kiv.wernerv.services.MongoUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.SecurityBuilder;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.*;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;

/**
 * This class contains Spring Security configuration.
 */
@EnableWebSecurity
@Order(0)
public class SecurityConfiguration {

    @Configuration
    @Order(0)
    public static class BasicSecurityConfigurer extends WebSecurityConfigurerAdapter {

        @Autowired MongoUserDetailsService userDetailsService;

        @Autowired Environment environment;

        @Bean
        public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

        @Bean
        public AuthenticationEntryPoint authEntryPoint() { return new HttpStatusEntryPoint(HttpStatus.FORBIDDEN); }

        @Bean
        CorsConfigurationSource corsConfigurationSource() {
            CorsConfiguration configuration = new CorsConfiguration();
            configuration.setAllowedOrigins(Arrays.asList("http://localhost:8080", "http://localhost:4200"));
            configuration.setAllowedMethods(Arrays.asList("OPTIONS", "GET", "POST", "PUT", "DELETE"));
            configuration.setAllowedHeaders(Arrays.asList("X-Requested-With", "Origin", "Content-Type", "Accept", "Authorization", "X-XSRF-TOKEN"));
            configuration.setAllowCredentials(true);
            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            source.registerCorsConfiguration("/**", configuration);
            return source;
        }

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            CsrfConfigurer<HttpSecurity> csrf =
                    http.anonymous().and().authorizeRequests()
                    // Allow access to the site
                    .antMatchers("/", "/*").permitAll()
                    // Allow login for everyone
                    .antMatchers(HttpMethod.POST, "/api/login").permitAll()
                    // Registration too
                    .antMatchers(HttpMethod.POST, "/api/users").permitAll()
                    // Current user retrieval from session cookie
                    .antMatchers(HttpMethod.GET, "/api/user").permitAll()
                    // User administration for admin only
                    .antMatchers(HttpMethod.GET, "/api/users/**").hasAuthority("admin")
                    .antMatchers(HttpMethod.PUT, "/api/users/**").hasAuthority("admin")
                    .antMatchers(HttpMethod.DELETE, "/api/users/**").hasAuthority("admin")
                    // Anyone can list and run available libs
                    .antMatchers(HttpMethod.GET, "/api/libs").permitAll()
                    .antMatchers(HttpMethod.POST, "/api/libs/*/run").permitAll()
                    // Only admin can manage the libs
                    .antMatchers(HttpMethod.POST, "/api/libs").hasAuthority("admin")
                    .antMatchers(HttpMethod.DELETE, "/api/libs/*").hasAuthority("admin")
                    // Only authorized users can manipulate projects
                    .antMatchers(HttpMethod.GET, "/api/projects").hasAuthority("user")
                    .antMatchers(HttpMethod.POST, "/api/projects").hasAuthority("user")
                    .antMatchers(HttpMethod.GET, "/api/projects/**").hasAuthority("user")
                    // Allow all OPTION request
                    .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    // Only admin can access administration
                    .antMatchers("/administration/**").hasAuthority("admin")
                    // Deny everything else
                    .anyRequest().denyAll()
                    // Setup login and authentication
                    .and().exceptionHandling().authenticationEntryPoint(authEntryPoint())
                    .and().formLogin()
                    .loginProcessingUrl("/api/login")
                    .successHandler(new AuthSuccessHandler())
                    .failureHandler(new SimpleUrlAuthenticationFailureHandler())
                    .and().logout().logoutUrl("/api/logout")
                    .logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler(HttpStatus.OK))
                    .and().cors().and().csrf();

            // Disable CSRF protection on test
            String[] profiles = environment.getActiveProfiles();
            boolean useCSRF = true;
            if (profiles.length == 0) {
                useCSRF = false;
            } else {
                for (String profile : profiles) {
                    if (profile.equals("test")) {
                        useCSRF = false;
                        break;
                    }
                }
            }
            if (useCSRF) {
                csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
            } else {
                csrf.disable();
            }
        }

        @Override
        protected void configure(AuthenticationManagerBuilder auth) throws Exception {
            auth.userDetailsService(userDetailsService);
        }

        @Component
        private static class AuthSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

            @Override
            public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                                Authentication authentication) throws IOException {
                clearAuthenticationAttributes(request);
                UserModel details = (UserModel) authentication.getPrincipal();
                response.getWriter().print(details.toString());
                response.setContentType("application/json");
                response.getWriter().flush();
            }
        }
    }
}
