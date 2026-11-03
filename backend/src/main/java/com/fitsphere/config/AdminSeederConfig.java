package com.fitsphere.config;

import com.fitsphere.entity.Role;
import com.fitsphere.entity.User;
import com.fitsphere.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@Configuration
public class AdminSeederConfig {

    private static final Logger log = LoggerFactory.getLogger(AdminSeederConfig.class);

    @Value("${fitsphere.admin.name:Shyam Raj}")
    private String adminName;

    @Value("${fitsphere.admin.email:shyamraj@gmail.com}")
    private String adminEmail;

    @Value("${fitsphere.admin.initial-password:shyam123}")
    private String adminInitialPassword;

    @Bean
    public CommandLineRunner seedInitialAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            com.fitsphere.repository.AdminProfileRepository adminProfileRepository,
            com.fitsphere.service.AdminProfileService adminProfileService) {
        return args -> {
            // Remove legacy mock admin accounts from database if present
            userRepository.findByEmail("admin@fitsphere.com").ifPresent(legacy -> {
                userRepository.delete(legacy);
                log.info("Removed legacy mock admin account: admin@fitsphere.com");
            });
            userRepository.findByEmail("admin@athletics.university.edu").ifPresent(legacy -> {
                userRepository.delete(legacy);
                log.info("Removed legacy mock admin account: admin@athletics.university.edu");
            });

            String normalizedEmail = adminEmail.trim().toLowerCase();
            Optional<User> existingUser = userRepository.findByEmail(normalizedEmail);

            User admin;
            if (existingUser.isPresent()) {
                admin = existingUser.get();
                admin.setName(adminName);
                admin.setPasswordHash(passwordEncoder.encode(adminInitialPassword));
                admin.setRole(Role.ADMIN);
                admin.setActive(true);
                admin = userRepository.save(admin);
                log.info("FitSphere Administrator account '{}' verified and updated.", normalizedEmail);
            } else {
                log.info("Initializing seeding for administrator '{}'...", normalizedEmail);
                String hashedPassword = passwordEncoder.encode(adminInitialPassword);
                admin = new User(
                        adminName,
                        normalizedEmail,
                        hashedPassword,
                        "+1 (555) 000-0001",
                        Role.ADMIN
                );
                admin = userRepository.save(admin);
                log.info("Administrator account successfully created with role: ADMIN (Email: {})", normalizedEmail);
            }

            if (!adminProfileRepository.existsByUser(admin)) {
                adminProfileService.createInitialProfile(admin);
                log.info("Admin profile seeded for administrator: {}", normalizedEmail);
            }
        };
    }
}
