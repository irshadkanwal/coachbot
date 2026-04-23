"use client"

import { useFeatureFlagValue } from '@/hooks/useFeatureFlag'
import { FEATURE_FLAGS } from '@/services/featureFlags'
import { useUser } from '@auth0/nextjs-auth0'
import { ReactNode } from 'react'

interface FeatureFlagBackgroundWrapperProps {
  children: ReactNode
  className?: string
}

export default function FeatureFlagBackgroundWrapper({
  children,
  className = ""
}: FeatureFlagBackgroundWrapperProps) {
  const { user } = useUser()
  const { value: bgColorVariant, isLoading } = useFeatureFlagValue(
    FEATURE_FLAGS.TEST_BANNER,
    {
      user: user ? { email: user.email || user?.metadata?.email || undefined } : undefined,
      defaultValue: 'default'
    }
  )

  const getBackgroundClass = () => {
    if (isLoading || bgColorVariant === 'default' || !bgColorVariant) {
      return 'bg-violet-950'
    }

    switch (bgColorVariant) {
      case 'green':
        return 'bg-green-950'
      case 'blue':
        return 'bg-blue-950'
      case 'purple':
        return 'bg-purple-950'
      case 'gradient':
        return 'bg-gradient-to-br from-violet-950 via-purple-950 to-indigo-950'
      default:
        return 'bg-violet-950'
    }
  }

  return (
    <div className={`${getBackgroundClass()} ${className}`}>
      {children}
    </div>
  )
}