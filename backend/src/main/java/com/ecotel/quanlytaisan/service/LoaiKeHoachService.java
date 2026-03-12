
package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.LoaiKeHoachDao;
import com.ecotel.quanlytaisan.model.LoaiKeHoach;
import com.ecotel.quanlytaisan.model.PageResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoaiKeHoachService {

    @Autowired
    private LoaiKeHoachDao dao;

    public PageResponse<LoaiKeHoach> getAll(int page,int size,String search){

        List<LoaiKeHoach> items= dao.findAll(page,size,search);
        long totalItems = dao.countAll(search);

        return new PageResponse<>(items, totalItems, page, size);

    }

    public int create(LoaiKeHoach entity){

        return dao.insert(entity);

    }

    public int update(LoaiKeHoach entity){

        return dao.update(entity);

    }

    public int delete(String id){

        return dao.delete(id);

    }

    public int deleteAll(){

        return dao.deleteAll();

    }

    public int deleteBatch(List<String> ids){

        return dao.deleteBatch(ids);

    }

}