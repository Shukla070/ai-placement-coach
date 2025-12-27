import json

# Read the current question bank
with open(r'c:\D\ai-placement-coach\data\question_master_curated.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

# Update each question with missing examples/constraints
updates = {
    "121": {  # Best Time to Buy and Sell Stock
        "display_markdown": """### Best Time to Buy and Sell Stock

You are given an array prices where prices[i] is the price of a stock on the ith day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.

**Example:**
```
Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.

Input: prices = [7,6,4,3,1]
Output: 0
Explanation: No transactions are done and the max profit = 0.
```

**Constraints:**
- 1 <= prices.length <= 10^5
-  0 <= prices[i] <= 10^4"""
    },
    "560": {  # Subarray Sum Equals K
        "display_markdown": """### Subarray Sum Equals K

Given an array of integers nums and an integer k, return the total number of continuous subarrays whose sum equals to k.

**Example:**
```
Input: nums = [1,1,1], k = 2
Output: 2
Explanation: Subarrays [1,1] and [1,1] both sum to 2.

Input: nums = [1,2,3], k = 3
Output: 2
```

**Constraints:**
- 1 <= nums.length <= 2 * 10^4
- -1000 <= nums[i] <= 1000
- -10^7 <= k <= 10^7"""
    },
    "94": {  # Binary Tree Inorder Traversal
        "display_markdown": """### Binary Tree Inorder Traversal

Given the root of a binary tree, return the inorder traversal of its nodes' values.

**Example:**
```
Input: root = [1,null,2,3]
Output: [1,3,2]

Input: root = []
Output: []
```

**Constraints:**
- 0 <= Number of nodes <= 100
- -100 <= Node.val <= 100"""
    },
    "98": {  # Validate Binary Search Tree
        "display_markdown": """### Validate Binary Search Tree

Given the root of a binary tree, determine if it is a valid binary search tree (BST).

A valid BST is defined as follows:
- The left subtree of a node contains only nodes with keys less than the node's key
- The right subtree of a node contains only nodes with keys greater than the node's key
- Both the left and right subtrees must also be binary search trees

**Example:**
```
Input: root = [2,1,3]
Output: true

Input: root = [5,1,4,null,null,3,6]
Output: false
Explanation: The root node's value is 5 but its right child's value is 4.
```

**Constraints:**
- 1 <= Number of nodes <= 10^4
- -2^31 <= Node.val <= 2^31 - 1"""
    },
    "200": {  # Number of Islands
        "display_markdown": """### Number of Islands

Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.

**Example:**
```
Input: grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
Output: 1

Input: grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
Output: 3
```

**Constraints:**
- m == grid.length
- n == grid[i].length
- 1 <= m, n <= 300
- grid[i][j] is '0' or '1'"""
    },
    "207": {  # Course Schedule
        "display_markdown": """### Course Schedule

There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.

Return true if you can finish all courses. Otherwise, return false.

**Example:**
```
Input: numCourses = 2, prerequisites = [[1,0]]
Output: true
Explanation: There are a total of 2 courses. To take course 1 you should have finished course 0. So it is possible.

Input: numCourses = 2, prerequisites = [[1,0],[0,1]]
Output: false
Explanation: There are 2 courses. To take course 1 you need course 0, and to take course 0 you need course 1. So it is impossible.
```

**Constraints:**
- 1 <= numCourses <= 2000
- 0 <= prerequisites.length <= 5000
- prerequisites[i].length == 2
- 0 <= ai, bi < numCourses
- All the pairs prerequisites[i] are unique"""
    },
    "146": {  # LRU Cache
        "display_markdown": """### LRU Cache

Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the LRUCache class:
- LRUCache(int capacity) Initialize the LRU cache with positive size capacity.
- int get(int key) Return the value of the key if the key exists, otherwise return -1.
- void put(int key, int value) Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.

**Example:**
```
Input:
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
Output:
[null, null, null, 1, null, -1, null, -1, 3, 4]
```

**Constraints:**
- 1 <= capacity <= 3000
- 0 <= key <= 10^4
- 0 <= value <= 10^5
- At most 2 * 10^5 calls will be made to get and put"""
    },
    "226": {  # Invert Binary Tree
        "display_markdown": """### Invert Binary Tree

Given the root of a binary tree, invert the tree, and return its root.

**Example:**
```
Input: root = [4,2,7,1,3,6,9]
Output: [4,7,2,9,6,3,1]

Input: root = [2,1,3]
Output: [2,3,1]
```

**Constraints:**
- 0 <= Number of nodes <= 100
- -100 <= Node.val <= 100"""
    },
    "21": {  # Merge Two Sorted Lists
        "display_markdown": """### Merge Two Sorted Lists

You are given the heads of two sorted linked lists list1 and list2.

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.

**Example:**
```
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]

Input: list1 = [], list2 = []
Output: []
```

**Constraints:**
- 0 <= list length <= 50
- -100 <= Node.val <= 100
- Both list1 and list2 are sorted in non-decreasing order"""
    },
    "70": {  # Climbing Stairs
        "display_markdown": """### Climbing Stairs

You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

**Example:**
```
Input: n = 2
Output: 2
Explanation: There are two ways to climb to the top: 1+1 or 2.

Input: n = 3
Output: 3
Explanation: There are three ways: 1+1+1, 1+2, or 2+1.
```

**Constraints:**
- 1 <= n <= 45"""
    },
    "53": {  # Maximum Subarray
        "display_markdown": """### Maximum Subarray

Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

**Example:**
```
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.

Input: nums = [1]
Output: 1
```

**Constraints:**
- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4"""
    },
    "235": {  # Lowest Common Ancestor of BST
        "display_markdown": """### Lowest Common Ancestor of a Binary Search Tree

Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.

The lowest common ancestor is defined as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself).

**Example:**
```
Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
Output: 6
Explanation: The LCA of nodes 2 and 8 is 6.

Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4
Output: 2
Explanation: The LCA of nodes 2 and 4 is 2, since a node can be a descendant of itself.
```

**Constraints:**
- 2 <= Number of nodes <= 10^5
- -10^9 <= Node.val <= 10^9
- All Node.val are unique
- p != q
- p and q will exist in the BST"""
    },
}

# Apply updates
for question in questions:
    if question['id'] in updates:
        question['display_markdown'] = updates[question['id']]['display_markdown']
        print(f"Updated question {question['id']}: {question['title']}")

# Write back to file
with open(r'c:\D\ai-placement-coach\data\question_master_curated.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"\nSuccessfully updated {len(updates)} questions!")
