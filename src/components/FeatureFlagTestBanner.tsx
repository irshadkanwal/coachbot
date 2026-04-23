"use client"

import { useUser } from '@auth0/nextjs-auth0'
import { usePostHog } from 'posthog-js/react'
import { useEffect, useState } from 'react'
import { FEATURE_FLAGS } from '@/services/featureFlags'
import { getUserEmail } from '@/utils/user-data'
import { TIMEOUTS } from '@/constants/pagination'

export default function FeatureFlagTestBanner() {
  const { user, isLoading: userLoading } = useUser()
  const posthog = usePostHog()
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    if (userLoading) return

    const checkFlag = async () => {
      try {
        if (!posthog || !posthog.__loaded) {
          setIsEnabled(false)
          return
        }

        const email = getUserEmail(user)
        if (user && email) {
          await new Promise(resolve => setTimeout(resolve, TIMEOUTS.FEATURE_FLAG_CHECK))

          const flagValue = await posthog.isFeatureEnabled(FEATURE_FLAGS.TEST_BANNER)
          setIsEnabled(flagValue || false)
        } else {
          setIsEnabled(false)
        }
      } catch (error) {
        console.error('Error checking flag:', error)
        setIsEnabled(false)
      }
    }

    checkFlag()
  }, [user, userLoading, posthog])

  const userEmail = getUserEmail(user) || user?.name || 'Not logged in'

  if (!isEnabled) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-4 text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-lg font-semibold">🎉 Feature Flag Test Banner</h2>
        <p className="text-sm opacity-90">
          This banner is only visible to users with the test-banner-feature flag enabled!
          {userEmail && userEmail !== 'Not logged in' && (
            <span className="ml-2 font-medium">
              Hello, {userEmail}
            </span>
          )}
        </p>
      </div>
    </div>
  )
}