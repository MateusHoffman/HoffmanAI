package com.hoffmanai.api.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hoffmanai.api.config.OpenRouterProperties;
import com.hoffmanai.api.prompt.SystemPromptBuilder;
import com.hoffmanai.api.web.dto.ChatMessageDto;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class OpenRouterService {

  private final RestClient restClient;
  private final OpenRouterProperties properties;
  private final SystemPromptBuilder systemPromptBuilder;
  private final ContextWindowService contextWindowService;
  private final ObjectMapper objectMapper;

  public OpenRouterService(
      RestClient openRouterRestClient,
      OpenRouterProperties properties,
      SystemPromptBuilder systemPromptBuilder,
      ContextWindowService contextWindowService,
      ObjectMapper objectMapper) {
    this.restClient = openRouterRestClient;
    this.properties = properties;
    this.systemPromptBuilder = systemPromptBuilder;
    this.contextWindowService = contextWindowService;
    this.objectMapper = objectMapper;
  }

  public void stream(List<ChatMessageDto> history, Consumer<String> onDelta) {
    if (properties.apiKey() == null || properties.apiKey().isBlank()) {
      throw new IllegalStateException("OPENROUTER_API_KEY não configurada");
    }

    String systemPrompt = systemPromptBuilder.build();
    List<ChatMessageDto> fitted =
        contextWindowService.fitHistory(systemPrompt, history, properties.maxInputTokens());

    var messages = new ArrayList<OutboundMessage>();
    messages.add(new OutboundMessage("system", systemPrompt));
    fitted.forEach(m -> messages.add(new OutboundMessage(m.role(), m.content())));

    var body =
        new OpenRouterRequest(properties.model(), messages, true, properties.maxOutputTokens());

    restClient
        .post()
        .uri(properties.url())
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + properties.apiKey())
        .contentType(MediaType.APPLICATION_JSON)
        .accept(MediaType.TEXT_EVENT_STREAM)
        .body(body)
        .exchange(
            (request, response) -> {
              if (response.getStatusCode().isError()) {
                throw new IllegalStateException(
                    "Falha ao chamar OpenRouter: HTTP " + response.getStatusCode().value());
              }
              try (var reader =
                  new BufferedReader(
                      new InputStreamReader(response.getBody(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                  if (!line.startsWith("data:")) {
                    continue;
                  }
                  String data = line.substring(5).trim();
                  if ("[DONE]".equals(data)) {
                    break;
                  }
                  if (data.isEmpty()) {
                    continue;
                  }
                  var chunk = objectMapper.readValue(data, OpenRouterStreamChunk.class);
                  if (chunk.choices() == null || chunk.choices().isEmpty()) {
                    continue;
                  }
                  Delta delta = chunk.choices().getFirst().delta();
                  if (delta != null && delta.content() != null && !delta.content().isEmpty()) {
                    onDelta.accept(delta.content());
                  }
                }
              }
              return null;
            });
  }

  private record OpenRouterRequest(
      String model,
      List<OutboundMessage> messages,
      boolean stream,
      @JsonProperty("max_tokens") int maxTokens) {}

  private record OutboundMessage(String role, String content) {}

  @JsonIgnoreProperties(ignoreUnknown = true)
  private record OpenRouterStreamChunk(List<StreamChoice> choices) {}

  @JsonIgnoreProperties(ignoreUnknown = true)
  private record StreamChoice(Delta delta) {}

  @JsonIgnoreProperties(ignoreUnknown = true)
  private record Delta(String content) {}
}
