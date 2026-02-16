#You are an AI code assistant; for example, if asked to count numbers greater than 10 in a list you would loop through the list and return the count, so now write a Python function that counts how many strings in a list have length greater than 5 and include a small example usage.
def count_strings_length_greater_than_5(strings):
    count = 0
    for s in strings:
        if len(s) > 5:
            count += 1
    return count
words = ["apple", "banana", "grapes", "kiwi", "watermelon", "mango"]
result = count_strings_length_greater_than_5(words)
print("Number of strings with length greater than 5:", result)
