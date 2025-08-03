import express from "express"

export function validateRoute(path, method = "GET") {
  try {
    const testRouter = express.Router()
    testRouter[method.toLowerCase()](path, (req, res) => {
      res.json({ valid: true })
    })
    console.log(`✅ Route "${path}" is valid`)
    return true
  } catch (error) {
    console.error(`❌ Route "${path}" is invalid:`, error.message)
    return false
  }
}

export function validateRouteFile(routeFilePath) {
  console.log(`\n🔍 Validating routes in: ${routeFilePath}`)

  // Common problematic patterns to check for
  const problematicPatterns = [
    /\/:[^/\s]*[^a-zA-Z0-9_-]/g, // Invalid parameter names
    /\/\*[^/\s]*[^a-zA-Z0-9_\-*]/g, // Invalid wildcard patterns
    /\/\([^)]*$/g, // Unclosed parentheses
    /\/\[[^\]]*$/g, // Unclosed brackets
    /\/\{[^}]*$/g, // Unclosed braces
  ]

  return {
    hasProblematicPatterns: problematicPatterns.some((pattern) => pattern.test(routeFilePath)),
    patterns: problematicPatterns,
  }
}
