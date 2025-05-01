from approvaltests import verify, Options
import inspect


def parse_test_cases(
    docstring, vertical=False, input_separator="->", case_separator="\n"
):
    """
    Extract test cases from docstring using the given separators

    Args:
        docstring: The docstring containing test cases
        vertical: If True, uses vertical mode where inputs/outputs are separated vertically
        input_separator: Separator between input and output ("->") or vertical separator ("---")
        case_separator: Separator between test cases ("\n" or "===")
    """
    if not docstring:
        return []

    if not vertical:
        # Original horizontal mode
        return [
            line.split(input_separator)[0].strip()
            for line in docstring.strip().split("\n")
            if input_separator in line
        ]
    else:
        # Vertical mode
        cases = []
        # Split the docstring by case separator
        raw_cases = docstring.strip().split(case_separator)

        for case in raw_cases:
            case = case.strip()
            if input_separator in case:
                parts = case.split(input_separator, 1)
                cases.append(parts[0].strip())

        return cases


def verify_docstring(
    docstring=None,
    processor_fn=None,
    vertical=False,
    input_separator="->",
    case_separator="\n",
    separator=None,  # For backward compatibility
):
    """
    Parses docstring test cases and verifies results using ApprovalTests

    Args:
        docstring: The docstring containing test cases (optional, will be detected if not provided)
        processor_fn: Function that processes each test case (optional, will attempt to detect)
        vertical: If True, uses vertical mode where inputs/outputs are separated vertically
        input_separator: Separator between input and output ("->") or vertical separator ("---")
        case_separator: Separator between test cases ("\n" or "===")
        separator: (Deprecated) For backward compatibility - if provided, overrides input_separator
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

    # Handle backward compatibility with 'separator' parameter
    if separator is not None:
        # If separator is provided, use it as input_separator (old behavior)
        input_separator = separator

    # Parse test cases
    test_inputs = parse_test_cases(
        docstring,
        vertical=vertical,
        input_separator=input_separator,
        case_separator=case_separator,
    )

    # Calculate results
    results = []

    if not vertical:
        # Horizontal mode (original)
        for expr in test_inputs:
            result = processor_fn(expr)
            results.append(f"{expr} {input_separator} {result}")

        verify("\n".join(results), options=Options().inline())
    else:
        # Vertical mode
        raw_cases = docstring.strip().split(case_separator)
        formatted_results = []

        for i, case in enumerate(raw_cases):
            case = case.strip()
            if input_separator in case:
                parts = case.split(input_separator, 1)
                input_text = parts[0].strip()
                # We don't need expected_output for verification, just the input

                actual_output = processor_fn(input_text)

                # Format a vertical test case with input, separator, and output
                # Keep the same format as in the original docstring
                formatted_case = f"{input_text}\n{input_separator}\n{actual_output}"

                # Add to results
                formatted_results.append(formatted_case)

        # Join all formatted cases with the case separator and double newlines for readability
        case_separator_with_padding = f"\n{case_separator}\n"
        final_output = case_separator_with_padding.join(formatted_results)

        verify(final_output, options=Options().inline())
