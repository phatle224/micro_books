# Monitoring & Observability Stack Prompt

**Prompt:**
"A premium software architecture diagram showcasing an advanced Monitoring and Observability stack for a microservices system. Clean enterprise aesthetic, white and soft-gray background, high-quality frosted glass (glassmorphism) cards.

The diagram shows a flow from left to right:

1. **Left Side (Sources):** Small cards for 'Order Service', 'Inventory Service', and 'Frontend' sending data streams labeled 'Metrics', 'Logs', and 'Traces'.

2. **Center (Collection Hub):** A prominent frosted glass card for 'OpenTelemetry Collector' acting as the central gateway.

3. **Storage Layer (Below/Beside):** Three sleek cards for:
   - 'Prometheus' (with a bar chart icon for Metrics)
   - 'Loki' (with a document icon for Logs)
   - 'Tempo' (with a connection graph icon for Distributed Tracing)

4. **Right Side (Visualization):** A large, beautiful card for 'Grafana Dashboard' showing colorful line graphs, heatmaps, and status badges. Include a secondary card for 'Kafka UI' showing a message queue flow.

**Visual Style:**
- Elegant glowing lines connecting the components.
- Modern Inter typography.
- Premium look with subtle shadows and vibrant data accents (blue for metrics, yellow for logs, purple for traces)."

The layout is divided into 4 horizontal layers and 1 vertical sidebar:

CLIENT LAYER (Top): Modern cards for 'Storefront UI' and 'Admin Portal' built with Next.js, featuring sleek web browser icons.
APPLICATION LAYER: Two primary Docker container cards: 'Order Service' and 'Inventory Service', both labeled 'Python / FastAPI'. Include small Docker whale logos on each.
MESSAGING LAYER: A central wide card for 'Apache Kafka' with a glowing node graph, showing an asynchronous event flow labeled 'order.created'.
DATA LAYER (Bottom): A 3D cylinder icon for 'MongoDB' connected to both services.
FULL-STACK OBSERVABILITY (Vertical Sidebar on the Right): A dedicated section with clean cards for:

Grafana: Visualization dashboard with a small line chart.
Loki: Log aggregation icon.
Prometheus: Metrics collection icon.
Tempo: Distributed tracing waterfall chart (replacing Jaeger).
END-TO-END FLOW (Bottom Strip): A sequential arrow path showing: '1. User places order' -> '2. Order Service creates entry' -> '3. Kafka broadcasts event' -> '4. Inventory Service updates stock' -> '5. Status: Success'.

Technical Style: Professional, corporate blue and teal color palette, minimalist line icons, sharp sans-serif typography (Inter or Roboto), isometric symbols, high-fidelity vector style, 8k resolution, clean lighting, soft shadows."
