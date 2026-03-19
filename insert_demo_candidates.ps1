$baseUrl = "http://localhost:8080/api/candidates"

function Insert-Candidate {
    param($name, $email, $role, $dept, $resumeText)

    $obj = [PSCustomObject]@{
        name       = $name
        email      = $email
        role       = $role
        department = $dept
        status     = "Applied"
        resumeText = $resumeText
        resumeUrl  = "demo_resume.pdf"
    }

    $json = $obj | ConvertTo-Json -Compress -Depth 3
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)

    try {
        $resp = Invoke-RestMethod -Uri $baseUrl -Method POST -Body $bytes -ContentType "application/json; charset=utf-8"
        Write-Host "OK: $name (id=$($resp.id))" -ForegroundColor Green
    } catch {
        Write-Host "FAIL: $name -- $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "--- Inserting Java Developer candidates ---" -ForegroundColor Cyan

Insert-Candidate `
  -name "Rohan Sharma" `
  -email "rohan.sharma@gmail.com" `
  -role "Java Developer" `
  -dept "Engineering" `
  -resumeText "Rohan Sharma. Java Developer with 4 years experience. Skills: Java 17, Spring Boot, Microservices, REST APIs, AWS EC2 S3 RDS, Docker, Kubernetes, PostgreSQL, Redis, Apache Kafka, JUnit Mockito. Experience: Senior Java Developer at TechCorp 2022 to present - designed microservices reducing latency 40 percent, implemented JWT authentication and RBAC, led team of 3 developers. Java Developer at Infosys 2020 to 2022 - built REST APIs for banking domain, migrated monolith to microservices, 90 percent test coverage. Education: B.Tech Computer Science NIT Pune CGPA 8.7. Certifications: AWS Certified Developer Associate, Oracle Java SE 11 Professional."

Insert-Candidate `
  -name "Priya Nair" `
  -email "priya.nair@outlook.com" `
  -role "Java Developer" `
  -dept "Engineering" `
  -resumeText "Priya Nair. Java Backend Developer with 2.5 years experience. Skills: Java 11 and 17, Spring Boot, Spring Data JPA, Hibernate, Apache Kafka, PostgreSQL, Elasticsearch, AWS Lambda API Gateway S3, Docker, Jenkins. Experience: Java Developer at FinPay Solutions 2021 to present - built payment microservices handling 10000 transactions per day, optimized SQL queries from 800ms to 120ms response time, integrated Kafka for real-time event streaming. Junior Java Developer at Wipro 2020 to 2021 - CRUD APIs for inventory management, reduced defect rate 30 percent. Education: B.E. Information Technology VIT Vellore CGPA 9.1. Certifications: Spring Professional Certification, Agile Software Development Lifecycle Coursera."

Insert-Candidate `
  -name "Amit Verma" `
  -email "amit.verma@yahoo.com" `
  -role "Java Developer" `
  -dept "Engineering" `
  -resumeText "Amit Verma. Java Developer fresher with internship experience. Skills: Core Java, Spring Boot, Spring MVC, Hibernate, MySQL, H2, Git, Maven, Postman. Experience: Java Developer Intern at StartupXYZ 6 months - built REST APIs for online learning platform, implemented user registration login and course enrollment, connected app to MySQL using Spring Data JPA, deployed on Linux server. Projects: Employee Management System using Spring Boot and MySQL full CRUD with pagination. Library Management System using Java and JDBC. Education: B.Tech Computer Science GGSIPU Delhi CGPA 7.9. Certifications: Udemy Complete Java Bootcamp 40 hours, HackerRank Java 5-Star."

Write-Host ""
Write-Host "Done! Go to Nexus Recruitment page and try this in AI Copilot:" -ForegroundColor Yellow
Write-Host "  Compare all Java developer candidates and recommend who to interview first" -ForegroundColor Magenta
