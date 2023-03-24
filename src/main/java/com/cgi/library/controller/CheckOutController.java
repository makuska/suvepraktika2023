package com.cgi.library.controller;

import com.cgi.library.entity.CheckOut;
import com.cgi.library.model.CheckOutDTO;
import com.cgi.library.service.CheckOutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/checkout")
public class CheckOutController {

    private final CheckOutService checkOutService;

    public CheckOutController(CheckOutService checkOutService) {
        this.checkOutService = checkOutService;
    }

    @GetMapping(value = "getCheckouts")
    public ResponseEntity<Page<CheckOutDTO>> getCheckOuts(Pageable pageable) {
        return ResponseEntity.ok(checkOutService.getCheckOuts(pageable));
    }
//    @GetMapping(value = "getCheckouts")
//    public ResponseEntity<Page<CheckOutDTO>> getCheckOuts(@RequestParam(name = "sort_by", defaultValue = "id") String sortBy,
//                                                          @RequestParam(name = "sort_dir", defaultValue = "asc") String sortDirection,
//                                                          Pageable pageable) {
//        return ResponseEntity.ok(checkOutService.getCheckOuts(sortBy, sortDirection, pageable));
//    }


    @GetMapping(value = "getCheckout")
    public ResponseEntity<CheckOutDTO> getCheckOut(@RequestParam(value = "checkOutId") UUID checkOutId) {
        return ResponseEntity.ok(checkOutService.getCheckOut(checkOutId));
    }
    // Should add an exception
    //https://www.codecademy.com/paths/create-rest-apis-with-spring-and-java

    @PostMapping(value = "checkout")
    public ResponseEntity<String> saveCheckOut(@RequestBody CheckOutDTO checkOutDTO) {
        checkOutService.saveCheckOut(checkOutDTO);
        return ResponseEntity.ok("");
    }

    @DeleteMapping(value = "checkout")
    public ResponseEntity<String> deleteCheckOut(@RequestParam(value = "checkOutId") UUID checkOutId) {
        checkOutService.deleteCheckOut(checkOutId);
        return ResponseEntity.ok("");
    }
}
