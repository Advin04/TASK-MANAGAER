/**
 * AI Categorization Service
 * Automatically detects task category based on title and description.
 */

const CATEGORIES = {
    BUG: "Bug",
    FEATURE: "Feature",
    FRONTEND: "Frontend",
    BACKEND: "Backend",
    UIUX: "UI/UX",
    DOCS: "Documentation",
    DEVOPS: "DevOps",
    UNCATEGORIZED: "Uncategorized"
};

const KEYWORDS = {
    [CATEGORIES.BUG]: ["bug", "fix", "error", "crash", "fail", "issue", "wrong", "broken", "incorrect", "problem"],
    [CATEGORIES.UIUX]: ["padding", "margin", "color", "font", "css", "style", "layout", "overlap", "design", "button", "center", "responsive", "mobile", "desktop"],
    [CATEGORIES.FRONTEND]: ["react", "component", "state", "props", "frontend", "client", "event", "handler", "input", "display"],
    [CATEGORIES.BACKEND]: ["api", "db", "database", "endpoint", "server", "express", "model", "schema", "auth", "jwt", "middleware"],
    [CATEGORIES.DOCS]: ["read", "write", "document", "comment", "guide", "info", "help", "manual", "readme"],
    [CATEGORIES.DEVOPS]: ["deploy", "docker", "cloud", "aws", "github", "workflow", "ci", "cd", "pipeline", "env", "configuration"]
};

/**
 * Categorize a task based on its title and description.
 * @param {string} title 
 * @param {string} description 
 * @returns {string} Suggested Category
 */
export const categorizeTask = (title, description = "") => {
    const content = (title + " " + description).toLowerCase();

    // Logical scoring
    let scores = {};
    Object.keys(CATEGORIES).forEach(cat => scores[CATEGORIES[cat]] = 0);

    for (const [category, words] of Object.entries(KEYWORDS)) {
        words.forEach(word => {
            // Bonus points for title matches
            if (title.toLowerCase().includes(word)) {
                scores[category] += 2;
            }
            // Standard points for description matches
            if (description.toLowerCase().includes(word)) {
                scores[category] += 1;
            }
        });
    }

    // Find the category with highest score
    let bestCategory = CATEGORIES.UNCATEGORIZED;
    let maxScore = 0;

    for (const [category, score] of Object.entries(scores)) {
        if (score > maxScore) {
            maxScore = score;
            bestCategory = category;
        }
    }

    // If title specifically starts with "Fix", it's likely a bug if not otherwise specified
    if (bestCategory === CATEGORIES.UNCATEGORIZED && title.toLowerCase().startsWith("fix")) {
        return CATEGORIES.BUG;
    }

    return bestCategory;
};

// NOTE: To upgrade to Real AI (LLM), replace the logic above with an API call:
/*
export const categorizeTaskWithGemini = async (title, description) => {
    const prompt = `Categorize this task into one of these: [${Object.values(CATEGORIES).join(", ")}]. 
    Task Name: ${title}
    Description: ${description}
    Return ONLY the category name.`;
    
    // Call Gemini API here...
}
*/
