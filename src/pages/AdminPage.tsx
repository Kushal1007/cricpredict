import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/context/AppContext';
import {
  Users, Coins, Trophy, TrendingUp, Edit2, Save, X, Search,
  ShieldCheck, LogOut, BarChart2, RefreshCw, Crown, Megaphone,
  CheckCircle, AlertCircle, Info, Trash2, Plus, ToggleLeft, ToggleRight
} from 'lucide-react';

interface ProfileRow {
  id: string;
  username: string;
  email: string;
  coins: number;
  points: number;
  level: number;
  level_name: string;
  streak: number;
  best_streak: number;
  total_predictions: number;
  correct_predictions: number;
  matches_played: number;
  login_streak: number;
  created_at: string;
  isAdmin?: boolean;
}

interface PredictionRow {
  id: string;
  user_id: string;
  question_text: string;
  option_label: string;
  phase: string;
  cost_paid: number;
  potential_win: number;
  result: string;
  created_at: string;
}

interface Stats {
  totalUsers: number;
  totalPredictions: number;
  totalCoinsInCirculation: number;
  totalPoints: number;
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
}

function computeLevel(points: number) {
  if (points >= 30000) return { level: 5, level_name: 'Legend' };
  if (points >= 15000) return { level: 4, level_name: 'Master' };
  if (points >= 5000) return { level: 3, level_name: 'Expert' };
  if (points >= 1000) return { level: 2, level_name: 'Fan' };
  return { level: 1, level_name: 'Rookie' };
}

