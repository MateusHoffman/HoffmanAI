package com.hoffmanai.api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "openrouter")
public record OpenRouterProperties(
    String apiKey,
    String url,
    String model,
    int maxInputTokens,
    int maxOutputTokens) {}
