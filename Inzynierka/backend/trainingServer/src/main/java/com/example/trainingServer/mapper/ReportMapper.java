package com.example.trainingServer.mapper;

import com.example.trainingServer.DTO.ReportDTO;
import com.example.trainingServer.entities.ComunicateType;
import com.example.trainingServer.entities.Report;

public class ReportMapper {

    public static ReportDTO toDTO(Report report) {
        ReportDTO dto = new ReportDTO();
        dto.setId(report.getId());
        dto.setDescription(report.getDescription());
        dto.setCommunicateType(report.getComunicateType().name());
        dto.setComumnicateId(report.getComunicateId());
        dto.setSenderId(report.getSenderId());
        dto.setReportedId(report.getReportedId());
        dto.setChecked(report.isChecked());
        dto.setReportedFullName(report.getReportedFullName());
        return dto;
    }

    public static Report toEntity(ReportDTO dto) {
        Report report = new Report();
        report.setDescription(dto.getDescription());
        report.setComunicateType(ComunicateType.valueOf(dto.getCommunicateType()));
        report.setComunicateId(dto.getComumnicateId());
        report.setSenderId(dto.getSenderId());
        report.setReportedId(dto.getReportedId());
        report.setChecked(dto.isChecked());
        report.setReportedFullName(report.getReportedFullName());
        return report;
    }
}

