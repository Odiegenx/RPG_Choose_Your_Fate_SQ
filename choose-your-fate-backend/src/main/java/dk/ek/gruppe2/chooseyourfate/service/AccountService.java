package dk.ek.gruppe2.chooseyourfate.service;

import dk.ek.gruppe2.chooseyourfate.dto.AccountResponseDTO;
import dk.ek.gruppe2.chooseyourfate.dto.CreateAccountRequestDTO;
import dk.ek.gruppe2.chooseyourfate.dto.UpdateAccountRequestDTO;
import dk.ek.gruppe2.chooseyourfate.enums.DataSourceType;
import dk.ek.gruppe2.chooseyourfate.interfaces.AccountDataAccess;
import dk.ek.gruppe2.chooseyourfate.service.mysql.SqlAccountService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountService {

    private final SqlAccountService sqlAccountService;

    public AccountService(
        SqlAccountService sqlAccountService
    ) {
        this.sqlAccountService = sqlAccountService;
    }

    public List<AccountResponseDTO> getAllAccounts(DataSourceType sourceHeader) {
        return resolveDataService(sourceHeader).getAllAccounts();
    }

    public AccountResponseDTO getAccountById(DataSourceType sourceHeader, Integer id) {
        return resolveDataService(sourceHeader).getAccountById(id);
    }

    public AccountResponseDTO createAccount(DataSourceType sourceHeader, CreateAccountRequestDTO request) {
        return resolveDataService(sourceHeader).createAccount(request);
    }

    public AccountResponseDTO updateAccount(DataSourceType sourceHeader, Integer id, UpdateAccountRequestDTO request) {
        return resolveDataService(sourceHeader).updateAccount(id, request);
    }

    public void deleteAccount(DataSourceType sourceHeader, Integer id) {
        resolveDataService(sourceHeader).deleteAccount(id);
    }

    public AccountResponseDTO registerAccount(CreateAccountRequestDTO request) {
        return sqlAccountService.createAccount(request);
    }

    private AccountDataAccess resolveDataService(DataSourceType sourceHeader) {
        return switch (sourceHeader) {
            case SQL -> sqlAccountService;
        };
    }
}
