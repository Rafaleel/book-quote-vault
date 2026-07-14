package com.rafaelmoral.bookquotevault.controllers;

import com.rafaelmoral.bookquotevault.models.Book;
import com.rafaelmoral.bookquotevault.models.Quote;
import com.rafaelmoral.bookquotevault.repositories.BookRepository;
import com.rafaelmoral.bookquotevault.repositories.QuoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/books/{bookId}/quotes")
public class QuoteController {

    @Autowired
    private QuoteRepository quoteRepository;
    
    @Autowired
    private BookRepository bookRepository;

    @GetMapping
    public ResponseEntity<?> getQuotesByBook(@PathVariable Long bookId, Principal principal) {
        Optional<Book> bookOptional = bookRepository.findById(bookId);
        if (bookOptional.isPresent()) {
            Book book = bookOptional.get();
            if (book.getUser() != null && book.getUser().getEmail().equals(principal.getName())) {
                return ResponseEntity.ok(quoteRepository.findByBookId(bookId));
            }
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> createQuote(@PathVariable Long bookId, @RequestBody Quote quote, Principal principal) {
        Optional<Book> bookOptional = bookRepository.findById(bookId);
        if (bookOptional.isPresent()) {
            Book book = bookOptional.get();
            if (book.getUser() != null && book.getUser().getEmail().equals(principal.getName())) {
                quote.setBook(book);
                return ResponseEntity.ok(quoteRepository.save(quote));
            }
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{quoteId}")
    public ResponseEntity<?> deleteQuote(@PathVariable Long bookId, @PathVariable Long quoteId, Principal principal) {
        Optional<Book> bookOptional = bookRepository.findById(bookId);
        if (bookOptional.isPresent()) {
            Book book = bookOptional.get();
            if (book.getUser() == null || !book.getUser().getEmail().equals(principal.getName())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }
            
            return quoteRepository.findById(quoteId)
                    .map(quote -> {
                        quoteRepository.delete(quote);
                        return ResponseEntity.ok().build();
                    })
                    .orElse(ResponseEntity.notFound().build());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{quoteId}")
    public ResponseEntity<?> updateQuote(@PathVariable Long bookId, @PathVariable Long quoteId, @RequestBody Quote quoteDetails, Principal principal) {
        Optional<Book> bookOptional = bookRepository.findById(bookId);
        if (bookOptional.isPresent()) {
            Book book = bookOptional.get();
            if (book.getUser() == null || !book.getUser().getEmail().equals(principal.getName())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }
            
            return quoteRepository.findById(quoteId)
                    .map(quote -> {
                        quote.setText(quoteDetails.getText());
                        quote.setPage(quoteDetails.getPage());
                        quote.setTags(quoteDetails.getTags());
                        quote.setCharacterName(quoteDetails.getCharacterName());
                        return ResponseEntity.ok(quoteRepository.save(quote));
                    })
                    .orElse(ResponseEntity.notFound().build());
        }
        return ResponseEntity.notFound().build();
    }
}
