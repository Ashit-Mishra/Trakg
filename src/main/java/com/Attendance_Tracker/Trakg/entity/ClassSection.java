package com.Attendance_Tracker.Trakg.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "class_sections",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "semester_id",
                                "section_name"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Section name is required")
    @Column(nullable = false, length = 10)
    private String sectionName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "semester_id", nullable = false)
    private Semester semester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @OneToMany(mappedBy = "classSection")
    private List<Student> students = new ArrayList<>();

    @OneToMany(mappedBy = "classSection")
    private List<TeacherSubjectAssignment> teacherSubjectAssignments = new ArrayList<>();
}