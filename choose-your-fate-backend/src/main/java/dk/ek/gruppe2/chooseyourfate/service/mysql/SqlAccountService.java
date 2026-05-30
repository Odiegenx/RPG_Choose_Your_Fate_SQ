package dk.ek.gruppe2.chooseyourfate.service.mysql;

import dk.ek.gruppe2.chooseyourfate.dto.AccountResponseDTO;
import dk.ek.gruppe2.chooseyourfate.dto.CreateAccountRequestDTO;
import dk.ek.gruppe2.chooseyourfate.dto.UpdateAccountRequestDTO;
import dk.ek.gruppe2.chooseyourfate.exception.DuplicateResourceException;
import dk.ek.gruppe2.chooseyourfate.exception.ResourceNotFoundException;
import dk.ek.gruppe2.chooseyourfate.interfaces.AccountDataAccess;
import dk.ek.gruppe2.chooseyourfate.model.mysql.Account;
import dk.ek.gruppe2.chooseyourfate.repository.mysql.AccountRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SqlAccountService implements AccountDataAccess {

    private final AccountRepository accountRepository;
    private final PasswordEncoder encoder;

    public SqlAccountService(AccountRepository accountRepository, PasswordEncoder encoder) {
        this.accountRepository = accountRepository;
        this.encoder = encoder;
    }

    @Override
    public List<AccountResponseDTO> getAllAccounts() {
        return accountRepository.findAll()
                .stream()
                .map(AccountResponseDTO::new)
                .toList();
    }

    @Override
    public AccountResponseDTO getAccountById(Integer id) {
        return new AccountResponseDTO(getAccountEntity(id));
    }

    @Override
    public AccountResponseDTO createAccount(CreateAccountRequestDTO request) {
        ensureUniqueUsername(request.getUsername(), null);
        ensureUniqueEmail(request.getEmail(), null);

        Account account = request.toEntity();
        account.setCharacterLimit(3);
        account.setPassword(encoder.encode(request.getPassword()));

        return new AccountResponseDTO(accountRepository.save(account));
    }

    @Override
    public AccountResponseDTO updateAccount(Integer id, UpdateAccountRequestDTO request) {
        Account account = getAccountEntity(id);

        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            ensureUniqueUsername(request.getUsername(), id);
            account.setUsername(request.getUsername());
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            ensureUniqueEmail(request.getEmail(), id);
            account.setEmail(request.getEmail());
        }

        if (request.getCharacterLimit() != null) {
            account.setCharacterLimit(request.getCharacterLimit());
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            account.setPassword(encoder.encode(request.getPassword()));
        }

        return new AccountResponseDTO(accountRepository.save(account));
    }

    @Override
    public void deleteAccount(Integer id) {
        if (!accountRepository.existsById(id)) {
            throw new ResourceNotFoundException("Account not found with id: " + id);
        }
        accountRepository.deleteById(id);
    }

    private Account getAccountEntity(Integer id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));
    }

    private void ensureUniqueUsername(String username, Integer currentId) {
        accountRepository.findByUsername(username)
                .filter(account -> !account.getId().equals(currentId))
                .ifPresent(account -> {
                    throw new DuplicateResourceException("Username already exists");
                });
    }

    private void ensureUniqueEmail(String email, Integer currentId) {
        accountRepository.findByEmail(email)
                .filter(account -> !account.getId().equals(currentId))
                .ifPresent(account -> {
                    throw new DuplicateResourceException("Email already exists");
                });
    }
}