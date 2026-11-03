package com.fitsphere.service;

import com.fitsphere.dto.profile.AdminProfileResponse;
import com.fitsphere.dto.profile.AdminProfileUpdateRequest;
import com.fitsphere.entity.AdminProfile;
import com.fitsphere.entity.User;

public interface AdminProfileService {

    AdminProfileResponse getProfile(String email);

    AdminProfileResponse updateProfile(String email, AdminProfileUpdateRequest request);

    AdminProfile createInitialProfile(User user);
}
