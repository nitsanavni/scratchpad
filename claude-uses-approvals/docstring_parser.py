from approvaltests import verify, Options


def parse_test_cases(docstring, separator="->"):
    """Extract test cases from docstring using the given separator"""
    return [
        line.split(separator)[0].strip()
        for line in docstring.strip().split("\n")
        if separator in line
    ]


def verify_docstring(docstring, processor_fn, separator="->"):
    """
    Parses docstring test cases and verifies results using ApprovalTests

    Args:
        docstring: The docstring containing test cases
        processor_fn: Function that processes each test case
        separator: The separator character in test cases (default '->')
    """
    # Calculate results using list comprehension
    results = [
        f"{expr} {separator} {processor_fn(expr)}"
        for expr in parse_test_cases(docstring, separator)
    ]

    verify("\n".join(results), options=Options().inline())
