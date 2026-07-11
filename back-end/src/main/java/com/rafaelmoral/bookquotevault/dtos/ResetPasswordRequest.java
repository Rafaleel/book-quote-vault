package com.rafaelmoral.bookquotevault.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @NotBlank(message = "O token é obrigatório.")
    private String token;

    @NotBlank(message = "A senha não pode estar em branco")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$",
            message = "A senha deve ter pelo menos 8 caracteres, uma letra, um número e um caractere especial.")
    private String newPassword;
}
