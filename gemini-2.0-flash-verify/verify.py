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

    # Use difflib for a nicer diff in the console. CRUCIAL FIX HERE:
    diff = difflib.unified_diff(
        thing_str.splitlines(keepends=True),  # Received content FIRST
        approved_content.splitlines(keepends=True),  # Approved content SECOND
        fromfile=received_filename,  # Received file name
        tofile=filename,  # Approved file name
    )
    print("".join(diff))

    # Attempt to launch a diff tool
    try:
        subprocess.run(
            ["d.sh", received_filename, filename], check=False
        )  # Your preferred tool, received first
    except FileNotFoundError:
        try:
            subprocess.run(
                ["bcompare", received_filename, filename], check=False
            )  # Backup tool, received first
        except FileNotFoundError:
            print(
                "d.sh or bcompare not found. Please install a diff tool for visual comparison."
            )

    raise AssertionError(
        f"Test '{test_name}' failed. See diff above and {filename} vs {received_filename}"
    )
