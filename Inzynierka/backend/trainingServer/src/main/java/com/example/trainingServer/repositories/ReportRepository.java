package com.example.trainingServer.repositories;

import com.example.trainingServer.entities.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findAllByReportedId(Long id);
}
