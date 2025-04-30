from approvaltests import verify, Options
import inspect


def parse_test_cases(docstring, separator="->"):
    """Extract test cases from docstring using the given separator"""
    if not docstring:
        return []

    return [
        line.split(separator)[0].strip()
        for line in docstring.strip().split("\n")
        if separator in line
    ]


def verify_docstring(docstring=None, processor_fn=None, separator="->"):
    """
    Parses docstring test cases and verifies results using ApprovalTests

    Args:
        docstring: The docstring containing test cases (optional, will be detected if not provided)
        processor_fn: Function that processes each test case (optional, will attempt to detect)
        separator: The separator character in test cases (default '->')
    """
    # Get the calling frame information
    caller_frame = inspect.currentframe().f_back
    caller_function_name = inspect.getframeinfo(caller_frame).function
    calling_module = inspect.getmodule(caller_frame)
    caller_function = getattr(calling_module, caller_function_name)

    # If docstring is not provided, get it from the calling function
    if docstring is None:
        docstring = inspect.getdoc(caller_function)
        if not docstring:
            raise ValueError(f"No docstring found for {caller_function_name}")

    # If processor_fn is not provided, try to detect it
    if processor_fn is None:
        # Strategy 1: Look for a function with the same name without 'test_' prefix in the same module
        if caller_function_name.startswith("test_"):
            processor_name = caller_function_name[5:]  # Remove 'test_' prefix
            processor_fn = getattr(calling_module, processor_name, None)

        # Strategy 2: Check imported modules for the function
        if processor_fn is None:
            # Get all imported modules and objects in the calling module
            for name, obj in inspect.getmembers(calling_module):
                # Skip if it's not a function or if it's a test function
                if inspect.isfunction(obj) and not name.startswith("test_"):
                    # Try using this function as the processor
                    if (
                        name == caller_function_name[5:]
                        if caller_function_name.startswith("test_")
                        else False
                    ):
                        processor_fn = obj
                        break

        # Strategy 3: Look at function references in the function body's source code
        if processor_fn is None:
            func_source = inspect.getsource(caller_function)
            for name, obj in inspect.getmembers(calling_module):
                if (
                    inspect.isfunction(obj)
                    and name in func_source
                    and not name.startswith("test_")
                ):
                    processor_fn = obj
                    break

        # If we still couldn't find a processor function, raise an error
        if processor_fn is None:
            raise ValueError(
                f"Could not automatically detect processor function for {caller_function_name}. "
                "Please provide the processor_fn parameter explicitly."
            )

    # Calculate results using list comprehension
    results = []

    for expr in parse_test_cases(docstring, separator):
        result = processor_fn(expr)
        results.append(f"{expr} {separator} {result}")

    verify("\n".join(results), options=Options().inline())
