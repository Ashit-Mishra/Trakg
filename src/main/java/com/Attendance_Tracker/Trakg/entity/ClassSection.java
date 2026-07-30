package com.Attendance_Tracker.Trakg.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "class_sections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;
}
