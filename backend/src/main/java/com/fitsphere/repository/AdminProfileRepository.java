package com.fitsphere.repository;

import com.fitsphere.entity.AdminProfile;
import com.fitsphere.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminProfileRepository extends JpaRepository<AdminProfile, Long> {

    Optional<AdminProfile> findByUser(User user);

    Optional<AdminProfile> findByUserId(Long userId);

    @Query("SELECT ap FROM AdminProfile ap JOIN FETCH ap.user u WHERE LOWER(u.email) = LOWER(:email)")
    Optional<AdminProfile> findByUserEmailIgnoreCase(@Param("email") String email);

    boolean existsByEmployeeId(String employeeId);

    boolean existsByUser(User user);
}
