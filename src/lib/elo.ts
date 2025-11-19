import { ELO_RANK } from './firebase'

export const ELO_RANKS: { rank: ELO_RANK; minElo: number; maxElo: number; color: string }[] = [
  { rank: 'Bronze III', minElo: 0, maxElo: 1149, color: 'from-amber-600 to-amber-700' },
  { rank: 'Bronze II', minElo: 1150, maxElo: 1299, color: 'from-amber-600 to-amber-700' },
  { rank: 'Bronze I', minElo: 1300, maxElo: 1399, color: 'from-amber-600 to-amber-700' },
  { rank: 'Silver III', minElo: 1400, maxElo: 1499, color: 'from-slate-400 to-slate-500' },
  { rank: 'Silver II', minElo: 1500, maxElo: 1599, color: 'from-slate-400 to-slate-500' },
  { rank: 'Silver I', minElo: 1600, maxElo: 1699, color: 'from-slate-400 to-slate-500' },
  { rank: 'Gold III', minElo: 1700, maxElo: 1799, color: 'from-yellow-500 to-yellow-600' },
  { rank: 'Gold II', minElo: 1800, maxElo: 1899, color: 'from-yellow-500 to-yellow-600' },
  { rank: 'Gold I', minElo: 1900, maxElo: 1999, color: 'from-yellow-500 to-yellow-600' },
  { rank: 'Platinum III', minElo: 2000, maxElo: 2099, color: 'from-cyan-400 to-cyan-500' },
  { rank: 'Platinum II', minElo: 2100, maxElo: 2199, color: 'from-cyan-400 to-cyan-500' },
  { rank: 'Platinum I', minElo: 2200, maxElo: 2299, color: 'from-cyan-400 to-cyan-500' },
  { rank: 'Diamond III', minElo: 2300, maxElo: 2399, color: 'from-blue-500 to-blue-600' },
  { rank: 'Diamond II', minElo: 2400, maxElo: 2499, color: 'from-blue-500 to-blue-600' },
  { rank: 'Diamond I', minElo: 2500, maxElo: 2599, color: 'from-blue-500 to-blue-600' },
  { rank: 'Master', minElo: 2600, maxElo: 2799, color: 'from-purple-500 to-purple-600' },
  { rank: 'Grandmaster', minElo: 2800, maxElo: 2999, color: 'from-red-500 to-red-600' },
  { rank: 'Challenger', minElo: 3000, maxElo: 9999, color: 'from-red-600 to-red-700' }
]

export const DEFAULT_ELO = 1000

export function getRankFromElo(elo: number): ELO_RANK {
  const rankInfo = ELO_RANKS.find(rank => elo >= rank.minElo && elo <= rank.maxElo)
  return rankInfo?.rank || 'Bronze III'
}

export function getRankInfo(rank: ELO_RANK) {
  return ELO_RANKS.find(r => r.rank === rank) || ELO_RANKS[0]
}

export function getNextRank(currentElo: number): ELO_RANK | null {
  const currentRankIndex = ELO_RANKS.findIndex(rank => currentElo >= rank.minElo && currentElo <= rank.maxElo)
  if (currentRankIndex < ELO_RANKS.length - 1) {
    return ELO_RANKS[currentRankIndex + 1].rank
  }
  return null
}

export function getEloProgress(currentElo: number): { current: number; max: number; percentage: number } {
  const currentRank = ELO_RANKS.find(rank => currentElo >= rank.minElo && currentElo <= rank.maxElo)
  if (!currentRank) return { current: 0, max: 100, percentage: 0 }

  const progress = currentElo - currentRank.minElo
  const maxProgress = currentRank.maxElo - currentRank.minElo

  return {
    current: progress,
    max: maxProgress,
    percentage: Math.round((progress / maxProgress) * 100)
  }
}

// ELO calculation for habit streaks
export function calculateEloChange(
  currentElo: number,
  opponentElo: number,
  isWin: boolean,
  streakMultiplier: number = 1
): number {
  const K = 32 // ELO K-factor, determines how much ratings change

  // Expected score (probability of winning)
  const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - currentElo) / 400))

  // Actual score (1 for win, 0 for loss)
  const actualScore = isWin ? 1 : 0

  // Base ELO change
  let eloChange = K * (actualScore - expectedScore)

  // Apply streak multiplier for consecutive wins
  if (isWin && streakMultiplier > 1) {
    eloChange *= Math.min(streakMultiplier * 0.1 + 1, 2) // Max 2x multiplier
  }

  // Apply difficulty multiplier based on current rank
  const difficultyMultiplier = getDifficultyMultiplier(currentElo)
  eloChange *= difficultyMultiplier

  return Math.round(eloChange)
}

function getDifficultyMultiplier(elo: number): number {
  if (elo < 1400) return 1.2 // Easier for beginners
  if (elo < 1700) return 1.0 // Standard
  if (elo < 2000) return 0.9 // Slightly harder
  if (elo < 2300) return 0.8 // Getting harder
  if (elo < 2600) return 0.7 // Challenging
  return 0.6 // Very challenging for high ranks
}

// For habits, we'll treat each habit as having an "opponent ELO" based on streak length
export function getHabitOpponentElo(streakLength: number): number {
  // Base opponent ELO increases with streak length
  const baseElo = 1000 + (streakLength * 50)

  // Add some randomness to make it more interesting (±100 ELO)
  const randomVariation = (Math.random() - 0.5) * 200

  return Math.max(800, Math.min(2500, baseElo + randomVariation))
}

// Calculate ELO change for habit completion
export function calculateHabitEloChange(
  currentElo: number,
  currentStreak: number,
  isWin: boolean,
  winStreak: number
): { eloChange: number; newElo: number } {
  const opponentElo = getHabitOpponentElo(currentStreak)
  const eloChange = calculateEloChange(currentElo, opponentElo, isWin, winStreak)
  const newElo = Math.max(0, currentElo + eloChange)

  return { eloChange, newElo }
}
