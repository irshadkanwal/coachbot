"use client"

import { useEffect, useState } from 'react'
import { usePostHog } from 'posthog-js/react'
import { FeatureFlagUser, FeatureFlagKey } from '@/services/featureFlags'

interface UseFeatureFlagOptions {
  user?: FeatureFlagUser
  defaultValue?: boolean
}

export function useFeatureFlag(
  flagKey: FeatureFlagKey | string,
  options: UseFeatureFlagOptions = {}
) {
  const { user, defaultValue = false } = options
  const posthog = usePostHog()
  const [isEnabled, setIsEnabled] = useState<boolean>(defaultValue)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!posthog) {
      setIsLoading(false)
      return
    }

    const checkFeatureFlag = async () => {
      try {
        setIsLoading(true)

        if (!posthog.__loaded) {
          console.warn('PostHog not loaded yet, using default value')
          setIsEnabled(defaultValue)
          setIsLoading(false)
          return
        }

        if (user && user.email) {
          posthog.identify(user.email, {
            email: user.email,
            ...(user.id && { id: user.id })
          })
        }

        const flagValue = await posthog.isFeatureEnabled(flagKey)
        setIsEnabled(flagValue ?? defaultValue)
      } catch (error) {
        console.error('Error checking feature flag in hook:', flagKey, error)
        setIsEnabled(defaultValue)
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(checkFeatureFlag, 100)
    return () => clearTimeout(timer)
  }, [flagKey, user?.email, user?.id, user?.distinctId, defaultValue, posthog])

  return { isEnabled, isLoading }
}

interface UseFeatureFlagValueOptions<T> {
  user?: FeatureFlagUser
  defaultValue?: T
}

export function useFeatureFlagValue<T = any>(
  flagKey: FeatureFlagKey | string,
  options: UseFeatureFlagValueOptions<T> = {}
) {
  const { user, defaultValue } = options
  const posthog = usePostHog()
  const [value, setValue] = useState<T | undefined>(defaultValue)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!posthog) {
      setIsLoading(false)
      return
    }

    const checkFeatureFlagValue = async () => {
      try {
        setIsLoading(true)

        if (!posthog.__loaded) {
          console.warn('PostHog not loaded yet, using default value')
          setValue(defaultValue)
          setIsLoading(false)
          return
        }

        // User is already identified by PostHogUserIdentifier
        // Only identify if explicitly passed (for edge cases)
        if (user && user.email) {
          posthog.identify(user.email, {
            email: user.email,
            ...(user.id && { id: user.id })
          })
        }

        const flagValue = await posthog.getFeatureFlag(flagKey)
        setValue((flagValue ?? defaultValue) as T | undefined)
      } catch (error) {
        console.error('Error getting feature flag value in hook:', flagKey, error)
        setValue(defaultValue)
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(checkFeatureFlagValue, 100)
    return () => clearTimeout(timer)
  }, [flagKey, user?.email, user?.id, user?.distinctId, defaultValue, posthog])

  return { value, isLoading }
}