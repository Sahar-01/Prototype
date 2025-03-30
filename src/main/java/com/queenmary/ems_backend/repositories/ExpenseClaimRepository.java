package com.queenmary.ems_backend.repositories;

import com.queenmary.ems_backend.entities.ExpenseClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExpenseClaimRepository extends JpaRepository<ExpenseClaim, Long> {
    List<ExpenseClaim> findByStatus(String status);
}
