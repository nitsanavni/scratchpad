import os
import difflib
import subprocess


def verify(thing, test_name):
    """
    Verifies a string or printable object against an approved file.

    Args:
        thing: The object to verify (should have a __str__ method).
        test_name: The name of the test (used for the filename).
    """
    filename = f"{test_name}.approved"
    received_filename = f"{test_name}.received"

    try:
        with open(filename, "r") as f:
            approved_content = f.read()
    except FileNotFoundError:
        print(f"Creating new approval file: {filename}")
        with open(filename, "w") as f:
            approved_content = ""

    thing_str = str(thing)  # Ensure we're comparing strings
    with open(received_filename, "w") as f:
        f.write(thing_str)

    if thing_str == approved_content:
        print(f"Test '{test_name}' passed.")
        if os.path.exists(received_filename):
            os.remove(received_filename)  # cleanup
        return

    print(f"Test '{test_name}' failed. Diff:")

    # Use difflib for a nicer diff in the console
    diff = difflib.unified_diff(
        approved_content.splitlines(keepends=True),
        thing_str.splitlines(keepends=True),
        fromfile=filename,
        tofile=received_filename,
    )
    print("".join(diff))

    # Attempt to launch a diff tool (e.g., Meld, Beyond Compare, etc.)
    try:
        subprocess.run(["meld", filename, received_filename], check=False)  # Meld
    except FileNotFoundError:
        try:
            subprocess.run(
                ["bcompare", filename, received_filename], check=False
            )  # Beyond Compare
        except FileNotFoundError:
            print(
                "meld or bcompare not found. Please install a diff tool for visual comparison."
            )

    raise AssertionError(
        f"Test '{test_name}' failed. See diff above and {filename} vs {received_filename}"
    )
