package com.hoffmanai.api;

import com.hoffmanai.api.config.DotEnv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HoffmanAiApiApplication {

  public static void main(String[] args) {
    DotEnv.load();
    SpringApplication.run(HoffmanAiApiApplication.class, args);
  }
}
