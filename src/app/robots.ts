import { isLowerEnv } from '@/utils/env-utils';
import { PrivateRoutes } from '@models/common.models';
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://coachbot.ai';
  
  if (isLowerEnv(baseUrl)) {
    return {
        rules: {
            userAgent: '*',
            disallow: ['/'],
        },
    }
  }

  return {
      rules: {
          userAgent: '*',
          allow: '/',
          disallow: [...Object.values(PrivateRoutes)]
      },
      sitemap: `${baseUrl}/sitemap.xml`,
  }
}