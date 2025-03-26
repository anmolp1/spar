'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Training {
  id: string
  title: string
  description: string
  feedback: string | null
  completed: boolean
  createdAt: string
}

export default function ProgressPage() {
  const [trainings, setTrainings] = useState<Training[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await fetch('/api/trainings')
        if (!response.ok) {
          throw new Error('Failed to fetch trainings')
        }
        const data = await response.json()
        setTrainings(data.trainings)
      } catch (error) {
        console.error('Error fetching trainings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrainings()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Training History</h2>
            
            {trainings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No training sessions yet.</p>
                <button
                  onClick={() => router.push('/dashboard/training')}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Start Training
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {trainings.map((training) => (
                  <div
                    key={training.id}
                    className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {training.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {new Date(training.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          training.completed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {training.completed ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">{training.description}</p>
                    </div>
                    {training.feedback && (
                      <div className="mt-4 bg-blue-50 rounded p-4">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">
                          AI Feedback
                        </h4>
                        <p className="text-sm text-blue-700">{training.feedback}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 