#!/usr/bin/env python3


def calculate(expression):
    """
    A simple string calculator that evaluates arithmetic expressions.
    Handles addition, subtraction, multiplication, exponentiation, and parentheses.
    """
    expression = expression.strip()

    if not expression:
        return 0

    # Handle parentheses first (recursive evaluation)
    if "(" in expression and ")" in expression:
        # Find the innermost set of parentheses
        open_idx = expression.rfind("(")
        close_idx = expression.find(")", open_idx)

        if open_idx != -1 and close_idx != -1:
            # Calculate the value inside the parentheses
            inner_value = calculate(expression[open_idx + 1 : close_idx])
            # Replace the parentheses and its contents with the calculated value
            new_expression = (
                expression[:open_idx] + str(inner_value) + expression[close_idx + 1 :]
            )
            # Continue evaluating
            return calculate(new_expression)

    # Handle exponentiation (fixed)
    if "**" in expression:
        parts = expression.split("**", 1)  # Split only on first occurrence
        if len(parts) == 2:
            base = int(parts[0].strip())
            # Handle negative exponents by returning a float
            exp = int(parts[1].strip())
            if exp < 0:
                return float(base**exp)
            return base**exp

    # Handle multiplication (check after exponentiation to avoid conflict with **)
    if "*" in expression:
        parts = expression.split("*")
        if len(parts) == 2:
            return int(parts[0].strip()) * int(parts[1].strip())

    # Handle addition (fixed)
    if "+" in expression:
        parts = expression.split("+")
        if len(parts) == 2:
            return int(parts[0].strip()) + int(parts[1].strip())

    # Handle subtraction
    if "-" in expression:
        # Need to handle negative numbers, so split only on first occurrence of -
        # that isn't at the start of the expression
        if expression[0] != "-" and "-" in expression[1:]:
            idx = expression.find("-", 1)
            left = expression[:idx].strip()
            right = expression[idx + 1 :].strip()
            return int(left) - int(right)

    # If it's just a single number
    try:
        return int(expression.strip())
    except ValueError:
        try:
            return float(expression.strip())
        except ValueError:
            return 0


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1:
        expression = sys.argv[1]
        result = calculate(expression)
        print(result)
    else:
        print('Usage: uv run calculate.py "expression"')
        print('Example: uv run calculate.py "2 + 2"')
        sys.exit(1)
