package com.cgi.library.repository;

import com.cgi.library.entity.Book;
import com.cgi.library.model.BookDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BookRepository extends JpaRepository<Book, UUID> {

    public BookDTO searchBookByTitle(String name);

    List<Book> findAllByTitleIgnoreCase(String name);

}
