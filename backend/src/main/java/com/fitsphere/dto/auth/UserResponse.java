package com.fitsphere.dto.auth;

import com.fitsphere.entity.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;

@Schema(description = "Safe user profile representation excluding credential hashes")
public class UserResponse {

    @Schema(example = "1", description = "Unique user identifier")
    private Long id;

    @Schema(example = "Alex Morgan", description = "User's full name")
    private String name;

    @Schema(example = "alex.morgan@university.edu", description = "Normalized account email")
    private String email;

    @Schema(example = "+1 (555) 234-5678", description = "Contact phone number")
    private String phone;

    @Schema(example = "STUDENT", description = "Platform role (ADMIN, TRAINER, STUDENT)")
    private Role role;

    @Schema(example = "true", description = "Account activation state")
    private boolean active;

    @Schema(description = "Timestamp when account was created in UTC")
    private Instant createdAt;

    public UserResponse() {
    }

    public UserResponse(Long id, String name, String email, String phone, Role role, boolean active, Instant createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.active = active;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
