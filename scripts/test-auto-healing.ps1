# Test Auto Healing
# Xóa pod để K8s tự động tạo lại, chứng minh khả năng tự phục hồi.
# Chạy: .\scripts\test-auto-healing.ps1 [-Target order-service]

param(
    [string]$Target = "order-service"
)

$Namespace = "microbooks"

function Ghi-Log($msg)      { Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $msg" -ForegroundColor Green }
function Ghi-Canh-Bao($msg) { Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $msg" -ForegroundColor Yellow }

function Hien-Thi-Pod {
    kubectl get pods -n $Namespace -l "app=$Target" `
        -o custom-columns='TÊN:.metadata.name,TRẠNG-THÁI:.status.phase,SẴN-SÀNG:.status.containerStatuses[0].ready,KHỞI-ĐỘNG-LẠI:.status.containerStatuses[0].restartCount' `
        2>$null
}

Ghi-Log "=== Bắt đầu kiểm tra Auto Healing ==="
Ghi-Log "Dịch vụ mục tiêu : $Target"
Ghi-Log "Dashboard Grafana : http://localhost:3005/d/microbooks-dash"
Write-Host ""

Ghi-Log "--- Trạng thái pod TRƯỚC khi xóa ---"
Hien-Thi-Pod
Write-Host ""

# Lấy danh sách pod
$DanhSachPod = kubectl get pods -n $Namespace -l "app=$Target" `
    -o jsonpath='{.items[*].metadata.name}' 2>$null

if (-not $DanhSachPod) {
    Write-Host "Lỗi: Không tìm thấy pod '$Target' trong namespace '$Namespace'." -ForegroundColor Red
    exit 1
}

Ghi-Log "Đang xóa pod để kích hoạt auto healing..."
foreach ($Pod in $DanhSachPod.Split(' ')) {
    if ($Pod.Trim()) {
        Write-Host "  Xóa: $Pod"
        kubectl delete pod $Pod -n $Namespace --grace-period=0 --force 2>$null
    }
}

Write-Host ""
Ghi-Log "K8s sẽ tự động tạo lại pod trong vòng 5–15 giây."
Ghi-Log "Đang theo dõi quá trình phục hồi..."
Write-Host ""

for ($i = 1; $i -le 8; $i++) {
    Write-Host "--- $(Get-Date -Format 'HH:mm:ss') [lần kiểm tra $i/8] ---"
    Hien-Thi-Pod
    Write-Host ""
    Start-Sleep 5
}

Ghi-Log "--- Trạng thái pod SAU khi phục hồi ---"
Hien-Thi-Pod
Write-Host ""

Ghi-Log "Sự kiện gần đây:"
kubectl get events -n $Namespace --sort-by='.lastTimestamp' 2>$null | `
    Select-String -Pattern "$Target|Killing|Started|Created|Pulled" | `
    Select-Object -Last 6

Write-Host ""
Ghi-Log "Kiểm tra trong Grafana:"
Write-Host "  → Panel 'Auto Healing — Pod Restarts': số restart tăng lên"
Write-Host "  → Panel 'Pod Status': chớp qua Pending rồi trở về Running"
Ghi-Log "Hoàn thành."
