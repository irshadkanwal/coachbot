"use client"

import { useUser } from '@auth0/nextjs-auth0'
import { usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'
import { featureFlagService } from '@/services/featureFlags'
import { getUserEmail } from '@/utils/user-data'

export default function PostHogUserIdentifier() {
  const { user, isLoading: userLoading } = useUser()
  const posthog = usePostHog()

  useEffect(() => {
    if (userLoading || !posthog?.__loaded) return

    const email = getUserEmail(user)
    const userId = user?.sub

    if (user && email) {
      // Identify with email as distinct ID and set person properties
      featureFlagService.identifyUser({
        email,
        id: userId,
      })
      
      // Explicitly set person properties to ensure they're available in PostHog
      if (posthog) {
        posthog.setPersonProperties({
          email: email,
          name: user.name,
          ...(userId && { user_id: userId })
        })
      }
    }
  }, [user, userLoading, posthog])

  return null
}


