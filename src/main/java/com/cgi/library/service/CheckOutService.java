package com.cgi.library.service;

import com.cgi.library.entity.CheckOut;
import com.cgi.library.model.CheckOutDTO;
import com.cgi.library.repository.CheckOutRepository;
import com.cgi.library.util.ModelMapperFactory;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CheckOutService {

    private final CheckOutRepository checkOutRepository;

    public CheckOutService(CheckOutRepository checkOutRepository) {
        this.checkOutRepository = checkOutRepository;
    }

    public Page<CheckOutDTO> getCheckOuts(Pageable pageable) {
        ModelMapper modelMapper = ModelMapperFactory.getMapper();
        return this.checkOutRepository.findAll(pageable).map(checkOut -> modelMapper.map(checkOut, CheckOutDTO.class));
    }

    public CheckOutDTO getCheckOut(UUID checkOutId) {
        CheckOut checkOut = this.checkOutRepository.getOne(checkOutId);
        return ModelMapperFactory.getMapper().map(checkOut, CheckOutDTO.class);
    }

    public void saveCheckOut(CheckOutDTO checkOutDTO) {
        this.checkOutRepository.save(ModelMapperFactory.getMapper().map(checkOutDTO, CheckOut.class));
    }

    public void deleteCheckOut(UUID checkOutId) {
        this.checkOutRepository.deleteById(checkOutId);
    }
}
