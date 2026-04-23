"use client"

import posthog from 'posthog-js'

export interface FeatureFlagUser {
  email?: string
  id?: string
  distinctId?: string
}

export class FeatureFlagService {
  private static instance: FeatureFlagService

  private constructor() {}

  static getInstance(): FeatureFlagService {
    if (!FeatureFlagService.instance) {
      FeatureFlagService.instance = new FeatureFlagService()
    }
    return FeatureFlagService.instance
  }

  async isFeatureEnabled(
    flagKey: string,
    user?: FeatureFlagUser,
    defaultValue: boolean = false
  ): Promise<boolean> {
    try {
      if (!posthog.__loaded) {
        console.warn('PostHog not loaded, returning default value for feature flag:', flagKey)
        return defaultValue
      }

      if (user) {
        posthog.identify(user.distinctId || user.id || user.email, {
          email: user.email,
          ...(user.id && { id: user.id })
        })
      }

      const flagValue = await posthog.isFeatureEnabled(flagKey)
      return flagValue ?? defaultValue
    } catch (error) {
      console.error('Error checking feature flag:', flagKey, error)
      return defaultValue
    }
  }

  isFeatureEnabledSync(
    flagKey: string,
    defaultValue: boolean = false
  ): boolean {
    try {
      if (!posthog.__loaded) {
        return defaultValue
      }

      const flagValue = posthog.isFeatureEnabled(flagKey)
      return flagValue ?? defaultValue
    } catch (error) {
      console.error('Error checking feature flag sync:', flagKey, error)
      return defaultValue
    }
  }

  async getFeatureFlagValue<T = any>(
    flagKey: string,
    user?: FeatureFlagUser,
    defaultValue?: T
  ): Promise<T | undefined> {
    try {
      if (!posthog.__loaded) {
        console.warn('PostHog not loaded, returning default value for feature flag:', flagKey)
        return defaultValue
      }

      if (user) {
        posthog.identify(user.distinctId || user.id || user.email, {
          email: user.email,
          ...(user.id && { id: user.id })
        })
      }

      const flagValue = await posthog.getFeatureFlag(flagKey)
      return (flagValue ?? defaultValue) as T | undefined
    } catch (error) {
      console.error('Error getting feature flag value:', flagKey, error)
      return defaultValue
    }
  }

  getFeatureFlagValueSync<T = any>(
    flagKey: string,
    defaultValue?: T
  ): T | undefined {
    try {
      if (!posthog.__loaded) {
        return defaultValue
      }

      const flagValue = posthog.getFeatureFlag(flagKey)
      return (flagValue ?? defaultValue) as T | undefined
    } catch (error) {
      console.error('Error getting feature flag value sync:', flagKey, error)
      return defaultValue
    }
  }

  identifyUser(user: FeatureFlagUser): void {
    try {
      if (!posthog.__loaded) {
        console.warn('PostHog not loaded, cannot identify user')
        return
      }

      posthog.identify(user.distinctId || user.id || user.email, {
        email: user.email,
        ...(user.id && { id: user.id })
      })
    } catch (error) {
      console.error('Error identifying user:', error)
    }
  }

  reloadFeatureFlags(): void {
    try {
      if (!posthog.__loaded) {
        console.warn('PostHog not loaded, cannot reload feature flags')
        return
      }

      posthog.reloadFeatureFlags()
    } catch (error) {
      console.error('Error reloading feature flags:', error)
    }
  }
}

export const featureFlagService = FeatureFlagService.getInstance()

export const FEATURE_FLAGS = {
  TEST_BANNER: 'test-banner-feature',
} as const

export type FeatureFlagKey = typeof FEATURE_FLAGS[keyof typeof FEATURE_FLAGS]