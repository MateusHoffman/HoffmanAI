package com.hoffmanai.api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "hoffmanai")
public record HoffmanAiProperties(
    String corsAllowedOrigins, int chatDailyLimit, int chatWeeklyLimit) {}
