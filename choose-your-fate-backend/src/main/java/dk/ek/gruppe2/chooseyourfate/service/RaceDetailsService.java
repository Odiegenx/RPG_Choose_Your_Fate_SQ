package dk.ek.gruppe2.chooseyourfate.service;

import dk.ek.gruppe2.chooseyourfate.dto.RaceDetailsResponseDTO;
import dk.ek.gruppe2.chooseyourfate.enums.DataSourceType;
import dk.ek.gruppe2.chooseyourfate.interfaces.RaceDetailsDataAccess;
import dk.ek.gruppe2.chooseyourfate.service.mysql.SqlRaceDetailsService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RaceDetailsService {

    private final SqlRaceDetailsService sqlRaceDetailsService;

    public RaceDetailsService(
            SqlRaceDetailsService sqlRaceDetailsService
    ) {
        this.sqlRaceDetailsService = sqlRaceDetailsService;
    }

    public List<RaceDetailsResponseDTO> getAllRaceDetails(DataSourceType sourceHeader) {
        return resolveDataAccess(sourceHeader).getAllRaceDetails();
    }

    public RaceDetailsResponseDTO getRaceDetailsById(DataSourceType sourceHeader, Integer id) {
        return resolveDataAccess(sourceHeader).getRaceDetailsById(id);
    }

    public RaceDetailsResponseDTO createRaceDetails(DataSourceType sourceHeader) {
        return resolveDataAccess(sourceHeader).createRaceDetails();
    }

    public void deleteRaceDetails(DataSourceType sourceHeader, Integer id) {
        resolveDataAccess(sourceHeader).deleteRaceDetails(id);
    }

    private RaceDetailsDataAccess resolveDataAccess(DataSourceType sourceHeader) {
        return switch (sourceHeader) {
            case SQL -> sqlRaceDetailsService;
        };
    }
}
