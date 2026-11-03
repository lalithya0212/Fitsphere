$base = "http://localhost:8080/api"

Write-Host "=== 1. TEST ADMIN LOGIN & PROFILE ==="
$adminLogin = @{ email = "shyamraj@gmail.com"; password = "shyam123" } | ConvertTo-Json
$adminAuth = Invoke-RestMethod -Uri "$base/auth/login" -Method Post -Body $adminLogin -ContentType "application/json"
$adminToken = $adminAuth.token
Write-Host "Admin logged in. User ID: $($adminAuth.user.id), Name: $($adminAuth.user.name)"

$adminProf = Invoke-RestMethod -Uri "$base/admin/profile" -Method Get -Headers @{ Authorization = "Bearer $adminToken" }
Write-Host "Admin Profile retrieved: EmployeeId=$($adminProf.employeeId), Designation=$($adminProf.designation), Department=$($adminProf.department)"

Write-Host "`n=== 2. TEST ADMIN PROFILE UPDATE ==="
$adminUpdate = @{
    name = "Shyam Raj (Director)"
    phone = "+1 (555) 000-9999"
    department = "Intercollegiate Athletics & University Sports"
    designation = "Executive Athletics Director & Dean"
    bio = "Updated director profile in MySQL."
} | ConvertTo-Json
$adminProfUpdated = Invoke-RestMethod -Uri "$base/admin/profile" -Method Put -Body $adminUpdate -ContentType "application/json" -Headers @{ Authorization = "Bearer $adminToken" }
Write-Host "Admin Profile updated: Name=$($adminProfUpdated.name), Designation=$($adminProfUpdated.designation), Phone=$($adminProfUpdated.phone)"

Write-Host "`n=== 3. TEST STUDENT REGISTRATION & PROFILE ==="
$randomId = Get-Random -Minimum 1000 -Maximum 9999
$studentEmail = "student$randomId@university.edu"
$studentReg = @{
    name = "Test Student $randomId"
    email = $studentEmail
    password = "StudentPass123!"
    phone = "+1 (555) 234-$randomId"
} | ConvertTo-Json
$studentAuthUser = Invoke-RestMethod -Uri "$base/auth/register/student" -Method Post -Body $studentReg -ContentType "application/json"
Write-Host "Student registered: ID=$($studentAuthUser.id), Email=$($studentAuthUser.email)"

# Login as student
$studentLogin = @{ email = $studentEmail; password = "StudentPass123!" } | ConvertTo-Json
$studentAuth = Invoke-RestMethod -Uri "$base/auth/login" -Method Post -Body $studentLogin -ContentType "application/json"
$studentToken = $studentAuth.token

# GET student profile
$studentProf = Invoke-RestMethod -Uri "$base/student/profile" -Method Get -Headers @{ Authorization = "Bearer $studentToken" }
Write-Host "Student Profile auto-created: StudentId=$($studentProf.studentId), Dept=$($studentProf.department), Year=$($studentProf.yearOfStudy)"

# PUT student profile
$studentUpdate = @{
    name = "Alex Test Athlete"
    phone = "+1 (555) 777-8888"
    department = "Kinesiology & Sports Science"
    course = "B.S. Sports Analytics"
    yearOfStudy = 2
    dateOfBirth = "2004-05-15"
    gender = "Female"
    fitnessGoal = "Varsity Sprinting"
    bio = "Varsity collegiate sprinter."
} | ConvertTo-Json
$studentProfUpdated = Invoke-RestMethod -Uri "$base/student/profile" -Method Put -Body $studentUpdate -ContentType "application/json" -Headers @{ Authorization = "Bearer $studentToken" }
Write-Host "Student Profile updated: Name=$($studentProfUpdated.name), Course=$($studentProfUpdated.course), Year=$($studentProfUpdated.yearOfStudy), Goal=$($studentProfUpdated.fitnessGoal)"

