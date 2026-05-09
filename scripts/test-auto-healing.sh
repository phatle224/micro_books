#!/usr/bin/env bash
# Test K8s Auto Healing: xóa/crash pod và quan sát K8s tự tạo lại pod.
# Thể hiện qua Grafana: Container Readiness drop rồi recovery, Restart count tăng.
#
# Yêu cầu: kubectl configured, namespace microbooks đang chạy
# Chạy: bash scripts/test-auto-healing.sh [MODE] [TARGET]
#   MODE   = delete | crash | oom  (default: delete)
#   TARGET = order-service | inventory-service | frontend (default: order-service)

set -euo pipefail

NAMESPACE="microbooks"
MODE="${1:-delete}"
TARGET="${2:-order-service}"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'
log()  { echo -e "${GREEN}[$(date +%T)]${NC} $*"; }
warn() { echo -e "${YELLOW}[$(date +%T)] WARN:${NC} $*"; }
info() { echo -e "${CYAN}[$(date +%T)]${NC} $*"; }

log "=== Auto Healing Test: mode=$MODE, target=$TARGET ==="
log "Dashboard: theo dõi panel 'Container Readiness over Time' và 'Pod Restart Rate'"
echo ""

# Hàm lấy trạng thái pod
show_pods() {
  kubectl get pods -n "$NAMESPACE" -l "app=$TARGET" \
    -o custom-columns='NAME:.metadata.name,STATUS:.status.phase,READY:.status.containerStatuses[0].ready,RESTARTS:.status.containerStatuses[0].restartCount,AGE:.metadata.creationTimestamp' \
    2>/dev/null || kubectl get pods -n "$NAMESPACE" -l "app=$TARGET"
}

log "Bước 1: Trạng thái TRƯỚC khi test"
show_pods
echo ""

case "$MODE" in
  delete)
    log "MODE: DELETE - Xóa pod, Deployment controller sẽ tạo pod mới ngay lập tức"
    log ""

    # Lấy tất cả pod của target
    PODS=$(kubectl get pods -n "$NAMESPACE" -l "app=$TARGET" -o jsonpath='{.items[*].metadata.name}')
    if [[ -z "$PODS" ]]; then
      echo -e "${RED}ERROR: Không tìm thấy pod $TARGET${NC}"; exit 1
    fi

    for POD in $PODS; do
      log "  Xóa pod: $POD"
      kubectl delete pod "$POD" -n "$NAMESPACE" --grace-period=0 --force 2>/dev/null || \
        kubectl delete pod "$POD" -n "$NAMESPACE"
    done

    log ""
    log "Bước 2: Theo dõi recovery (K8s sẽ tạo pod mới trong ~5-15 giây)"
    echo ""

    for i in $(seq 1 8); do
      echo "--- $(date +%T) [check $i/8] ---"
      show_pods
      echo ""
      sleep 5
    done
    ;;

  crash)
    log "MODE: CRASH - Gây crash process chính trong container, liveness probe sẽ restart"
    log ""

    POD=$(kubectl get pods -n "$NAMESPACE" -l "app=$TARGET" \
      --field-selector=status.phase=Running -o jsonpath='{.items[0].metadata.name}')
    if [[ -z "$POD" ]]; then
      echo -e "${RED}ERROR: Không tìm thấy pod Running $TARGET${NC}"; exit 1
    fi

    log "Pod target: $POD"
    info "Restart count TRƯỚC:"
    kubectl get pod "$POD" -n "$NAMESPACE" \
      -o jsonpath='Restarts: {.status.containerStatuses[0].restartCount}{"\n"}'

    log "Gây crash PID 1 trong container..."
    kubectl exec -n "$NAMESPACE" "$POD" -- sh -c "kill 1" 2>/dev/null || true

    log ""
    log "Bước 2: Theo dõi restart + recovery"
    echo ""

    for i in $(seq 1 10); do
      echo "--- $(date +%T) [check $i/10] ---"
      show_pods
      echo ""
      sleep 6
    done
    ;;

  oom)
    log "MODE: OOM - Gây OOM kill bằng cách allocate memory vượt limit"
    log "  order-service limit: 256Mi, inventory-service limit: 256Mi"
    log ""

    POD=$(kubectl get pods -n "$NAMESPACE" -l "app=$TARGET" \
      --field-selector=status.phase=Running -o jsonpath='{.items[0].metadata.name}')
    if [[ -z "$POD" ]]; then
      echo -e "${RED}ERROR: Không tìm thấy pod Running $TARGET${NC}"; exit 1
    fi

    log "Pod target: $POD"
    log "Gây memory allocation 300Mi (vượt limit 256Mi)..."

    # Allocate memory với Python
    kubectl exec -n "$NAMESPACE" "$POD" -- sh -c \
      "python3 -c \"x = bytearray(300 * 1024 * 1024); import time; time.sleep(30)\" 2>/dev/null || \
       node -e \"var b = Buffer.alloc(300 * 1024 * 1024); setTimeout(()=>{}, 30000)\" 2>/dev/null || \
       (dd if=/dev/zero bs=1M count=300 | cat > /dev/null)" &

    log ""
    log "Bước 2: Theo dõi OOM kill + recovery (K8s sẽ restart container)"
    echo ""

    for i in $(seq 1 10); do
      echo "--- $(date +%T) [check $i/10] ---"
      show_pods
      # Kiểm tra OOM events
      kubectl get events -n "$NAMESPACE" --sort-by='.lastTimestamp' 2>/dev/null | \
        grep -E "OOMKill|OOM|Killing|Backoff" | tail -3 || true
      echo ""
      sleep 6
    done
    ;;

  *)
    echo -e "${RED}ERROR: MODE không hợp lệ. Dùng: delete | crash | oom${NC}"
    exit 1
    ;;
esac

echo ""
log "=== Test hoàn thành ==="
log "Bước 3: Trạng thái CUỐI"
show_pods
echo ""
log "Bước 4: Kiểm tra events để xem lý do restart"
kubectl get events -n "$NAMESPACE" --sort-by='.lastTimestamp' 2>/dev/null | \
  grep -E "$TARGET|Killing|BackOff|Unhealthy|OOMKill|Started|Created|Pulled" | tail -10 || true

echo ""
log "=== Kết quả mong đợi trong Grafana ==="
echo "  Panel 'Container Readiness over Time'  : line drop xuống 0 rồi tăng lại"
echo "  Panel 'Pod Restart Rate per Container' : spike tại thời điểm restart"
echo "  Panel 'Total Restarts'                 : số tăng lên"
echo "  Panel 'Pod Status'                     : chớp qua Pending rồi về Running"
echo ""
log "DONE."
