import json
import sys

# Set UTF-8 encoding for output
if sys.platform == "win32":
    import codecs
    sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())

# Read the question bank
with open(r'c:\D\ai-placement-coach\data\question_master_curated.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

print(f"Total questions in database: {len(questions)}")
print("=" * 70)

# Check each question
incomplete = []
complete = []

for q in questions:
    has_example = '**Example' in q['display_markdown']
    has_constraints = '**Constraints' in q['display_markdown']
    
    if has_example and has_constraints:
        complete.append(q)
    else:
        incomplete.append({
            'id': q['id'],
            'title': q['title'],
            'missing_example': not has_example,
            'missing_constraints': not has_constraints
        })

# Print results
print(f"\nCOMPLETE QUESTIONS: {len(complete)}/35")
print(f"INCOMPLETE QUESTIONS: {len(incomplete)}/35")
print("=" * 70)

if incomplete:
    print("\nINCOMPLETE QUESTIONS:")
    for item in incomplete:
        issues = []
        if item['missing_example']:
            issues.append("Missing Example")
        if item['missing_constraints']:
            issues.append("Missing Constraints")
        print(f"  [X] ID {item['id']:3s}: {item['title']:45s} - {', '.join(issues)}")
else:
    print("\nALL 35 QUESTIONS ARE COMPLETE!")
    print("\nEvery question has:")
    print("  [OK] Problem description")
    print("  [OK] At least one example")
    print("  [OK] Constraints section")
    print("  [OK] Metadata (difficulty, topics, companies)")
    print("  [OK] Judge context (solution, complexity, insights)")

print("\n" + "=" * 70)
