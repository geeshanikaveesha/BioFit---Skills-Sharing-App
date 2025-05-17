package com.example.backend.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Exercise {
    @Id
    private String id;
    private String name;
    private String description;
    private String targetAreas;
    private String equipments;
    private String sets;
    private String reps;
}
