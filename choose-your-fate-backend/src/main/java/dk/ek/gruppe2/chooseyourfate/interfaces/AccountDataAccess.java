package dk.ek.gruppe2.chooseyourfate.interfaces;

import dk.ek.gruppe2.chooseyourfate.dto.AccountResponseDTO;
import dk.ek.gruppe2.chooseyourfate.dto.CreateAccountRequestDTO;
import dk.ek.gruppe2.chooseyourfate.dto.UpdateAccountRequestDTO;

import java.util.List;

public interface AccountDataAccess {

    List<AccountResponseDTO> getAllAccounts();

    AccountResponseDTO getAccountById(Integer id);

    AccountResponseDTO createAccount(CreateAccountRequestDTO request);

    AccountResponseDTO updateAccount(Integer id, UpdateAccountRequestDTO request);

    void deleteAccount(Integer id);
}