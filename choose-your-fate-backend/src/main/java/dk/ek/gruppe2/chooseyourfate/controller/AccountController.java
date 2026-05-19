package dk.ek.gruppe2.chooseyourfate.controller;

import dk.ek.gruppe2.chooseyourfate.dto.AccountResponseDTO;
import dk.ek.gruppe2.chooseyourfate.dto.CharacterResponseDTO;
import dk.ek.gruppe2.chooseyourfate.dto.CreateAccountRequestDTO;
import dk.ek.gruppe2.chooseyourfate.dto.UpdateAccountRequestDTO;
import dk.ek.gruppe2.chooseyourfate.enums.DataSourceType;
import dk.ek.gruppe2.chooseyourfate.service.AccountService;
import dk.ek.gruppe2.chooseyourfate.service.CharacterService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/choose-your-fate/accounts")
public class AccountController {

    private static final String DATA_SOURCE_HEADER = "X-Data-Source";

    private final AccountService accountService;
    private final CharacterService characterService;


    public AccountController(AccountService accountService, CharacterService characterService) {
        this.accountService = accountService;
        this.characterService = characterService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<AccountResponseDTO> getAllAccounts(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = false) String dataSource
    ) {
        return accountService.getAllAccounts(dataSource);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public AccountResponseDTO getAccountById(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = false) String dataSource,
            @PathVariable Integer id
    ) {
        return accountService.getAccountById(dataSource, id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AccountResponseDTO createAccount(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = false) String dataSource,
            @RequestBody CreateAccountRequestDTO request
    ) {
        return accountService.createAccount(dataSource, request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @accountAuthorizationService.canModifyAccount(#id, authentication)")
    public AccountResponseDTO updateAccount(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = false) String dataSource,
            @PathVariable Integer id,
            @RequestBody UpdateAccountRequestDTO request
    ) {
        return accountService.updateAccount(dataSource, id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteAccount(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = false) String dataSource,
            @PathVariable Integer id
    ) {
        accountService.deleteAccount(dataSource, id);
    }
}
