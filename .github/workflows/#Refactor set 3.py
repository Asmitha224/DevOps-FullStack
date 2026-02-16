#Refactor the AI-generated function `def calculate_discount(price): return price * 0.9` so that it properly handles negative prices and prevents invalid inputs (such as strings or None) from producing incorrect or misleading output.
def calculate_discount(price):
    if not isinstance(price, (int, float)):
        raise TypeError("Price must be a numeric value.")
    if price < 0:
        raise ValueError("Price cannot be negative.")
    return round(price * 0.9, 2)
try:
    print(calculate_discount(200))     
    print(calculate_discount(-10))     
    print(calculate_discount("200"))   
except (TypeError, ValueError) as e:
    print("Error:", e)
