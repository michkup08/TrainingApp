package com.example.trainingServer.repositories;

import com.example.trainingServer.entities.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {
}
