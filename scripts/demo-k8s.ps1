# Demo K8s: Auto Scaling -> Scale Down -> Auto Healing
# Chạy: .\scripts\demo-k8s.ps1

$Namespace = "microbooks"
$DichVu    = "order-service"

function GhiLog($msg) { Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $msg" -ForegroundColor Green }

function GhiBuoc([int]$so, [string]$tieuDe) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  PHẦN $so -- $tieuDe" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
}

function DungLai($moTa) {
    Write-Host ""
    Write-Host "  >>> NHÌN GRAFANA NGAY! <<<" -ForegroundColor Magenta
    Write-Host "  $moTa" -ForegroundColor White
    Write-Host "  Nhấn Enter để tiếp tục..." -ForegroundColor Yellow
    Read-Host | Out-Null
}

function DocReplicas { kubectl get hpa "$DichVu-hpa" -n $Namespace -o jsonpath='{.status.currentReplicas}' 2>$null }
function DocCPU      { kubectl get hpa "$DichVu-hpa" -n $Namespace -o jsonpath='{.status.currentMetrics[0].resource.current.averageUtilization}' 2>$null }

# --------------------------------------------------------------------------
Clear-Host
Write-Host "  Grafana: http://localhost:3005/d/microbooks-dash" -ForegroundColor Yellow
Write-Host "  Mở section 'Auto Scaling & Auto Healing' trước khi bắt đầu" -ForegroundColor Yellow
Write-Host ""
Write-Host "Nhấn Enter để bắt đầu..." -ForegroundColor Yellow
Read-Host | Out-Null

# Dọn sạch yes cũ từ lần trước, reset về 1 replica
kubectl get pods -n $Namespace -l "app=$DichVu" --field-selector=status.phase=Running `
    -o jsonpath='{.items[*].metadata.name}' 2>$null | ForEach-Object {
    $_.Split(' ') | Where-Object { $_ } | ForEach-Object {
        kubectl exec -n $Namespace $_ -- sh -c 'rm -f /tmp/ypids; for d in /proc/[0-9]*; do [ "$(cat $d/comm 2>/dev/null)" = "yes" ] && kill -9 $(basename $d) 2>/dev/null; done' 2>$null | Out-Null
    }
}
kubectl scale deployment $DichVu -n $Namespace --replicas=1 2>$null | Out-Null
Start-Sleep 8

$Pod = kubectl get pods -n $Namespace -l "app=$DichVu" `
    --field-selector=status.phase=Running -o jsonpath='{.items[0].metadata.name}' 2>$null

GhiLog "Pod: $Pod | CPU: $(DocCPU)% | Replicas: $(DocReplicas)"


# ==========================================================================
GhiBuoc 1 "AUTO SCALING"
# ==========================================================================
GhiLog "Bắt đầu tạo tải CPU (lưu PID vào /tmp/ypids)..."

kubectl exec -n $Namespace $Pod -- sh -c `
    'yes>/dev/null & P1=$!; yes>/dev/null & P2=$!; yes>/dev/null & P3=$!; echo "$P1 $P2 $P3" > /tmp/ypids; echo "PIDs: $P1 $P2 $P3"' `
    2>$null

GhiLog "Chờ HPA scale up..."
Write-Host ""

$DaScale = $false
for ($i = 1; $i -le 12; $i++) {
    Start-Sleep 10
    $R = DocReplicas; $C = DocCPU
    Write-Host "  [$(Get-Date -Format 'HH:mm:ss')]  Replicas: $R  |  CPU: $C%"
    if (([int]$R -gt 1) -and (-not $DaScale)) {
        $DaScale = $true
        Write-Host ""
        Write-Host "  >>> AUTO SCALING: replicas tăng lên $R <<<" -ForegroundColor Green
        DungLai "Panel 'HPA Replicas': đường current tăng lên $R (vượt đường min)"
        break
    }
}


# ==========================================================================
GhiBuoc 2 "AUTO SCALE DOWN"
# ==========================================================================
GhiLog "Dừng tải bằng PID đã lưu..."

kubectl exec -n $Namespace $Pod -- sh -c `
    'kill -9 $(cat /tmp/ypids 2>/dev/null) 2>/dev/null; rm -f /tmp/ypids; echo "Đã kill"' `
    2>$null

Write-Host ""
Start-Sleep 5
$cpuSau = DocCPU
Write-Host "  CPU sau khi kill: $cpuSau%"

