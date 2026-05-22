import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Code, Eye, RefreshCw } from 'lucide-react';
import api from '../services/api';

interface ApiResponse {
  headers: Record<string, string>;
  data: any;
  status: number;
}

export default function ApiDemo() {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHeadersDemo = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch headers information from public httpbin or placeholder endpoint
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
    try {
      // Make a call that triggers a 404 error through Axios client
      await api.get('/invalid-endpoint-triggering-error');
    } catch (err: any) {
      setError(`Interceptors caught error: ${err.message} (Status: ${err.status})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Axios Request Lifecycle
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Observe how the pre-configured Axios instance handles tokens, log streams, and global exception responses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls Card */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-500" />
            Interceptor Playgrounds
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Clicking a test case routes requests through <code className="font-mono text-indigo-400">src/services/api.ts</code>. Open your browser console to view the request and response interceptor logs.
          </p>

          <div className="space-y-3 pt-2">
            <button
              onClick={fetchHeadersDemo}
              disabled={loading}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-indigo-500/5 dark:hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all text-left group"
            >
              <div>
                <div className="text-sm font-semibold group-hover:text-indigo-500 transition-colors">Test Authorization Headers</div>
                <div className="text-xs text-slate-400 mt-1">Queries public httpbin.org to return outgoing request headers.</div>
              </div>
              <Eye className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            </button>

            <button
              onClick={triggerErrorDemo}
              disabled={loading}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 hover:border-rose-500/30 transition-all text-left group"
            >
              <div>
                <div className="text-sm font-semibold group-hover:text-rose-500 transition-colors">Trigger Global error interceptor</div>
                <div className="text-xs text-slate-400 mt-1">Simulates a 404 network failure to run global handler formatting.</div>
              </div>
              <AlertTriangle className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
            </button>
          </div>
        </div>

        {/* Live Terminal Output */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-200 font-mono shadow-sm flex flex-col min-h-[300px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold uppercase tracking-wider">
              <Code className="w-3.5 h-3.5 text-indigo-400" />
              Terminal logs
            </span>
            {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
          </div>

          <div className="flex-1 text-xs space-y-4 overflow-y-auto max-h-[350px]">
            {loading && (
              <div className="text-indigo-400 animate-pulse">Running Axios request lifecycle...</div>
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

                <div className="space-y-2">
                  <div className="text-slate-400 font-semibold border-b border-slate-800/80 pb-1 text-[10px] uppercase tracking-wider">Intercepted Outgoing Headers</div>
                  <pre className="p-2 bg-slate-900 rounded-lg text-[10px] overflow-x-auto text-slate-300">
                    {JSON.stringify(response.data.headers, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {!loading && !error && !response && (
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
