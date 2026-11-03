package com.fitsphere.repository;

import com.fitsphere.entity.StudentProfile;
import com.fitsphere.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {

    Optional<StudentProfile> findByUser(User user);

    Optional<StudentProfile> findByUserId(Long userId);

    @Query("SELECT sp FROM StudentProfile sp JOIN FETCH sp.user u WHERE LOWER(u.email) = LOWER(:email)")
    Optional<StudentProfile> findByUserEmailIgnoreCase(@Param("email") String email);

    boolean existsByStudentId(String studentId);

    boolean existsByUser(User user);
}
