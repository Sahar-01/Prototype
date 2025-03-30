package com.queenmary.ems_backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "expense_claims")
public class ExpenseClaim {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate date;
    private String category;
    private Double amount;
    private String status;  // PENDING, APPROVED, REJECTED
    private String reason;  // If rejected

    private String receiptUrl; // Add this field

    private String reasonForRejection;

    @ManyToOne
    private User staff; // Who submitted the claim

    @ManyToOne
    private User manager; // Who reviews the claim

    public void setReasonForRejection(String reason) {
        this.reasonForRejection = reason;
    }
    // Getter and Setter
    public String getReceiptUrl() {
        return receiptUrl;
    }

    public void setReceiptUrl(String receiptUrl) {
        this.receiptUrl = receiptUrl;
    }

}

