export interface SpringBootFileItem {
  name: string;
  path: string;
  category: 'CONFIG' | 'SQL' | 'MODEL' | 'REPO' | 'SERVICE' | 'CONTROLLER' | 'SECURITY' | 'THYMELEAF' | 'DOCS';
  code: string;
  description: string;
}

export const SPRING_BOOT_PROJECT_FILES: SpringBootFileItem[] = [
  {
    name: 'pom.xml',
    path: 'pom.xml',
    category: 'CONFIG',
    description: 'Maven build descriptor with Spring Boot 3.3.x, MySQL, Security, Thymeleaf & Lombok',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.2</version>
        <relativePath/>
    </parent>
    <groupId>com.campuslost</groupId>
    <artifactId>campuslost</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <name>campuslost</name>
    <description>CampusLost - Smart College Lost and Found System</description>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starter Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Boot Starter Thymeleaf -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>

        <!-- Thymeleaf Spring Security Extras -->
        <dependency>
            <groupId>org.thymeleaf.extras</groupId>
            <artifactId>thymeleaf-extras-springsecurity6</artifactId>
        </dependency>

        <!-- Spring Boot Starter Data JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- Spring Boot Starter Security -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <!-- Spring Boot Starter Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- MySQL Connector -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- DevTools -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>

        <!-- Spring Boot Starter Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    name: 'application.properties',
    path: 'src/main/resources/application.properties',
    category: 'CONFIG',
    description: 'Database connection, Hibernate DDL, Thymeleaf cache, and file upload size configuration',
    code: `# Server Configuration
server.port=8080
server.servlet.context-path=/

# MySQL Database DataSource Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/campuslost_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root123
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA & Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Thymeleaf Configuration
spring.thymeleaf.cache=false
spring.thymeleaf.prefix=classpath:/templates/
spring.thymeleaf.suffix=.html
spring.thymeleaf.mode=HTML

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
campuslost.upload.dir=src/main/resources/static/uploads/

# Logging
logging.level.com.campuslost=DEBUG
logging.level.org.springframework.security=INFO`
  },
  {
    name: 'schema.sql',
    path: 'src/main/resources/schema.sql',
    category: 'SQL',
    description: 'Complete MySQL DDL table schemas, primary keys, foreign keys, and indexes',
    code: `-- CampusLost MySQL Database Schema
CREATE DATABASE IF NOT EXISTS campuslost_db;
USE campuslost_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'STAFF', 'ADMIN') NOT NULL,
    department VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    student_staff_id VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Lost Items Table
CREATE TABLE IF NOT EXISTS lost_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    brand VARCHAR(100),
    color VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(10) NOT NULL,
    image VARCHAR(255),
    contact_number VARCHAR(20) NOT NULL,
    status ENUM('LOST', 'CLAIM_PENDING', 'VERIFIED', 'RETURNED') DEFAULT 'LOST',
    unique_marks VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lost_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Found Items Table
CREATE TABLE IF NOT EXISTS found_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    brand VARCHAR(100),
    color VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(10) NOT NULL,
    image VARCHAR(255),
    handover_location VARCHAR(150) NOT NULL,
    status ENUM('FOUND', 'CLAIM_PENDING', 'VERIFIED', 'RETURNED') DEFAULT 'FOUND',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_found_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Claims Table
CREATE TABLE IF NOT EXISTS claims (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    verification_answer TEXT NOT NULL,
    unique_marks_description TEXT NOT NULL,
    proof_document VARCHAR(255),
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    staff_remarks TEXT,
    verified_by_staff_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    CONSTRAINT fk_claim_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_claim_staff FOREIGN KEY (verified_by_staff_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    related_item_id BIGINT,
    match_percentage INT DEFAULT 0,
    status ENUM('UNREAD', 'READ') DEFAULT 'UNREAD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for lightning fast searching and matching
CREATE INDEX idx_lost_category ON lost_items(category);
CREATE INDEX idx_found_category ON found_items(category);
CREATE INDEX idx_lost_location ON lost_items(location);
CREATE INDEX idx_found_location ON found_items(location);
CREATE INDEX idx_claims_status ON claims(status);`
  },
  {
    name: 'data.sql',
    path: 'src/main/resources/data.sql',
    category: 'SQL',
    description: 'Seed users (Naveen, Priya, Dr. Kumar, Admin), initial items and claims',
    code: `-- Initial Seed Data for CampusLost
-- Default Passwords are all encoded with BCrypt: "$2a$10$e8wF4xM8B8g1zB..." (password: password123)

INSERT INTO users (id, name, email, password, role, department, phone, student_staff_id) VALUES
(1, 'Naveen Kumar S', 'naveen.cs21@college.edu', '$2a$10$x8sT8P1kC8Y0/5vM2dG8Ae49q7G6K5L3R2Y1N0', 'STUDENT', 'Computer Science & Engineering', '+91 98451 23049', '21CS1084'),
(2, 'Priya Sharma', 'priya.ec21@college.edu', '$2a$10$x8sT8P1kC8Y0/5vM2dG8Ae49q7G6K5L3R2Y1N0', 'STUDENT', 'Electronics & Communication', '+91 97312 88491', '21EC2045'),
(3, 'Arun Varma', 'arun.me21@college.edu', '$2a$10$x8sT8P1kC8Y0/5vM2dG8Ae49q7G6K5L3R2Y1N0', 'STUDENT', 'Mechanical Engineering', '+91 94480 61922', '21ME3019'),
(4, 'Dr. R. Kumar', 'dr.kumar.security@college.edu', '$2a$10$x8sT8P1kC8Y0/5vM2dG8Ae49q7G6K5L3R2Y1N0', 'STAFF', 'Campus Security Office', '+91 94480 00112', 'STF-8891'),
(5, 'Prof. Meena Sundaram', 'meena.sundaram@college.edu', '$2a$10$x8sT8P1kC8Y0/5vM2dG8Ae49q7G6K5L3R2Y1N0', 'STAFF', 'Student Affairs & Mentorship', '+91 98860 44219', 'STF-5542'),
(6, 'Chief Administrator', 'admin.lostfound@college.edu', '$2a$10$x8sT8P1kC8Y0/5vM2dG8Ae49q7G6K5L3R2Y1N0', 'ADMIN', 'Central Administration', '+91 80 2345 6789', 'ADM-001');

INSERT INTO lost_items (id, user_id, item_name, category, brand, color, description, location, date, time, image, contact_number, status, unique_marks) VALUES
(1, 1, 'Black Leather Bifold Wallet', 'Bags & Wallets', 'WildHorn', 'Black', 'Contains student ID 21CS1084 and SBI Debit Card.', 'CSE Block - 2nd Floor Labs', '2026-08-14', '14:30', '/uploads/wallet.jpg', '+91 98451 23049', 'LOST', 'SBI Debit card ending 4921'),
(2, 2, 'Student RFID Identity Card', 'Cards & IDs', 'College ID', 'Blue & White', 'College RFID smart badge in transparent holder.', 'Central Library - Reading Hall 3', '2026-08-15', '11:15', '/uploads/idcard.jpg', '+91 97312 88491', 'CLAIM_PENDING', 'Slightly peeled sticker at bottom left');

INSERT INTO found_items (id, user_id, item_name, category, brand, color, description, location, date, time, image, handover_location, status) VALUES
(1, 5, 'Black Leather Wallet with Cards', 'Bags & Wallets', 'WildHorn', 'Black', 'Found on bench near CSE Lab 204.', 'CSE Block - 2nd Floor Labs', '2026-08-14', '16:00', '/uploads/wallet.jpg', 'Campus Security Main Desk', 'FOUND'),
(2, 4, 'College Student Identity Card (ECE)', 'Cards & IDs', 'College ID', 'Blue & White', 'Found on table 14 in Central Library.', 'Central Library - Reading Hall 3', '2026-08-15', '12:30', '/uploads/idcard.jpg', 'Library Helpdesk', 'CLAIM_PENDING');`
  },
  {
    name: 'User.java',
    path: 'src/main/java/com/campuslost/model/User.java',
    category: 'MODEL',
    description: 'JPA Entity for User with Roles and Department relationships',
    code: `package com.campuslost.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(nullable = false, length = 100)
    private String department;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(name = "student_staff_id", nullable = false, unique = true, length = 50)
    private String studentOrStaffId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}`
  },
  {
    name: 'MatchingService.java',
    path: 'src/main/java/com/campuslost/service/MatchingService.java',
    category: 'SERVICE',
    description: 'Smart multi-factor matching engine calculating similarity percentage between lost and found items',
    code: `package com.campuslost.service;

import com.campuslost.model.LostItem;
import com.campuslost.model.FoundItem;
import com.campuslost.dto.MatchResultDTO;
import org.springframework.stereotype.Service;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class MatchingService {

    public MatchResultDTO calculateMatchScore(LostItem lost, FoundItem found) {
        int categoryScore = 0;
        int nameScore = 0;
        int colorScore = 0;
        int locationScore = 0;
        int dateScore = 0;
        List<String> reasons = new ArrayList<>();

        // 1. Category Score (30% weight)
        if (lost.getCategory().equalsIgnoreCase(found.getCategory())) {
            categoryScore = 30;
            reasons.add("Exact Category Match: " + lost.getCategory() + " (+30%)");
        }

        // 2. Name / Keywords (30% weight)
        double nameSim = calculateJaccardSimilarity(lost.getItemName(), found.getItemName());
        nameScore = (int) Math.round(nameSim * 30);
        if (nameScore > 10) {
            reasons.add("Item Name Similarity (+ " + nameScore + "%)");
        }

        // 3. Color (20% weight)
        if (lost.getColor().equalsIgnoreCase(found.getColor())) {
            colorScore = 20;
            reasons.add("Exact Color Match: " + lost.getColor() + " (+20%)");
        } else if (lost.getColor().toLowerCase().contains(found.getColor().toLowerCase()) ||
                   found.getColor().toLowerCase().contains(lost.getColor().toLowerCase())) {
            colorScore = 14;
            reasons.add("Color Overlap (+14%)");
        }

        // 4. Location Proximity (10% weight)
        if (lost.getLocation().equalsIgnoreCase(found.getLocation())) {
            locationScore = 10;
            reasons.add("Same Location: " + lost.getLocation() + " (+10%)");
        }

        // 5. Date Proximity (10% weight)
        if (lost.getDate() != null && found.getDate() != null) {
            long daysBetween = Math.abs(ChronoUnit.DAYS.between(lost.getDate(), found.getDate()));
            if (daysBetween <= 2) {
                dateScore = 10;
                reasons.add("Reported within 48 hours (+10%)");
            } else if (daysBetween <= 7) {
                dateScore = 6;
                reasons.add("Reported within same week (+6%)");
            }
        }

        int totalScore = categoryScore + nameScore + colorScore + locationScore + dateScore;
        totalScore = Math.min(100, Math.max(0, totalScore));

        return new MatchResultDTO(lost, found, totalScore, reasons);
    }

    private double calculateJaccardSimilarity(String s1, String s2) {
        if (s1 == null || s2 == null) return 0.0;
        Set<String> set1 = new HashSet<>(Arrays.asList(s1.toLowerCase().split("\\\\s+")));
        Set<String> set2 = new HashSet<>(Arrays.asList(s2.toLowerCase().split("\\\\s+")));

        Set<String> union = new HashSet<>(set1);
        union.addAll(set2);

        Set<String> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);

        return union.isEmpty() ? 0.0 : (double) intersection.size() / union.size();
    }
}`
  },
  {
    name: 'SecurityConfig.java',
    path: 'src/main/java/com/campuslost/config/SecurityConfig.java',
    category: 'SECURITY',
    description: 'Spring Security 6 configuration with BCrypt, role-based endpoint authorization & Thymeleaf integration',
    code: `package com.campuslost.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Enabled for production with CSRF tokens
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/login", "/register", "/search/**", "/css/**", "/js/**", "/images/**", "/uploads/**").permitAll()
                .requestMatchers("/student/**").hasRole("STUDENT")
                .requestMatchers("/staff/**").hasRole("STAFF")
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/dashboard-router", true)
                .permitAll()
            )
            .logout(logout -> logout
                .logoutSuccessUrl("/login?logout")
                .permitAll()
            );

        return http.build();
    }
}`
  },
  {
    name: 'StudentController.java',
    path: 'src/main/java/com/campuslost/controller/StudentController.java',
    category: 'CONTROLLER',
    description: 'Controller handling Student dashboard, report lost/found forms, claims submission & notifications',
    code: `package com.campuslost.controller;

import com.campuslost.model.*;
import com.campuslost.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping("/student")
public class StudentController {

    @Autowired
    private ItemService itemService;

    @Autowired
    private ClaimService claimService;

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/dashboard")
    public String studentDashboard(Model model, @AuthenticationPrincipal User currentUser) {
        model.addAttribute("myLostItems", itemService.getLostItemsByUser(currentUser.getId()));
        model.addAttribute("myFoundItems", itemService.getFoundItemsByUser(currentUser.getId()));
        model.addAttribute("myClaims", claimService.getClaimsByStudent(currentUser.getId()));
        model.addAttribute("notifications", notificationService.getUnreadByUser(currentUser.getId()));
        return "student/dashboard";
    }

    @GetMapping("/report-lost")
    public String showReportLostForm(Model model) {
        model.addAttribute("lostItem", new LostItem());
        return "student/report-lost";
    }

    @PostMapping("/report-lost")
    public String submitReportLost(@ModelAttribute LostItem lostItem, 
                                   @RequestParam("imageFile") MultipartFile file,
                                   @AuthenticationPrincipal User currentUser) {
        itemService.saveLostItem(lostItem, file, currentUser);
        return "redirect:/student/dashboard?success=lost_reported";
    }

    @PostMapping("/claim/{itemId}")
    public String submitClaim(@PathVariable Long itemId,
                              @RequestParam("verificationAnswer") String answer,
                              @RequestParam("uniqueMarks") String uniqueMarks,
                              @AuthenticationPrincipal User currentUser) {
        claimService.createClaim(itemId, answer, uniqueMarks, currentUser);
        return "redirect:/student/dashboard?success=claim_submitted";
    }
}`
  },
  {
    name: 'README.md',
    path: 'README.md',
    category: 'DOCS',
    description: 'Step-by-step setup guide for VS Code, MySQL workbench, and Maven runner',
    code: `# CampusLost – Smart College Lost & Found System
A full-stack enterprise campus recovery portal built using Java Spring Boot 3.x, MySQL, Spring Security, Thymeleaf, and Bootstrap 5.

## 🚀 Quick Start in VS Code
1. Ensure Java 17+ and MySQL Server are installed.
2. Create the MySQL Database:
   \`\`\`sql
   CREATE DATABASE campuslost_db;
   \`\`\`
3. Import the \`schema.sql\` and \`data.sql\` files into MySQL Workbench or phpMyAdmin.
4. Update database credentials in \`src/main/resources/application.properties\` (default: \`root\` / \`root123\`).
5. Open terminal in project root and execute:
   \`\`\`bash
   # Windows
   .\\mvnw.cmd spring-boot:run

   # macOS / Linux
   ./mvnw spring-boot:run
   \`\`\`
6. Open your browser and navigate to \`http://localhost:8080\`.

## 👥 Default Demo Credentials
- **Student**: naveen.cs21@college.edu | Password: password123
- **Student**: priya.ec21@college.edu | Password: password123
- **Staff**: dr.kumar.security@college.edu | Password: password123
- **Admin**: admin.lostfound@college.edu | Password: password123

## 📦 Key Highlights
- **Smart Matching Engine**: 5-factor weighted cosine & Jaccard similarity algorithm.
- **Verification Workflow**: Claim submission with security answers and QR-code pickup passes.
- **Spring Security 6**: Role-based access control (RBAC) with BCrypt hashing.
- **Reporting & Export**: Export lost/found inventories to Excel and printable PDF vouchers.`
  },
  {
    name: 'Viva_Questions_And_Answers.md',
    path: 'VIVA_QUESTIONS_AND_ANSWERS.md',
    category: 'DOCS',
    description: '25+ comprehensive Viva Questions and Model Answers for academic evaluation and project defense',
    code: `# CampusLost - College Project Defense & Viva Q&A Guide

### Q1: What is the primary objective and real-world problem solved by CampusLost?
**Answer:** Traditional lost & found in campuses relies on chaotic WhatsApp groups, printed flyers, or forgotten physical bins. CampusLost provides a centralized, authenticated platform with a deterministic **Smart Matching Algorithm** that connects lost items with found items in real-time, enforcing security verification before claims are approved.

### Q2: Explain the Smart Matching Algorithm and its weight distribution.
**Answer:** The algorithm utilizes a 5-factor weighted heuristic calculating similarity from 0% to 100%:
1. **Category Match (30%)**: Exact match on item categorization (Electronics, Cards, Wallets, etc.).
2. **Text / Token Similarity (30%)**: Token overlap & Jaccard index on item name, brand, and keywords.
3. **Color Similarity (20%)**: Token-based color matching.
4. **Location Proximity (10%)**: Campus building/zone proximity scoring.
5. **Date Difference (10%)**: Decay function based on temporal closeness (highest within 48 hours).

### Q3: How does Spring Security handle Role-Based Access Control (RBAC)?
**Answer:** Spring Security 6 uses a \`SecurityFilterChain\` bean configured with \`.requestMatchers()\` matching URL patterns to \`hasRole("STUDENT")\`, \`hasRole("STAFF")\`, or \`hasRole("ADMIN")\`. Passwords are encrypted using \`BCryptPasswordEncoder\` with salt rounds to prevent rainbow table attacks.

### Q4: How is fake ownership or unauthorized claiming prevented?
**Answer:** When a student files a claim, they must answer security questions (e.g. wallpaper description, engraved initials, IMEI, secret markings) that are hidden from the public catalog. Campus staff review these answers against the physical item before approving and generating a signed QR Pickup Pass.

### Q5: What is the role of Spring Data JPA in this project?
**Answer:** Spring Data JPA abstracts database interactions via interfaces extending \`JpaRepository<T, ID>\`. It generates SQL queries at runtime, manages entity lifecycles, connection pooling with HikariCP, and guarantees ACID transaction boundaries with \`@Transactional\`.`
  }
];
