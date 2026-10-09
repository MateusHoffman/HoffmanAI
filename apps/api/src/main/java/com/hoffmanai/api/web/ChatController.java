package com.hoffmanai.api.web;

import com.hoffmanai.api.config.HoffmanAiProperties;
import com.hoffmanai.api.service.OpenRouterService;
import com.hoffmanai.api.web.dto.ChatRequest;
import com.hoffmanai.api.web.dto.ChatResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.LocalDate;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/v1")
public class ChatController {

  private final OpenRouterService openRouterService;
  private final HoffmanAiProperties props;
  private final Map<String, Integer> usage = new ConcurrentHashMap<>();

  public ChatController(OpenRouterService openRouterService, HoffmanAiProperties props) {
    this.openRouterService = openRouterService;
    this.props = props;
  }

  @PostMapping(value = "/chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
  public SseEmitter chat(
      @Valid @RequestBody ChatRequest request,
      HttpServletRequest httpRequest,
      HttpServletResponse response) {
    enforceRateLimit(httpRequest.getRemoteAddr());

    response.setHeader("Cache-Control", "no-cache, no-transform");
    response.setHeader("X-Accel-Buffering", "no");

    SseEmitter emitter = new SseEmitter(300_000L);
    Thread.startVirtualThread(
        () -> {
          try {
            openRouterService.stream(
                request.messages(),
                delta -> {
                  try {
                    emitter.send(SseEmitter.event().data(new ChatResponse(delta)));
                  } catch (IOException ex) {
                    throw new UncheckedIOException(ex);
                  }
                });
            emitter.complete();
          } catch (Exception ex) {
            try {
              String msg = ex.getMessage() != null ? ex.getMessage() : "erro";
              emitter.send(SseEmitter.event().name("error").data(new ErrorBody(msg)));
              emitter.complete();
            } catch (Exception ignored) {
              emitter.completeWithError(ex);
            }
          }
        });
    return emitter;
  }

  private void enforceRateLimit(String ip) {
    LocalDate today = LocalDate.now();
    String key = ip + "-" + today;
    if (usage.merge(key, 1, Integer::sum) > props.chatDailyLimit()) {
      throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Limite diário atingido");
    }
    int week = 0;
    for (int i = 0; i < 7; i++) {
      week += usage.getOrDefault(ip + "-" + today.minusDays(i), 0);
    }
    if (week > props.chatWeeklyLimit()) {
      throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Limite semanal atingido");
    }
  }

  record ErrorBody(String message) {}
}
