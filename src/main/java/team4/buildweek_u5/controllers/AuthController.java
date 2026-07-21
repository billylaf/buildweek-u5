package team4.buildweek_u5.controllers;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import team4.buildweek_u5.recordsDTO.LoginPayloadDTO;
import team4.buildweek_u5.recordsDTO.LoginResponseDTO;
import team4.buildweek_u5.services.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public LoginResponseDTO login(@RequestBody @Valid LoginPayloadDTO body) {
        String token = authService.controllaCredenzialiEGeneraToken(body);
        return new LoginResponseDTO(token);
    }
}