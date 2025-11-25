
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, Activity, Brain, Zap, Download, AlertTriangle } from 'lucide-react';
import { COLORS } from '../../constants';

// Mock Data
const mockActivityData = [
  { name: 'Mon', nodes: 40, edges: 24 },
  { name: 'Tue', nodes: 30, edges: 13 },
  { name: 'Wed', nodes: 20, edges: 58 },
  { name: 'Thu', nodes: 27, edges: 39 },
  { name: 'Fri', nodes: 18, edges: 48 },
  { name: 'Sat', nodes: 23, edges: 38 },
  { name: 'Sun', nodes: 34, edges: 43 },
];

const mockTypeData = [
  { name: 'Task', value: 400 },
  { name: 'Topic', value: 300 },
  { name: 'Note', value: 300 },
  { name: 'Project', value: 200 },
  { name: 'Video', value: 100 },
];

const mockAIData = [
  { name: '00:00', latency: 1200, success: 1 },
  { name: '04:00', latency: 1100, success: 1 },
  { name: '08:00', latency: 2400, success: 0.8 },
  { name: '12:00', latency: 1800, success: 1 },
  { name: '16:00', latency: 3200, success: 0.9 },
  { name: '20:00', latency: 1500, success: 1 },
];

const CHART_COLORS = [COLORS.JIRAI_ACCENT, COLORS.JIRAI_SECONDARY, COLORS.SUCCESS, COLORS.WARNING, COLORS.PURPLE];

interface AnalyticsDashboardProps {
    isOpen?: boolean; // Optional prop if we want to control visibility externally later
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = () => {
  return (
    <div className="p-6 space-y-6 bg-[#0F1115] min-h-full text-white overflow-y-auto custom-scrollbar">
      
      <div className="flex items-center justify-between mb-6">
          <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Activity className="text-jirai-accent" />
                  System Analytics
              </h2>
              <p className="text-sm text-gray-400">Real-time monitoring and usage statistics</p>
          </div>
          <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/20 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  System Healthy
              </span>
          </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Active Users" value="1,234" change="+12%" color="blue" />
          <StatCard icon={Brain} label="AI Queries" value="8,543" change="+24%" color="purple" />
          <StatCard icon={Zap} label="Avg Latency" value="1.2s" change="-5%" color="yellow" />
          <StatCard icon={AlertTriangle} label="Error Rate" value="0.04%" change="-0.01%" color="green" />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Activity Chart */}
          <div className="bg-[#181B21] border border-[#2D313A] rounded-xl p-4 shadow-lg">
              <h3 className="text-sm font-bold text-gray-300 mb-4">Weekly Activity</h3>
              <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockActivityData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                          <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip 
                              contentStyle={{ backgroundColor: '#1F2329', borderColor: '#2D313A', color: '#fff' }}
                              itemStyle={{ color: '#ccc' }}
                          />
                          <Legend />
                          <Bar dataKey="nodes" fill={COLORS.JIRAI_ACCENT} radius={[4, 4, 0, 0]} />
                          <Bar dataKey="edges" fill={COLORS.JIRAI_SECONDARY} radius={[4, 4, 0, 0]} />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* AI Performance Chart */}
          <div className="bg-[#181B21] border border-[#2D313A] rounded-xl p-4 shadow-lg">
              <h3 className="text-sm font-bold text-gray-300 mb-4">AI Response Latency (ms)</h3>
              <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockAIData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                          <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip 
                              contentStyle={{ backgroundColor: '#1F2329', borderColor: '#2D313A', color: '#fff' }}
                          />
                          <Line type="monotone" dataKey="latency" stroke={COLORS.WARNING} strokeWidth={2} dot={{ r: 4 }} />
                      </LineChart>
                  </ResponsiveContainer>
              </div>
          </div>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Node Distribution */}
          <div className="bg-[#181B21] border border-[#2D313A] rounded-xl p-4 shadow-lg lg:col-span-1">
              <h3 className="text-sm font-bold text-gray-300 mb-4">Node Distribution</h3>
              <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie
                              data={mockTypeData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                          >
                              {mockTypeData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#1F2329', borderColor: '#2D313A', borderRadius: '8px' }} />
                          <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                      </PieChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* Recent Exports Log (Mock Table) */}
          <div className="bg-[#181B21] border border-[#2D313A] rounded-xl p-4 shadow-lg lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-300">Recent Exports</h3>
                  <button className="text-xs text-jirai-accent hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-400">
                      <thead className="text-xs uppercase bg-[#0F1115] text-gray-500">
                          <tr>
                              <th className="px-4 py-3 rounded-l-lg">User</th>
                              <th className="px-4 py-3">Format</th>
                              <th className="px-4 py-3">Size</th>
                              <th className="px-4 py-3 text-right rounded-r-lg">Time</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2D313A]">
                          {[
                              { user: 'Alice', format: 'JSON', size: '1.2 MB', time: '2 mins ago' },
                              { user: 'Bob', format: 'PNG', size: '4.5 MB', time: '15 mins ago' },
                              { user: 'Charlie', format: 'PDF', size: '0.8 MB', time: '1 hour ago' },
                              { user: 'Diana', format: 'Markdown', size: '12 KB', time: '3 hours ago' },
                          ].map((row, i) => (
                              <tr key={i} className="hover:bg-white/5 transition-colors">
                                  <td className="px-4 py-3 font-medium text-white">{row.user}</td>
                                  <td className="px-4 py-3 flex items-center gap-2">
                                      <Download size={12} /> {row.format}
                                  </td>
                                  <td className="px-4 py-3 font-mono text-xs">{row.size}</td>
                                  <td className="px-4 py-3 text-right">{row.time}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>

    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, change, color }: any) => {
    const isPositive = change.startsWith('+');
    const colorClass = {
        blue: 'text-blue-400 bg-blue-500/10',
        purple: 'text-purple-400 bg-purple-500/10',
        yellow: 'text-yellow-400 bg-yellow-500/10',
        green: 'text-emerald-400 bg-emerald-500/10',
    }[color as string] || 'text-white bg-gray-700';

    return (
        <div className="bg-[#181B21] border border-[#2D313A] p-4 rounded-xl shadow-lg hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
                </div>
                <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon size={20} />
                </div>
            </div>
            <div className={`mt-3 text-xs font-medium flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {change}
                <span className="text-gray-600 font-normal">vs last week</span>
            </div>
        </div>
    );
}
