package com.example.trainingServer.mapper;

import com.example.trainingServer.DTO.ReportDTO;
import com.example.trainingServer.entities.ComunicateType;
import com.example.trainingServer.entities.Report;

import java.util.List;
import java.util.stream.Collectors;

public class ReportMapper {

    public static ReportDTO toDTO(Report report) {
        ReportDTO dto = new ReportDTO();
        dto.setId(report.getId());
        dto.setDescription(report.getDescription());
        dto.setCommunicateType(report.getComunicateType().name());
        dto.setCommunicateId(report.getComunicateId());
        dto.setSenderId(report.getSenderId());
        dto.setReportedId(report.getReportedId());
        dto.setChecked(report.isChecked());
        dto.setReportedFullName(report.getReportedFullName());
        return dto;
    }

    public static List<ReportDTO> toDTOList(List<Report> reports) {
        if (reports == null || reports.isEmpty()) {
            return List.of();
        }
        return reports.stream()
                .map(ReportMapper::toDTO)
                .collect(Collectors.toList());
    }

    public static Report toEntity(ReportDTO dto, String fullName) {
        Report report = new Report();
        report.setDescription(dto.getDescription());
        report.setComunicateType(ComunicateType.valueOf(dto.getCommunicateType()));
        report.setComunicateId(dto.getCommunicateId());
        report.setSenderId(dto.getSenderId());
        report.setReportedId(dto.getReportedId());
        report.setChecked(dto.isChecked());
        report.setReportedFullName(fullName);
        return report;
    }
}

