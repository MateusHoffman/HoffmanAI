package com.hoffmanai.api.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ChatMessageDto(
    @NotBlank @Pattern(regexp = "user|assistant") String role, @NotBlank String content) {}
