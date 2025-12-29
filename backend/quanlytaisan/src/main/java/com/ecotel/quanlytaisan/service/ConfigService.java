package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.ConfigDao;
import com.ecotel.quanlytaisan.model.Config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConfigService {
    @Autowired
    private ConfigDao configDao;

    public List<Config> getAll() {
        return configDao.findAll();
    }

    public Config getByIdAccount(String idAccount) {
        return configDao.findByIdAccount(idAccount);
    }

    public int create(Config config) {
        return configDao.insert(config);
    }

    public int update(Config config) {
        return configDao.update(config);
    }

    public int delete(String idAccount) {
        return configDao.delete(idAccount);
    }
}
