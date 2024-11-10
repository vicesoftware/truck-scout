# Prompt Best Practices

## Core Principles

1. **Surgical Precision**
   - Focus exclusively on the specific task requested
   - Do NOT modify any code unrelated to the immediate task
   - Preserve ALL existing content in files unless explicitly instructed otherwise

2. **Communication is Key**
   - If ANY uncertainty exists, ALWAYS ask a clarifying question BEFORE making changes
   - Be specific in your questions to get precise guidance
   - Do not make assumptions about intent or implementation

3. **Minimal Invasive Changes**
   - When updating documentation or code:
     * Keep changes targeted and minimal
     * Preserve existing formatting and structure
     * Do not add unnecessary comments or placeholders
     * Ensure 100% of original content remains intact

4. **Explicit Confirmation**
   - Before using any file modification tool:
     * Carefully review the entire file content
     * Understand the full context
     * Plan changes that are precise and non-destructive
   - If unsure about the scope of changes, ask for explicit confirmation

## What to Avoid

- Do NOT use phrases like:
  * "(Previous content remains the same)"
  * "[... rest of the document remains the same ...]"
  * "[Rest of the document remains unchanged]"

- Do NOT modify files beyond the specific task requirements
- Do NOT remove or alter existing content without explicit instruction
- Do NOT make sweeping changes that could impact unrelated parts of the project

## Recommended Workflow

1. Read the entire task description carefully
2. Analyze the current state of relevant files
3. Identify the minimal changes required
4. If ANY doubt exists, ask a clarifying question
5. Propose changes with surgical precision
6. Seek confirmation before executing changes

## Better Approaches

- When documenting or updating files, consider:
  * Using diff-like precision
  * Asking for specific guidance on insertion points
  * Showing proposed changes before implementation
  * Breaking complex tasks into smaller, more manageable steps

Remember: The goal is to make the smallest, most targeted change possible that fully addresses the task requirements.
