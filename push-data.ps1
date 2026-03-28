# Linglong Dashboard Data Push Script
$API_URL = "http://localhost:18082/api/linglong-data"
$REPO_PATH = "C:\Users\Administrator\.stepclaw\workspace\self-improving\projects\stepclaw-dashboard"
$DATA_FILE = "$REPO_PATH\linglong-data.json"
$LOG_FILE = "$REPO_PATH\push-data.log"
$GH_TOKEN = $env:GH_TOKEN  # Read from environment variable

$ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
"$ts - Start data push" | Add-Content $LOG_FILE

# Fetch data from API
try {
    $resp = Invoke-RestMethod -Uri $API_URL -Method GET -TimeoutSec 10
    $json = $resp | ConvertTo-Json -Depth 10
    $json | Set-Content -Path $DATA_FILE -Encoding UTF8
    "$ts - Data fetched OK" | Add-Content $LOG_FILE
}
catch {
    "$ts - Error: $($_.Exception.Message)" | Add-Content $LOG_FILE
    exit 1
}

# Git push
try {
    Set-Location $REPO_PATH
    git config user.email "bot@linglong.dashboard" 2>&1 | Out-Null
    git config user.name "Linglong Bot" 2>&1 | Out-Null
    
    git add linglong-data.json 2>&1 | Out-Null
    git commit -m "Update: $ts" 2>&1 | Out-Null
    
    git push https://$GH_TOKEN@github.com/sdoaiya/stepclaw-dashboard.git main 2>&1 | Out-Null
    "$ts - Push OK" | Add-Content $LOG_FILE
}
catch {
    "$ts - Push error: $($_.Exception.Message)" | Add-Content $LOG_FILE
    exit 1
}

exit 0
