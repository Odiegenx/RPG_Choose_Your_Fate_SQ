package dk.ek.gruppe2.chooseyourfate.service;

import java.util.List;

import org.springframework.stereotype.Service;

import dk.ek.gruppe2.chooseyourfate.dto.choice.ChoiceResponseDTO;
import dk.ek.gruppe2.chooseyourfate.dto.choice.CreateChoiceRequestDTO;
import dk.ek.gruppe2.chooseyourfate.dto.choice.UpdateChoiceRequestDTO;
import dk.ek.gruppe2.chooseyourfate.enums.DataSourceType;
import dk.ek.gruppe2.chooseyourfate.interfaces.ChoiceDataAccess;
import dk.ek.gruppe2.chooseyourfate.service.mysql.SqlChoiceService;

@Service
public class ChoiceService {
    private final SqlChoiceService sqlChoiceService;

    public ChoiceService(
            SqlChoiceService sqlChoiceService
    ) {
        this.sqlChoiceService = sqlChoiceService;
    }

    public List<ChoiceResponseDTO> getAllChoices(DataSourceType source) {
        return resolveDataService(source).getAllChoices();
    }

    public ChoiceResponseDTO getChoiceById(DataSourceType source, Integer id) {
        return resolveDataService(source).getChoiceById(id);
    }

    public ChoiceResponseDTO createChoice(DataSourceType source, CreateChoiceRequestDTO request) {
        return resolveDataService(source).createChoice(request);
    }

    public ChoiceResponseDTO updateChoice(DataSourceType source, Integer id, UpdateChoiceRequestDTO request) {
        return resolveDataService(source).updateChoice(id, request);
    }

    public void deleteChoice(DataSourceType source, Integer id) {
        resolveDataService(source).deleteChoice(id);
    }

    public ChoiceResponseDTO registerChoice(CreateChoiceRequestDTO request) {
        return sqlChoiceService.createChoice(request);
    }

    private ChoiceDataAccess resolveDataService(DataSourceType source) {
        return switch (source) {
            case SQL -> sqlChoiceService;
            default -> throw new IllegalArgumentException("Unexpected value: " + source);
        };
    }
}
