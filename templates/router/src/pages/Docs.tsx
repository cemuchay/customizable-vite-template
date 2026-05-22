import { BookOpen, Code, Layers, MessageSquare, Play, HelpCircle } from 'lucide-react';

export default function Docs() {
  const sections = [
    {
      title: 'Directory Architecture',
      icon: Layers,
      color: 'text-blue-500',
      description: 'Understanding the standard folders in your custom Vite setup.',
      content: (
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li>📂 <code className="font-mono text-indigo-400">src/components/</code>: Visual UI components (Layout, buttons, inputs).</li>
          <li>📂 <code className="font-mono text-indigo-400">src/hooks/</code>: Custom hooks, containing React Query definitions and query invalidation.</li>
          <li>📂 <code className="font-mono text-indigo-400">src/services/</code>: Singletons and configuration clients (e.g. Axios client, interceptors).</li>
          <li>📂 <code className="font-mono text-indigo-400">src/store/</code>: Zustand store configs, hooks, and local storage state sync.</li>
          <li>📂 <code className="font-mono text-indigo-400">src/pages/</code>: High level page structures mapped to routes (if routing enabled).</li>
        </ul>
      ),
    },
    {
      title: 'State Management (Zustand)',
      icon: MessageSquare,
      color: 'text-purple-500',
      description: 'How to fetch state and update it globally in any component.',
      content: (
        <div className="space-y-2">
          <p className="text-xs text-slate-500">Import the store and pick state selectors:</p>
          <pre className="p-3 bg-slate-950 text-slate-300 rounded-xl text-[11px] font-mono overflow-x-auto">
{`import { useStore } from '../store/useStore';

const user = useStore((state) => state.user);
const loginUser = useStore((state) => state.loginUser);`}
          </pre>
        </div>
      ),
    },
    {
      title: 'Server Invalidation (React Query)',
      icon: Code,
      color: 'text-emerald-500',
      description: 'Triggering data refetches after mutating server data.',
      content: (
        <div className="space-y-2">
          <p className="text-xs text-slate-500">Mutate and invalidate cache automatically:</p>
          <pre className="p-3 bg-slate-950 text-slate-300 rounded-xl text-[11px] font-mono overflow-x-auto">
{`const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: createTodo,
  onSuccess: () => {
    // Invalidate and refetch 'todos' query
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  }
});`}
          </pre>
        </div>
      ),
    },
    {
      title: 'Writing Automated Tests',
      icon: Play,
      color: 'text-amber-500',
      description: 'Testing components using JSDOM environment and Vitest runner.',
      content: (
        <div className="space-y-2">
          <p className="text-xs text-slate-500">Example test case using Testing Library:</p>
          <pre className="p-3 bg-slate-950 text-slate-300 rounded-xl text-[11px] font-mono overflow-x-auto">
{`import { render, screen } from '@testing-library/react';
import Dashboard from '../components/Dashboard';

test('renders dashboard heading', () => {
  render(<Dashboard />);
  expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
});`}
          </pre>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-500" />
          Guides & Documentation
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          A quick guide to modifying, extending, and testing your freshly bootstrapped Vite setup.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <div 
              key={idx} 
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-800 ${section.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">{section.title}</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">{section.description}</p>
                </div>
              </div>

              <div className="pt-2">
                {section.content}
              </div>
            </div>
          );
        })}
      </div>

      {/* Help Banner */}
      <div className="p-6 rounded-2xl border border-dashed border-indigo-500/30 bg-indigo-500/5 flex items-start gap-4">
        <HelpCircle className="w-6 h-6 text-indigo-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Need to install additional npm modules?</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Run <code className="font-mono text-indigo-400 bg-slate-100 dark:bg-slate-800 px-1 rounded">npm install &lt;package-name&gt;</code> in the terminal root. For Tailwind settings, modify either <code className="font-mono text-indigo-400">src/index.css</code> (v4) or <code className="font-mono text-indigo-400">tailwind.config.js</code> (v3) respectively.
          </p>
        </div>
      </div>
    </div>
  );
}
