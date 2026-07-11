package com.rafaelmoral.bookquotevault.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendPasswordResetEmail(String to, String resetLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(new InternetAddress(fromEmail, "Book Quote Vault"));
            helper.setTo(to);
            helper.setSubject("Book Quote Vault - Password Reset");
            
            // Corpo do E-mail em HTML
            String htmlContent = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 12px;\">" +
                    "<div style=\"text-align: center; margin-bottom: 30px;\">" +
                    "<h2 style=\"color: #111827; font-size: 24px; margin-bottom: 5px;\">Book Quote Vault</h2>" +
                    "<p style=\"color: #6b7280; font-size: 16px; margin: 0;\">Password Recovery</p>" +
                    "</div>" +
                    "<div style=\"background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);\">" +
                    "<p style=\"color: #374151; font-size: 16px; margin-bottom: 20px;\">Hello,</p>" +
                    "<p style=\"color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 30px;\">" +
                    "We received a request to reset the password for your <strong>Book Quote Vault</strong> account. " +
                    "If you didn't make this request, you can safely ignore this email." +
                    "</p>" +
                    "<div style=\"text-align: center; margin-bottom: 30px;\">" +
                    "<a href=\"" + resetLink + "\" style=\"background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;\">" +
                    "Reset My Password" +
                    "</a>" +
                    "</div>" +
                    "<p style=\"color: #6b7280; font-size: 14px; text-align: center;\">" +
                    "This link is valid for only <strong>15 minutes</strong>." +
                    "</p>" +
                    "</div>" +
                    "<div style=\"text-align: center; margin-top: 20px;\">" +
                    "<p style=\"color: #9ca3af; font-size: 12px;\">" +
                    "If you're having trouble with the button above, copy and paste the URL below into your web browser:<br>" +
                    "<a href=\"" + resetLink + "\" style=\"color: #4f46e5;\">" + resetLink + "</a>" +
                    "</p>" +
                    "</div>" +
                    "</div>";

            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("E-mail de recuperação enviado para: " + to);
            System.out.println("Link (para debug): " + resetLink);
        } catch (Exception e) {
            System.err.println("Erro ao enviar e-mail: " + e.getMessage());
            System.out.println("Link de fallback (para debug local): " + resetLink);
        }
    }
}
