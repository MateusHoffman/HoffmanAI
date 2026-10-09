package com.hoffmanai.api.config;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

/** Carrega apps/api/.env (ou .env na cwd) em system properties, sem sobrescrever o ambiente. */
public final class DotEnv {

  private DotEnv() {}

  public static void load() {
    for (Path path : List.of(Path.of(".env"), Path.of("apps/api/.env"))) {
      if (!Files.isRegularFile(path)) {
        continue;
      }
      try {
        for (String raw : Files.readAllLines(path)) {
          String line = raw.trim();
          if (line.isEmpty() || line.startsWith("#") || !line.contains("=")) {
            continue;
          }
          int eq = line.indexOf('=');
          String key = line.substring(0, eq).trim();
          String value = line.substring(eq + 1).trim();
          if (key.isEmpty()) {
            continue;
          }
          if (System.getenv(key) == null && System.getProperty(key) == null) {
            System.setProperty(key, value);
          }
        }
      } catch (IOException ignored) {
        // segue sem .env
      }
      return;
    }
  }
}
