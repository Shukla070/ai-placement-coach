import json

# Load the question bank
with open('c:/D/ai-placement-coach/data/question_master_curated.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

# Find questions with double-escaped newlines
affected_questions = []
for q in questions:
    if '\\n' in q['display_markdown']:
        affected_questions.append({
            'id': q['id'],
            'title': q['title']
        })

# Print results
if affected_questions:
    print(f"Found {len(affected_questions)} questions with double-escaped newlines:\n")
    for q in affected_questions:
        print(f"ID {q['id']}: {q['title']}")
else:
    print("No questions found with double-escaped newlines")
