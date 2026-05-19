# Software Requirements Specification

## Project
Choose Your Fate

## Course Context
This document is written for the Software Quality exam project. It defines the intended scope, functional requirements, and quality requirements for the current version of the system. The document is aligned with the team's current goal of delivering a vertical slice first and then extending that slice into one complete playable adventure.

## 1. Introduction

### 1.1 Purpose
Choose Your Fate is a web-based, text-driven role-playing game inspired by classic "Choose Your Own Adventure" books. The goal is to offer players an online experience where story progression is driven by player choices. The system is intended for users who enjoy branching stories, replayability, and interactive fiction.

The system addresses two main needs:

- There are relatively few simple browser-based systems centered on classic choice-driven adventure books.
- Multiple adventures can eventually be collected in one digital platform instead of being isolated as separate books or one-off experiences.

### 1.2 Intended Audience
The primary audience for the system is:

- Players who want to play a choice-driven online text RPG.
- Administrators who manage content and maintain the available adventures.

The primary audience for this document is:

- The development group
- Reviewers
- Teachers and examiners

### 1.3 Product Scope
The current product scope is a vertical slice of a browser-based text RPG with a frontend, backend API, relational database, authentication, and a quality-focused delivery process.

The short-term project goal is:

- To implement a playable vertical slice that proves the main gameplay loop.

The next step after the vertical slice is:

- To support one complete adventure from start to finish.

Out of scope for the current slice:

- Multiple fully selectable adventures
- Large-scale content management beyond what is needed for one demonstrable adventure
- Advanced social features such as chat, guilds, multiplayer sessions, or leaderboards

### 1.4 Definitions

- **Adventure**: A complete branching story consisting of chapters, scenes, and choices.
- **Scene**: A narrative unit presented to the player.
- **Choice**: An option that moves the player to another scene and may affect progression.
- **Character**: A player-owned game entity used to progress through an adventure.
- **Vertical slice**: A small but complete end-to-end part of the system that demonstrates core functionality across frontend, backend, database, and testing.
- **Failover database**: A secondary SQL database instance intended to take over if the primary database becomes unavailable.

## 2. System Overview

### 2.1 Product Perspective
Choose Your Fate is a client-server web application consisting of:

- A React frontend
- A Spring Boot backend exposed through an HTTP API
- A relational database for persistent storage
- An external public API integration

For the Software Quality version of the project, the persistence strategy is relational. The system architecture is intended to include:

- One primary SQL database instance
- One mirrored or standby SQL database instance for improved availability

### 2.2 User Classes

#### Player
A player can:

- Create an account
- Log in
- Create and manage characters
- Play through scenes
- Make choices
- Potentially manage inventory, items, and quests depending on the completed slice

#### Administrator
An administrator can:

- Manage content for adventures
- Maintain scenes, choices, and related story data
- Potentially manage chapters, items, quests, and other game entities

## 3. Assumptions and Constraints

### 3.1 Assumptions

- The system is used through a web browser.
- Users have internet access.
- The backend exposes a REST-style API.
- A relational database is the authoritative source of game and account data in the Software Quality version.
- The project will include CI and automated testing as part of the delivery.

### 3.2 Constraints

- The project is developed within course time and team capacity.
- The deliverable must contain a frontend, backend, database, external API integration, testing, and CI.
- The current scope is limited to one vertical slice and then one full demonstrable adventure.
- High availability is addressed through a mirrored SQL setup rather than through multiple heterogeneous databases.

## 4. Functional Requirements

### 4.1 Authentication and Account Management

#### FR-1 Account Registration
The system shall allow a new player account to be created with the required credentials and profile data.

#### FR-2 Authentication
The system shall allow registered users to log in and receive authenticated access to protected functionality.

#### FR-3 Authorization
The system shall distinguish between at least two roles:

- Player
- Administrator

#### FR-4 Account Access Control
The system shall ensure that players can only access or modify their own account-related gameplay data unless they have administrator privileges.

### 4.2 Character Management

#### FR-5 Character Creation
The system shall allow an authenticated player to create a character linked to the player account.

#### FR-6 Character Retrieval
The system shall allow a player to retrieve their own character data.

#### FR-7 Character Administration
The system shall allow an administrator to retrieve and manage character data across users.

### 4.3 Adventure Navigation

#### FR-8 Scene Retrieval
The system shall retrieve the current scene for a character during gameplay.

#### FR-9 Choice Presentation
The system shall present the available choices for the current scene.

#### FR-10 Scene Progression
The system shall move the player to the next scene based on the selected choice.

#### FR-11 Consequence Handling
The system shall support choice consequences that affect scene progression and, where implemented, related gameplay state.

### 4.4 Story Content Management

#### FR-12 Story Structure
The system shall support storing at least the following story entities:

- Adventures or chapters
- Scenes
- Choices

#### FR-13 Content Administration
The system shall allow administrators to create, read, update, and delete story content required for the adventure slice.

### 4.5 Inventory, Items, and Quests

#### FR-14 Inventory Support
The system should support a character inventory if this functionality is included in the implemented slice.

#### FR-15 Item Support
The system should support items associated with the character and/or adventure logic if this functionality is included in the implemented slice.

#### FR-16 Quest Support
The system should support quest data and quest progression if this functionality is included in the implemented slice.

### 4.6 External API Integration

