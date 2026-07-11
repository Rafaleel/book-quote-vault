package com.rafaelmoral.bookquotevault;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class BookQuoteVaultApplication {

	public static void main(String[] args) {
		SpringApplication.run(BookQuoteVaultApplication.class, args);
	}

}
