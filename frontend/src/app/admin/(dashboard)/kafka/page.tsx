"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Activity, Server, MessageSquare, RefreshCw, ExternalLink,
  CheckCircle2, XCircle, ChevronDown, ChevronUp, Inbox, Layers
} from "lucide-react";

const API = "http://localhost:8080/api/clusters/microbooks-cluster";

type Cluster = {
  name: string; status: string; brokerCount: number;
  topicCount: number; onlinePartitionCount: number; version: string;
};
type Broker = {
  id: number; host: string; port: number;
  partitions: number; inSyncPartitions: number; partitionsLeader: number;
};
type Topic = {
  name: string; partitionCount: number; replicationFactor: number;
  inSyncReplicas: number; segmentSize: number;
  partitions: { partition: number; offsetMax: number; offsetMin: number }[];
};
type KafkaMessage = {
  partition: number; offset: number; timestamp: string;
  key: string | null; content: string;
};

function StatusBadge({ online }: { online: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${online ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
      {online
        ? <CheckCircle2 className="w-3.5 h-3.5" />
        : <XCircle className="w-3.5 h-3.5" />}
      {online ? "Online" : "Offline"}
    </span>
  );
}

function fmt(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function KafkaPage() {
  const [cluster, setCluster] = useState<Cluster | null>(null);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, KafkaMessage[]>>({});
  const [loadingMessages, setLoadingMessages] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [clusterRes, topicsRes, brokersRes] = await Promise.all([
        fetch("http://localhost:8080/api/clusters"),
        fetch(`${API}/topics`),
        fetch(`${API}/brokers`),
      ]);
      const clusterData = await clusterRes.json();
      const topicsData = await topicsRes.json();
      const brokersData = await brokersRes.json();

      setCluster(Array.isArray(clusterData) ? clusterData[0] : clusterData);
      setTopics(topicsData.topics ?? []);
      setBrokers(Array.isArray(brokersData) ? brokersData : []);
    } catch (e: unknown) {
      setError("Cannot connect to Kafka UI at localhost:8080. Make sure the container is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const loadMessages = (topicName: string) => {
    if (messages[topicName]) {
      setExpandedTopic(expandedTopic === topicName ? null : topicName);
      return;
    }
    setExpandedTopic(topicName);
    setLoadingMessages(topicName);
    const collected: KafkaMessage[] = [];

    const es = new EventSource(
      `${API}/topics/${topicName}/messages?limit=20&page=1`
    );
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === "MESSAGE" && data.message) {
          const m = data.message;
          let content = "";
          try {
            const decoded = atob(m.content ?? "");
            content = JSON.parse(decoded);
            content = JSON.stringify(JSON.parse(decoded), null, 2);
          } catch {
            content = m.content ?? "";
          }
          collected.push({
            partition: m.partition,
            offset: m.offset,
            timestamp: m.timestamp,
            key: m.key,
            content,
          });
          setMessages((prev) => ({ ...prev, [topicName]: [...collected] }));
        }
        if (data.type === "CONSUMING" && data.consuming?.isCancelled !== false) {
          es.close();
          setLoadingMessages(null);
        }
      } catch {}
    };
    es.onerror = () => {
      es.close();
      setLoadingMessages(null);
      if (collected.length === 0) {
        setMessages((prev) => ({ ...prev, [topicName]: [] }));
      }
    };
    setTimeout(() => {
      es.close();
      setLoadingMessages(null);
      setMessages((prev) => ({ ...prev, [topicName]: [...collected] }));
    }, 4000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
        <span className="ml-3 text-gray-500">Connecting to Kafka UI...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        <XCircle className="w-5 h-5 mb-2" />
        <p className="font-semibold">Connection failed</p>
        <p className="text-sm mt-1">{error}</p>
        <button onClick={fetchAll} className="mt-4 text-sm underline">Retry</button>
      </div>
    );
  }

  const totalMessages = topics.reduce(
    (sum, t) => sum + (t.partitions?.[0]?.offsetMax ?? 0), 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kafka Monitor</h1>
          <p className="text-sm text-gray-500 mt-1">
            Cluster: <span className="font-medium text-gray-700">{cluster?.name}</span>
            {cluster?.version && (
              <span className="ml-2 text-gray-400">v{cluster.version}</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchAll}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <a
            href="http://localhost:8080"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-black text-white hover:bg-gray-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open Kafka UI
          </a>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Status", value: <StatusBadge online={cluster?.status === "online"} />, icon: Activity, color: "bg-white" },
          { label: "Brokers", value: cluster?.brokerCount ?? 0, icon: Server, color: "bg-white" },
          { label: "Topics", value: cluster?.topicCount ?? 0, icon: Layers, color: "bg-white" },
          { label: "Total Messages", value: totalMessages, icon: MessageSquare, color: "bg-white" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`${color} rounded-xl border border-gray-200 p-5 flex items-start gap-4`}>
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Brokers */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Server className="w-4 h-4 text-gray-500" />
          <h2 className="font-semibold text-gray-800">Brokers</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
            <tr>
              {["ID", "Host", "Port", "Partitions", "In-Sync", "Leader"].map(h => (
                <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {brokers.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-mono text-gray-700">{b.id}</td>
                <td className="px-5 py-3 font-medium text-gray-900">{b.host}</td>
                <td className="px-5 py-3 text-gray-600">{b.port}</td>
                <td className="px-5 py-3 text-gray-600">{b.partitions}</td>
                <td className="px-5 py-3">
                  <span className={`font-medium ${b.inSyncPartitions === b.partitions ? "text-emerald-600" : "text-red-500"}`}>
                    {b.inSyncPartitions}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-600">{b.partitionsLeader}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Topics */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Layers className="w-4 h-4 text-gray-500" />
          <h2 className="font-semibold text-gray-800">Topics</h2>
          <span className="ml-auto text-xs text-gray-400">Click a topic to browse messages</span>
        </div>
        <div className="divide-y divide-gray-100">
          {topics.map((topic) => {
            const offsetMax = topic.partitions?.[0]?.offsetMax ?? 0;
            const isExpanded = expandedTopic === topic.name;
            const topicMessages = messages[topic.name];
            const isLoadingMsg = loadingMessages === topic.name;

            return (
              <div key={topic.name}>
                <button
                  onClick={() => loadMessages(topic.name)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span className="font-mono text-sm font-semibold text-gray-900 flex-1">{topic.name}</span>
                  <div className="hidden sm:flex items-center gap-6 text-xs text-gray-500">
                    <span><span className="font-semibold text-gray-700">{offsetMax}</span> messages</span>
                    <span><span className="font-semibold text-gray-700">{topic.partitionCount}</span> partitions</span>
                    <span><span className="font-semibold text-gray-700">{topic.replicationFactor}</span> replicas</span>
                    <span>{fmt(topic.segmentSize)}</span>
                  </div>
                  {isExpanded
                    ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
                    {isLoadingMsg ? (
                      <div className="flex items-center gap-2 text-sm text-gray-500 py-4 justify-center">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Fetching messages...
                      </div>
                    ) : !topicMessages || topicMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                        <Inbox className="w-8 h-8 mb-2" />
                        <p className="text-sm">No messages in this topic</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-xs text-gray-500 font-medium">
                          Latest {topicMessages.length} message{topicMessages.length !== 1 ? "s" : ""}
                        </p>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {[...topicMessages].reverse().map((msg, i) => (
                            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                              <div className="flex items-center gap-3 mb-2 text-xs text-gray-500">
                                <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                                  offset: {msg.offset}
                                </span>
                                <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                                  partition: {msg.partition}
                                </span>
                                <span className="ml-auto">
                                  {new Date(msg.timestamp).toLocaleString("vi-VN")}
                                </span>
                              </div>
                              <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap break-all bg-gray-50 rounded p-3 overflow-x-auto">
                                {typeof msg.content === "string"
                                  ? msg.content
                                  : JSON.stringify(msg.content, null, 2)}
                              </pre>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
