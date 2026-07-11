package com.rafaelmoral.bookquotevault.repositories;

import com.rafaelmoral.bookquotevault.models.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByUserEmail(String email);
}
