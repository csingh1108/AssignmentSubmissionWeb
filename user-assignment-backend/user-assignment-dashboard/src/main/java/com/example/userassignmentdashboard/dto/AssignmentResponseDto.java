package com.example.userassignmentdashboard.dto;

import com.example.userassignmentdashboard.enums.AssignmentEnum;
import com.example.userassignmentdashboard.enums.AssignmentStatusEnum;
import com.example.userassignmentdashboard.model.Assignment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentResponseDto {

    private Assignment assignment;
    private AssignmentEnum[] assignmentEnums = AssignmentEnum.values();
    private AssignmentStatusEnum[] statusEnums = AssignmentStatusEnum.values();

    public AssignmentResponseDto(Assignment assignment) {
        super();
        this.assignment = assignment;
    }

}