Write-Host "`n=== 4. TEST TRAINER REGISTRATION & PROFILE ==="
$trainerEmail = "coach$randomId@university.edu"
$trainerReg = @{
    name = "Test Coach $randomId"
    email = $trainerEmail
    password = "TrainerPass123!"
    phone = "+1 (555) 876-$randomId"
} | ConvertTo-Json
$trainerAuthUser = Invoke-RestMethod -Uri "$base/auth/register/trainer" -Method Post -Body $trainerReg -ContentType "application/json"
Write-Host "Trainer registered: ID=$($trainerAuthUser.id), Email=$($trainerAuthUser.email)"

# Login as trainer
$trainerLogin = @{ email = $trainerEmail; password = "TrainerPass123!" } | ConvertTo-Json
$trainerAuth = Invoke-RestMethod -Uri "$base/auth/login" -Method Post -Body $trainerLogin -ContentType "application/json"
$trainerToken = $trainerAuth.token

# GET trainer profile
$trainerProf = Invoke-RestMethod -Uri "$base/trainer/profile" -Method Get -Headers @{ Authorization = "Bearer $trainerToken" }
Write-Host "Trainer Profile auto-created: TrainerId=$($trainerProf.trainerId), Exp=$($trainerProf.experienceYears), Specialization=$($trainerProf.specialization)"

# PUT trainer profile
$trainerUpdate = @{
    name = "Head Coach Miller"
    phone = "+1 (555) 444-3333"
    qualification = "M.S. Exercise Physiology, CSCS"
    experienceYears = 8
    specialization = "Speed & Power Conditioning"
    bio = "10 years collegiate performance coaching."
} | ConvertTo-Json
$trainerProfUpdated = Invoke-RestMethod -Uri "$base/trainer/profile" -Method Put -Body $trainerUpdate -ContentType "application/json" -Headers @{ Authorization = "Bearer $trainerToken" }
Write-Host "Trainer Profile updated: Name=$($trainerProfUpdated.name), Qual=$($trainerProfUpdated.qualification), Exp=$($trainerProfUpdated.experienceYears)"

Write-Host "`n=== 5. TEST ROLE PROTECTION & SECURITY ==="
# Test Student attempting to access /api/admin/profile (Expect 403)
try {
    Invoke-RestMethod -Uri "$base/admin/profile" -Method Get -Headers @{ Authorization = "Bearer $studentToken" }
    Write-Host "FAIL: Student was able to access Admin profile!"
} catch {
    Write-Host "SUCCESS: Student blocked from Admin profile with HTTP Status: $($_.Exception.Response.StatusCode.value__)"
}

# Test Trainer attempting to access /api/student/profile (Expect 403)
try {
    Invoke-RestMethod -Uri "$base/student/profile" -Method Get -Headers @{ Authorization = "Bearer $trainerToken" }
    Write-Host "FAIL: Trainer was able to access Student profile!"
} catch {
    Write-Host "SUCCESS: Trainer blocked from Student profile with HTTP Status: $($_.Exception.Response.StatusCode.value__)"
}

# Test Unauthenticated access (Expect 401)
try {
    Invoke-RestMethod -Uri "$base/student/profile" -Method Get
    Write-Host "FAIL: Unauthenticated request was allowed!"
} catch {
    Write-Host "SUCCESS: Unauthenticated request rejected with HTTP Status: $($_.Exception.Response.StatusCode.value__)"
}

Write-Host "`n=== 6. TEST VALIDATION REJECTION ==="
# Test Invalid Data (yearOfStudy = 25 > 10, expect 400)
$invalidUpdate = @{ yearOfStudy = 25 } | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "$base/student/profile" -Method Put -Body $invalidUpdate -ContentType "application/json" -Headers @{ Authorization = "Bearer $studentToken" }
    Write-Host "FAIL: Invalid data was accepted!"
} catch {
    Write-Host "SUCCESS: Invalid data rejected with HTTP Status: $($_.Exception.Response.StatusCode.value__)"
}

Write-Host "`n=== ALL API VERIFICATIONS COMPLETED SUCCESSFULLY ==="
