package com.hoffmanai.api.config;

import java.io.IOException;
import java.net.http.HttpClient;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Arrays;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableConfigurationProperties({OpenRouterProperties.class, HoffmanAiProperties.class})
public class AppConfig implements WebMvcConfigurer {

  private final HoffmanAiProperties hoffmanAiProperties;

  public AppConfig(HoffmanAiProperties hoffmanAiProperties) {
    this.hoffmanAiProperties = hoffmanAiProperties;
  }

  @Bean
  RestClient openRouterRestClient() {
    HttpClient httpClient =
        HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(30)).build();
    JdkClientHttpRequestFactory factory = new JdkClientHttpRequestFactory(httpClient);
    factory.setReadTimeout(Duration.ofMinutes(5));
    return RestClient.builder().requestFactory(factory).build();
  }

  @Bean
  String curriculoMarkdown() throws IOException {
    return new ClassPathResource("curriculo.md").getContentAsString(StandardCharsets.UTF_8);
  }

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    String[] origins =
        Arrays.stream(hoffmanAiProperties.corsAllowedOrigins().split(","))
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .toArray(String[]::new);
    registry
        .addMapping("/api/**")
        .allowedOrigins(origins)
        .allowedMethods("GET", "POST", "OPTIONS")
        .allowedHeaders("*");
  }
}
