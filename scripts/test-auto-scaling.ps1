# Test Auto Scaling
# Tạo tải CPU lên service để HPA tự động tăng số lượng pod.
# Chạy: .\scripts\test-auto-scaling.ps1 [-Target order-service] [-ThoiGian 120]

param(
    [string]$Target = "order-service",
    [int]$ThoiGian = 120
)

$Namespace = "microbooks"

function Ghi-Log($msg) { Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $msg" -ForegroundColor Green }
function Ghi-Canh-Bao($msg) { Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $msg" -ForegroundColor Yellow }

Ghi-Log "=== Bắt đầu kiểm tra Auto Scaling ==="
Ghi-Log "Dịch vụ mục tiêu : $Target"
Ghi-Log "Thời gian tạo tải : ${ThoiGian} giây"
Ghi-Log "Dashboard Grafana : http://localhost:3005/d/microbooks-dash"
Write-Host ""

# Lấy tên pod đang chạy
$Pod = kubectl get pods -n $Namespace -l "app=$Target" `
    --field-selector=status.phase=Running `
    -o jsonpath='{.items[0].metadata.name}' 2>$null

if (-not $Pod) {
    Write-Host "Lỗi: Không tìm thấy pod '$Target' đang chạy trong namespace '$Namespace'." -ForegroundColor Red
    exit 1
}

Ghi-Log "Pod mục tiêu: $Pod"
Write-Host ""

Ghi-Log "--- Trạng thái HPA trước khi tạo tải ---"
kubectl get hpa -n $Namespace
Write-Host ""

Ghi-Log "Bắt đầu tạo tải CPU trong pod..."
Ghi-Log "Khi CPU vượt ngưỡng, HPA sẽ tự động tăng số replica."

# Chạy stress CPU bằng yes trong background của pod
$CongViecStress = Start-Job -ScriptBlock {
    param($pod, $ns, $dur)
    kubectl exec -n $ns $pod -- sh -c "yes > /dev/null & yes > /dev/null & sleep $dur; kill `$(jobs -p) 2>/dev/null; echo done"
} -ArgumentList $Pod, $Namespace, $ThoiGian

Ghi-Log "Đang theo dõi HPA mỗi 15 giây (tổng ${ThoiGian}s)..."
Write-Host ""

$ThoiGianDaQua = 0
while ($CongViecStress.State -eq "Running" -and $ThoiGianDaQua -le $ThoiGian) {
    Write-Host "--- $(Get-Date -Format 'HH:mm:ss') (đã chạy: ${ThoiGianDaQua}s) ---"
    kubectl get hpa -n $Namespace 2>$null | Select-String -Pattern "NAME|$Target"
    Write-Host ""
    Start-Sleep 15
    $ThoiGianDaQua += 15
}

Stop-Job $CongViecStress -ErrorAction SilentlyContinue
Remove-Job $CongViecStress -ErrorAction SilentlyContinue

Write-Host ""
Ghi-Log "--- Trạng thái sau khi tạo tải ---"
kubectl get hpa -n $Namespace
Write-Host ""
kubectl get pods -n $Namespace -l "app=$Target"
Write-Host ""
Ghi-Log "Kiểm tra trong Grafana:"
Write-Host "  → Panel 'Auto Scaling': đường 'current' tăng lên so với 'min'"
Write-Host "  → Sau ~5 phút không có tải, HPA sẽ tự giảm về minReplicas"
Ghi-Log "Hoàn thành."
