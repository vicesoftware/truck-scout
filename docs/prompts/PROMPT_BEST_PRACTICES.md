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

## Critical Content Preservation Strategy

### Content Modification Workflow
1. **Full Content Preservation**
   - When modifying a file, ALWAYS include the ENTIRE original content
   - Add new content by inserting or appending, never by replacing wholesale
   - If adding new sections, place them strategically without disrupting existing structure

2. **Handling Partial Updates**
   - If only a small portion of a file needs updating:
     * Identify the exact location for the change
     * Modify ONLY that specific section
     * Ensure all surrounding content remains untouched
   - Use precise, targeted modifications
   - Avoid global replacements or bulk edits

3. **Tooling Considerations**
   - When using write_to_file or similar tools:
     * Always provide the complete file content
     * Do NOT use truncation or partial content strategies
     * Treat each file modification as a complete file rewrite
   - If unsure about the full content, use read_file first to capture the entire original file

### Common Pitfall Prevention
- **Red Flags to Watch For**:
  * Accidentally removing sections of a file
  * Using placeholders like "[...]"
  * Truncating content
  * Assuming certain sections are unimportant

- **Mitigation Strategies**:
  * Always double-check file content before submission
  * Use diff tools to verify changes
  * Ask for confirmation if any doubt exists
  * Treat every file as a complete, interconnected document

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

## Philosophical Approach

Remember: Each file is a living document. Your goal is not just to make changes, but to evolve the document while maintaining its integrity, context, and original intent. Every modification should feel like a natural, seamless extension of the existing content.

The ultimate goal is to make the smallest, most targeted change possible that fully addresses the task requirements while preserving the holistic nature of the document.
