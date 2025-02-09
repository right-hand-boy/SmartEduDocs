package com.smartedudocs.backend.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.smartedudocs.backend.model.UserAccount;
import com.smartedudocs.backend.repository.UserAccountRepository;

@Service
public class ProfileSettingService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileSettingService(UserAccountRepository userAccountRepository, PasswordEncoder passwordEncoder) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public boolean modifyUserName(UserAccount user) {
        Optional<UserAccount> userAccountOptional = userAccountRepository.findById(user.getId().toString());

        if (userAccountOptional.isPresent()) {
            UserAccount existingUser = userAccountOptional.get();
            existingUser.setName(user.getName());
            userAccountRepository.save(existingUser);
            return true;
        }
        return false;
    }

    public boolean modifyUserInfo(UserAccount user, String newPassword) {
        Optional<UserAccount> userAccountOptional = userAccountRepository.findById(user.getId().toString());

        if (userAccountOptional.isPresent()) {
            UserAccount existingUser = userAccountOptional.get();

            // Validate password
            if (!passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
                throw new IllegalArgumentException("Invalid credentials");
            }

            // Check if email is already in use by another user
            Optional<UserAccount> emailConflict = userAccountRepository.findByEmail(user.getEmail());
            if (emailConflict.isPresent() && !emailConflict.get().getId().equals(user.getId())) {
                throw new IllegalArgumentException("Email is taken by another user");
            }

            // Update user details
            existingUser.setName(user.getName());
            existingUser.setEmail(user.getEmail());
            if (newPassword != null && !newPassword.isEmpty()) {
                existingUser.setPassword(passwordEncoder.encode(newPassword));
            }

            userAccountRepository.save(existingUser);
            return true;
        }

        return false;
    }

}
