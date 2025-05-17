package com.example.backend.Controller;

import com.example.backend.Dto.EditCommentDto;
import com.example.backend.Model.Likes;
import com.example.backend.Model.WorkoutPlan;
import com.example.backend.Model.Comment;
import com.example.backend.Service.WorkoutPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/workoutPlans")
public class WorkoutPlanController {

    @Autowired
    private WorkoutPlanService workoutPlanService;

    @PostMapping
    public ResponseEntity<?> createWorkoutPlan(@RequestBody WorkoutPlan workoutPlan) {

        WorkoutPlan createdWorkoutPlan = workoutPlanService.createWorkoutPlan(workoutPlan);

        // Create HATEOAS response with self link
        EntityModel<WorkoutPlan> resource = EntityModel.of(createdWorkoutPlan);
        resource.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(WorkoutPlanController.class).createWorkoutPlan(workoutPlan)).withSelfRel());

        // Return the response with created status and HATEOAS links
        return ResponseEntity.status(HttpStatus.CREATED).body(resource);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getWorkoutPlansByUserId(@PathVariable("userId") String userId) {
        List<WorkoutPlan> workoutPlans = workoutPlanService.getWorkoutPlansByUserId(userId);

        // If no workout plans found, return 404 NOT FOUND
        if (workoutPlans.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No workout plans found for the user");
        }

        // Create a collection model
        CollectionModel<WorkoutPlan> resource = CollectionModel.of(workoutPlans);

        // Add self link for each workout plan
        for (WorkoutPlan workoutPlan : workoutPlans) {
            Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(WorkoutPlanController.class).getWorkoutPlansByUserId(userId)).withSelfRel();
            resource.add(selfLink.withRel("workoutPlan-" + workoutPlan.getId()));
        }

        // Return response with HATEOAS links
        return ResponseEntity.ok(resource);
    }

    @GetMapping("/allWorkoutPlans")
    public ResponseEntity<?> getAllWorkoutPlans( ) {
        List<WorkoutPlan> workoutPlans = workoutPlanService.getAllWorkoutPlans();

        // If no workout plans found, return 404 NOT FOUND
        if (workoutPlans.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No workout plans found");
        }

        // Create a collection model
        CollectionModel<WorkoutPlan> resource = CollectionModel.of(workoutPlans);

        // Add self link for each workout plan
        for (WorkoutPlan workoutPlan : workoutPlans) {
            Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(WorkoutPlanController.class).getAllWorkoutPlans()).withSelfRel();
            resource.add(selfLink.withRel("workoutPlan-" + workoutPlan.getId()));
        }

        // Return response with HATEOAS links
        return ResponseEntity.ok(resource);
    }


    @GetMapping("viewPost/{postId}")
    public ResponseEntity<?> getWorkoutPlanById(@PathVariable("postId") String postId) {
        Optional<WorkoutPlan> workoutPlan = workoutPlanService.getWorkoutPostById(postId);

        if (workoutPlan.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Workout plan not found");
        }

        // Create a model for the workout plan
        EntityModel<Optional<WorkoutPlan>> resource = EntityModel.of(workoutPlan);

        // Add self link
        Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(WorkoutPlanController.class).getWorkoutPlanById(postId)).withSelfRel();
        resource.add(selfLink);

        // Return response with HATEOAS links
        return ResponseEntity.ok(resource);


    }

    @DeleteMapping("/{workoutPlanId}")
    public ResponseEntity<String> deleteWorkoutPlanById(@PathVariable("workoutPlanId") String workoutPlanId) {
        workoutPlanService.deleteWorkoutPlanById(workoutPlanId);
        return new ResponseEntity<>("Workout plan deleted successfully", HttpStatus.OK);
    }

    @PutMapping("/{workoutPlanId}")
    public ResponseEntity<EntityModel<WorkoutPlan>> updateWorkoutPlanById(@PathVariable("workoutPlanId") String workoutPlanId, @RequestBody WorkoutPlan updatedWorkoutPlan) {
        WorkoutPlan updatedPlan = workoutPlanService.updateWorkoutPlanById(workoutPlanId, updatedWorkoutPlan);

        // Create self link
        Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(WorkoutPlanController.class).updateWorkoutPlanById(workoutPlanId, updatedWorkoutPlan)).withSelfRel();

        // Create response entity with self link
        EntityModel<WorkoutPlan> response = EntityModel.of(updatedPlan);
        response.add(selfLink);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/comments/{workoutPlanId}")
    public ResponseEntity<?> addCommentToWorkoutPlan(@PathVariable String workoutPlanId, @RequestBody Comment comment){
        WorkoutPlan updatedPlan = workoutPlanService.addCommentToWorkoutPlan(workoutPlanId, comment);

        // Create self link
        Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(WorkoutPlanController.class).addCommentToWorkoutPlan(workoutPlanId, comment)).withSelfRel();

        // Create response entity with self link
        EntityModel<WorkoutPlan> response = EntityModel.of(updatedPlan);
        response.add(selfLink);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/deleteComment/{workoutPlanId}")
    public ResponseEntity<?> deleteComment(@PathVariable String workoutPlanId, @RequestBody Comment comment){
        WorkoutPlan updatedPlan = workoutPlanService.deleteComment(workoutPlanId,comment);

        // Create self link
        Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(WorkoutPlanController.class).deleteComment(workoutPlanId,comment)).withSelfRel();

        // Create response entity with self link
        EntityModel<WorkoutPlan> response = EntityModel.of(updatedPlan);
        response.add(selfLink);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/editComment/{workoutPlanId}")
    public ResponseEntity<?> editComment(@PathVariable String workoutPlanId, @RequestBody EditCommentDto comment){
        WorkoutPlan updatedPlan = workoutPlanService.editComment(workoutPlanId,comment);

        // Create self link
        Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(WorkoutPlanController.class).editComment(workoutPlanId,comment)).withSelfRel();

        // Create response entity with self link
        EntityModel<WorkoutPlan> response = EntityModel.of(updatedPlan);
        response.add(selfLink);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/like/{workoutPlanId}")
    public ResponseEntity<?> Like(@PathVariable String workoutPlanId, @RequestBody Likes like){
        WorkoutPlan updatedPlan = workoutPlanService.like(workoutPlanId,like);

        // Create self link
        Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(WorkoutPlanController.class).Like(workoutPlanId,like)).withSelfRel();

        // Create response entity with self link
        EntityModel<WorkoutPlan> response = EntityModel.of(updatedPlan);
        response.add(selfLink);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/unlike/{workoutPlanId}")
    public ResponseEntity<?> Unlike(@PathVariable String workoutPlanId, @RequestBody Likes unlike){
        WorkoutPlan updatedPlan = workoutPlanService.unlike(workoutPlanId,unlike);

        // Create self link
        Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(WorkoutPlanController.class).Unlike(workoutPlanId,unlike)).withSelfRel();

        // Create response entity with self link
        EntityModel<WorkoutPlan> response = EntityModel.of(updatedPlan);
        response.add(selfLink);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PutMapping("/visibility/{workoutPlanId}/{visibility}")
    public ResponseEntity<?> updateVisibility(@PathVariable String workoutPlanId, @PathVariable boolean visibility){
        WorkoutPlan updatedPlan = workoutPlanService.UpdateVisibility(workoutPlanId,visibility);

        // Create self link
        Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(WorkoutPlanController.class).updateVisibility(workoutPlanId,visibility)).withSelfRel();

        // Create response entity with self link
        EntityModel<WorkoutPlan> response = EntityModel.of(updatedPlan);
        response.add(selfLink);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

  

@PutMapping("/likes/{workoutPlanId}")
public ResponseEntity<WorkoutPlan> Likes(@PathVariable String workoutPlanId, @RequestBody Likes like) {
    WorkoutPlan updatedPlan = workoutPlanService.like(workoutPlanId, like);
    return new ResponseEntity<>(updatedPlan, HttpStatus.OK);
}

@PutMapping("/unlikes/{workoutPlanId}")
public ResponseEntity<WorkoutPlan> Unlikes(@PathVariable String workoutPlanId, @RequestBody Likes unlike) {
    WorkoutPlan updatedPlan = workoutPlanService.unlike(workoutPlanId, unlike);
    return new ResponseEntity<>(updatedPlan, HttpStatus.OK);
}
}
