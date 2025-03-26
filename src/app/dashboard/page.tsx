'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DashboardStats {
  totalTrainings: number
  completedTrainings: number
  totalDuration: number
  averageDuration: number
}

interface Training {
  id: string
  title: string
  description: string | null
  duration: number
  completed: boolean
  feedback: string | null
  createdAt: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTrainings: 0,
    completedTrainings: 0,
    totalDuration: 0,
    averageDuration: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/trainings')
        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }
        const data = await response.json()
        const trainings = data.trainings as Training[]
        
        // Calculate stats
        const totalTrainings = trainings.length
        const completedTrainings = trainings.filter(t => t.completed).length
        const totalDuration = trainings.reduce((sum, t) => sum + t.duration, 0)
        const averageDuration = totalTrainings > 0 ? Math.round(totalDuration / totalTrainings) : 0

        setStats({
          totalTrainings,
          completedTrainings,
          totalDuration,
          averageDuration,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <Link
          href="/dashboard/training"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Start Training
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Trainings */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Trainings
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stats.totalTrainings}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Completed Trainings */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Completed Trainings
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stats.completedTrainings}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Total Duration */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">⏱️</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Duration
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stats.totalDuration} min
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Average Duration */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Average Duration
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stats.averageDuration} min
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              href="/dashboard/training"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Start New Training
            </Link>
            <Link
              href="/dashboard/progress"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Progress
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 