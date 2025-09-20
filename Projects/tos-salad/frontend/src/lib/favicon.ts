/**
 * Favicon utility functions for company logos
 */

export interface FaviconSource {
  url: string
  size: number
  type: string
}

/**
 * Get the best favicon URL for a domain using multiple sources
 */
export function getFaviconUrl(domain: string, size: number = 32): string {
  // Remove common subdomains for better favicon matching
  const cleanDomain = domain
    .replace(/^(www\.|m\.|mobile\.|api\.|docs\.|help\.|support\.)/, '')
    .replace(/\/$/, '')

  // Favicon services in order of preference
  const faviconSources = [
    // Google favicon service (most reliable, high quality)
    `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=${size}`,

    // DuckDuckGo favicon service (good fallback)
    `https://icons.duckduckgo.com/ip3/${cleanDomain}.ico`,

    // Favicon.io service
    `https://favicon.io/favicon.ico?domain=${cleanDomain}`,

    // Direct domain favicon
    `https://${cleanDomain}/favicon.ico`,

    // Common favicon paths
    `https://${cleanDomain}/favicon.png`,
    `https://${cleanDomain}/apple-touch-icon.png`
  ]

  // Return the primary Google favicon service URL
  return faviconSources[0]
}

/**
 * Get multiple favicon sources for fallback handling
 */
export function getFaviconSources(domain: string, size: number = 32): FaviconSource[] {
  const cleanDomain = domain
    .replace(/^(www\.|m\.|mobile\.|api\.|docs\.|help\.|support\.)/, '')
    .replace(/\/$/, '')

  return [
    {
      url: `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=${size}`,
      size,
      type: 'google'
    },
    {
      url: `https://icons.duckduckgo.com/ip3/${cleanDomain}.ico`,
      size: 16,
      type: 'duckduckgo'
    },
    {
      url: `https://${cleanDomain}/favicon.ico`,
      size: 16,
      type: 'direct'
    }
  ]
}

/**
 * Special cases for known domains that have better favicon URLs
 */
export function getSpecialFaviconUrl(domain: string, size: number = 32): string | null {
  const specialCases: Record<string, string> = {
    'github.com': 'https://github.githubassets.com/favicons/favicon.svg',
    'google.com': 'https://www.google.com/favicon.ico',
    'policies.google.com': 'https://www.google.com/favicon.ico',
    'microsoft.com': 'https://c.s-microsoft.com/favicon.ico',
    'apple.com': 'https://www.apple.com/favicon.ico',
    'openai.com': 'https://openai.com/favicon.ico',
    'anthropic.com': 'https://www.anthropic.com/favicon.ico',
    'spotify.com': 'https://open.spotify.com/favicon.ico',
    'artists.spotify.com': 'https://open.spotify.com/favicon.ico',
    'discord.com': 'https://discord.com/assets/f9bb9c4af2b9c32a2c5ee0014661546d.ico',
    'telegram.org': 'https://telegram.org/favicon.ico',
    'signal.org': 'https://signal.org/assets/images/favicon/favicon.ico',
    'reddit.com': 'https://www.redditstatic.com/desktop2x/img/favicon/favicon-96x96.png',
    'tiktok.com': 'https://lf16-tiktok-web.ttocdn.com/obj/tiktok-web-tx/favicon.ico',
    'x.com': 'https://abs.twimg.com/favicons/twitter.3.ico',
    'youtube.com': 'https://www.youtube.com/s/desktop/favicon.ico',
    'verizon.com': 'https://www.verizon.com/cs/groups/public/sites/default/favicon.ico',
    'chase.com': 'https://www.chase.com/etc/designs/chase-ux/css/img/newnavigation/favicon-32x32.png',
    'bankofamerica.com': 'https://www.bankofamerica.com/favicon.ico',
    'coinbase.com': 'https://www.coinbase.com/favicon.ico',
    'paypal.com': 'https://www.paypalobjects.com/webstatic/icon/favicon.ico',
    'robinhood.com': 'https://robinhood.com/favicon.ico',
    'blackrock.com': 'https://www.blackrock.com/favicon.ico',
    'replit.com': 'https://replit.com/favicon.ico',
    'gitlab.com': 'https://about.gitlab.com/nuxt-images/favicon.ico',
    'snapchat.com': 'https://www.snapchat.com/favicon.ico',
    'otter.ai': 'https://otter.ai/favicon.ico',
    'fathom.video': 'https://fathom.video/favicon.ico',
    'linkedin.com': 'https://static.licdn.com/sc/h/1bt1uwq5akv756knzdj4l6cdc'
  }

  const cleanDomain = domain.replace(/^(www\.|m\.|mobile\.)/, '')
  return specialCases[cleanDomain] || null
}

/**
 * Get the best favicon URL with special case handling
 */
export function getBestFaviconUrl(domain: string, size: number = 32): string {
  // Check for special cases first
  const specialUrl = getSpecialFaviconUrl(domain, size)
  if (specialUrl) {
    return specialUrl
  }

  // Fall back to standard favicon URL
  return getFaviconUrl(domain, size)
}