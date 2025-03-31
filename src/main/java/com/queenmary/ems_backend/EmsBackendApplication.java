package com.queenmary.ems_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.queenmary.ems_backend")
public class EmsBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(EmsBackendApplication.class, args);
    }
}