const AdminPage: React.FC = () => {
  const { logout, user } = useApp();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [predictions, setPredictions] = useState<PredictionRow[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0, totalPredictions: 0, totalCoinsInCirculation: 0, totalPoints: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'predictions' | 'broadcast'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ coins: number; points: number }>({ coins: 0, points: 0 });
  const [saving, setSaving] = useState(false);
  // Broadcast form
  const [bcTitle, setBcTitle] = useState('');
  const [bcMessage, setBcMessage] = useState('');
  const [bcType, setBcType] = useState<Announcement['type']>('info');
  const [bcPosting, setBcPosting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [profilesRes, predictionsRes, rolesRes, announcementsRes] = await Promise.all([
      supabase.from('profiles').select('*').order('points', { ascending: false }),
      supabase.from('predictions').select('*').order('created_at', { ascending: false }).limit(200),
      supabase.from('user_roles' as any).select('user_id, role').eq('role', 'admin'),
      (supabase.from('announcements' as any) as any).select('*').order('created_at', { ascending: false }),
    ]);

    const adminIds = new Set<string>((rolesRes.data || []).map((r: any) => r.user_id));

    if (profilesRes.data) {
      const withAdmin = profilesRes.data.map((p: any) => ({ ...p, isAdmin: adminIds.has(p.id) }));
      setProfiles(withAdmin);
      setStats({
        totalUsers: profilesRes.data.length,
        totalPredictions: predictionsRes.data?.length ?? 0,
        totalCoinsInCirculation: profilesRes.data.reduce((s: number, p: any) => s + (p.coins ?? 0), 0),
        totalPoints: profilesRes.data.reduce((s: number, p: any) => s + (p.points ?? 0), 0),
      });
    }
    if (predictionsRes.data) setPredictions(predictionsRes.data as any);
    if (announcementsRes.data) setAnnouncements(announcementsRes.data as Announcement[]);
    setLoading(false);
  };

  const postAnnouncement = async () => {
    if (!bcTitle.trim() || !bcMessage.trim() || !user) return;
    setBcPosting(true);
    const { data } = await (supabase.from('announcements' as any) as any).insert({
      title: bcTitle.trim(),
      message: bcMessage.trim(),
      type: bcType,
      is_active: true,
      created_by: user.id,
    }).select().single();
    if (data) setAnnouncements(prev => [data as Announcement, ...prev]);
    setBcTitle('');
    setBcMessage('');
    setBcType('info');
    setBcPosting(false);
  };

  const toggleAnnouncement = async (id: string, current: boolean) => {
    await (supabase.from('announcements' as any) as any)
      .update({ is_active: !current })
      .eq('id', id);
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, is_active: !current } : a));
  };

  const deleteAnnouncement = async (id: string) => {
    await (supabase.from('announcements' as any) as any).delete().eq('id', id);
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  useEffect(() => { fetchData(); }, []);

  const startEdit = (p: ProfileRow) => {
    setEditingUser(p.id);
    setEditValues({ coins: p.coins, points: p.points });
  };

  const saveEdit = async (userId: string) => {
    setSaving(true);
    const { level, level_name } = computeLevel(editValues.points);
    const { data } = await supabase
      .from('profiles')
      .update({ coins: editValues.coins, points: editValues.points, level, level_name })
      .eq('id', userId)
      .select()
      .single();
    if (data) {
      // Patch local state directly — no need to re-fetch all 3 queries
      setProfiles(prev =>
        prev.map(p => p.id === userId ? { ...p, ...(data as any) } : p)
      );
      // Recompute stats
      setStats(prev => ({
        ...prev,
        totalCoinsInCirculation: prev.totalCoinsInCirculation - (profiles.find(p => p.id === userId)?.coins ?? 0) + editValues.coins,
        totalPoints: prev.totalPoints - (profiles.find(p => p.id === userId)?.points ?? 0) + editValues.points,
      }));
    }
    setEditingUser(null);
    setSaving(false);
  };

  const toggleAdmin = async (userId: string, isAdmin: boolean) => {
    if (isAdmin) {
      await (supabase.from('user_roles' as any) as any).delete().eq('user_id', userId).eq('role', 'admin');
    } else {
      await (supabase.from('user_roles' as any) as any).insert({ user_id: userId, role: 'admin' });
    }
    await fetchData();
  };

  const filteredProfiles = profiles.filter(p =>
    p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resultColorClass = (r: string) => {
    if (r === 'won') return 'text-primary';
    if (r === 'lost') return 'text-destructive';
    return 'text-muted-foreground';
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="font-rajdhani text-lg font-bold neon-text-green">CricPredict Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="p-2 rounded-lg hover:bg-surface text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border/50">
          {(['overview', 'users', 'predictions'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-4xl animate-bounce">🏏</div>
          </div>
        ) : (
          <>
            {/* ── Overview ───────────────────────────────────────────────── */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Users', value: stats.totalUsers, Icon: Users, cls: 'text-blue-400' },
                    { label: 'Total Predictions', value: stats.totalPredictions, Icon: BarChart2, cls: 'text-primary' },
                    { label: 'Coins in Circulation', value: stats.totalCoinsInCirculation.toLocaleString(), Icon: Coins, cls: 'text-yellow-400' },
                    { label: 'Total Points Awarded', value: stats.totalPoints.toLocaleString(), Icon: Trophy, cls: 'text-orange-400' },
                  ].map(s => (
                    <div key={s.label} className="bg-surface border border-border rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <s.Icon className={`w-4 h-4 ${s.cls}`} />
                        <span className="text-xs text-muted-foreground">{s.label}</span>
                      </div>
                      <div className="text-2xl font-bold font-rajdhani">{s.value}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-surface border border-border rounded-xl p-5">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" /> Top 5 Users by Points
                  </h3>
                  <div className="space-y-3">
                    {profiles.slice(0, 5).map((p, i) => (
                      <div key={p.id} className="flex items-center gap-3">
                        <span className="w-6 text-center text-sm text-muted-foreground font-bold">#{i + 1}</span>
                        <div className="w-8 h-8 rounded-full gradient-green flex items-center justify-center text-background font-bold text-xs">
                          {p.username[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate flex items-center gap-1.5">
                            {p.username}
                            {p.isAdmin && <Crown className="w-3 h-3 text-yellow-400" />}
                          </div>
                          <div className="text-xs text-muted-foreground">{p.email}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-primary">{p.points.toLocaleString()} pts</div>
                          <div className="text-xs text-yellow-400">{p.coins.toLocaleString()} 🪙</div>
                        </div>
                      </div>
                    ))}
                    {profiles.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No users yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── Users ──────────────────────────────────────────────────── */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by username or email…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                  />
                </div>
                <div className="text-xs text-muted-foreground">{filteredProfiles.length} user(s)</div>

                <div className="space-y-3">
                  {filteredProfiles.map(p => (
                    <div key={p.id} className="bg-surface border border-border rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full gradient-green flex items-center justify-center text-background font-bold text-sm shrink-0">
                          {p.username[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm">{p.username}</span>
                            {p.isAdmin && (
                              <span className="text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Crown className="w-3 h-3" /> Admin
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">{p.level_name}</span>
                          </div>
                          <div className="text-xs text-muted-foreground truncate">{p.email}</div>

                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3">
                            {[
                              { label: 'Coins', val: p.coins.toLocaleString() },
                              { label: 'Points', val: p.points.toLocaleString() },
                              { label: 'Streak', val: p.streak },
                              { label: 'Predictions', val: p.total_predictions },
                              { label: 'Correct', val: p.correct_predictions },
                              {
                                label: 'Accuracy',
                                val: p.total_predictions > 0
                                  ? `${Math.round((p.correct_predictions / p.total_predictions) * 100)}%`
                                  : '—'
                              },
                            ].map(s => (
                              <div key={s.label} className="bg-background rounded-lg p-2 text-center">
                                <div className="text-xs text-muted-foreground">{s.label}</div>
                                <div className="text-sm font-semibold">{s.val}</div>
                              </div>
                            ))}
                          </div>

                          {editingUser === p.id ? (
                            <div className="mt-3 flex items-center gap-2 flex-wrap">
                              <div className="flex items-center gap-1.5 bg-background rounded-lg px-3 py-1.5 border border-border">
                                <Coins className="w-3.5 h-3.5 text-yellow-400" />
                                <input
                                  type="number"
                                  value={editValues.coins}
                                  onChange={e => setEditValues(v => ({ ...v, coins: Number(e.target.value) }))}
                                  className="w-20 bg-transparent text-sm focus:outline-none text-foreground"
                                />
                              </div>
                              <div className="flex items-center gap-1.5 bg-background rounded-lg px-3 py-1.5 border border-border">
                                <Trophy className="w-3.5 h-3.5 text-orange-400" />
                                <input
                                  type="number"
                                  value={editValues.points}
                                  onChange={e => setEditValues(v => ({ ...v, points: Number(e.target.value) }))}
                                  className="w-20 bg-transparent text-sm focus:outline-none text-foreground"
                                />
                              </div>
                              <button
                                onClick={() => saveEdit(p.id)}
                                disabled={saving}
                                className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                              >
                                <Save className="w-3 h-3" /> Save
                              </button>
                              <button
                                onClick={() => setEditingUser(null)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-surface border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <X className="w-3 h-3" /> Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="mt-3 flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => startEdit(p)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary border border-primary/30 rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors"
                              >
                                <Edit2 className="w-3 h-3" /> Edit Coins & Points
                              </button>
                              <button
                                onClick={() => toggleAdmin(p.id, !!p.isAdmin)}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                  p.isAdmin
                                    ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30 hover:bg-yellow-400/20'
                                    : 'bg-surface text-muted-foreground border-border hover:text-foreground'
                                }`}
                              >
                                <Crown className="w-3 h-3" />
                                {p.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredProfiles.length === 0 && (
                    <p className="text-center text-muted-foreground py-10">No users found.</p>
                  )}
                </div>
              </div>
            )}

            {/* ── Predictions ────────────────────────────────────────────── */}
            {activeTab === 'predictions' && (
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground">Showing latest 200 predictions across all users</div>
                {predictions.map(pred => {
                  const u = profiles.find(p => p.id === pred.user_id);
                  return (
                    <div key={pred.id} className="bg-surface border border-border rounded-xl p-4 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full gradient-green flex items-center justify-center text-background font-bold text-xs shrink-0">
                        {u ? u.username[0].toUpperCase() : '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">{u?.username ?? pred.user_id.slice(0, 8)}</span>
                          <span className={`text-xs font-semibold capitalize ${resultColorClass(pred.result)}`}>
                            {pred.result}
                          </span>
                          <span className="text-xs text-muted-foreground capitalize">{pred.phase}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{pred.question_text}</div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                          <span>Picked: <span className="text-foreground">{pred.option_label}</span></span>
                          <span>Cost: <span className="text-yellow-400">{pred.cost_paid}🪙</span></span>
                          <span>Win: <span className="text-primary">+{pred.potential_win}🪙</span></span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                        {new Date(pred.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </div>
                  );
                })}
                {predictions.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">No predictions yet.</div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
