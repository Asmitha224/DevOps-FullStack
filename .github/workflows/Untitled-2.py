def count_long_strings(strings):
    """
    Counts how many strings in the list have length greater than 5.
    
    :param strings: List of strings
    :return: Integer count of strings with length > 5
    """
    count = 0
    for s in strings:
        if len(s) > 5:
            count += 1
    return count
if __name__ == "__main__":
    words = ["apple", "banana", "kiwi", "strawberry"]
    result = count_long_strings(words)
    print("Number of strings with length greater than 5:", result)
