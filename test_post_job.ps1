$body = @{
    title = "Test Job"
    department = "Engineering"
    location = "Remote"
    type = "Full-time"
    description = "Test description"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/jobs" -Method Post -Body $body -ContentType "application/json"
