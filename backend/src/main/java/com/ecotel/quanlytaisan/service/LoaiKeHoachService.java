
package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.LoaiKeHoachDao;
import com.ecotel.quanlytaisan.model.LoaiKeHoach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoaiKeHoachService {

    @Autowired
    private LoaiKeHoachDao dao;

    public List<LoaiKeHoach> getAll(int page,int size,String search){

        return dao.findAll(page,size,search);

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