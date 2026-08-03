package com.Attendance_Tracker.Trakg.entity;

import com.Attendance_Tracker.Trakg.enums.AttendanceStatus;
import lombok.*;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(
        name = "attendance",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "student_id",
                                "teacher_subject_assignment_id",
                                "attendance_date"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_subject_assignment_id", nullable = false)
    private TeacherSubjectAssignment assignment;

    @Column(nullable = false)
    private LocalDate attendanceDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttendanceStatus status;
}