package com.hoffmanai.api.service;

import com.hoffmanai.api.web.dto.ChatMessageDto;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

/** Mantém o histórico recente no orçamento de tokens (~3 chars/token). */
@Service
public class ContextWindowService {

  public List<ChatMessageDto> fitHistory(
      String systemPrompt, List<ChatMessageDto> history, int maxInputTokens) {
    if (history == null || history.isEmpty()) {
      return List.of();
    }

    int remaining = maxInputTokens - tokens(systemPrompt);
    List<ChatMessageDto> kept = new ArrayList<>();

    for (int i = history.size() - 1; i >= 0; i--) {
      ChatMessageDto msg = history.get(i);
      int cost = tokens(msg.content());
      if (cost > remaining) {
        break;
      }
      kept.addFirst(msg);
      remaining -= cost;
    }
    return kept;
  }

  int tokens(String text) {
    return text == null || text.isEmpty() ? 0 : text.length() / 3;
  }
}
