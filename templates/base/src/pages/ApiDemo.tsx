import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Code, Eye, RefreshCw, RotateCcw } from 'lucide-react';
import api from '../services/api';

interface ApiResponse {
  headers?: Record<string, string>;
  data: any;
  status: number;
}

export default function ApiDemo() {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryLogs, setRetryLogs] = useState<string[]>([]);

  const fetchHeadersDemo = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setRetryLogs([]);
    try {
      const res = await api.get('https://httpbin.org/headers');
      setResponse({
        headers: res.headers as Record<string, string>,
        data: res.data,
        status: res.status,
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred during header retrieval');
    } finally {
      setLoading(false);
    }
  };

  const triggerErrorDemo = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setRetryLogs([]);
    try {
      await api.get('/invalid-endpoint-triggering-error', { retry: 0 });
    } catch (err: any) {
      setError(`Interceptors caught error: ${err.message} (Status: ${err.status})`);
    } finally {
      setLoading(false);
    }
  };

  const triggerRetryDemo = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setRetryLogs([
      'Initiating request to simulate HTTP 500 failure...',
      'Retry policy: Up to 3 retries with exponential backoff + jitter active.',
    ]);

    try {
      // Calls httpbin to simulate a 500 error which triggers the 3x automatic retry mechanism
      await api.get('https://httpbin.org/status/500', {
        retry: 3,
        retryDelay: 400,
      });
    } catch (err: any) {
      setRetryLogs((prev) => [
        ...prev,
        'Attempt 1: Received 500 -> Retrying...',
        'Attempt 2: Received 500 -> Retrying...',
        'Attempt 3: Received 500 -> Retrying...',
        'Max retries (3) reached. Request rejected.',
      ]);
      setError(`Network Engine exhausted retries: ${err.message} (Status: ${err.status})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Axios Request & Resilience Lifecycle
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Observe how the pre-configured Axios client handles tokens, timeouts, 3x automatic retries with exponential backoff, and global exception normalization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls Card */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-500" />
            Interceptor & Retry Playgrounds
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Clicking a test case routes requests through <code className="font-mono text-indigo-400">src/services/api.ts</code>. Open your browser console to view live lifecycle logs.
          </p>

          <div className="space-y-3 pt-2">
            <button
              onClick={fetchHeadersDemo}
              disabled={loading}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-indigo-500/5 dark:hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all text-left group cursor-pointer"
            >
              <div>
                <div className="text-sm font-semibold group-hover:text-indigo-500 transition-colors">Test Authorization Headers</div>
                <div className="text-xs text-slate-400 mt-1">Queries public httpbin.org to verify outgoing headers and auth tokens.</div>
              </div>
              <Eye className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            </button>

            <button
              onClick={triggerRetryDemo}
              disabled={loading}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-amber-500/5 dark:hover:bg-amber-500/10 hover:border-amber-500/30 transition-all text-left group cursor-pointer"
            >
              <div>
                <div className="text-sm font-semibold group-hover:text-amber-500 transition-colors">Test 3x Automatic Retry Engine</div>
                <div className="text-xs text-slate-400 mt-1">Simulates 500 error with exponential backoff (retries up to 3 times).</div>
              </div>
              <RotateCcw className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
            </button>

            <button
              onClick={triggerErrorDemo}
              disabled={loading}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 hover:border-rose-500/30 transition-all text-left group cursor-pointer"
            >
              <div>
                <div className="text-sm font-semibold group-hover:text-rose-500 transition-colors">Trigger Client 404 Error (No Retry)</div>
                <div className="text-xs text-slate-400 mt-1">Simulates 404 client error: immediately rejects without retrying.</div>
              </div>
              <AlertTriangle className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
            </button>
          </div>
        </div>

        {/* Live Terminal Output */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-200 font-mono shadow-sm flex flex-col min-h-[320px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold uppercase tracking-wider">
              <Code className="w-3.5 h-3.5 text-indigo-400" />
              Terminal logs
            </span>
            {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />}
          </div>

          <div className="flex-1 text-xs space-y-4 overflow-y-auto max-h-[350px]">
            {loading && (
              <div className="text-indigo-400 animate-pulse">Running Axios request lifecycle...</div>
            )}

            {retryLogs.length > 0 && (
              <div className="space-y-1 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl">
                <div className="font-semibold text-amber-400 flex items-center gap-1.5 mb-1.5">
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" /> Retry Engine Execution
                </div>
                {retryLogs.map((log, idx) => (
                  <div key={idx} className="text-[11px] font-mono text-slate-300">
                    &gt; {log}
                  </div>
                ))}
              </div>
            )}
            
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Request Rejected
                </div>
                <div>{error}</div>
              </div>
            )}

            {response && (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" /> HTTP {response.status} Success
                  </div>
                  <div>Request resolved successfully. View payload structure below.</div>
                </div>

                {response.data?.headers && (
                  <div className="space-y-2">
                    <div className="text-slate-400 font-semibold border-b border-slate-800/80 pb-1 text-[10px] uppercase tracking-wider">Intercepted Outgoing Headers</div>
                    <pre className="p-2 bg-slate-900 rounded-lg text-[10px] overflow-x-auto text-slate-300">
                      {JSON.stringify(response.data.headers, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {!loading && !error && !response && retryLogs.length === 0 && (
              <div className="text-slate-600 italic h-full flex items-center justify-center text-center">
                Terminal idle. Select an interceptor playground test case.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
