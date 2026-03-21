const invitationCooldowns = new Map();

export const invitationRateLimiter = (maxInvitations = 10, windowMs = 60 * 60 * 1000) => {
  return (req, res, next) => {
    const userId = req.user?._id?.toString() || req.ip;
    const now = Date.now();
    
    const userData = invitationCooldowns.get(userId) || { count: 0, resetAt: now + windowMs };
    
    if (now > userData.resetAt) {
      userData.count = 0;
      userData.resetAt = now + windowMs;
    }
    
    if (userData.count >= maxInvitations) {
      const retryAfter = Math.ceil((userData.resetAt - now) / 1000);
      res.set("Retry-After", retryAfter);
      return res.status(429).json({
        success: false,
        message: `Too many invitations. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
        retryAfter,
      });
    }
    
    userData.count++;
    invitationCooldowns.set(userId, userData);
    
    res.set("X-RateLimit-Limit", maxInvitations);
    res.set("X-RateLimit-Remaining", maxInvitations - userData.count);
    res.set("X-RateLimit-Reset", Math.ceil(userData.resetAt / 1000));
    
    next();
  };
};

setInterval(() => {
  const now = Date.now();
  for (const [key, data] of invitationCooldowns.entries()) {
    if (now > data.resetAt + 60000) {
      invitationCooldowns.delete(key);
    }
  }
}, 5 * 60 * 1000);
