package com.fitsphere.entity;

/**
 * Role enumeration for FitSphere platform access control.
 * Phase 1 supports:
 * - ADMIN: Campus sports & athletics directors
 * - TRAINER: Fitness trainers & coaches
 * - STUDENT: Student athletes & general collegiate students
 */
public enum Role {
    ADMIN,
    TRAINER,
    STUDENT
}