#### FR-17 External API Usage
The system shall integrate with at least one external public API as required by the course assignment.

#### FR-18 External API Isolation
The external API integration shall be encapsulated so that failures in the external service do not corrupt internal game data.

Note:
The current codebase appears to include text-to-speech integration. If the group keeps this as the selected external API integration, the final document can name that integration explicitly.

## 5. Non-Functional Requirements

### 5.1 Availability

#### NFR-1 Service Availability
The system should aim for high availability within the limits of the project setup.

#### NFR-2 Database Availability
The system shall be designed to support a secondary SQL database instance that can be used if the primary instance becomes unavailable.

#### NFR-3 Failover Objective
The database design should minimize downtime in the event of primary database failure.

### 5.2 Reliability and Data Integrity

#### NFR-4 Consistent Persistence
The system shall preserve data consistency for accounts, characters, scenes, and related game entities.

#### NFR-5 Constraint Enforcement
The relational database shall enforce key integrity rules such as primary keys, foreign keys, and relevant uniqueness constraints.

#### NFR-6 Error Handling
The backend shall return meaningful error responses for invalid input, unauthorized access, and system failures.

### 5.3 Security

#### NFR-7 Authentication Security
The system shall protect secured endpoints using authenticated access control.

#### NFR-8 Password Protection
User passwords shall not be stored in plaintext.

#### NFR-9 Authorization Security
The system shall enforce role-based access to privileged operations.

#### NFR-10 Input Validation
The system shall validate client input before processing or persisting data.

### 5.4 Performance

#### NFR-11 Normal Response Time
Under normal use, common API operations should respond quickly enough to support a smooth gameplay experience.

#### NFR-12 Gameplay Responsiveness
Scene navigation and choice submission should feel responsive from the player's perspective.

#### NFR-13 Load Awareness
The system shall be testable with load, stress, and spike testing as required by the course.

### 5.5 Maintainability

#### NFR-14 Layered Architecture
The system should follow a clear separation of concerns between frontend, controller/API, service logic, and persistence.

#### NFR-15 Code Readability
The codebase should be understandable and maintainable by the student team.

#### NFR-16 Testability
The system architecture shall support unit testing, integration testing, API testing, and end-to-end UI testing.

### 5.6 Test Automation and Quality Assurance

#### NFR-17 Continuous Integration
The project shall include a CI pipeline that runs automated checks on pushes and pull requests.

#### NFR-18 Automated Unit Testing
The project shall include unit tests for business logic and critical components.

#### NFR-19 Automated Integration Testing
The project shall include integration tests for backend and persistence behavior where relevant.

#### NFR-20 Automated API Testing
The project shall include automated tests for internal API endpoints, covering both positive and negative cases.

#### NFR-21 Automated End-to-End UI Testing
The project shall include browser-based end-to-end tests implemented in code.

#### NFR-22 Frontend UI Test Tool
Playwright shall be used for end-to-end frontend testing.

#### NFR-23 Coverage and Static Analysis
The project shall include code coverage reporting and the use of at least one static analysis or static testing tool beyond basic IDE linting.

## 6. Technology Requirements

### 6.1 Backend
The backend shall be implemented in Java using Spring Boot.

### 6.2 Frontend
The frontend shall be implemented as a web client using React and TypeScript.

### 6.3 Database
The Software Quality version of the system shall use a relational SQL database as the primary persistence solution.

### 6.4 Authentication
The backend shall support token-based authentication for protected endpoints.

### 6.5 Testing Tooling
The project shall support automated tests for backend and frontend, including Playwright for UI testing.

## 7. Initial User Stories

### US-1 Player Login
As a player, I want to log in so that I can access my game progress and characters.

### US-2 Create Character
As a player, I want to create a character so that I can begin an adventure.

### US-3 Continue Story
As a player, I want to view my current scene and available choices so that I can progress through the story.

### US-4 Make Choice
As a player, I want to choose between different actions so that the story changes based on my decisions.

### US-5 Admin Content Management
As an administrator, I want to manage story content so that new adventures and scenes can be added to the platform.

### US-6 Preserve Availability
As a system stakeholder, I want the database layer to tolerate primary database failure so that the system can maintain availability as well as possible within the project scope.

## 8. Acceptance-Oriented Slice Definition

The current vertical slice is considered successful if the following is demonstrated:

- A player can create an account or log in
- A player can create a character
- A player can enter at least one adventure flow
- The system can present a scene and available choices
- A selected choice moves the player to the next scene
- The backend persists relevant game state in the relational database
- The frontend, backend, database, and external API integration work together end-to-end

The next milestone after the vertical slice is a complete playable adventure with the same architectural and quality principles.

## 9. Open Decisions

The following points should be confirmed before the final PDF version is submitted:

- Which external public API is the officially selected integration
- Whether inventory, items, and quests are included in the final slice or listed as partial/optional functionality
- Whether the mirrored SQL setup is automatic failover, manual failover, or standby-only in the final implementation
- Whether the final wording should describe "adventures" as a future feature or keep the current delivery strictly focused on one adventure

## 10. Summary
Choose Your Fate is specified as a quality-focused web application for interactive text-based adventure gameplay. The current Software Quality version focuses on a relational architecture, authenticated gameplay, content administration, automated testing, CI, and improved availability through a mirrored SQL setup. The document deliberately reflects the team's current delivery target: one solid vertical slice first, then one complete adventure.
