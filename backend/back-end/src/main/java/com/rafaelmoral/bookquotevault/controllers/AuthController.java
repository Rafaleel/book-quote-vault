package com.rafaelmoral.bookquotevault.controllers;

import com.rafaelmoral.bookquotevault.dtos.AuthResponse;
import com.rafaelmoral.bookquotevault.dtos.LoginRequest;
import com.rafaelmoral.bookquotevault.dtos.RegisterRequest;
import com.rafaelmoral.bookquotevault.dtos.ForgotPasswordRequest;
import com.rafaelmoral.bookquotevault.dtos.ResetPasswordRequest;
import com.rafaelmoral.bookquotevault.models.User;
import com.rafaelmoral.bookquotevault.models.PasswordResetToken;
import com.rafaelmoral.bookquotevault.repositories.UserRepository;
import com.rafaelmoral.bookquotevault.repositories.PasswordResetTokenRepository;
import com.rafaelmoral.bookquotevault.services.EmailService;
import com.rafaelmoral.bookquotevault.security.JwtService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Map;
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.USER);

        userRepository.save(user);

        final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        final String jwt = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(jwt, user.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        
        var optionalUser = userRepository.findByEmail(request.getEmail());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getAuthProvider() == User.AuthProvider.GOOGLE) {
                return ResponseEntity.badRequest().body(
                    java.util.Map.of("message", "This account is linked to Google. Please sign in using the Google button below.")
                );
            }
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        final String jwt = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(jwt, userDetails.getUsername()));
    }

    @PostMapping("/forgot-password")
    @Transactional
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        var optionalUser = userRepository.findByEmail(request.getEmail());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "If the email is registered, you will receive a recovery link shortly."));
        }

        User user = optionalUser.get();
        if (user.getAuthProvider() == User.AuthProvider.GOOGLE) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "This account is linked to Google and does not have a password. Please sign in with Google.")
            );
        }

        // Apagar token antigo se existir
        tokenRepository.deleteByUser(user);

        // Gerar novo token
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));
        tokenRepository.save(resetToken);

        // Enviar E-mail
        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);

        return ResponseEntity.ok(Map.of("message", "If the email is registered, you will receive a recovery link shortly."));
    }

    @PostMapping("/reset-password")
    @Transactional
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        var optionalToken = tokenRepository.findByToken(request.getToken());
        
        if (optionalToken.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid or missing token."));
        }

        PasswordResetToken resetToken = optionalToken.get();
        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            return ResponseEntity.badRequest().body(Map.of("message", "This token has expired. Please request a new recovery link."));
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        tokenRepository.delete(resetToken);

        return ResponseEntity.ok(Map.of("message", "Password reset successfully! You can now log in."));
    }
}
