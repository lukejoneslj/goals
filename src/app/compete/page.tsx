'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Trophy,
  TrendingUp,
  Users,
  Award,
  Target,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { UserELO } from '@/lib/firebase'
import { userELOService } from '@/lib/database'
import { getRankInfo, ELO_RANKS } from '@/lib/elo'
import DashboardNav from '@/components/DashboardNav'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, BarChart, Bar } from 'recharts'

export default function CompetePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [userELO, setUserELO] = useState<UserELO | null>(null)
  const [allUsers, setAllUsers] = useState<UserELO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin')
    }
  }, [user, authLoading, router])

  const loadData = useCallback(async () => {
    if (!user?.uid) return

    try {
      const [userResult, allUsersResult] = await Promise.all([
        userELOService.getOrCreate(user.uid),
        userELOService.getAllUsers()
      ])

      if (userResult.error) throw userResult.error
      if (allUsersResult.error) throw allUsersResult.error

      setUserELO(userResult.data as UserELO)
      setAllUsers((allUsersResult.data || []) as UserELO[])
    } catch (error) {
      console.error('Error loading ELO data:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.uid])

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user, loadData])

  // Calculate statistics
  const stats = useMemo(() => {
    if (!userELO || allUsers.length === 0) {
      return {
        percentile: 0,
        rank: 0,
        totalUsers: 0,
        averageELO: 0,
        medianELO: 0,
        maxELO: 0,
        minELO: 0,
        aboveAverage: false
      }
    }

    const sortedELOs = [...allUsers].sort((a, b) => b.eloRating - a.eloRating)
    const userRank = sortedELOs.findIndex(u => u.userId === userELO.userId) + 1
    const totalUsers = allUsers.length
    const usersBelow = sortedELOs.filter(u => u.eloRating < userELO.eloRating).length
    const percentile = totalUsers > 0 ? Math.round((usersBelow / totalUsers) * 100) : 0

    const elos = allUsers.map(u => u.eloRating)
    const averageELO = Math.round(elos.reduce((a, b) => a + b, 0) / elos.length)
    const sortedElos = [...elos].sort((a, b) => a - b)
    const medianELO = sortedElos.length > 0 
      ? sortedElos[Math.floor(sortedElos.length / 2)]
      : 0
    const maxELO = Math.max(...elos)
    const minELO = Math.min(...elos)

    return {
      percentile,
      rank: userRank,
      totalUsers,
      averageELO,
      medianELO,
      maxELO,
      minELO,
      aboveAverage: userELO.eloRating >= averageELO
    }
  }, [userELO, allUsers])

  // Prepare scatter plot data
  const scatterData = useMemo(() => {
    if (!userELO || allUsers.length === 0) return []
    
    return allUsers.map((u, index) => ({
      x: index + 1,
      y: u.eloRating,
      isCurrentUser: u.userId === userELO.userId,
      rank: u.currentRank
    }))
  }, [allUsers, userELO])

  // Prepare bell curve data (distribution)
  const bellCurveData = useMemo(() => {
    if (allUsers.length === 0) return []

    const elos = allUsers.map(u => u.eloRating)
    const min = Math.min(...elos)
    const max = Math.max(...elos)
    const range = max - min
    const buckets = 20
    const bucketSize = range / buckets

    const distribution: { elo: number; count: number }[] = []
    for (let i = 0; i < buckets; i++) {
      const bucketMin = min + (i * bucketSize)
      const bucketMax = bucketMin + bucketSize
      const count = elos.filter(e => e >= bucketMin && e < bucketMax).length
      distribution.push({
        elo: Math.round((bucketMin + bucketMax) / 2),
        count
      })
    }

    return distribution
  }, [allUsers])

  // Prepare rank distribution data
  const rankDistribution = useMemo(() => {
    if (allUsers.length === 0) return []

    const rankCounts: Record<string, number> = {}
    allUsers.forEach(u => {
      rankCounts[u.currentRank] = (rankCounts[u.currentRank] || 0) + 1
    })

    return ELO_RANKS.map(rank => ({
      rank: rank.rank,
      count: rankCounts[rank.rank] || 0,
      color: rank.color
    })).filter(r => r.count > 0)
  }, [allUsers])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav />
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading competition data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!userELO) return null

  const rankInfo = getRankInfo(userELO.currentRank)

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${rankInfo.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
              <Trophy className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                Compete & Compare
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                See how you stack up against other users
              </p>
            </div>
          </div>
        </div>

        {/* Your Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 shadow-sm">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Your ELO</p>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-700">{userELO.eloRating}</p>
                  <p className="text-xs text-muted-foreground mt-1">{userELO.currentRank}</p>
                </div>
                <Target className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Rank</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">
                    #{stats.rank}
                    {stats.totalUsers > 0 && (
                      <span className="text-sm text-muted-foreground font-normal"> / {stats.totalUsers}</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.percentile}th percentile
                  </p>
                </div>
                <Award className="w-8 h-8 sm:w-10 sm:h-10 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Win Rate</p>
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-600">
                    {userELO.totalWins + userELO.totalLosses > 0
                      ? Math.round((userELO.totalWins / (userELO.totalWins + userELO.totalLosses)) * 100)
                      : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {userELO.totalWins}W / {userELO.totalLosses}L
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Best Streak</p>
                  <p className="text-2xl sm:text-3xl font-bold text-orange-600">{userELO.bestWinStreak}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Current: {userELO.winStreak}
                  </p>
                </div>
                <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-8">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Comparison Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <span className="text-sm font-medium text-muted-foreground">Average ELO</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-foreground">{stats.averageELO}</span>
                    {stats.aboveAverage ? (
                      <Badge variant="default" className="bg-emerald-600">Above</Badge>
                    ) : (
                      <Badge variant="outline">Below</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <span className="text-sm font-medium text-muted-foreground">Median ELO</span>
                  <span className="text-lg font-bold text-foreground">{stats.medianELO}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <span className="text-sm font-medium text-muted-foreground">Highest ELO</span>
                  <span className="text-lg font-bold text-foreground">{stats.maxELO}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <span className="text-sm font-medium text-muted-foreground">Lowest ELO</span>
                  <span className="text-lg font-bold text-foreground">{stats.minELO}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <span className="text-sm font-medium text-muted-foreground">Total Users</span>
                  <span className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {stats.totalUsers}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Your Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">ELO vs Average</span>
                    <span className={`text-sm font-bold ${stats.aboveAverage ? 'text-emerald-600' : 'text-red-600'}`}>
                      {stats.aboveAverage ? '+' : ''}{userELO.eloRating - stats.averageELO}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${stats.aboveAverage ? 'bg-emerald-600' : 'bg-red-600'}`}
                      style={{ 
                        width: `${Math.min(100, Math.max(0, ((userELO.eloRating - stats.minELO) / (stats.maxELO - stats.minELO || 1)) * 100))}%` 
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Percentile</span>
                    <span className="text-sm font-bold text-primary">{stats.percentile}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${stats.percentile}%` }}
                    />
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">You are performing better than</p>
                  <p className="text-3xl font-bold text-primary">{stats.percentile}%</p>
                  <p className="text-xs text-muted-foreground mt-1">of all users</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scatter Plot */}
        <Card className="mb-6 sm:mb-8 border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              ELO Distribution (Scatter Plot)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80 md:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Rank" 
                    label={{ value: 'Rank', position: 'insideBottom', offset: -5 }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="ELO" 
                    label={{ value: 'ELO Rating', angle: -90, position: 'insideLeft' }}
                    stroke="#6b7280"
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        const data = payload[0].payload as { x: number; y: number; isCurrentUser: boolean; rank: string }
                        return (
                          <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-semibold text-foreground">
                              {data.isCurrentUser ? 'You' : `Rank #${data.x}`}
                            </p>
                            <p className="text-sm text-muted-foreground">ELO: {data.y}</p>
                            <p className="text-sm text-muted-foreground">Rank: {data.rank}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Scatter name="Users" data={scatterData} fill="#8884d8">
                    {scatterData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.isCurrentUser ? '#8b5cf6' : '#cbd5e1'} 
                        r={entry.isCurrentUser ? 8 : 4}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                <span className="text-muted-foreground">You</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-300"></div>
                <span className="text-muted-foreground">Other Users</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bell Curve / Distribution */}
        <Card className="mb-6 sm:mb-8 border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              ELO Distribution (Bell Curve)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80 md:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bellCurveData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="elo" 
                    label={{ value: 'ELO Rating', position: 'insideBottom', offset: -5 }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    label={{ value: 'Number of Users', angle: -90, position: 'insideLeft' }}
                    stroke="#6b7280"
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        const data = payload[0].payload as { elo: number; count: number }
                        return (
                          <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-semibold text-foreground">ELO Range: ~{data.elo}</p>
                            <p className="text-sm text-muted-foreground">Users: {data.count}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                    {bellCurveData.map((entry, index) => {
                      const isUserRange = userELO && entry.elo >= userELO.eloRating - 50 && entry.elo <= userELO.eloRating + 50
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={isUserRange ? '#8b5cf6' : '#cbd5e1'} 
                        />
                      )
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                <span className="text-muted-foreground">Your Range</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-300"></div>
                <span className="text-muted-foreground">All Users</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rank Distribution */}
        <Card className="mb-6 sm:mb-8 border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Rank Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80 md:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rankDistribution} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="rank" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    label={{ value: 'Number of Users', angle: -90, position: 'insideLeft' }}
                    stroke="#6b7280"
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        const data = payload[0].payload as { rank: string; count: number }
                        return (
                          <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-semibold text-foreground">{data.rank}</p>
                            <p className="text-sm text-muted-foreground">Users: {data.count}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {rankDistribution.map((entry, index) => {
                      const isUserRank = entry.rank === userELO.currentRank
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={isUserRank ? '#8b5cf6' : '#cbd5e1'} 
                          stroke={isUserRank ? '#7c3aed' : 'none'}
                          strokeWidth={isUserRank ? 2 : 0}
                        />
                      )
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        {allUsers.length > 0 && (
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {allUsers.slice(0, 10).map((u, index) => {
                  const isCurrentUser = u.userId === userELO.userId
                  const rankInfo = getRankInfo(u.currentRank)
                  return (
                    <div
                      key={u.id}
                      className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border transition-all ${
                        isCurrentUser
                          ? 'bg-purple-50 border-purple-200 shadow-sm'
                          : 'bg-card border-border hover:bg-secondary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm sm:text-base ${
                          index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white' :
                          index === 1 ? 'bg-gradient-to-r from-slate-300 to-slate-400 text-white' :
                          index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white' :
                          'bg-secondary text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className={`font-semibold text-sm sm:text-base truncate ${
                              isCurrentUser ? 'text-purple-700' : 'text-foreground'
                            }`}>
                              {isCurrentUser ? 'You' : `User ${u.userId.slice(0, 8)}...`}
                            </p>
                            {isCurrentUser && (
                              <Badge variant="default" className="bg-purple-600 text-xs">You</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge 
                              variant="outline" 
                              className={`text-xs border-${rankInfo.color.split('-')[1]}-300`}
                            >
                              {u.currentRank}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {u.totalWins}W / {u.totalLosses}L
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className={`text-lg sm:text-xl font-bold ${
                          isCurrentUser ? 'text-purple-700' : 'text-foreground'
                        }`}>
                          {u.eloRating}
                        </p>
                        <p className="text-xs text-muted-foreground">ELO</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              {allUsers.length > 10 && (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Showing top 10 of {allUsers.length} users
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

