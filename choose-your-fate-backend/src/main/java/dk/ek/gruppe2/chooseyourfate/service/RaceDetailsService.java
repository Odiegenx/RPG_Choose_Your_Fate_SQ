package dk.ek.gruppe2.chooseyourfate.service;

import dk.ek.gruppe2.chooseyourfate.datasource.DataSourceResolver;
import dk.ek.gruppe2.chooseyourfate.dto.RaceDetailsResponseDTO;
import dk.ek.gruppe2.chooseyourfate.enums.DataSourceType;
import dk.ek.gruppe2.chooseyourfate.interfaces.RaceDetailsDataAccess;
import dk.ek.gruppe2.chooseyourfate.service.mysql.SqlRaceDetailsService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RaceDetailsService {

    private final DataSourceResolver dataSourceResolver;
    private final SqlRaceDetailsService sqlRaceDetailsService;

    public RaceDetailsService(
            DataSourceResolver dataSourceResolver,
            SqlRaceDetailsService sqlRaceDetailsService
    ) {
        this.dataSourceResolver = dataSourceResolver;
        this.sqlRaceDetailsService = sqlRaceDetailsService;
    }

    public List<RaceDetailsResponseDTO> getAllRaceDetails(String sourceHeader) {
        return resolveDataAccess(sourceHeader).getAllRaceDetails();
    }

    public RaceDetailsResponseDTO getRaceDetailsById(String sourceHeader, Integer id) {
        return resolveDataAccess(sourceHeader).getRaceDetailsById(id);
    }

    public RaceDetailsResponseDTO createRaceDetails(String sourceHeader) {
        return resolveDataAccess(sourceHeader).createRaceDetails();
    }

    public void deleteRaceDetails(String sourceHeader, Integer id) {
        resolveDataAccess(sourceHeader).deleteRaceDetails(id);
    }

    private RaceDetailsDataAccess resolveDataAccess(String sourceHeader) {
        DataSourceType dataSourceType = dataSourceResolver.resolve(sourceHeader);
        return switch (dataSourceType) {
            case SQL -> sqlRaceDetailsService;
        };
    }
}
