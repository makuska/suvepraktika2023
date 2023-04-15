## Creating API endpoint for searching books

Still quite confused about the DTO (data transfer object), and how it exactly differs from entities and models.

Trying to create a new endpoint for search; Was able to get it to work using the knowledge I already have quite easily. But my implementation differs from other endpoints.

```java
@GetMapping("/search") //Request ise tundub õige olevat, vähemalt SQLi vaadates
    // List annab kaasa kõik borrowerid kamh
    public ResponseEntity<List<BookDTO>> searchBooks(@RequestParam(value = "bookName") String bookName){
        return ResponseEntity.ok(this.bookService.searchBooks(bookName));
    }
```
Using `BookDTO` returns an error: `No converter found capable of converting from type [com.cgi.library.entity.Book] to type [com.cgi.library.model.BookDTO]`

Worked fine just using the `Book` entity. The error suggests that the issue lies with the type. Hence, why the `ModelMapper` is also used in other methods.<br>
Will try to use the `ModelMapper`.

**ModelMapper** is a Java library that simplifies object mapping. It maps one object to another object, which has similar properties or fields. In this case, it's being used to map an entity object of type Book to a DTO (Data Transfer Object) of type BookDTO.

`getMapper()` is a static method in the ModelMapperFactory class, which returns a new instance of the ModelMapper class. It's a factory method that ensures that only one instance of `ModelMapper` is created and shared across the application.

In The end, this is the working API endpoint for search:
```java
public List<BookDTO> searchBooks(String bookName) {
        ModelMapper modelMapper = ModelMapperFactory.getMapper();
        List<Book> books = this.bookRepository.findAllByTitleIgnoreCase(bookName);
        return books.stream()
                .map(book -> modelMapper.map(book, BookDTO.class))
                .collect(Collectors.toList()); // Should probably use the Pageable
    }
```
`List` is should be replaced with Pageable interface.

`stream()` is a method of the List interface that returns a sequential Stream with the elements of this list as its source. Streams provide a way to perform operations on collections of objects. It's used here to process the list of books one by one.

