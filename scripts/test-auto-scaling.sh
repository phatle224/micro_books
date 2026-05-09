#!/usr/bin/env bash
# Test HPA Auto Scaling: tạo CPU load trên order-service/inventory-service,
# sau đó quan sát HPA tự scale up trong Grafana dashboard.
#
# Yêu cầu: kubectl configured, namespace microbooks đang chạy
# Chạy: bash scripts/test-auto-scaling.sh [TARGET] [DURATION_SECONDS]
#   TARGET    = order-service | inventory-service | frontend (default: order-service)
#   DURATION  = thời gian stress (giây, default: 120)

set -euo pipefail

NAMESPACE="microbooks"
TARGET="${1:-order-service}"
DURATION="${2:-120}"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log()  { echo -e "${GREEN}[$(date +%T)]${NC} $*"; }
warn() { echo -e "${YELLOW}[$(date +%T)] WARN:${NC} $*"; }

log "=== Auto Scaling Test: target=$TARGET, duration=${DURATION}s ==="
log "Dashboard: http://localhost:3005  (hoặc NodePort của Grafana)"

# Lấy tên pod đang running
POD=$(kubectl get pods -n "$NAMESPACE" -l "app=$TARGET" \
  --field-selector=status.phase=Running -o jsonpath='{.items[0].metadata.name}' 2>/dev/null || true)

if [[ -z "$POD" ]]; then
  echo -e "${RED}ERROR: Không tìm thấy pod $TARGET trong namespace $NAMESPACE${NC}"
  exit 1
fi

log "Pod target: $POD"
log ""
log "Bước 1: Trạng thái HPA TRƯỚC khi stress"
kubectl get hpa -n "$NAMESPACE" 2>/dev/null || warn "kube-state-metrics chưa expose HPA info"
echo ""

log "Bước 2: Chạy stress CPU trong pod (${DURATION}s)..."
log "  -> Nếu CPU vượt ngưỡng HPA (70-80%), HPA sẽ tự scale up"

# Chạy stress bằng yes command (consume CPU) trong background của pod
kubectl exec -n "$NAMESPACE" "$POD" -- sh -c \
  "yes > /dev/null & yes > /dev/null & STRESS_PID=\$!; sleep $DURATION; kill \$(jobs -p) 2>/dev/null; echo 'stress done'" &
STRESS_BG=$!

log "Bước 3: Theo dõi HPA mỗi 15 giây (Ctrl+C để dừng theo dõi, stress tự dừng sau ${DURATION}s)"
echo ""

ELAPSED=0
while kill -0 $STRESS_BG 2>/dev/null; do
  echo "--- $(date +%T) (elapsed: ${ELAPSED}s) ---"
  kubectl get hpa -n "$NAMESPACE" 2>/dev/null | grep -E "NAME|$TARGET" || true
  kubectl top pods -n "$NAMESPACE" --sort-by=cpu 2>/dev/null | head -8 || warn "metrics-server belum ready"
  echo ""
  sleep 15
  ELAPSED=$((ELAPSED + 15))
done

wait $STRESS_BG 2>/dev/null || true

echo ""
log "=== Stress hoàn thành ==="
log "Bước 4: Trạng thái HPA SAU khi stress"
kubectl get hpa -n "$NAMESPACE"
echo ""
log "Bước 5: Xem pods (HPA có thể đã scale up)"
kubectl get pods -n "$NAMESPACE" -l "app=$TARGET"
echo ""
log "=== Kết quả mong đợi trong Grafana ==="
echo "  Panel 'HPA Replicas': đường 'current' và 'desired' phải tăng lên"
echo "  Panel 'Pod CPU Usage': đường CPU phải spike rõ ràng"
echo "  Panel 'Deployment Replicas': ready replicas tăng khi pod mới khởi động"
echo ""
log "DONE. Sau ~5 phút không có load, HPA sẽ tự scale down về minReplicas."
