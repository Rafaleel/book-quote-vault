package com.rafaelmoral.bookquotevault.controllers;

import com.rafaelmoral.bookquotevault.models.Book;
import com.rafaelmoral.bookquotevault.models.Quote;
import com.rafaelmoral.bookquotevault.repositories.BookRepository;
import com.rafaelmoral.bookquotevault.repositories.QuoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/books/{bookId}/quotes")
@CrossOrigin(origins = "*")
public class QuoteController {

    @Autowired
    private QuoteRepository quoteRepository;
    
    @Autowired
    private BookRepository bookRepository;

    @GetMapping
    public List<Quote> getQuotesByBook(@PathVariable Long bookId) {
        return quoteRepository.findByBookId(bookId);
    }

    @PostMapping
    public ResponseEntity<Quote> createQuote(@PathVariable Long bookId, @RequestBody Quote quote) {
        Optional<Book> bookOptional = bookRepository.findById(bookId);
        if (bookOptional.isPresent()) {
            quote.setBook(bookOptional.get());
            return ResponseEntity.ok(quoteRepository.save(quote));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{quoteId}")
    public ResponseEntity<Void> deleteQuote(@PathVariable Long bookId, @PathVariable Long quoteId) {
        return quoteRepository.findById(quoteId)
                .map(quote -> {
                    quoteRepository.delete(quote);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{quoteId}")
    public ResponseEntity<Quote> updateQuote(@PathVariable Long bookId, @PathVariable Long quoteId, @RequestBody Quote quoteDetails) {
        return quoteRepository.findById(quoteId)
                .map(quote -> {
                    quote.setText(quoteDetails.getText());
                    quote.setPage(quoteDetails.getPage());
                    quote.setTags(quoteDetails.getTags());
                    return ResponseEntity.ok(quoteRepository.save(quote));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