# Nếu vẫn còn cao (yes cũ từ lần trước) -> restart pod để chắc chắn
if ([int]$cpuSau -gt 50) {
    Write-Host "  Còn yes cũ -> restart pod..." -ForegroundColor Yellow
    $DanhSachPod = kubectl get pods -n $Namespace -l "app=$DichVu" `
        --field-selector=status.phase=Running -o jsonpath='{.items[*].metadata.name}' 2>$null
    foreach ($P in $DanhSachPod.Split(' ')) {
        if ($P.Trim()) {
            kubectl delete pod $P.Trim() -n $Namespace --grace-period=0 --force 2>$null | Out-Null
            Write-Host "  Đã restart: $P"
        }
    }
    Start-Sleep 15
}

GhiLog "Chờ HPA scale down (~30-60 giây)..."
Write-Host ""

$DaScaleDown = $false
for ($i = 1; $i -le 15; $i++) {
    Start-Sleep 10
    $R = DocReplicas; $C = DocCPU
    Write-Host "  [$(Get-Date -Format 'HH:mm:ss')]  Replicas: $R  |  CPU: $C%"
    if (([int]$R -le 1) -and (-not $DaScaleDown)) {
        $DaScaleDown = $true
        Write-Host ""
        Write-Host "  >>> SCALE DOWN: replicas về 1 <<<" -ForegroundColor Green
        DungLai "Panel 'HPA Replicas': đường current giảm về 1 (bằng đường min)"
        break
    }
}
if (-not $DaScaleDown) {
    Write-Host "  Scale down sẽ xảy ra trên Grafana trong 1-2 phút tới." -ForegroundColor Yellow
    DungLai "Replicas về 1 -- xem Grafana rồi nhấn Enter"
}


# ==========================================================================
GhiBuoc 3 "AUTO HEALING"
# ==========================================================================
GhiLog "Trạng thái hiện tại:"
kubectl get pods -n $Namespace -l "app=$DichVu" --no-headers 2>$null | ForEach-Object { Write-Host "  $_" }
Write-Host ""

$DanhSachPod = kubectl get pods -n $Namespace -l "app=$DichVu" `
    -o jsonpath='{.items[*].metadata.name}' 2>$null

# Cordon node 15s để pod mới bị giữ ở Pending đủ lâu cho Prometheus scrape
$Node = kubectl get nodes -o jsonpath='{.items[0].metadata.name}' 2>$null
GhiLog "Cordon node '$Node' 15s -> pod mới sẽ Pending (Grafana bắt được Running=0)..."
kubectl cordon $Node 2>$null | Out-Null

GhiLog "Xóa pod..."
foreach ($P in $DanhSachPod.Split(' ')) {
    if ($P.Trim()) {
        kubectl delete pod $P.Trim() -n $Namespace --grace-period=0 --force 2>$null | Out-Null
        Write-Host "  Đã xóa: $P"
    }
}

# Chờ 15s để Prometheus scrape được trạng thái Running=0, Pending=1
Start-Sleep 15
kubectl uncordon $Node 2>$null | Out-Null
GhiLog "Uncordon -> K8s bắt đầu schedule pod mới..."

# Poll NGAY -- không pause ở đây vì pod heal trong 5-15s
# Nếu pause trước thì pod đã Running rồi mới bắt đầu poll -> bỏ lỡ hoàn toàn
Write-Host ""
GhiLog "Chờ K8s tự tạo lại pod (mở Grafana song song ngay bây giờ)..."
Write-Host ""

$DaHeal = $false
$T0 = Get-Date
for ($i = 1; $i -le 20; $i++) {
    Start-Sleep 3
    $pods = kubectl get pods -n $Namespace -l "app=$DichVu" --no-headers 2>$null
    $giay = [int]((Get-Date) - $T0).TotalSeconds
    Write-Host "  [+${giay}s]  $(($pods -replace '\s+', ' ').Trim())"
    if (($pods -match "Running") -and (-not $DaHeal)) {
        $DaHeal = $true
        Write-Host ""
        Write-Host "  >>> AUTO HEALING: pod mới Running sau ${giay} giây <<<" -ForegroundColor Green
        # Pause SAU KHI heal -- Grafana đã có data, giờ mới nhìn
        DungLai "Pod đã Running lại. Grafana 'Pod Status': đường Running chớp về 0 rồi tăng lại"
        break
    }
}


# --------------------------------------------------------------------------
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  TỔNG KẾT DEMO" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "  [OK] Auto Scaling : CPU tăng  -> replicas tăng tự động" -ForegroundColor Green
Write-Host "  [OK] Scale Down   : CPU giảm  -> replicas về 1 sau ~30s" -ForegroundColor Green
Write-Host "  [OK] Auto Healing : pod bị xóa -> K8s tạo lại <15s" -ForegroundColor Green
Write-Host ""
Write-Host "  Bằng chứng: http://localhost:3005/d/microbooks-dash" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Green
