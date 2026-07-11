package com.rafaelmoral.bookquotevault.controllers;

import com.rafaelmoral.bookquotevault.models.Book;
import com.rafaelmoral.bookquotevault.models.User;
import com.rafaelmoral.bookquotevault.repositories.BookRepository;
import com.rafaelmoral.bookquotevault.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Book> getAllBooks(Principal principal) {
        return bookRepository.findByUserEmail(principal.getName());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id, Principal principal) {
        return bookRepository.findById(id)
                .map(book -> {
                    if (book.getUser() != null && book.getUser().getEmail().equals(principal.getName())) {
                        return ResponseEntity.ok(book);
                    }
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).<Book>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createBook(@RequestBody Book book, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        
        book.setUser(user);
        if(book.getColor() == null) {
            book.setColor("bg-indigo-100");
        }
        return ResponseEntity.ok(bookRepository.save(book));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBook(@PathVariable Long id, @RequestBody Book bookDetails, Principal principal) {
        return bookRepository.findById(id)
                .map(book -> {
                    if (book.getUser() == null || !book.getUser().getEmail().equals(principal.getName())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
                    }
                    book.setTitle(bookDetails.getTitle());
                    book.setAuthor(bookDetails.getAuthor());
                    book.setCoverUrl(bookDetails.getCoverUrl());
                    if (bookDetails.getColor() != null) {
                        book.setColor(bookDetails.getColor());
                    }
                    return ResponseEntity.ok(bookRepository.save(book));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id, Principal principal) {
        return bookRepository.findById(id)
                .map(book -> {
                    if (book.getUser() == null || !book.getUser().getEmail().equals(principal.getName())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
                    }
                    bookRepository.delete(book);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
