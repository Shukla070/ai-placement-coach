import json

# Read question bank
with open(r'c:\D\ai-placement-coach\data\question_master_curated.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("Manually Checking Each Question...")
print("=" * 80)

incomplete_questions = []

for i, q in enumerate(data, 1):
    q_id = q['id']
    title = q['title']
    markdown = q['display_markdown']
    
    # Check for examples and constraints
    has_example = '**Example' in markdown
    has_constraints = '**Constraints' in markdown
    
    status = "✓" if (has_example and has_constraints) else "✗"
    
    if not (has_example and has_constraints):
        missing = []
        if not has_example:
            missing.append("Example")
        if not has_constraints:
            missing.append("Constraints")
        
        incomplete_questions.append({
            'id': q_id,
            'title': title,
            'missing': missing
        })
        print(f"{i:2d}. [{status}] ID {q_id:3s}: {title:50s} MISSING: {', '.join(missing)}")
    else:
        print(f"{i:2d}. [{status}] ID {q_id:3s}: {title}")

print("\n" + "=" * 80)
print(f"\nSummary:")
print(f"  Total Questions: {len(data)}")
print(f"  Complete: {len(data) - len(incomplete_questions)}")
print(f"  Incomplete: {len(incomplete_questions)}")

if incomplete_questions:
    print(f"\n{len(incomplete_questions)} Incomplete Questions Found:")
    for q in incomplete_questions:
        print(f"  - ID {q['id']}: {q['title']} (Missing: {', '.join(q['missing'])})")
else:
    print("\nAll questions are complete!")
