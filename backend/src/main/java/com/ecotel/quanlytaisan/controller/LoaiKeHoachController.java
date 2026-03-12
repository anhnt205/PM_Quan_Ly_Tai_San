
package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.LoaiKeHoach;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.LoaiKeHoachService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loaikehoach")
public class LoaiKeHoachController {

    @Autowired
    private LoaiKeHoachService service;

    @GetMapping
    public PageResponse<LoaiKeHoach> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search
    ){

        return service.getAll(page,size,search);

    }

    @PostMapping
    public String create(@RequestBody LoaiKeHoach entity){

        service.create(entity);

        return "created";

    }

    @PutMapping("/{id}")
    public String update(
            @PathVariable String id,
            @RequestBody LoaiKeHoach entity
    ){

        entity.setId(id);

        service.update(entity);

        return "updated";

    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable String id){

        service.delete(id);

        return "deleted";

    }

    @DeleteMapping("/all")
    public String deleteAll(){

        service.deleteAll();

        return "deleted all";

    }

    @DeleteMapping("/batch")
    public String deleteBatch(@RequestBody List<String> ids){

        service.deleteBatch(ids);

        return "deleted batch";

    }

}