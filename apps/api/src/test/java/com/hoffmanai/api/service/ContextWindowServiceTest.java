package com.hoffmanai.api.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.hoffmanai.api.web.dto.ChatMessageDto;
import java.util.List;
import org.junit.jupiter.api.Test;

class ContextWindowServiceTest {

  private final ContextWindowService service = new ContextWindowService();

  @Test
  void keepsNewestMessagesWithinBudget() {
    List<ChatMessageDto> history =
        List.of(
            new ChatMessageDto("user", "a".repeat(300)),
            new ChatMessageDto("assistant", "b".repeat(300)),
            new ChatMessageDto("user", "c".repeat(300)));

    int budget = service.tokens("sys") + service.tokens("c".repeat(300)) + 10;
    List<ChatMessageDto> fitted = service.fitHistory("sys", history, budget);

    assertEquals(1, fitted.size());
    assertTrue(fitted.getFirst().content().startsWith("c"));
  }

  @Test
  void skipsMessageThatDoesNotFit() {
    String huge = "x".repeat(9000);
    List<ChatMessageDto> fitted =
        service.fitHistory("sys", List.of(new ChatMessageDto("user", huge)), 50);

    assertTrue(fitted.isEmpty());
  }
}
