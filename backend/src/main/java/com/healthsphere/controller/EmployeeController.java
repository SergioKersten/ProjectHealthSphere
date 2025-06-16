package com.healthsphere.controller;

import java.time.LocalDate;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.healthsphere.components.Employee;
import com.healthsphere.manager.PersonManager;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    private final PersonManager<Employee> employeeManager;

    public EmployeeController() {
        this.employeeManager = new PersonManager<>("employees.ser");
    }

    @GetMapping
    public ResponseEntity<Set<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeManager.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable long id) {
        Employee employee = employeeManager.findById(id);
        if (employee != null) {
            return ResponseEntity.ok(employee);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/department/{department}")
    public ResponseEntity<Set<Employee>> getEmployeesByDepartment(@PathVariable String department) {
        Set<Employee> employees = employeeManager.filter(emp -> 
            emp.getDepartment() != null && emp.getDepartment().equalsIgnoreCase(department));
        return ResponseEntity.ok(employees);
    }

    @PostMapping
    public ResponseEntity<String> createEmployee(@RequestBody EmployeeRequest request) {
        try {
            Employee employee = new Employee(
                request.getPersonId(),
                request.getName(),
                request.getFirstname(),
                request.getPhonenumber(),
                request.getEmail(),
                request.getBirthdate(),
                request.getAdress(),
                request.getDepartment()
            );
            
            boolean added = employeeManager.addPerson(employee);
            if (added) {
                return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Mitarbeiter erfolgreich erstellt");
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Mitarbeiter mit dieser ID existiert bereits");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Fehler beim Erstellen des Mitarbeiters: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateEmployee(
            @PathVariable long id,
            @RequestBody EmployeeUpdateRequest request) {
        
        Employee employee = employeeManager.findById(id);
        if (employee != null) {
            // Update standard Person fields
            boolean updated = employeeManager.updatePerson(
                id,
                request.getName(),
                request.getFirstname(),
                request.getPhonenumber(),
                request.getEmail(),
                request.getAdress()
            );
            
            // Update department if provided
            if (request.getDepartment() != null) {
                employee.setDepartment(request.getDepartment());
            }
            
            return ResponseEntity.ok("Mitarbeiter erfolgreich aktualisiert");
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable long id) {
        boolean deleted = employeeManager.deletePerson(id);
        if (deleted) {
            return ResponseEntity.ok("Mitarbeiter erfolgreich gelöscht");
        }
        return ResponseEntity.notFound().build();
    }

    // DTO Classes
    public static class EmployeeRequest {
        private long personId;
        private String name;
        private String firstname;
        private String phonenumber;
        private String email;
        private LocalDate birthdate;
        private String adress;
        private String department;

        // Getters and Setters
        public long getPersonId() { return personId; }
        public void setPersonId(long personId) { this.personId = personId; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getFirstname() { return firstname; }
        public void setFirstname(String firstname) { this.firstname = firstname; }
        public String getPhonenumber() { return phonenumber; }
        public void setPhonenumber(String phonenumber) { this.phonenumber = phonenumber; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public LocalDate getBirthdate() { return birthdate; }
        public void setBirthdate(LocalDate birthdate) { this.birthdate = birthdate; }
        public String getAdress() { return adress; }
        public void setAdress(String adress) { this.adress = adress; }
        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
    }

    public static class EmployeeUpdateRequest {
        private String name;
        private String firstname;
        private String phonenumber;
        private String email;
        private String adress;
        private String department;

        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getFirstname() { return firstname; }
        public void setFirstname(String firstname) { this.firstname = firstname; }
        public String getPhonenumber() { return phonenumber; }
        public void setPhonenumber(String phonenumber) { this.phonenumber = phonenumber; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getAdress() { return adress; }
        public void setAdress(String adress) { this.adress = adress; }
        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
    }
}
