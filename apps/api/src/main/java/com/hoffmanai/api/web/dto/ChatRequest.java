package com.hoffmanai.api.web.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record ChatRequest(@NotEmpty @Valid List<ChatMessageDto> messages) {}
