package com.queenmary.ems_backend.controllers;

import com.queenmary.ems_backend.entities.ExpenseClaim;
import com.queenmary.ems_backend.repositories.ExpenseClaimRepository;
import com.queenmary.ems_backend.services.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/expenses")
public class ExpenseClaimController {

    @Autowired
    private ExpenseClaimRepository expenseClaimRepository;

    private FileStorageService fileStorageService; // Inject FileStorageService

    // Submit Expense Claim
    @PostMapping("/submit")
    public ResponseEntity<String> submitClaim(@RequestBody ExpenseClaim claim) {
        claim.setStatus("PENDING");
        expenseClaimRepository.save(claim);
        return ResponseEntity.ok("Claim submitted!");
    }

    // Approve Expense Claim
    @PutMapping("/{id}/approve")
    public ResponseEntity<String> approveClaim(@PathVariable Long id) {
        ExpenseClaim claim = expenseClaimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Claim not found"));
        claim.setStatus("APPROVED");
        expenseClaimRepository.save(claim);
        return ResponseEntity.ok("Claim approved!");
    }

    // Reject Expense Claim
    @PutMapping("/{id}/reject")
    public ResponseEntity<String> rejectClaim(@PathVariable Long id, @RequestParam String reason) {
        ExpenseClaim claim = expenseClaimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Claim not found"));
        claim.setStatus("REJECTED");
        claim.setReasonForRejection(reason); // Fixed
        expenseClaimRepository.save(claim);
        return ResponseEntity.ok("Claim rejected!");
    }

    // Upload Receipt (Ensure FileStorageService is Implemented)

    @PostMapping("/upload")
    public ResponseEntity<String> uploadReceipt(@RequestParam("file") MultipartFile file) {
        String filePath = fileStorageService.saveFile(file);

        ExpenseClaim claim = new ExpenseClaim();
        claim.setReceiptUrl(filePath);
        claim.setStatus("PENDING");
        expenseClaimRepository.save(claim);

        return ResponseEntity.ok("File uploaded successfully!");
    }
}
